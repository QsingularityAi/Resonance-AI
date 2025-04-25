from modeltranslation.translator import translator, TranslationOptions
from .models import Chatbot, FAQCategory, FAQ


class ChatbotTranslationOptions(TranslationOptions):
    fields = ('welcome_title', 'welcome_text', 'welcome_additional_text', 'first_message')

translator.register(Chatbot, ChatbotTranslationOptions)