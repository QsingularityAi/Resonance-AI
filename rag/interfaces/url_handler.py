"""
URL-Handler-Interface für den DownloadService.
"""
from abc import ABC, abstractmethod
from typing import Optional


class URLHandler(ABC):
    """
    Eine abstrakte Klasse für URL-Handler, die vom DownloadService verwendet werden.
    
    URL-Handler sind für das Erkennen und Herunterladen von Dateien von bestimmten URL-Typen zuständig.
    """
    
    @abstractmethod
    def can_handle(self, url: str) -> bool:
        """
        Prüft, ob der Handler die angegebene URL verarbeiten kann.
        
        Args:
            url: Die zu prüfende URL
            
        Returns:
            True, wenn der Handler die URL verarbeiten kann, sonst False
        """
        pass
    
    @abstractmethod
    def download(self, url: str, reference_id: str) -> Optional[bytes]:
        """
        Lädt eine Datei von der angegebenen URL herunter.
        
        Args:
            url: Die URL der Datei
            reference_id: Die Referenz-ID für die Datei
            
        Returns:
            Die Datei als Bytes-Objekt oder None, wenn ein Fehler auftritt
        """
        pass