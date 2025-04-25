from django.core.exceptions import ObjectDoesNotExist
from ..languages import Language
from ..models import Chatbot


def generate_chatbot_config(chatbot_id):
    """
    Generate chatbot configuration based on the chatbot instance ID.

    Args:
        chatbot_id: UUID of the chatbot instance

    Returns:
        dict: Chatbot configuration

    Raises:
        ObjectDoesNotExist: If chatbot instance is not found
    """
    try:
        chatbot = Chatbot.objects.get(id=chatbot_id)

        config = {
            "primaryColor": chatbot.primary_color,
            "textColor": chatbot.text_color,
            "headerTitle": chatbot.header_title,
            "assistantName": chatbot.assistant_name,
            "logo": chatbot.get_logo_base64(),
            "avatar": chatbot.get_avatar_base64(),
            "rag_type": chatbot.rag_type,
            "variant": chatbot.chatbot_style,
            "contact": {
                "email": chatbot.contact_email,
                "name": chatbot.contact_name
            },
            "tech_contact": {
                "email": chatbot.tech_contact_email,
                "name": chatbot.tech_contact_name
            },
            "welcome": {},
            "firstMessage": {}
        }

        for lang in Language:
            config["welcome"][lang.value] = {
                "title": getattr(chatbot, f"welcome_title_{lang.value}", ""),
                "text": getattr(chatbot, f"welcome_text_{lang.value}", ""),
                "additionalText": getattr(chatbot, f"welcome_additional_text_{lang.value}", "")
            }
            config["firstMessage"][lang.value] = getattr(chatbot, f"first_message_{lang.value}", "")

        return config

    except Chatbot.DoesNotExist:
        raise ObjectDoesNotExist("Chatbot instance not found")
