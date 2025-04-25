"""
Crawl-Manager für WebDAV-Ressourcen.
"""
import logging
from typing import Optional

from django.utils import timezone

from webdav.dataclasses import CrawlingStatus
from webdav.tasks import webdav_crawl, check_webdav_resources_for_deletion


logger = logging.getLogger(__name__)


class CrawlManager:
    """
    Ein Manager für den Crawling-Prozess von WebDAV-Ressourcen.
    
    Dieser Manager bietet Methoden für das Starten und Überwachen des Crawling-Prozesses.
    """
    
    @staticmethod
    def start_crawl(resource_id: int) -> str:
        """
        Startet den Crawling-Prozess für eine WebDAV-Ressource.
        
        Args:
            resource_id: Die ID der WebDAV-Ressource
            
        Returns:
            Eine Nachricht über den Status des Crawling-Prozesses
        """
        from webdav.models import WebdavResource
        
        try:
            resource = WebdavResource.objects.get(pk=resource_id)
            
            # Überprüfe, ob die Ressource bereits gecrawlt wird
            if resource.crawling_status == CrawlingStatus.CRAWLING.value:
                return f"WebDAV resource {resource.name} is already being crawled"
            
            # Starte den Crawling-Prozess
            webdav_crawl.delay(resource_id)
            
            return f"Started crawl for WebDAV resource {resource.name}"
        except WebdavResource.DoesNotExist:
            return f"WebDAV resource with ID {resource_id} not found"
        except Exception as e:
            logger.error(f"Error starting crawl for WebDAV resource with ID {resource_id}: {str(e)}")
            return f"Error starting crawl for WebDAV resource with ID {resource_id}: {str(e)}"
    
    @staticmethod
    def delete_resources(resource_id: int, deletion_timeout: Optional[int] = None, force_delete: bool = False) -> str:
        """
        Löscht Ressourcen einer WebDAV-Ressource.
        
        Args:
            resource_id: Die ID der WebDAV-Ressource
            deletion_timeout: Die Anzahl der Tage, nach denen Ressourcen gelöscht werden sollen (optional)
            force_delete: Ob Ressourcen unabhängig vom Zeitlimit gelöscht werden sollen
            
        Returns:
            Eine Nachricht über den Status des Löschvorgangs
        """
        from webdav.models import WebdavResource
        
        try:
            resource = WebdavResource.objects.get(pk=resource_id)
            
            # Starte den Löschvorgang
            check_webdav_resources_for_deletion.delay(
                resource_id=resource_id,
                deletion_timeout=deletion_timeout,
                force_delete=force_delete
            )
            
            return f"Started deletion of resources for WebDAV resource {resource.name}"
        except WebdavResource.DoesNotExist:
            return f"WebDAV resource with ID {resource_id} not found"
        except Exception as e:
            logger.error(f"Error deleting resources for WebDAV resource with ID {resource_id}: {str(e)}")
            return f"Error deleting resources for WebDAV resource with ID {resource_id}: {str(e)}"