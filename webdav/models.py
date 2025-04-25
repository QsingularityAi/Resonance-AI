from urllib.parse import urlparse

from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from backend.api.models import Knowledgebase, Tenant
from webdav.dataclasses import CrawlingStatus
from django_scopes.manager import ScopedManager




class WebdavResource(models.Model):
    """
    Ein Model für WebDAV-Ressourcen.
    
    Dieses Model speichert Informationen über WebDAV-Ressourcen, die gecrawlt werden sollen.
    """
    
    url = models.URLField(
        verbose_name=_('Quell URL'),
    )

    knowledgebase = models.ForeignKey(
        Knowledgebase,  # Adjusted to reference the Knowledgebase model from another app
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_('Knowledgebase')
    )
    auth_user_name = models.CharField(
        null=True,
        blank=True,
        max_length=255,
        verbose_name=_('Benutzername')
    )
    auth_user_password = models.CharField(
        null=True,
        blank=True,
        max_length=255,
        verbose_name=_('Passwort')
    )
    deep = models.BooleanField(
        default=False,
        verbose_name=_('Rekursiv crawlen')
    )

    starting_directory = models.CharField(
        null=False,
        blank=False,
        default="/",
        max_length=255,
        help_text=_("Startverzeichnis relativ zum Start. Bspw. 'Beispiel/Ordner/'. Keine führenden '/'!"),
    )

    supported_extensions = models.CharField(
        null=True,
        blank=True,
        max_length=255,
        default='pdf,jpeg,jpg,JPG,png,PNG',
        verbose_name=_('Unterstützte Dateierweiterungen')
    )
    name = models.CharField(
        null=False,
        blank=False,
        max_length=255,
        verbose_name=_('Name')
    )
    
    # Felder für die Verwaltung des Crawling-Prozesses
    last_crawl_start = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_('Letzter Crawl-Start')
    )
    last_crawl_end = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_('Letzter Crawl-Ende')
    )
    number_of_resources_processed = models.IntegerField(
        default=0,
        verbose_name=_('Anzahl verarbeiteter Ressourcen')
    )
    crawling_status = models.CharField(
        max_length=20,
        choices=[(status.value, status.name) for status in CrawlingStatus],
        default=CrawlingStatus.PENDING.value,
        verbose_name=_('Crawling-Status')
    )
    crawl_interval = models.IntegerField(
        default=0,
        verbose_name=_('Crawl-Intervall (Tage)'),
        help_text=_('Intervall für automatische Crawls in Tagen. 0 = keine automatischen Crawls.')
    )
    deletion_timeout = models.IntegerField(
        default=0,
        verbose_name=_('Löschzeitraum (Tage)'),
        help_text=_('Zeitraum in Tagen, nach dem Ressourcen gelöscht werden sollen. 0 = keine automatische Löschung.')
    )
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    objects = ScopedManager(tenant="tenant")

    @property
    def host(self)->str:
        """Returns the hostname part of the URL."""
        return f"{urlparse(self.url).scheme}://{urlparse(self.url).netloc}"

    
    class Meta:
        app_label = 'webdav'
        verbose_name = _('WebDAV-Ressource')
        verbose_name_plural = _('WebDAV-Ressourcen')
    
    def __str__(self):
        return self.name
    
    def __init__(self, *args, **kwargs):
        """
        Initialisiert die WebdavResource-Instanz.
        
        Speichert die ursprüngliche URL für den Vergleich beim Speichern.
        """
        super().__init__(*args, **kwargs)
        self._original_url = self.url if self.pk else None
    
    def crawl(self):
        """
        Startet den Crawling-Prozess für diese WebDAV-Ressource.
        
        Returns:
            Die Anzahl der gefundenen und verarbeiteten Dateien
        """
        from webdav.service.webdav_crawler_service import WebdavCrawlerService
        
        # Aktualisiere den Crawling-Status und den Zeitpunkt des letzten Crawl-Starts
        self.crawling_status = CrawlingStatus.CRAWLING.value
        self.last_crawl_start = timezone.now()
        self.save()
        
        try:
            # Erstelle einen WebdavCrawlerService und starte den Crawling-Prozess
            crawler = WebdavCrawlerService(self)
            processed_count = crawler.crawl(start_path=self.starting_directory, deep=self.deep)
            
            # Aktualisiere die Anzahl der verarbeiteten Ressourcen und den Zeitpunkt des letzten Crawl-Endes
            self.number_of_resources_processed = processed_count
            self.last_crawl_end = timezone.now()
            self.crawling_status = CrawlingStatus.PENDING.value
            self.save()
            
            return processed_count
        except Exception as e:
            # Bei einem Fehler setze den Crawling-Status auf ERROR
            self.crawling_status = CrawlingStatus.ERROR.value
            self.last_crawl_end = timezone.now()
            self.save()
            
            # Logge den Fehler und gib ihn weiter
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error crawling WebDAV resource {self.url}: {str(e)}")
            
            raise