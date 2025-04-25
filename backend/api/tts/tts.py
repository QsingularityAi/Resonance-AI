from openai import OpenAI
from django.http import StreamingHttpResponse
import io

client = OpenAI()
def generate_tts_audio(text, language):
    # openai does not use the language setting
    def generate_audio():
        buffer = io.BytesIO()
        response = client.audio.speech.create(
            model="tts-1",
            voice="alloy",
            input=text,
            response_format="mp3"
        )

        for chunk in response.iter_bytes(chunk_size=4096):
            buffer.write(chunk)
            yield chunk

        buffer.seek(0)

    response = StreamingHttpResponse(generate_audio(), content_type="audio/mpeg")
    response['Content-Disposition'] = f'attachment; filename="tts_output_{language}.mp3"'
    return response