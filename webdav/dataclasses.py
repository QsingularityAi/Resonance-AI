"""
Dataclasses für den WebDAV-Crawler.
"""
from enum import Enum
from django.utils.translation import gettext_lazy as _


class CrawlingStatus(str, Enum):
    """
    Status des Crawling-Prozesses.
    """
    PENDING = "pending"
    CRAWLING = "crawling"
    ERROR = "error"
    
    @classmethod
    def choices(cls):
        """
        Gibt eine Liste von Tupeln (value, name) zurück, die für Django-Modelle verwendet werden kann.
        
        Returns:
            Eine Liste von Tupeln (value, name)
        """
        return [(member.value, member.name) for member in cls]