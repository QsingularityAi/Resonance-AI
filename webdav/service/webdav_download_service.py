"""
WebDAV Download Service für das Herunterladen von Dateien von WebDAV-Servern.
"""
import logging
from typing import Optional

from django.apps import apps
from dependency_injector.wiring import inject, Provide

from hw_rag.rag_di import RAGDI
from hw_rag.interfaces.url_handler import URLHandler
from webdav.service.webdav_client_service import WebdavClientService
from urllib.parse import unquote

logger = logging.getLogger(__name__)


class WebdavURLHandler(URLHandler):
    """
    Ein URL-Handler für WebDAV-URLs.
    
    Dieser Handler erkennt WebDAV-URLs und lädt Dateien von WebDAV-Servern herunter.
    """
    
    def can_handle(self, url: str) -> bool:
        """
        Prüft, ob der Handler die angegebene URL verarbeiten kann.
        
        Args:
            url: Die zu prüfende URL
            
        Returns:
            True, wenn der Handler die URL verarbeiten kann, sonst False
        """
        try:
            # Hole alle WebDAV-Ressourcen aus der Datenbank
            WebdavResource = apps.get_model('webdav', 'WebdavResource')
            webdav_resources = WebdavResource.objects.all()
            logger.info("check webdav")
            # Prüfe, ob die URL mit einer der WebDAV-Ressourcen beginnt
            for resource in webdav_resources:
                if url.startswith(f"{resource.url}"):
                    return True
            return False
        except Exception as e:
            logger.error(f"Error checking if URL is WebDAV: {str(e)}")
            return False
    
    def get_matching_resource(self, url: str) -> Optional[object]:
        """
        Gibt die WebDAV-Ressource zurück, die zur URL passt.
        
        Args:
            url: Die URL
            
        Returns:
            Die WebDAV-Ressource oder None, wenn keine passende Ressource gefunden wurde
        """
        try:
            # Hole alle WebDAV-Ressourcen aus der Datenbank
            WebdavResource = apps.get_model('webdav', 'WebdavResource')
            
            # Finde die WebDAV-Ressource, die zur URL passt
            for resource in WebdavResource.objects.all():
                if url.startswith(resource.url):
                    return resource
            
            return None
        except Exception as e:
            logger.error(f"Error getting matching WebDAV resource: {str(e)}")
            return None
    
    def download(self, url: str, reference_id: str) -> Optional[bytes]:
        """
        Lädt eine Datei von einem WebDAV-Server herunter.
        
        Args:
            url: Die URL der Datei
            reference_id: Die Referenz-ID für die Datei
            
        Returns:
            Die Datei als Bytes-Objekt oder None, wenn ein Fehler auftritt
        """
        try:
            # Hole die WebDAV-Ressource, die zur URL passt
            resource = self.get_matching_resource(url)
            if not resource:
                logger.error(f"No matching WebDAV resource found for URL: {url}")
                return None
            
            # Erstelle einen WebDAV-Client
            client = WebdavClientService(
                base_url=resource.url,
                auth_user_name=resource.auth_user_name,
                auth_user_password=resource.auth_user_password
            )
            
            # Extrahiere den relativen Pfad aus der URL
            relative_path = url[len(resource.url):]
            
            # Lade die Datei herunter
            return client.download_file(unquote(relative_path))
        except Exception as e:
            logger.error(f"Error downloading WebDAV file {url} for reference_id {reference_id}: {str(e)}")
            return None


# Registriere den WebdavURLHandler beim DownloadService
@inject
def register_webdav_url_handler(download_service=Provide[RAGDI.download_service]):
    """
    Registriert den WebdavURLHandler beim DownloadService.
    
    Diese Funktion wird aufgerufen, wenn das webdav-Paket geladen wird.
    
    Args:
        download_service: Der DownloadService, bei dem der Handler registriert werden soll
    """
    try:
        # Erstelle einen WebdavURLHandler und registriere ihn beim DownloadService
        handler = WebdavURLHandler()
        
        # Prüfe, ob die Methode register_url_handler existiert
        if hasattr(download_service, 'register_url_handler'):
            download_service.register_url_handler(handler)
        else:
            logger.error("DownloadService does not have method register_url_handler")
    except Exception as e:
        logger.error(f"Error registering WebdavURLHandler: {str(e)}")