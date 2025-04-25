"""
Django-App-Konfiguration für das webdav-Paket.
"""
from django.apps import AppConfig


class WebdavConfig(AppConfig):
    """
    Django-App-Konfiguration für das webdav-Paket.
    """
    
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'webdav'
    verbose_name = 'WebDAV'
    
    def ready(self):
        """
        Wird aufgerufen, wenn die App bereit ist.
        
        Registriert die Signal-Handler und den WebdavURLHandler.
        """
        # Importiere die Signal-Handler
        import webdav.signals
        
        # Registriere den WebdavURLHandler
        try:
            from webdav.service.webdav_download_service import register_webdav_url_handler
            register_webdav_url_handler()
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error registering WebdavURLHandler: {str(e)}")
