from openai import OpenAI
import ffmpeg as ffmpeg_lib
import os
import json
import io
import re
from pathlib import Path

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

def _convert_audio_to_opus(input_stream):
    """
    Convert audio to Opus format in memory to pass to OpenAI API.
    """

    try:
        # Convert audio to Opus format using ffmpeg-python
        process = (
            ffmpeg_lib
            .input('pipe:0')
            .output('pipe:1',
                   format='opus',
                   acodec='libopus',
                   audio_bitrate='16k',      # Reduced from 24k to 16k
                   ar='16000',               # Sample rate 16kHz (standard for speech)
                   ac='1',                   # Mono audio
                   application='voip',       # Optimize for speech
                   frame_duration='20',      # Standard frame size for speech
                   compression_level='10'    # Maximum compression
            )
            .run(input=input_stream.read(), capture_stdout=True, capture_stderr=True)
        )

        # process contains stdout (converted audio) and stderr (ffmpeg logs)
        converted_audio = process[0]  # stdout is the converted audio bytes
        return converted_audio

    except Exception as e:
        raise RuntimeError(f"An error occurred during audio conversion: {str(e)}") from e

def _transcribe(audio_bytes, lang: str, file_format = "ogg"):
    """
    Transcribe audio using the OpenAI Whisper API.
    """
    audio_stream = io.BytesIO(audio_bytes)
    audio_stream.name = f"audio.{file_format}"  # Required by OpenAI API to detect format

    try:
        # @feat: we might consider using GPT-4o for post-processing to improve the accuracy
        # of the transcript if needed. See openai documentation about speech-to-text
        transcript = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_stream,
            language=lang,
            response_format="text" #or vtt
        )

    except Exception as e:
        raise RuntimeError(f"An error occurred during transcription: {str(e)}") from e

    return transcript


def transcribe_audio(audio_bytes: bytes, lang: str) -> str | None:
    """Transcribe audio bytes to text using OpenAI Whisper API and filter unwanted phrases.

    Args:
        audio_bytes (bytes): Raw audio data in bytes format
        lang (str): Language code

    Returns:
        str | None: Cleaned transcribed text or None if result too short
    """
    # Load filters
    filter_path = Path(__file__).parent / "filter.json"
    with open(filter_path) as f:
        filters = json.load(f)

    # Get language specific filters
    lang_filters = filters.get(lang, [])

    # Process audio
    input_stream = io.BytesIO(audio_bytes)
    opus_bytes = _convert_audio_to_opus(input_stream)
    transcription = _transcribe(opus_bytes, lang)

    # Apply filters
    filtered_text = transcription
    for phrase in lang_filters:
        filtered_text = filtered_text.replace(phrase, '')

    # Clean whitespace
    cleaned_text = re.sub(r'\s+', ' ', filtered_text).strip()

    # Return None if too short
    return cleaned_text if len(cleaned_text) >= 5 else None