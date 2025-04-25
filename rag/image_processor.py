"""
Copyright (c) 2024 Helm & Walter IT-Solutions
PROPRIETARY AND CONFIDENTIAL

This component and any modifications thereof remain the exclusive property of
Helm & Walter IT-Solutions. A non-exclusive, non-transferable license is granted
solely for the purpose of operating the delivered solution in its intended way.

While source code is provided, any use, copying, modification, distribution or
reuse outside the intended solution it was shipped with is strictly prohibited.
All rights reserved.

Version: 1.2.2
Initial version: 1.0.0 (2024-05-22) Bernd Helm (bernd.helm@helmundwalter.de)
"""
import base64
import logging
import os
from datetime import datetime
import hashlib
import io
import json
from enum import Enum
from typing import Optional
from langchain.schema import Document
from PIL import Image
from pydantic import BaseModel, ValidationError
from hw_rag.dataclasses import QSource, QDocType

from hw_rag.dataclasses import QDocument
from dependency_injector.wiring import inject, Provide
from hw_rag.rag_di import RAGDI
from hw_rag.services.qdrant_service import QdrantService
from hw_rag.services.openai_service import OpenAIService, GPTModel

class ImageInfo(BaseModel):
    description: str
    title: str
    is_offensive: bool
    is_informative: bool


class CustomEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        if isinstance(obj, QSource):
            return obj.model_dump_json()
        if isinstance(obj, Enum):
            return obj.value
        return super().default(obj)


