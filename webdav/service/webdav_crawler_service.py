"""
WebDAV Crawler Service für das Crawlen von WebDAV-Servern.
"""
import hashlib
import logging
import os
from datetime import datetime
from io import BytesIO
from typing import Optional, Dict, List, Any, Tuple, Set

from bson import ObjectId
from django.utils import timezone
from extra_settings.cache import del_cached_setting
from webdav4.client import Client

from backend.services.mongo_service import MongoService
from backend.tasks import process_qsource
from hw_rag.dataclasses import QSource, QSourceType, QSourceOrigin, QSourceOriginType
from webdav.models import WebdavResource
from webdav.service.webdav_client_service import WebdavClientService


class WebdavCrawlerService:
    """
    Ein Service für das Crawlen von WebDAV-Servern.
    
    Dieser Service verwendet den WebDAV Client Service, um Dateien rekursiv von WebDAV-Servern zu crawlen.
    Er filtert Dateien nach Erweiterungen, speichert Metadaten in MongoDB und erstellt QSource-Objekte
    für gefundene Dateien, die dann an den RAG-Prozessor übergeben werden.
    """
    
    def __init__(self, webdav_resource: WebdavResource, mongo_service: Optional[MongoService] = None):
        """
        Initialisiert den WebDAV Crawler Service.
        
        Args:
            webdav_resource: Eine WebdavResource-Instanz mit den Verbindungsinformationen
            mongo_service: Eine optionale MongoService-Instanz für die Datenspeicherung
        """
        self.webdav_resource = webdav_resource
        self.mongo_service = mongo_service or MongoService()
        self.webdav_client = None
        self.logger = logging.getLogger(__name__)
    
    def initialize_client(self) -> WebdavClientService:
        """
        Initialisiert den WebDAV Client mit den Verbindungsinformationen aus der WebdavResource.
        
        Returns:
            Eine WebdavClientService-Instanz
        """
        self.webdav_client = WebdavClientService(
            base_url=self.webdav_resource.url,
            auth_user_name=self.webdav_resource.auth_user_name,
            auth_user_password=self.webdav_resource.auth_user_password
        )
        return self.webdav_client
    
    def crawl(self, start_path: str = "", deep: bool = False) -> int:
        """
        Startet den Crawling-Prozess vom angegebenen Pfad aus.
        
        Args:
            start_path: Der Pfad, von dem aus der Crawling-Prozess gestartet werden soll
            deep: Ob Unterverzeichnisse rekursiv durchsucht werden sollen
            
        Returns:
            Die Anzahl der gefundenen und verarbeiteten Dateien
        """
        # Initialisiere den WebDAV-Client, falls noch nicht geschehen
        if self.webdav_client is None:
            self.initialize_client()
        # Überprüfe, ob der Pfad existiert
        if not self.webdav_client.file_exists(start_path):
            self.logger.error(f"Path {start_path} does not exist")
            return 0
        
        # Überprüfe, ob der Pfad ein Verzeichnis ist
        if not self.webdav_client.is_directory(start_path):
            self.logger.error(f"Path {start_path} is not a directory")
            return 0
        
        # Starte den Crawling-Prozess
        processed_files = set()
        return self.crawl_directory(start_path, deep, processed_files)
    
    def crawl_directory(self, path: str, deep: bool = False, processed_files: Optional[Set[str]] = None) -> int:
        """
        Durchsucht ein Verzeichnis und optional seine Unterverzeichnisse.
        
        Args:
            path: Der zu durchsuchende Verzeichnispfad
            deep: Ob Unterverzeichnisse rekursiv durchsucht werden sollen
            processed_files: Eine Menge der bereits verarbeiteten Dateien
            
        Returns:
            Die Anzahl der gefundenen und verarbeiteten Dateien
        """
        if processed_files is None:
            processed_files = set()
        
        # Initialisiere den WebDAV-Client, falls noch nicht geschehen
        if self.webdav_client is None:
            self.initialize_client()
        
        # Hole den Verzeichnisinhalt
        try:
            directory_listing = self.webdav_client.list_directory(path)
        except Exception as e:
            self.logger.error(f"Error listing directory {path}: {str(e)}")
            return 0
        
        # Zähle die verarbeiteten Dateien
        processed_count = 0
        
        # Verarbeite jede Datei und jedes Verzeichnis
        for item in directory_listing:
            item_path = item.get('href', '')
            item_name = item.get('name', None)
            if item_name is None:
                continue
            is_dir = self.webdav_client.is_directory(f"{item.get('name')}")
            
            # Überspringe bereits verarbeitete Dateien
            if item_path in processed_files:
                continue
            
            # Füge die Datei zur Menge der verarbeiteten Dateien hinzu
            processed_files.add(item_path)
            
            if is_dir and deep:
                # Rekursiv Unterverzeichnisse durchsuchen
                processed_count += self.crawl_directory(f"{item_name}/", deep, processed_files)
            elif not is_dir and self.is_supported_file(item):
                # Verarbeite die Datei
                self.logger.info(f"Processing {self.webdav_resource.host+item_path}")
                if self.process_file(self.webdav_resource.host+item_path, item):
                    processed_count += 1
        
        return processed_count
    
    def is_supported_file(self, file_info: Dict[str, Any]) -> bool:
        """
        Prüft, ob eine Datei unterstützt wird (basierend auf der Erweiterung).
        
        Args:
            file_info: Informationen über die Datei
            
        Returns:
            True, wenn die Datei unterstützt wird, sonst False
        """
        # Hole den Dateinamen
        file_name = file_info.get('name', '')
        
        # Hole die unterstützten Erweiterungen
        supported_extensions = self.webdav_resource.supported_extensions
        if not supported_extensions:
            # Standardmäßig werden PDF- und Bilddateien unterstützt
            supported_extensions = 'pdf,jpeg,jpg,JPG,png,PNG'
        
        # Konvertiere die unterstützten Erweiterungen in eine Liste
        extensions = [ext.strip() for ext in supported_extensions.split(',')]
        
        # Prüfe, ob die Datei eine unterstützte Erweiterung hat
        for ext in extensions:
            if file_name.lower().endswith(f'.{ext.lower()}'):
                return True
        
        return False
    
    def process_file(self, file_path: str, file_info: Dict[str, Any]) -> bool:
        """
        Verarbeitet eine gefundene Datei.
        
        Args:
            file_path: Der Pfad zur Datei
            file_info: Informationen über die Datei
            
        Returns:
            True, wenn die Datei erfolgreich verarbeitet wurde, sonst False
        """
        try:
            # Berechne den Hash der Datei
            file_hash = None if "etag" not in file_info.keys() else file_info["etag"]
            if file_hash is None:
                return False
            
            # Bestimme den Quelltyp basierend auf der Dateierweiterung
            source_type = self._get_source_type_from_extension(file_path)
            
            # Erstelle oder aktualisiere den MongoDB-Eintrag
            reference_id, should_process = self.create_or_update_mongo_entry(file_path, source_type, file_hash, file_info)
            
            # Wenn die Datei nicht verarbeitet werden muss, überspringe sie
            if not should_process:
                return False
            
            # Erstelle ein QSource-Objekt
            qsource = self.create_qsource(file_path, file_info, reference_id)
            
            # Stelle die Datei in die Warteschlange für die RAG-Verarbeitung
            return self.queue_rag_processing(qsource)
        except Exception as e:
            self.logger.error(f"Error processing file {file_path}: {str(e)}")
            return False
    
    def create_or_update_mongo_entry(self, file_path: str, source_type: QSourceType, file_hash: str, file_info: Dict[str, Any]) -> Tuple[str, bool]:
        """
        Erstellt oder aktualisiert einen Eintrag in der MongoDB für eine gefundene Datei.
        
        Args:
            file_path: Der Pfad zur Datei
            source_type: Der Quelltyp der Datei
            file_hash: Der Hash der Datei
            file_info: Informationen zur Datei
        Returns:
            Die ID des erstellten oder aktualisierten Eintrags und ein Flag, das angibt, ob die Datei verarbeitet werden soll
        """
        
        # Prüfe, ob bereits ein Eintrag für diese Datei existiert
        existing_entry = self.mongo_service.get_one_rag_data(
            self.webdav_resource.knowledgebase.id,
            {"url": file_path}
        )
        
        # Aktuelles Datum
        now = datetime.now()
        
        # Erstelle die Metadaten für den Eintrag (entsprechend der vorgegebenen Struktur)
        content = {
            'url': file_path,
            'source_type': source_type.value,
            'source_origin': f"webdav:{self.webdav_resource.id}",
            'content': file_hash,
            'create_date': file_info.get('created', now),
            'last_processed': None,
            'last_updated': file_info.get('modified', now),
            'checksum': file_hash
        }
        
        if existing_entry:
            # Prüfe, ob sich der Hash geändert hat
            if existing_entry.get("checksum") == file_hash:
                # Der Hash hat sich nicht geändert, die Datei muss nicht erneut verarbeitet werden
                self.logger.info(f"File {file_path} has not changed, skipping processing")
                # Aktualisiere nur das last_updated-Feld
                self.mongo_service.update_rag_data(
                    self.webdav_resource.knowledgebase.id,
                    {"_id": existing_entry["_id"]},
                    {"last_updated": now}
                )
                return str(existing_entry["_id"]), False
            
            # Aktualisiere den bestehenden Eintrag
            update_content = content.copy()
            # Behalte das ursprüngliche create_date bei
            if 'create_date' in existing_entry:
                update_content['create_date'] = existing_entry['create_date']
            
            self.mongo_service.update_rag_data(
                self.webdav_resource.knowledgebase.id,
                {"_id": existing_entry["_id"]},
                update_content
            )
            return str(existing_entry["_id"]), True
        else:
            # Erstelle einen neuen Eintrag
            content["_id"] = ObjectId()
            doc = self.mongo_service.insert_rag_data(
                self.webdav_resource.knowledgebase.id,
                content
            )
            return str(doc.inserted_id), True
    
    def create_qsource(self, file_path: str, file_info: Dict[str, Any], reference_id: str) -> QSource:
        """
        Erstellt ein QSource-Objekt für eine gefundene Datei.
        
        Args:
            file_path: Der Pfad zur Datei
            file_info: Informationen über die Datei
            reference_id: Die Referenz-ID für die Datei
            
        Returns:
            Ein QSource-Objekt
        """
        # Bestimme den Quelltyp basierend auf der Dateierweiterung
        source_type = self._get_source_type_from_extension(file_path)
        
        # Erstelle die vollständige URL zur Datei
        file_url = f"{file_path}"
        
        # Erstelle das QSource-Objekt
        source = QSource(
            url=file_url,
            source_type=source_type,
            source_origin=QSourceOrigin(
                type=QSourceOriginType.WEBDAV,  # Verwende den neuen WEBDAV-Typ
                id=self.webdav_resource.id
            ),
            title=file_info.get("name", os.path.basename(file_path)),
            create_date=file_info.get("created", None),
            reference_id=reference_id,
        )
        
        return source
    
    def queue_rag_processing(self, qsource: QSource) -> bool:
        """
        Stellt eine Datei in die Warteschlange für die RAG-Verarbeitung.
        
        Args:
            qsource: Ein QSource-Objekt
            
        Returns:
            True, wenn die Datei erfolgreich in die Warteschlange gestellt wurde, sonst False
        """
        try:
            # Rufe den RAG-Prozessor auf
            process_qsource.delay(
                knowledgebase_id=self.webdav_resource.knowledgebase.id,
                source=qsource.model_dump()
            )
            return True
        except Exception as e:
            self.logger.error(f"Error queuing RAG processing: {str(e)}")
            return False
    
    def calculate_file_hash(self, file_path: str) -> Optional[str]:
        """
        Berechnet den Hash einer Datei.
        
        Args:
            file_path: Der Pfad zur Datei
            
        Returns:
            Der Hash der Datei oder None, wenn ein Fehler auftritt
        """
        try:
            # Initialisiere den WebDAV-Client, falls noch nicht geschehen
            if self.webdav_client is None:
                self.initialize_client()
            
            # Lade die Datei herunter
            file_content = self.webdav_client.download_file(file_path)
            if file_content is None:
                return None
            
            # Berechne den MD5-Hash der Datei
            md5_hash = hashlib.md5()
            md5_hash.update(file_content)
            
            return md5_hash.hexdigest()
        except Exception as e:
            self.logger.error(f"Error calculating hash for file {file_path}: {str(e)}")
            return None
    
    def _get_source_type_from_extension(self, file_path: str) -> QSourceType:
        """
        Bestimmt den QSourceType basierend auf der Dateierweiterung.
        
        Args:
            file_path: Der Pfad zur Datei
            
        Returns:
            Der QSourceType
        """
        # Hole die Dateierweiterung
        _, ext = os.path.splitext(file_path)
        ext = ext.lower()
        
        # Bestimme den QSourceType basierend auf der Erweiterung
        if ext == '.pdf':
            return QSourceType.PDF
        else:
            return QSourceType.WEBSITE  # Für Bilder und andere Dateien verwenden wir WEBSITE