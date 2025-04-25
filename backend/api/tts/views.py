from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .tts import generate_tts_audio
from drf_spectacular.utils import extend_schema
from drf_spectacular.types import OpenApiTypes
from rest_framework import serializers
from ..languages import Language


class TTSRateThrottle(AnonRateThrottle):
    rate = '20/day'
    scope = 'tts'


class TTSSerializer(serializers.Serializer):
    text = serializers.CharField(required=True, help_text="Text to convert to speech")
    language = serializers.ChoiceField(
        choices=Language.choices,
        required=True,
        help_text="Language of the audio output and input text"
    )


class TTSView(APIView):
    throttle_classes = [TTSRateThrottle]  # Add this line

    @extend_schema(
        request=TTSSerializer,
        responses={
            200: OpenApiTypes.BINARY,
            429: OpenApiTypes.OBJECT,  # Add rate limit exceeded response
        },
        description="Convert text to speech",
        summary="Text-to-Speech conversion"
    )
    def post(self, request):
        """
        Generate speech from text.

        This endpoint converts the provided text to speech in the specified language.
        """
        serializer = TTSSerializer(data=request.data)
        if serializer.is_valid():
            text = serializer.validated_data['text']
            language = serializer.validated_data['language']
            return generate_tts_audio(text, language)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