class ImageProcessor:
    @inject
    def __init__(self, cache_dir, qdrant: QdrantService = Provide[RAGDI.qdrant_service], openai_service: OpenAIService = Provide[RAGDI.openai_service]):
        self.qdrant = qdrant
        self.openai_client = openai_service
        self.cache_dir = cache_dir
        os.makedirs(cache_dir, exist_ok=True)
        self.logger = logging.getLogger(__name__)
        pass

    def prepare_for_rag(self, image_url: str, context: Document, knowledgebase_id: int) -> QDocument | None:
        image_binary = self._get_image_from_source(image_url)
        checksum = hashlib.md5(image_binary).hexdigest()

        # Check vector DB first
        doc = self.qdrant.get_document_by_checksum(knowledgebase_id, checksum)
        if doc is not None:
            return doc

        # Process image if not cached
        scaled_image = self.scale_image(image_binary, 800, 800)
        scaled_base64 = base64.b64encode(scaled_image).decode('utf-8')

        # Check cache
        cache_path = os.path.join(self.cache_dir, f"{checksum}.json")
        image_info = self._read_cache(cache_path)
        if image_info is None:
            image_info = self._image_summarize(scaled_base64, context)
            if image_info is None:
                return None
            self._write_cache(cache_path, image_info)

        if image_info.is_offensive or not image_info.is_informative:
            # do not store these types of images
            return None

        new_metadata = context.metadata.copy()  # copy the dict, so we do not modify the parent documents context

        new_metadata['image_title'] = image_info.title
        new_metadata['is_informative'] = image_info.is_informative
        new_metadata.pop('images', None) # we do not need images on image metadata

        return QDocument(
            text=f"# {image_info.title}\n\n{image_info.description}",
            embedding_text=f"# {image_info.title}\n\n{image_info.description}",
            doc_type=QDocType.IMAGE,
            image_content=scaled_base64,
            reference_id=context.metadata['source'].reference_id,
            checksum=checksum,
            source=context.metadata['source'],
            # remove redundant keys:
            metadata=dict(filter(lambda item: item[0] not in {'source', 'reference_id'}, new_metadata.items())),
        )
        pass

    @staticmethod
    def scale_image(image_data: bytes, width: int, height: int) -> bytes:
        # Convert bytes to PIL Image
        img = Image.open(io.BytesIO(image_data))

        # Convert to RGB if necessary (handles PNG transparency)
        if img.mode in ('RGBA', 'P'):
            img = img.convert('RGB')

        # Resize image while maintaining aspect ratio
        max_size = (width, height)  # You can adjust these dimensions
        # btw, thumbnail won't enlarge the image
        img.thumbnail(max_size, Image.Resampling.LANCZOS)

        # Save as JPEG with compression
        output_buffer = io.BytesIO()
        img.save(output_buffer, format='JPEG', quality=70)  # Adjust quality (0-100)
        return output_buffer.getvalue()

    def _image_summarize(self, image_base64: str, context: Document) -> ImageInfo | None:

        image_info = self.openai_client.call_openai(
            model=GPTModel.GPT4O_MINI,
            messages=[
                {
                    "role": "system",
                    "content": """Als KI-Bildanalyst sollst du abrufoptimierte Zusammenfassungen für Bilder mit folgender Struktur erstellen:

BildInfo:
1. description (50-100 Wörter): Erstelle eine detaillierte Analyse für Screenreader und Abruf.
Füge ein:
   - Hauptmotiv oder Fokus
   - Wichtige visuelle Elemente  
   - Relevanter Kontext aus dem Quelldokument (Personen, Ort, Objekte)
   - Bei Grafiken/Diagrammen: Typ, Achsen, Trends und wichtige Datenpunkte
   Beschreibe Text im Bild. Bei komplexen Bildern priorisiere die wichtigsten Elemente.

2. title (max. 15 Wörter): Erstelle basierend auf deiner Beschreibung einen präzisen Titel.

3. is_offensive (boolean): Gib an, ob das Bild möglicherweise anstößige Inhalte enthält.

4. is_informative:
   - True wenn das Bild Informationen oder relevante Personen, Orte oder Objekte zeigt.
   - False wenn das Bild ein Designelement ist, sehr generisch ist oder keinen Bezug zum Text hat.

Vorgehen:
- Beginne mit einer gründlichen Beschreibung als Basis für die weiteren Elemente.
- Passe deine Analyse an den Bildtyp an (z.B. Foto, Diagramm, Grafik).
- Optimiere alle Elemente für den Abruf und stelle sicher, dass die Beschreibung für Sehbehinderte informativ ist.
- Nutze den Kontext aus dem Quelldokument, um deine Analyse zu verbessern.

Dein Ziel ist es, für jedes Bild ein umfassendes und abruffreundliches BildInfo-Objekt zu erstellen."""
                },
                {
                    "type": "text",
                    "role": "user",
                    "content": f"Hier ist der Seiteninhalt, in dem das Bild gefunden wurde: {context.page_content}\n\n"
                            + "Metadata: " + json.dumps(context.metadata, indent=2, cls=CustomEncoder),
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{image_base64}"
                            }
                        }
                    ]
                }
            ],
            response_type=ImageInfo,
            max_retries=10
        )
        if self._is_empty(image_info.description) or self._is_empty(image_info.title):
            self.logger.warning("image description or title was empty, skipping")
            return None

        return image_info

    def _read_cache(self, cache_path: str) -> Optional[ImageInfo]:
        try:
            with open(cache_path, 'r') as f:
                return ImageInfo.model_validate(json.load(f))
        except (IOError, json.JSONDecodeError, ValidationError):
            return None

    def _write_cache(self, cache_path: str, image_info: ImageInfo) -> None:
        with open(cache_path, 'w') as f:
            json.dump(image_info.model_dump(), f)

    def _get_image_from_source(self, image_path: str) -> bytes:
        """
        Retrieves image data from either a local file system path or a URL.

        Args:
            image_path (str): Path to image (local filesystem path starting with '/'
                             or URL starting with 'http'/'https')

        Returns:
            bytes: Binary image data

        Raises:
            FileNotFoundError: If local file doesn't exist
            requests.RequestException: If remote file can't be retrieved
        """
        import requests
        from pathlib import Path

        # Check if the path is a URL (starts with http:// or https://)
        if image_path.lower().startswith(('http://', 'https://')):
            try:
                response = requests.get(image_path)
                response.raise_for_status()  # Raises an HTTPError for bad responses
                return response.content
            except requests.RequestException as e:
                raise requests.RequestException(f"Failed to download image from {image_path}: {str(e)}")

        # Handle local file path
        else:
            try:
                file_path = Path(image_path)
                if not file_path.exists():
                    raise FileNotFoundError(f"Image file not found: {image_path}")

                with open(file_path, 'rb') as file:
                    return file.read()
            except Exception as e:
                raise FileNotFoundError(f"Error reading image file {image_path}: {str(e)}")


    def _is_empty(self, text: str) -> bool:
        return not text or text.isspace()