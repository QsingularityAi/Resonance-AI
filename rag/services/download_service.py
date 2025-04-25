from typing import Optional, List

import requests
import logging
from hw_rag.interfaces.url_handler import URLHandler

logger = logging.getLogger(__name__)


class DownloadService:
    """
    Ein Service für das Herunterladen von Dateien.
    
    Dieser Service verwendet URL-Handler, um Dateien von verschiedenen Quellen herunterzuladen.
    Standardmäßig werden HTTP-URLs unterstützt, aber andere URL-Typen können durch Registrierung
    von URL-Handlern unterstützt werden.
    """
    
    def __init__(self):
        """
        Initialisiert den DownloadService.
        """
        self.url_handlers: List[URLHandler] = []
    
    def register_url_handler(self, handler: URLHandler):
        """
        Registriert einen URL-Handler beim DownloadService.
        
        Args:
            handler: Der zu registrierende URL-Handler
        """
        self.url_handlers.append(handler)
        # logger.info(f"URL handler registered: {handler.__class__.__name__}")
    
    def download_file(self, url: str, reference_id: str) -> Optional[bytes]:
        """
        Download file and return its bytes.

        Args:
            url (str): URL of the file to download
            reference_id (str): Reference ID for cross-database linking

        Returns:
            Optional[bytes]: File content as bytes or None if download failed
        """
        try:
            # Prüfe, ob ein registrierter Handler die URL verarbeiten kann
            logger.info(f" registered handlers: {str(self.url_handlers)}")
            for handler in self.url_handlers:
                if handler.can_handle(url):
                    logger.info(f"Using handler {handler.__class__.__name__} for URL: {url}")
                    return handler.download(url, reference_id)
            
            # Standardmäßig HTTP-Download
            logger.info(f"Using standard HTTP download for URL: {url}")
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            return response.content

        except Exception as e:
            logger.error(f"Error downloading {url} for reference_id {reference_id}: {str(e)}")
            return None