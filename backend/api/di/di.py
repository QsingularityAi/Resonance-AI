from dependency_injector import providers, containers

from backend.api.services.faq_service import FaqService
from backend.services.mongo_service import MongoService
from backend.services.rag_datamanager import RAGDataManager
from hw_rag.rag_di import RAGDI



class DI(containers.DeclarativeContainer):
    mongodb_service = providers.Singleton(MongoService)
    rag_data_manager = providers.Singleton(RAGDataManager, mongodb_service=mongodb_service)
    RAG = providers.Container(
        RAGDI,
        rag_data_manager=rag_data_manager,
    )
    qdrant_service = RAG.qdrant_service
    openai_service = RAG.openai_service
    rag_processing = RAG.rag_processing
    download_service = RAG.download_service  # Übernehme den download_service aus dem RAGDI-Container
    faq_service = providers.Singleton(
        FaqService,
        qdrant_service=qdrant_service
    )

