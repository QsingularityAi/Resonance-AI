"""
Signal-Handler für WebDAV-Ressourcen.
"""
import logging

from django.db.models.signals import pre_delete, post_save
from django.dispatch import receiver

from backend.services.mongo_service import MongoService
from webdav.models import WebdavResource


logger = logging.getLogger(__name__)


@receiver(pre_delete, sender=WebdavResource)
def delete_webdav_resources(sender, instance, **kwargs):
    """
    Löscht alle Ressourcen einer WebDAV-Ressource aus der MongoDB, wenn die WebDAV-Ressource gelöscht wird.
    
    Args:
        sender: Die Klasse, die das Signal gesendet hat
        instance: Die WebdavResource-Instanz, die gelöscht wird
        **kwargs: Weitere Argumente
    """
    try:
        # Überprüfe, ob die WebdavResource eine Knowledgebase hat
        if not instance.knowledgebase:
            logger.warning(f"WebdavResource {instance.name} has no knowledgebase, skipping resource deletion")
            return
        
        # Erstelle eine MongoService-Instanz
        mongo = MongoService()
        
        # Lösche alle Ressourcen der WebDAV-Ressource aus der MongoDB
        result = mongo.delete_many_rag_data(
            instance.knowledgebase.id,
            {"webdav_resource_id": instance.id}
        )
        
        logger.info(f"Deleted {result.deleted_count} resources for WebDAV resource {instance.name}")
    except Exception as e:
        logger.error(f"Error deleting resources for WebDAV resource {instance.name}: {str(e)}")
    finally:
        # Schließe die MongoDB-Verbindung
        if 'mongo' in locals():
            mongo.close()


@receiver(post_save, sender=WebdavResource)
def update_webdav_resources(sender, instance, created, **kwargs):
    """
    Aktualisiert die Ressourcen einer WebDAV-Ressource in der MongoDB, wenn die WebDAV-Ressource gespeichert wird.
    
    Args:
        sender: Die Klasse, die das Signal gesendet hat
        instance: Die WebdavResource-Instanz, die gespeichert wird
        created: True, wenn die Instanz neu erstellt wurde, False, wenn sie aktualisiert wurde
        **kwargs: Weitere Argumente
    """
    try:
        # Überprüfe, ob die WebDAV-Ressource eine Knowledgebase hat
        if not instance.knowledgebase:
            logger.warning(f"WebdavResource {instance.name} has no knowledgebase, skipping resource update")
            return
        
        # Wenn die URL geändert wurde, müssen die Ressourcen aktualisiert werden
        if not created and hasattr(instance, '_original_url') and instance._original_url != instance.url:
            # Erstelle eine MongoService-Instanz
            mongo = MongoService()
            
            # Aktualisiere die URLs der Ressourcen in der MongoDB
            result = mongo.update_many_rag_data(
                instance.knowledgebase.id,
                {"webdav_resource_id": instance.id},
                {"$set": {"url": {"$concat": [instance.url, {"$substr": ["$url", {"$strLenCP": instance._original_url}, -1]}]}}}
            )
            
            logger.info(f"Updated {result.modified_count} resources for WebDAV resource {instance.name}")
        
        # Speichere die ursprüngliche URL für den nächsten Vergleich
        instance._original_url = instance.url
    except Exception as e:
        logger.error(f"Error updating resources for WebDAV resource {instance.name}: {str(e)}")
    finally:
        # Schließe die MongoDB-Verbindung
        if 'mongo' in locals():
            mongo.close()