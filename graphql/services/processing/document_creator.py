"""
Document Creator

This module provides a service for creating MongoDB documents from processed data.
"""
import hashlib
import json
import logging
from typing import Dict, Any, Optional
from urllib.parse import urlparse

from bson import ObjectId
from django.utils import timezone

from backend.services.mongo_service import MongoService
from graphql.models import GraphQlResource
from hw_rag.dataclasses import QSourceType, QSourceOrigin, QSource, QSourceOriginType

logger = logging.getLogger(__name__)


class DocumentCreator:
    """
    Service for creating MongoDB documents from processed data.
    """
    
    def __init__(self, graph_ql_resource: GraphQlResource):
        """
        Initialize the document creator.
        
        Args:
            graph_ql_resource: The GraphQlResource instance.
        """
        self.resource = graph_ql_resource
    
    def create_document(self, item: Dict[str, Any], markdown: str, mongo: MongoService,resource: GraphQlResource) -> tuple[Dict[str, Any], QSource, bool]:
        """
        Create a MongoDB document from processed data.
        
        Args:
            item: The original item data.
            markdown: The markdown representation of the item.
            mongo: Mongo Service instance.

        Returns:
            A MongoDB document.
        """
        # Create a unique identifier for the document based on the content
        item_json = json.dumps(item, sort_keys=False)
        checksum = hashlib.md5(item_json.encode()).hexdigest()

        # Generate a deterministic reference ID based on the checksum
        # This ensures that the same content always gets the same ID

        item_id = item.get(self.resource.item_identification_field, checksum)

        # Create a QSource object and update/create document
        document = mongo.get_one_rag_data(self.resource.knowledgebase.id, {"url": f"{item_id}" })
        reference_id = ObjectId() if document is None else document["_id"]
        source = self._create_source(str(reference_id), item)
        send_update = False
        if document is None:
            # Create the document
            document = {
                "_id": reference_id,
                "title": self.resource.name,
                "url": item_id,
                "source_type": QSourceType.MARKDOWN.value,
                "source_origin": source.source_origin.serialize(),
                "content": markdown,
                "create_date": timezone.now(),
                "last_processed": timezone.now(),
                "last_updated": timezone.now(),
                "raw_data": json.dumps(item),
                "checksum": checksum,
            }
            send_update = True
        else:
            document["updated"] = True
            if checksum != document["checksum"]:
                document["checksum"] = checksum
                document["content"] = markdown
                document["last_updated"] = timezone.now()
                send_update = True
            else:
                document["last_updated"] = timezone.now()

        
        return document, source, send_update

    def _create_source(self, reference_id: str, source_metadata: Optional[dict] = None) -> QSource:
        """
        Create a QSource object for the document.

        Args:
            reference_id: The unique reference ID for the document.
            source_metadata: Optional metadata from the source.

        Returns:
            A QSource object.
        """
        name = source_metadata.get("name", "")
        item_id = source_metadata.get(self.resource.item_identification_field, "")
        url = self.resource.url  # Default to the query URL
        
        # Try to use template if available
        if self.resource.source_url_template and source_metadata:
            try:
                url = self._process_url_template(self.resource.source_url_template, source_metadata)
            except Exception as e:
                logger.warning(f"Error processing URL template: {str(e)}")
                # Fall back to the resource URL on error

        return QSource(
            reference_id=reference_id,
            url=url,
            title= name + "|" + item_id,
            source_type=QSourceType.MARKDOWN,  # Using WEBSITE as default for GraphQL
            source_origin=QSourceOrigin(
                type=QSourceOriginType.GRAPHQL,
                id=self.resource.id
            ),
            create_date=timezone.now(),
            metadata={key:source_metadata.get(key, None) for key in self.resource.result_metadata_fields.split(",")} if self.resource.result_metadata_fields is not None and self.resource.result_metadata_fields != "" else None,
        )
        
    def _process_url_template(self, template: str, source_metadata: dict) -> str:
        """
        Process URL template by replacing placeholders with values from source metadata.
        
        Args:
            template: URL template with {placeholders}
            source_metadata: Source data dictionary
            
        Returns:
            Processed URL with placeholders replaced by values
        """
        try:
            # Find all placeholders in the template
            import re
            placeholders = re.findall(r'\{([^}]+)\}', template)
            
            # Create a dictionary of replacements
            replacements = {}
            for placeholder in placeholders:
                # Check if placeholder exists directly in source_metadata
                if placeholder in source_metadata:
                    replacements[placeholder] = source_metadata[placeholder]
                else:
                    # Try nested path notation (e.g., "user.name")
                    parts = placeholder.split('.')
                    value = source_metadata
                    try:
                        for part in parts:
                            value = value[part]
                        replacements[placeholder] = value
                    except (KeyError, TypeError):
                        # Use empty string if not found
                        replacements[placeholder] = ""
                        logger.debug(f"Placeholder '{placeholder}' not found in source data")
            
            # Replace placeholders in template
            return template.format(**replacements)
        except Exception as e:
            logger.warning(f"Error processing URL template: {str(e)}")
            return self.resource.url
