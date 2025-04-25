import logging
import time

from ...languages import Language
from openai import OpenAI, OpenAIError
from modeltranslation.translator import translator


class Autotranslate:
    help = 'Find and translate missing translations for all translated models'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.client = OpenAI()
        self.logger = logging.getLogger(__name__)

    def translate_all_missing(self):
        for model in translator.get_registered_models():
            self.process_model_translations(model)

    def process_model_translations(self, model):
        trans_opts = translator.get_options_for_model(model)
        fields = trans_opts.fields

        for obj in model.objects.all():
            for field in fields:
                self.process_field_translations(obj, field)

    def process_field_translations(self, obj, field):
        languages = [lang.value for lang in Language]

        # Find the first non-empty translation
        source_lang = next((lang for lang in languages if getattr(obj, f'{field}_{lang}')), None)

        if source_lang:
            source_text = getattr(obj, f'{field}_{source_lang}')
            for target_lang in languages:
                if target_lang != source_lang:
                    target_field = f'{field}_{target_lang}'
                    if not getattr(obj, target_field):
                        self.logger.info(
                            f"Translating {obj._meta.model_name} (id:{obj.id}) field '{field}' from {source_lang} to {target_lang}")
                        translated_text = self.translate_text(source_text, source_lang, target_lang)
                        setattr(obj, target_field, translated_text)
            obj.save()

    def translate_text(self, text, source_lang, target_lang):
        system_prompt = ("You are a professional translator. Translate the given text accurately while preserving the "
                         "meaning and tone. Just respond with the translation, nothing else.")

        user_prompt = f"""
        Translate the following text from {source_lang} to {target_lang}:

        {text}

        Translated text:
        """

        try:
            response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=1.0
            )

            translated_text = response.choices[0].message.content.strip()
            return translated_text

        except OpenAIError as e:
            self.logger.error(f"OpenAI API error: {str(e)}")
            return None

        except Exception as e:
            self.logger.error(f"Unexpected error: {str(e)}")
            return None

    def translate_object(self, obj):
        """
        Translate all empty translated fields for a specific object.

        Args:
            obj: Model instance to translate
        Returns:
            Updated object with translations
        """
        trans_opts = translator.get_options_for_model(obj.__class__)
        fields = trans_opts.fields

        for field in fields:
            self.process_field_translations(obj, field)

        return obj