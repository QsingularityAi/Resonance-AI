from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from django.core.exceptions import ObjectDoesNotExist
from .chat_config import generate_chatbot_config
from rest_framework import serializers

class ChatbotConfigResponseSerializer(serializers.Serializer):
    primaryColor = serializers.CharField()
    textColor = serializers.CharField()
    headerTitle = serializers.CharField()
    assistantName = serializers.CharField()
    logo = serializers.CharField()
    avatar = serializers.CharField()
    contact = serializers.DictField()
    welcome = serializers.DictField()
    rag_type = serializers.CharField()
    firstMessage = serializers.DictField()

class ConfigRateThrottle(AnonRateThrottle):
    rate = '300/day'
    scope = 'config'

class ChatbotConfigView(APIView):
    throttle_classes = [ConfigRateThrottle]

    @extend_schema(
        parameters=[
            OpenApiParameter(name="chatbot_id", type=OpenApiTypes.UUID, location=OpenApiParameter.PATH, description="UUID of the chatbot instance"),
        ],
        responses={
            200: ChatbotConfigResponseSerializer,
            404: OpenApiTypes.OBJECT,
            429: OpenApiTypes.OBJECT,
        },
        description="Get chatbot configuration",
        summary="Retrieve chatbot configuration"
    )
    def get(self, request, chatbot_id):
        """
        Retrieve chatbot configuration based on the provided UUID.

        This endpoint returns the complete configuration for a specific chatbot instance,
        including styling, content, and translations.
        """
        try:
            config = generate_chatbot_config(chatbot_id)
            return Response(config, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response(
                {"error": "Chatbot not found"},
                status=status.HTTP_404_NOT_FOUND
            )