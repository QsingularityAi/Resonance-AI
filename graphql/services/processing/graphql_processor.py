"""
GraphQL Processor

This module provides a service for processing GraphQL data and storing it in MongoDB.
"""
import logging
from typing import Dict, Any, List


from backend.services.mongo_service import MongoService
from backend.tasks import process_qsource
from graphql.models import GraphQlResource
from graphql.services import FieldMapper
from graphql.services.markdown.markdown_converter_factory import MarkdownConverterFactory
from graphql.services.processing.document_creator import DocumentCreator
from graphql.services.processing.pdf_extractor import PdfDocumentExtractor

logger = logging.getLogger(__name__)


class GraphQLProcessor:
    """
    Service for processing GraphQL data and storing it in MongoDB.
    """
    
    def __init__(self, mongo_service: MongoService):
        """
        Initialize the GraphQL processor.
        
        Args:
            mongo_service: The MongoDB service for storing data.
        """
        self.mongo_service = mongo_service
    
    def process_items(self, items: List[Dict[str, Any]], resource: GraphQlResource) -> List[str]:
        """
        Process GraphQL items and store them in MongoDB.
        
        Args:
            items: The items to process.
            resource: The GraphQlResource instance.
            
        Returns:
            A list of document IDs.
        """
        document_ids = []
        
        # Create a document creator
        document_creator = DocumentCreator(resource)
        
        # Get field mappings from the resource
        field_mappings = FieldMapper(resource.get_mappings())

        pdf_extractor = PdfDocumentExtractor(self.mongo_service)
        
        # Process each item
        for item in items:
            try:
                # Create a markdown converter for the item
                converter = MarkdownConverterFactory.create_converter(item, field_mappings)
                # Convert the item to markdown
                markdown = converter.convert(item, resource)
                # Create a document
                document, source, send_update = document_creator.create_document(item, markdown, self.mongo_service, resource)
                # Store the document in MongoDB
                # Process any PDF documents found in markdown
                if resource.extract_document_resources:
                    pdf_ids = pdf_extractor.process_pdf_documents(markdown, resource, item)
                    document_ids.extend(pdf_ids)
                    # Initialize metadata dict if None
                    if source.metadata is None:
                        source.metadata = {}
                    # Add or extend associated_ref_ids in metadata
                    if "associated_ref_ids" not in source.metadata:
                        source.metadata["associated_ref_ids"] = pdf_ids
                    else:
                        source.metadata["associated_ref_ids"].extend(pdf_ids)



                if "updated" in document:
                    ref_id = document["_id"]
                    del document["updated"]
                    del document["_id"]
                    self.mongo_service.update_rag_data(
                        resource.knowledgebase.id,
                        {"_id": ref_id},
                        document
                    )
                else:
                    self.mongo_service.insert_rag_data(resource.knowledgebase.id, document)
                    source.reference_id = str(document["_id"])

                if send_update:
                    process_qsource.delay(
                        knowledgebase_id=resource.knowledgebase.id,
                        source=source.dict()
                    )

                document_ids.append(str(source.reference_id))
                logger.info(f"Processed item and stored in MongoDB with ID: {str(source.reference_id)}")
            except Exception as e:
                logger.error(f"Failed to process item: {str(e)}")
        
        return document_ids

