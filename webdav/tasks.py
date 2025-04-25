from celery import shared_task
from celery.schedules import crontab
from celery.utils.log import get_task_logger
import logging
import datetime
from django.utils import timezone

from webdav.models import WebdavResource
from webdav.dataclasses import CrawlingStatus
from django_scopes import scopes_disabled


logger = get_task_logger(__name__)
logger.setLevel(logging.INFO)

# Define a schedule for tasks
WEBDAV_CELERY_BEAT_SCHEDULE = {
    'webdav_deletion_check': {
        'task': 'webdav.tasks.check_webdav_resources_for_deletion',
        'schedule': crontab(hour=12),
        'args': (),
    },
    'webdav_check_for_resources_to_be_crawled': {
        'task': 'webdav.tasks.webdav_crawl_periodically',
        'schedule': crontab(hour=1),
        'args': (),
    },
}


@shared_task(queue="main")
@scopes_disabled()
def webdav_crawl(resource_id: int):
    """
    Crawlt eine WebDAV-Ressource.
    
    Args:
        resource_id: Die ID der WebDAV-Ressource
    """
    try:
        resource = WebdavResource.objects.get(pk=resource_id)
        resource.crawl()
    except WebdavResource.DoesNotExist:
        logger.error(f"WebdavResource {resource_id} not found in webdav_crawl task")
    except Exception as e:
        logger.error(f"Error in webdav_crawl task for resource ID {resource_id}: {str(e)}")


@shared_task(queue="main")
@scopes_disabled()
def check_webdav_resources_for_deletion(resource_id: int = None, deletion_timeout: int = None, force_delete: bool = False):
    """
    Überprüft, ob Ressourcen einer WebDAV-Ressource gelöscht werden sollen.
    
    Args:
        resource_id: Die ID der WebDAV-Ressource (optional, wenn None werden alle Ressourcen überprüft)
        deletion_timeout: Die Anzahl der Tage, nach denen Ressourcen gelöscht werden sollen (optional, wenn None wird der Wert aus der WebDAV-Ressource verwendet)
        force_delete: Ob Ressourcen unabhängig vom Zeitlimit gelöscht werden sollen
    """
    from backend.services.mongo_service import MongoService
    from backend.tasks import delete_qsource
    
    mongo = MongoService()
    
    try:
        # Wenn eine bestimmte Ressource angegeben wurde, überprüfe nur diese
        if resource_id:
            resources = WebdavResource.objects.filter(pk=resource_id)
        else:
            # Andernfalls überprüfe alle Ressourcen
            resources = WebdavResource.objects.all()
        
        for resource in resources:
            # Wenn kein Zeitlimit angegeben wurde, verwende das Zeitlimit aus der Ressource
            timeout = deletion_timeout if deletion_timeout is not None else resource.deletion_timeout
            
            # Wenn das Zeitlimit 0 ist und force_delete nicht gesetzt ist, überspringe die Ressource
            if timeout == 0 and not force_delete:
                continue
            
            # Erstelle eine Query für Ressourcen, die gelöscht werden sollen
            query = {
                'source_origin': f"webdav:{resource.id}"
            }
            
            # Wenn force_delete nicht gesetzt ist, füge das Zeitlimit hinzu
            if not force_delete:
                query['last_updated'] = {"$lt": datetime.datetime.now() - datetime.timedelta(days=timeout)}
            
            # Hole die zu löschenden Ressourcen
            docs = mongo.get_rag_data(resource.knowledgebase.id, query)
            
            # Lösche die Ressourcen
            for doc in docs:
                delete_qsource.delay(resource.knowledgebase.id, str(doc['_id']))
            
            # Lösche die Einträge in der MongoDB
            result = mongo.delete_many_rag_data(resource.knowledgebase.id, query)
            logger.info(f"Deleted {result.deleted_count} documents for WebDAV resource {resource.name}")
    except Exception as e:
        logger.warning(f"Error while deleting WebDAV resources: {str(e)}")
    finally:
        mongo.close()


@shared_task(queue="main")
@scopes_disabled()
def webdav_crawl_periodically():
    """
    Überprüft, ob WebDAV-Ressourcen gecrawlt werden sollen, und startet den Crawling-Prozess.
    """
    for resource in WebdavResource.objects.all():
        # Überspringe Ressourcen, die noch nie gecrawlt wurden
        if resource.last_crawl_end is None:
            continue
        
        # Überspringe Ressourcen, die kein Crawl-Intervall haben
        if resource.crawl_interval <= 0:
            continue
        
        # Überspringe Ressourcen, die gerade gecrawlt werden
        if resource.crawling_status == CrawlingStatus.CRAWLING.value:
            continue
        
        # Überprüfe, ob das Crawl-Intervall abgelaufen ist
        if timezone.now() > resource.last_crawl_end + datetime.timedelta(days=resource.crawl_interval):
            # Starte den Crawling-Prozess
            webdav_crawl.delay(resource.id)
            logger.info(f"Started periodic crawl for WebDAV resource {resource.name}")