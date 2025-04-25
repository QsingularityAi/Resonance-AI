"""
WebDAV-Paket für das Crawlen von WebDAV-Servern.
"""
import logging

logger = logging.getLogger(__name__)

# Die Registrierung der Signal-Handler und des WebdavURLHandler erfolgt jetzt in der ready()-Methode der App-Konfiguration