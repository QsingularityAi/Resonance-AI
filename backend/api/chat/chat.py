import base64
import logging
import re
import time
from pathlib import Path
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.shortcuts import get_object_or_404
from django.utils.translation import gettext as _
from django_scopes import scopes_disabled
from .asr import transcribe_audio
from hw_rag.dataclasses import QSourceType
from ..models import FAQ, Chatbot
from hw_rag.answer_generator import RAGFactory
from hw_rag.related_question_generator import RelatedQuestionGenerator

logger = logging.getLogger(__name__)


class ChatProcessing:
    @staticmethod
    def process_text(text, language, messages, chatbot_id):
        # Disable scopes when querying the Chatbot model
        with scopes_disabled():
            chatbot = get_object_or_404(Chatbot, id=chatbot_id)
        rag_generator = RAGFactory.create_answer_generator(chatbot)
        answer, sources, images, topic = rag_generator.generate_answer_sync(text, lang=language, messages=messages)
        if topic != 'Anderes':
            yield {'warning': _("complex_topic")}

        yield {'answer_text': f'{ChatProcessing.escape_asterisks(answer)}'}

        for image in images:
            yield {
                'image': f'data:image/jpeg;base64,{image.image_content}',
                'image_title': image.metadata.get('image_title'),
                'image_description': image.text,
                'image_source': image.source.url
            }

        unique_sources = []
        seen = set()

        for source in sources:
            if source.source.source_type == QSourceType.FAQ:
                # do not reference faq here.
                continue

            # Create tuple of values to check uniqueness
            source_tuple = (
                source.source.title,
                source.source.url,
                source.source.source_type,
                source.metadata.get('page')
            )

            if source_tuple not in seen:
                seen.add(source_tuple)
                unique_sources.append({
                    'id': source.checksum,
                    'name': source.source.title,
                    'link': source.source.url,
                    'type': source.source.source_type,
                    'page': source.metadata.get('page')
                })

        if unique_sources:
            yield {'sources': unique_sources}
        if len(sources) == 0:
            yield {'offer_human_contact': True}
        else: # only create related questions when we have a proper answer with sources
            related_question_generator = RelatedQuestionGenerator(chatbot)
            related_questions = related_question_generator.related_questions(answer, lang=language)
            if len(related_questions.related_questions) > 0:
                yield {'related_questions': related_questions.related_questions}

    @staticmethod
    def process_audio(audio, language, messages, chatbot_id):
        if isinstance(audio, InMemoryUploadedFile):
            audio = audio.read()

        transcription = transcribe_audio(audio, language)

        yield {"transcribed_audio": (transcription or "")}
        if transcription is None:
            yield {
                "answer": _(
                    "I didn't catch any audio. Could you please check that your microphone is connected and not muted? Try recording again, or feel free to type your message instead.") + '\n'
            }
            yield {'offer_human_contact': True}
        else:
            for response in ChatProcessing.process_text(
                    transcription,
                    language,
                    messages,
                    chatbot_id
            ):
                yield response


    @staticmethod
    def process_faq(faq_id, language):
        # Disable scopes when querying the FAQ model
        with scopes_disabled():
            faq = FAQ.objects.get(id=faq_id)
        yield {'answer_text': getattr(faq, f"answer_{language.value}")}

    @staticmethod
    def generate_test_response(input):
        # This is just a test function to demonstrate the streaming and how the results
        # should be returned

        # Generate answer text and sources immediately
        yield {'answer_text': f'Here is the answer to your question: {input}'}

        yield {'sources': [
            {'name': 'Source 1', 'link': 'https://example.com/source1', 'type': 'website'},
            {'name': 'Source 2', 'link': 'https://example.com/source2', 'type': 'pdf'}
        ]}

        # Sleep for 2 seconds
        time.sleep(2)

        # Generate image
        yield {
            'image': ChatProcessing.get_test_image(),
            'image_alt': 'Description of the image',
            'image_source': 'https://example.com/image_source'
        }

        # Sleep for 5 seconds
        time.sleep(5)

        # Generate related questions and FAQ questions
        yield {'related_questions': ['Related question 1?', 'Related question 2?']}

        yield {'faq_questions': [{'text': 'FAQ 1?', 'id': 1}, {'text': 'FAQ 2?', 'id': 2}]}

        yield {'transcribed_audio': 'transcription of the audio in case the input was audio'}

        # Check for user dissatisfaction
        yield {'user_dissatisfaction_detected': False}

    @staticmethod
    def get_test_image():
        image_path = Path("images/testresponse.jpg")

        # Open and read the image file
        with open(image_path, "rb") as image_file:
            image_data = image_file.read()

        # Encode the image data to base64
        base64_image = base64.b64encode(image_data).decode("utf-8")

        # Create an HTML string with the embedded base64 image
        return f'data:image/jpeg;base64,{base64_image}'

    @staticmethod
    def escape_asterisks(text):
        # Regex pattern to match asterisks within words
        pattern = r'(?<=\w)[*](?=\w)'
        # Replace with escaped asterisk
        return re.sub(pattern, r'\\*', text)