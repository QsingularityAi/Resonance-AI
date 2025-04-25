import json
import logging
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, serializers
from django.http import StreamingHttpResponse
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample, extend_schema_field
from drf_spectacular.types import OpenApiTypes
from backend.api.chat.chat import ChatProcessing
from hw_rag.services.openai_service import OpenAIService
from backend.utils.stats import track_new_message
from dependency_injector.wiring import inject, Provide
from backend.api.di.di import DI

class Message(serializers.Serializer):
    role = serializers.ChoiceField(choices=['user', 'system'])
    content = serializers.CharField()


@extend_schema_field({
    'type': 'string',
    'format': 'binary',
    'example': 'audio_file.mp3'
})
class AudioFileField(serializers.FileField):
    def to_representation(self, value):
        if value:
            return {
                'url': value.url,
                'name': value.name,
                'size': value.size
            }
        return None


class MessageListField(serializers.ListField):
    def __init__(self, **kwargs):
        kwargs['default'] = []
        super().__init__(**kwargs)

    def to_internal_value(self, data):
        # Handle None or empty data
        if data is None or not data:
            return []

        if isinstance(data, list) and len(data) > 0 and (isinstance(data[0], str) or isinstance(data[0], list)):
            try:
                if isinstance(data[0], list):
                    data = data[0]

                parsed_data = []
                for item in data:
                    item = item.strip().rstrip(',')
                    parsed_item = json.loads(item)
                    parsed_data.append(parsed_item)
                return parsed_data
            except json.JSONDecodeError as e:
                raise serializers.ValidationError(f"Invalid JSON format for messages: {str(e)}")
        return []


class ChatRequestSerializer(serializers.Serializer):
    messages = MessageListField(required=False, allow_null=True, default=[])
    text_input = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    faq_id = serializers.IntegerField(required=False, allow_null=True)
    audio_input = AudioFileField(required=False, allow_null=True)
    chatbot_id = serializers.UUIDField(required=True, allow_null=False)
    conversation_id = serializers.UUIDField(required=True, allow_null=False)

    def to_internal_value(self, data):
        if 'messages[]' in data:
            data = data.copy()  # Make a mutable copy of the QueryDict
            messages = data.getlist('messages[]')
            data['messages'] = messages
            del data['messages[]']

        return super().to_internal_value(data)

    def validate(self, data):
        if not any([
            data.get('text_input'),
            data.get('audio_input'),
            data.get('faq_id')
        ]):
            raise serializers.ValidationError("One of text_input, audio_input, or faq_id must be provided")
        return data


class Source(serializers.Serializer):
    id = serializers.CharField()
    name = serializers.CharField()
    link = serializers.URLField()
    type = serializers.CharField()
    page = serializers.IntegerField(required=False, default=None)


class ChatResponseSerializer(serializers.Serializer):
    answer_text = serializers.CharField()
    image = serializers.CharField(required=False)
    image_alt = serializers.CharField(required=False)
    image_source = serializers.URLField(required=False)
    related_questions = serializers.ListField(child=serializers.CharField(), required=False)
    faq_questions = serializers.ListField(child=serializers.DictField(), required=False)
    sources = serializers.ListField(child=Source(), required=False)
    user_dissatisfaction_detected = serializers.BooleanField()
    transcribed_audio = serializers.CharField(required=False)


class ChatRateThrottle(AnonRateThrottle):
    rate = '30/day'
    scope = 'chat'


class ChatView(APIView):
    throttle_classes = [ChatRateThrottle]
    @inject
    def __init__(
        self,
        openai_service: OpenAIService = Provide[DI.openai_service],
        **kwargs
    ):
        super().__init__(**kwargs)
        self.openai_service = openai_service
    @extend_schema(
        request={
            'multipart/form-data': {
                'type': 'object',
                'properties': {
                    'messages[]': {
                        'type': 'array',
                        'items': {
                            'type': 'object',
                            'properties': {
                                'role': {
                                    'type': 'string',
                                    'enum': ['user', 'assistant', 'system']
                                },
                                'content': {
                                    'type': 'string'
                                }
                            },
                            'required': ['role', 'content']
                        },
                        'nullable': True
                    },
                    'text_input': {
                        'type': 'string',
                        'nullable': True
                    },
                    'faq_id': {
                        'type': 'integer',
                        'nullable': True
                    },
                    'audio_input': {
                        'type': 'string',
                        'format': 'binary',
                        'nullable': True
                    },
                    'chatbot_id': {
                        'type': 'string',
                        'format': 'uuid',
                        'nullable': False,
                        'required': True
                    },
                    'conversation_id': {
                        'type': 'string',
                        'format': 'uuid',
                        'nullable': False,
                        'required': True
                    }
                },
                'required': []
            },
        }, responses={
            200: OpenApiTypes.OBJECT,
            429: OpenApiTypes.OBJECT,  # Add rate limit exceeded response
        },
        description="Chat API endpoint that handles text, audio, or FAQ ID inputs. For testing in swagger, "
                    "empty the not used inputs and uncheck send empty value.",
        summary="Chat with AI",
        parameters=[
            OpenApiParameter(
                name="Accept-Language",
                type=str,
                location=OpenApiParameter.HEADER,
                required=True,
                description="Specify the preferred language for the response (e.g., 'en', 'tr', 'ru')"
            )
        ],
        examples=[
            OpenApiExample(
                'Streaming Response',
                description='The response is a stream of JSON objects, each object on a new line, NOT a comma seperated list of objects',
                value=[
                    {'answer_text': 'Partial answer...'},
                    {'sources': [{'id': '234124n2kj5n23k4jn4', 'name': 'Source 1', 'link': 'https://example.com', 'type': 'pdf', 'page': 4}]},
                    {'image': 'base64_encoded_data',
                     'image_title': 'Image title',
                     'image_description': 'Image description',
                     'image_source': 'https://example.com/image'},
                    {'related_questions': ['Related question 1?', 'Related question 2?']},
                    {'faq_questions': [{'text': 'FAQ 1?', 'id': 1}, {'text': 'FAQ 2?', 'id': 2}]},
                    {'transcribed_audio': 'transcription of the users audio if submitted'},
                    {'user_dissatisfaction_detected': False}
                ],
                response_only=True,
            )
        ],
    )
    def post(self, request):
        # Create a mutable copy of the QueryDict
        mutable_data = request.data.copy()
        serializer = ChatRequestSerializer(data=mutable_data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        conversation_id = serializer.validated_data.get('conversation_id')
        track_new_message(request, str(conversation_id))

        def response_generator():
            language = request.META.get('HTTP_ACCEPT_LANGUAGE', 'de')
            chatbot_id = serializer.validated_data.get('chatbot_id')
            if serializer.validated_data.get('text_input'):
                generator = ChatProcessing.process_text(
                    serializer.validated_data['text_input'],
                    language,
                    serializer.validated_data['messages'],
                    chatbot_id
                )
            elif serializer.validated_data.get('audio_input'):
                generator = ChatProcessing.process_audio(
                    audio=serializer.validated_data['audio_input'],
                    language=language,
                    messages=serializer.validated_data['messages'],
                    chatbot_id=chatbot_id
                )
            elif serializer.validated_data.get('faq_id'):
                generator = ChatProcessing.process_faq(serializer.validated_data['faq_id'], language)
            else:
                yield json.dumps({"error": "No valid input provided"}) + '\n'
                return

            for item in generator:
                yield json.dumps(item) + '\n'
            logger = logging.getLogger(__name__)
            logger.info(f"Total cost of request: {self.openai_service.total_cost:.2f} cent")

        return StreamingHttpResponse(response_generator(), content_type='application/json')
