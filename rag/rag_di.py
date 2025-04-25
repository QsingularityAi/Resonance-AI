from dependency_injector import containers, providers
from hw_rag.services.qdrant_service import QdrantService
from hw_rag.services.openai_service import OpenAIService
from hw_rag.services.download_service import DownloadService


class RAGDI(containers.DeclarativeContainer):
    config = providers.Configuration()
    openai_service = providers.Singleton(OpenAIService)
    qdrant_service = providers.Singleton(QdrantService)
    download_service = providers.Singleton(DownloadService)
    rag_data_manager = providers.Dependency()
    rag_processing = providers.Singleton(
        lambda qdrant, rag_data_manager: __import__('hw_rag.rag_processing').rag_processing.RagProcessing(
            qdrant=qdrant,
            rag_data_manager=rag_data_manager
        ),
        qdrant=qdrant_service,
        rag_data_manager=rag_data_manager
    )
