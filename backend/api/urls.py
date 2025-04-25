from django.urls import path, include

from .thumb.views import ThumbView
from .tts.views import TTSView
from .chat.views import ChatView
from .chat_config.views import ChatbotConfigView


urlpatterns = [
    path('tts/', TTSView.as_view(), name='tts'),
    path('chat/', ChatView.as_view(), name='chat'),
    path('chatbot-config/<uuid:chatbot_id>/', ChatbotConfigView.as_view(), name='chatbot-config'),
    path('thumb/<uuid:conversation_id>/<str:action>/', ThumbView.as_view(), name='chatbot-thumb'),
]

