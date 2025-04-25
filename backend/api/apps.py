import importlib

from dependency_injector import providers
from django.apps import AppConfig
from django.conf import settings
from django.core.cache import cache

from backend.api.di.di import DI
import sys

from hw_rag.rag_di import RAGDI


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'backend.api'
    label = 'api'

    def ready(self):
        wire_modules = [
            "hw_rag.answer_generator",
            "hw_rag.base_rag",
            "hw_rag.services.qdrant_service",
            "hw_rag.query_optimizer",
            "hw_rag.related_question_generator",
            "backend.tasks",
        ]

        if self.is_rag_available():
            wire_modules += [
                "hw_rag.image_processor",
                "hw_rag.markdown_processor",
            ]
            
        # Füge das webdav-Paket zu den wire_modules hinzu, wenn es verfügbar ist
        if self.is_webdav_available():
            wire_modules += [
                "webdav.service.webdav_download_service",
            ]

        packages = [
            "backend.api",
            "backend.services",
        ]
        
        # Füge das webdav-Paket hinzu, wenn es verfügbar ist
        if self.is_webdav_available():
            packages.append("webdav")
        container = DI()
        container.RAG.wire(wire_modules)
        container.wire(modules=wire_modules, packages=packages)

        optional_modules = [
            "hw_rag.benchmark.benchmark",
            "hw_rag.benchmark.get_answers",
        ]

        for module in optional_modules:
            try:
                container.RAG.wire([module])
                container.wire(modules=[module], packages=packages)
            except ModuleNotFoundError:
                pass  # Skip if benchmark module doesn't exist

        self.update_jazzmin_settings()

    def is_rag_available(self):
        # this is a simple test to see if we are in a container that has the rag dependencies installed
        try:
            import langchain
            return True
        except ImportError:
            return False

    def is_webdav_available(self):
        # this is a simple test to see if we are in a container that has the webdav dependencies installed
        try:
            import webdav4
            return True
        except ImportError:
            return False



    def update_jazzmin_settings(self):
        from backend.utils.jazzmin import update_jazzmin_settings
        update_jazzmin_settings()