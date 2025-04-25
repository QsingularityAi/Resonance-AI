"""
Copyright (c) 2024 Helm & Walter IT-Solutions
PROPRIETARY AND CONFIDENTIAL

This component and any modifications thereof remain the exclusive property of
Helm & Walter IT-Solutions. A non-exclusive, non-transferable license is granted
solely for the purpose of operating the delivered solution in its intended way.

While source code is provided, any use, copying, modification, distribution or
reuse outside the intended solution it was shipped with is strictly prohibited.
All rights reserved.

Version: 1.1.0
Initial version: 1.0.0 (2024-06-14) Bernd Helm (bernd.helm@helmundwalter.de)
"""
from datetime import datetime, timezone
from typing import Optional
import logging

from bson import ObjectId
from pymongo import ASCENDING
from dependency_injector.wiring import inject, Provide

from hw_rag.dataclasses import QSource
from hw_rag.i_rag_datamanager import IRAGDataManager
from backend.services.mongo_service import MongoService

# Setup logging
logger = logging.getLogger(__name__)


class RAGDataManager(IRAGDataManager):
    @inject
    def __init__(
        self,
        mongodb_service: MongoService
    ):
        """
        Initialize RAG data manager using injected MongoDB service
        """
        try:
            self.mongo_service = mongodb_service
            self.db = self.mongo_service.db

            # LLM cache collection with 5-day TTL
            self.llm_cache = self.db['LLM_REQUEST_CACHE']
            self.llm_cache.create_index(
                [("timestamp", ASCENDING)],
                expireAfterSeconds=5 * 24 * 60 * 60  # 5 days
            )

            self.images_collection = self.db['IMAGES']  # Regular collection
            # Create indexes
            self.images_collection.create_index("reference_id")
            self.images_collection.create_index("checksum")

        except Exception as e:
            logger.error(f"Error initializing RAGDataManager: {str(e)}")
            raise


    def get_markdown_content(self, knowledgebase_id: int, source: QSource, ) -> Optional[str]:
        """Retrieve markdown content from MongoDB by document_id"""
        try:
            # Convert string id to ObjectId
            from bson import ObjectId
            object_id = ObjectId(source.reference_id)

            query = {'_id': object_id}
            
            result = self.mongo_service.get_one_rag_data(knowledgebase_id, query)
            if result:
                return result['content']
            return None
        except Exception as e:
            logger.error(f"Error retrieving markdown content: {str(e)}")
            return None

    def update_last_processed(self, knowledgebase_id: int, reference_id: str) -> bool:
        """Update timestamp or full content for a document"""
        try:
            result = self.mongo_service.update_rag_data(
                knowledgebase_id,
                {"_id": ObjectId(reference_id)},
                {"last_processed": datetime.now(timezone.utc)}
            )
            return result.modified_count > 0
        except Exception as e:
            logger.error(f"Error updating timestamp: {str(e)}")
            return False

    def get_url(self, knowledgebase_id: int, reference_id: str) -> Optional[str]:
        """Retrieve URL from MongoDB by document_id"""
        try:
            object_id = ObjectId(reference_id)
            query = {'_id': object_id}
            result = self.mongo_service.get_one_rag_data(knowledgebase_id, query)

            if result and 'url' in result:
                return result['url']
            return None
        except Exception as e:
            logger.error(f"Error retrieving URL: {str(e)}")
            return None
