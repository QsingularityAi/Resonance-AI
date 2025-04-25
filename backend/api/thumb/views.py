from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import serializers
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from django.core.exceptions import ObjectDoesNotExist
from backend.utils.stats import track_like,track_dislike

class ThumbRateThrottle(AnonRateThrottle):
    rate = '4/day'
    scope = 'thumb'


class ThumbResponseSerializer(serializers.Serializer):
    success = serializers.BooleanField()
    message = serializers.CharField()


class ThumbView(APIView):
    serializer_class = ThumbResponseSerializer
    throttle_classes = [ThumbRateThrottle]

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="conversation_id",
                type=OpenApiTypes.UUID,
                location=OpenApiParameter.PATH,
                description="UUID of the conversation"
            ),
            OpenApiParameter(
                name="action",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.PATH,
                description="Vote action (up/down)"
            ),
        ],
        responses={
            200: ThumbResponseSerializer,
            400: OpenApiTypes.OBJECT,
            404: OpenApiTypes.OBJECT,
            429: OpenApiTypes.OBJECT,
        },
        description="Submit a vote for a conversation",
        summary="Vote on a conversation"
    )
    def post(self, request, conversation_id, action):
        """
        Submit a thumb up/down vote for a specific conversation.

        This endpoint handles voting actions for a conversation,
        allowing users to submit either an upvote or downvote.
        """
        if action not in ['up', 'down']:
            return Response(
                {"error": "Invalid action. Use 'up' or 'down'"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            if(action == 'up'):
                track_like(request, conversation_id)
            else:
                track_dislike(request, conversation_id)

            serializer = ThumbResponseSerializer(data ={
                "success": True,
                "message": f"Successfully {action}voted conversation {conversation_id}"
            })

            return Response(serializer.initial_data, status=status.HTTP_200_OK)

        except ObjectDoesNotExist:
            return Response(
                {"error": "Chatbot not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
