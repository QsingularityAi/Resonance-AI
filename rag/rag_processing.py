"""
Copyright (c) 2024 Helm & Walter IT-Solutions
PROPRIETARY AND CONFIDENTIAL

This component and any modifications thereof remain the exclusive property of
Helm & Walter IT-Solutions. A non-exclusive, non-transferable license is granted
solely for the purpose of operating the delivered solution in its intended way.

While source code is provided, any use, copying, modification, distribution or
reuse outside the intended solution it was shipped with is strictly prohibited.
All rights reserved.

Version: 1.5.1
Initial version: 1.0.0 (2024-02-14) Bernd Helm (bernd.helm@helmundwalter.de)
"""
import logging
from pathlib import Path

from dependency_injector.wiring import Provide

from hw_rag.dataclasses import QSourceType, QSource
from hw_rag.services.qdrant_service import QdrantService
from .i_rag_datamanager import IRAGDataManager
from .rag_di import RAGDI
from .services.download_service import DownloadService
logger = logging.getLogger(__name__)


class RagProcessing:
    def __init__(self, qdrant: QdrantService = Provide[RAGDI.qdrant_service],
                 rag_data_manager: IRAGDataManager = Provide[RAGDI.rag_data_manager],
                 download_service: DownloadService = Provide[RAGDI.download_service]):
        # Use relative paths from current directory
        current_dir = Path(__file__).parent.parent / "rag_cache"
        self.data_dir = current_dir / "data"
        self.cache_dir = current_dir / "cache"
        self.rag_data_manager = rag_data_manager
        self.download_service = download_service

        # Create directories if they don't exist
        self.data_dir.mkdir(exist_ok=True)
        self.cache_dir.mkdir(exist_ok=True)

        self.logger = logging.getLogger(__name__)

        self.qdrant = qdrant
        self.pdf_processor = None
        self.markdown_processor = None


    def process_document(self, knowledgebase_id: int, source: QSource) -> bool:

        if not self.pdf_processor:
            from .pdf_processor import PdfProcessor
            self.pdf_processor = PdfProcessor(self.data_dir / 'pdf')
        if not self.markdown_processor:
            from .markdown_processor import MarkdownProcessor
            self.markdown_processor = MarkdownProcessor(self.cache_dir / 'markdown')

        try:
            if source.source_type not in [QSourceType.PDF, QSourceType.WEBSITE, QSourceType.MARKDOWN]:
                raise ValueError()
            from langchain_core.documents import Document

            documents = []
            self.logger.warn(f"rag processing started, {source.url}")
            # Get document data based on source type
            if source.source_type == QSourceType.WEBSITE or source.source_type == QSourceType.MARKDOWN:
                document_data = self.rag_data_manager.get_markdown_content(knowledgebase_id, source)
                if not document_data:
                    self.logger.error(f"No markdown content found for document_id: {source.reference_id}")
                    return False
                document = Document(
                    page_content=document_data,
                    metadata={
                        'source': source,
                    }
                )
                documents.extend(self.markdown_processor.process_markdown([document], knowledgebase_id))
            elif source.source_type == QSourceType.PDF:

                document_data = self.download_service.download_file(url=source.url, reference_id=source.reference_id)
                if not document_data:
                    self.logger.error(f"Failed to download document: {source.url}")
                    return False

                # for debugging/development, save the downloaded docs locally
                #parsed_url = urlparse(url)
                #output_dir = Path("downloaded_docs")
                #output_dir.mkdir(exist_ok=True)
                #filename = os.path.basename(parsed_url.path)

                #output_path = output_dir / filename
                #try:
                #    with open(output_path, "wb") as f:
                #        f.write(document_data)
                #    self.logger.info(f"Saved document to {output_path}")
                #except Exception as e:
                #    self.logger.error(f"Failed to save document: {e}")
                #    return False

                markdowns = self.pdf_processor.process_pdf(pdf_bytes=document_data, source=source,
                                                           force_processing=False)
                if len(markdowns) == 0:
                    return False
                docs = self.markdown_processor.process_markdown(markdowns, knowledgebase_id)
                documents.extend(docs)
            else:
                self.logger.error(f"Unexpected source type: {source.source_type}")
                return False

            # Store all documents in Qdrant using batch functionality
            self.qdrant.smart_upsert(knowledgebase_id, documents, source.reference_id)
            self.logger.warn(f"Processed documents: {len(documents)}")
            self.rag_data_manager.update_last_processed(knowledgebase_id, reference_id=source.reference_id)
            return len(documents) > 0
        except Exception as e:
            self.logger.error(f"Error processing document: {str(e)}", exc_info=True)
            return False
