"""PDF Document Processor for GraphQL resources"""
import hashlib
import logging
import requests
from typing import List
from datetime import datetime, timezone
from urllib.parse import urlparse
from bson import ObjectId

from hw_rag.dataclasses import QSource, QSourceType, QSourceOrigin, QSourceOriginType
from backend.services.mongo_service import MongoService
from graphql.models import GraphQlResource

logger = logging.getLogger(__name__)


class PdfDocumentExtractor:
    def __init__(self, mongo_service: MongoService):
        self.mongo_service = mongo_service

    def process_pdf_documents(self, markdown: str, resource: GraphQlResource, item) -> List[str]:
        """Process PDF documents found in markdown content"""
        document_ids = []
        pdf_links = self._extract_pdf_links(markdown)

        for pdf_url in pdf_links:
            try:
                document_id = self._process_single_pdf(pdf_url, resource, item)
                if document_id:
                    document_ids.append(document_id)
            except Exception as e:
                logger.error(f"Failed to process PDF {pdf_url}: {str(e)}")
        logger.info(f"Processed {len(document_ids)} PDFs")
        return document_ids

    def _process_single_pdf(self, pdf_url: str, resource: GraphQlResource, item) -> str:
        """Process a single PDF document"""
        # Download PDF content
        response = requests.get(pdf_url, timeout=30)
        if response.status_code != 200:
            raise Exception(f"status code: {str(response.status_code)}")

        # Generate checksum
        pdf_content = response.content
        checksum = hashlib.md5(pdf_content).hexdigest()

        # Check for duplicate
        existing_doc = self.mongo_service.get_one_rag_data(
            resource.knowledgebase.id,
            {"url": pdf_url}
        )

        reference_id = ObjectId() if existing_doc is None else existing_doc["_id"]

        # Create source object
        source = QSource(
            reference_id=str(reference_id),
            url=pdf_url,
            title=urlparse(pdf_url).path.split('/')[-1],
            source_type=QSourceType.PDF,
            source_origin=QSourceOrigin(
                type=QSourceOriginType.GRAPHQL,
                id=resource.id
            ),
            create_date=datetime.now(timezone.utc),
        )

        if existing_doc is None:
            # Create new document
            document = self._create_new_document(pdf_url, checksum, source)
            self.mongo_service.insert_rag_data(resource.knowledgebase.id, document)
            self._queue_for_processing(resource.knowledgebase.id, source)
        else:
            if checksum != existing_doc.get("checksum"):
                # Update existing if changed
                self._update_existing_document(resource.knowledgebase.id, reference_id, checksum)
                self._queue_for_processing(resource.knowledgebase.id, source)
            else:
                logger.info(f"Skipping {pdf_url} as it has already been processed")
        return str(reference_id)

    def _create_new_document(self, url: str, checksum: str, source: QSource) -> dict:
        """Create a new MongoDB document for PDF"""
        return {
            "_id": ObjectId(source.reference_id),
            "url": url,
            "source_type": QSourceType.PDF.value,
            "source_origin": source.source_origin.serialize(),
            "content": checksum,
            "create_date": datetime.now(timezone.utc),
            "last_processed": None,
            "last_updated": datetime.now(timezone.utc),
            "checksum": checksum,
        }

    def _update_existing_document(self, knowledgebase_id: int, reference_id: ObjectId, checksum: str):
        """Update existing PDF document"""
        self.mongo_service.update_rag_data(
            knowledgebase_id,
            {"_id": reference_id},
            {
                "content": checksum,
                "checksum": checksum,
                "last_updated": datetime.now(timezone.utc),
            }
        )

    def _queue_for_processing(self, knowledgebase_id: int, source: QSource):
        """Queue document for RAG processing"""
        from backend.tasks import process_qsource
        logger.info(f"Processing PDF {source.url}")
        process_qsource.delay(
            knowledgebase_id=knowledgebase_id,
            source=source.dict()
        )

    @staticmethod
    def _extract_pdf_links(markdown: str) -> List[str]:
        """Extract PDF links from markdown content"""
        import re
        link_pattern = r'!?\[(.*?)\]\((.*?\.pdf)\)'
        matches = re.finditer(link_pattern, markdown)
        return [match.group(2) for match in matches]
