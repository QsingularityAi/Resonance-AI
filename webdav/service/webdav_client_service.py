"""
WebDAV Client Service für die Kommunikation mit WebDAV-Servern.
"""
import logging
from io import BytesIO
from typing import Optional, Dict, List, Any, Tuple, Union

from webdav4.client import Client, ClientError
import httpx


class WebdavClientService:
    """
    Ein Service für die Kommunikation mit WebDAV-Servern.
    
    Dieser Service verwendet die webdav4-Bibliothek, um mit WebDAV-Servern zu kommunizieren.
    Er bietet grundlegende Funktionen für die Verbindung, Authentifizierung, Verzeichnislistung
    und Dateidownload.
    """
    
    def __init__(self, base_url: str, auth_user_name: Optional[str] = None, auth_user_password: Optional[str] = None, verify_ssl: bool = True):
        """
        Initialisiert den WebDAV Client Service.
        
        Args:
            base_url: Die Basis-URL des WebDAV-Servers
            auth_user_name: Der Benutzername für die Authentifizierung (optional)
            auth_user_password: Das Passwort für die Authentifizierung (optional)
            verify_ssl: Ob SSL-Zertifikate überprüft werden sollen (Standard: True)
        """
        self.base_url = base_url
        self.auth_user_name = auth_user_name
        self.auth_user_password = auth_user_password
        self.verify_ssl = verify_ssl
        self.client = None
        self.auth_required = None  # Wird später festgelegt
        self.logger = logging.getLogger(__name__)
    
    def check_auth_required(self) -> bool:
        """
        Überprüft, ob eine Authentifizierung für den WebDAV-Server erforderlich ist.
        
        Versucht zunächst eine Verbindung ohne Authentifizierung herzustellen.
        Wenn ein 401 Unauthorized-Fehler zurückgegeben wird, ist eine Authentifizierung erforderlich.
        
        Returns:
            True, wenn eine Authentifizierung erforderlich ist, sonst False
        
        Raises:
            ClientError: Wenn ein anderer Fehler als 401 Unauthorized auftritt
        """
        try:
            # Versuche, ohne Authentifizierung zu verbinden
            test_client = Client(
                base_url=self.base_url,
                verify=self.verify_ssl  # SSL-Zertifikate überprüfen oder nicht
            )
            # Versuche, ein Verzeichnis aufzulisten oder eine andere Operation durchzuführen
            test_client.ls("")
            # Wenn kein Fehler auftritt, ist keine Authentifizierung erforderlich
            self.auth_required = False
            return False
        except ClientError as e:
            # Prüfe, ob es sich um einen 401 Unauthorized-Fehler handelt
            if isinstance(e.__cause__, httpx.HTTPStatusError) and e.__cause__.response.status_code == 401:
                self.auth_required = True
                return True
            # Andere Fehler weiterleiten
            raise
    
    def get_client(self) -> Client:
        """
        Erstellt und gibt ein webdav4.client.Client-Objekt zurück.
        
        Wenn eine Authentifizierung erforderlich ist und Anmeldedaten vorhanden sind,
        werden diese verwendet. Andernfalls wird versucht, ohne Authentifizierung zu verbinden.
        
        Returns:
            Ein webdav4.client.Client-Objekt
        """
        # Wenn wir noch nicht wissen, ob Authentifizierung erforderlich ist, prüfen wir das
        if self.auth_required is None:
            self.check_auth_required()
        
        # Client-Optionen für HTTPS
        client_opts = {
            'verify': self.verify_ssl  # SSL-Zertifikate überprüfen oder nicht
        }
        
        # Wenn Authentifizierung erforderlich ist und Anmeldedaten vorhanden sind
        if self.auth_required and self.auth_user_name and self.auth_user_password:
            self.client = Client(
                base_url=self.base_url,
                auth=(self.auth_user_name, self.auth_user_password),
                **client_opts
            )
        else:
            # Keine Authentifizierung erforderlich oder keine Anmeldedaten vorhanden
            self.client = Client(
                base_url=self.base_url,
                **client_opts
            )
        
        return self.client
    
    def list_directory(self, path: str, detail: bool = True) -> Union[List[str], List[Dict[str, Any]]]:
        """
        Listet den Inhalt eines Verzeichnisses auf.
        
        Args:
            path: Der Pfad zum Verzeichnis
            detail: Ob detaillierte Informationen zurückgegeben werden sollen (Standard: True)
            
        Returns:
            Eine Liste von Datei- und Verzeichnisnamen oder eine Liste von Dictionaries mit detaillierten Informationen
            
        Raises:
            ClientError: Wenn ein Fehler beim Auflisten des Verzeichnisses auftritt
        """
        try:
            client = self.get_client()
            return client.ls(path, detail=detail)
        except ClientError as e:
            self.logger.error(f"Error listing directory {path}: {str(e)}")
            raise
    
    def download_file(self, path: str) -> Optional[bytes]:
        """
        Lädt eine Datei herunter und gibt sie als Bytes-Objekt zurück.
        
        Args:
            path: Der Pfad zur Datei
            
        Returns:
            Die Datei als Bytes-Objekt oder None, wenn ein Fehler auftritt
            
        Raises:
            ClientError: Wenn ein Fehler beim Herunterladen der Datei auftritt
        """
        try:
            client = self.get_client()
            buffer = BytesIO()
            client.download_fileobj(path, buffer)
            buffer.seek(0)
            return buffer.read()
        except ClientError as e:
            self.logger.error(f"Error downloading file {path}: {str(e)}")
            raise
    
    def file_exists(self, path: str) -> bool:
        """
        Prüft, ob eine Datei oder ein Verzeichnis existiert.
        
        Args:
            path: Der Pfad zur Datei oder zum Verzeichnis
            
        Returns:
            True, wenn die Datei oder das Verzeichnis existiert, sonst False
        """
        try:
            client = self.get_client()
            return client.exists(path)
        except ClientError as e:
            self.logger.error(f"Error checking if file exists {path}: {str(e)}")
            return False
    
    def is_directory(self, path: str) -> bool:
        """
        Prüft, ob ein Pfad ein Verzeichnis ist.
        
        Args:
            path: Der Pfad zum Verzeichnis
            
        Returns:
            True, wenn der Pfad ein Verzeichnis ist, sonst False
        """
        try:
            client = self.get_client()
            return client.isdir(path)
        except ClientError as e:
            self.logger.error(f"Error checking if path is directory {path}: {str(e)}")
            return False
    
    def is_file(self, path: str) -> bool:
        """
        Prüft, ob ein Pfad eine Datei ist.
        
        Args:
            path: Der Pfad zur Datei
            
        Returns:
            True, wenn der Pfad eine Datei ist, sonst False
        """
        try:
            client = self.get_client()
            return client.isfile(path)
        except ClientError as e:
            self.logger.error(f"Error checking if path is file {path}: {str(e)}")
            return False
    
    def get_file_info(self, path: str) -> Optional[Dict[str, Any]]:
        """
        Ruft Metadaten einer Datei oder eines Verzeichnisses ab.
        
        Args:
            path: Der Pfad zur Datei oder zum Verzeichnis
            
        Returns:
            Ein Dictionary mit Metadaten oder None, wenn ein Fehler auftritt
        """
        try:
            client = self.get_client()
            return client.info(path)
        except ClientError as e:
            self.logger.error(f"Error getting file info {path}: {str(e)}")
            return None
    
    @staticmethod
    def handle_ssl_errors(func):
        """
        Decorator für die Behandlung von SSL-Fehlern.
        
        Args:
            func: Die zu dekorierenden Funktion
            
        Returns:
            Die dekorierte Funktion
        """
        def wrapper(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except httpx.SSLError as e:
                # SSL-Fehler behandeln
                logging.error(f"SSL error: {str(e)}")
                raise
            except httpx.ConnectTimeout as e:
                # Verbindungs-Timeout behandeln
                logging.error(f"Connection timeout: {str(e)}")
                raise
            except httpx.ConnectError as e:
                # Verbindungsfehler behandeln
                logging.error(f"Connection error: {str(e)}")
                raise
        return wrapper