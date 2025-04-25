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
Initial version: 1.0.0 (2024-02-22) Bernd Helm (bernd.helm@helmundwalter.de)
"""
from qdrant_client import QdrantClient
from qdrant_client.http import models
from qdrant_client.http.models import Distance, VectorParams
from qdrant_client.http.models import SearchRequest
from typing import List, Optional
import uuid
import logging
import math
from datetime import datetime, timezone

from hw_rag.dataclasses import QDocument, QSourceType, QSourceOriginType
from hw_rag.services.openai_service import OpenAIService
from dependency_injector.wiring import inject, Provide


class QdrantService:
    @inject
    def __init__(self, openai_service: OpenAIService = Provide['openai_service']):
        self.client = QdrantClient(
            host="qdrant",
            port=6333
        )
        self.openai_client = openai_service
        self.logger = logging.getLogger(__name__)
        self.embedding_model = "text-embedding-3-small"

    def get_collection_name(self, knowledgebase_id: int) -> str:
        return f"knowledge_{knowledgebase_id}"

    def smart_upsert(self, knowledgebase_id: int, documents: List[QDocument], reference_id: str):
        """
        Smart upsert that compares checksums to minimize database operations.
        Only deletes outdated documents and inserts new ones.
        """
        try:
            collection_name = self.get_collection_name(knowledgebase_id)

            # Get existing documents for this reference_id
            existing_docs = self.client.scroll(
                collection_name=collection_name,
                scroll_filter=models.Filter(
                    must=[
                        models.FieldCondition(
                            key="reference_id",
                            match=models.MatchValue(value=reference_id)
                        )
                    ]
                ),
                limit=1000
            )[0]

            # Create sets of checksums for comparison
            existing_checksums = {doc.payload["checksum"] for doc in existing_docs if doc.payload.get("checksum")}
            new_checksums = {doc.checksum for doc in documents if doc.checksum}

            # Find documents to delete (exist in DB but not in new set)
            checksums_to_delete = existing_checksums - new_checksums
            if checksums_to_delete:
                self.client.delete(
                    collection_name=collection_name,
                    points_selector=models.Filter(
                        must=[
                            models.FieldCondition(
                                key="checksum",
                                match=models.MatchAny(any=list(checksums_to_delete))
                            )
                        ]
                    )
                )

            # Find documents to insert (exist in new set but not in DB)
            docs_to_insert = [doc for doc in documents if doc.checksum in (new_checksums - existing_checksums)]
            if docs_to_insert:
                self.store_documents(knowledgebase_id, docs_to_insert)

            self.logger.info(
                f"Smart upsert completed - Requested: {len(documents)}, Deleted: {len(checksums_to_delete)}, "
                f"Inserted: {len(docs_to_insert)}"
            )

        except Exception as e:
            self.logger.error(f"Error in smart upsert: {e}")
            raise

    def store_documents(self, knowledgebase_id: int, documents: List[QDocument]):
        """Store multiple documents in Qdrant using batch mode"""
        try:
            collection_name = self.get_collection_name(knowledgebase_id)

            # Process embeddings in parallel
            embedding_texts = [doc.embedding_text if doc.embedding_text else doc.text for doc in documents]
            embeddings = self.get_embeddings(embedding_texts, -1)

            # Generate batch arrays
            point_ids = [
                str(uuid.uuid5(uuid.NAMESPACE_DNS, doc.checksum if doc.checksum else doc.reference_id))
                for doc in documents
            ]
            payloads = [{**doc.model_dump(), "embedding_text": ""} for doc in documents]

            # Upload batch
            self.client.upsert(
                collection_name=collection_name,
                points=models.Batch(
                    ids=point_ids,
                    vectors=embeddings,
                    payloads=payloads
                )
            )

            self.logger.info(f"Stored {len(documents)} documents in collection: {collection_name}")

        except Exception as e:
            self.logger.error(f"Error storing documents batch: {e}")
            raise

    def get_document_by_checksum(self, knowledgebase_id: int, checksum: str) -> Optional[QDocument]:
        """Get document by checksum"""

        try:
            collection_name = self.get_collection_name(knowledgebase_id)
            results = self.client.scroll(
                collection_name=collection_name,
                scroll_filter=models.Filter(
                    must=[
                        models.FieldCondition(
                            key="checksum",
                            match=models.MatchValue(value=checksum)
                        )
                    ]
                ),
                limit=1
            )[0]

            if results:
                doc = QDocument(**results[0].payload)
                # restore embedding text. it its empty, it was 1:1 the text.
                if not doc.embedding_text:
                    doc.embedding_text = doc.text

            return None

        except Exception as e:
            self.logger.error(f"Error getting document by checksum: {e}")
            raise

    def initialize_collection(self, knowledgebase_id: int):
        try:
            collection_name = self.get_collection_name(knowledgebase_id)
            collections = self.client.get_collections().collections
            exists = any(col.name == collection_name for col in collections)

            if not exists:
                self.client.create_collection(
                    collection_name=collection_name,
                    vectors_config=VectorParams(size=1536, distance=Distance.COSINE)
                )
                self.client.create_payload_index(
                    collection_name=collection_name,
                    field_name="checksum",
                    field_schema=models.PayloadSchemaType.KEYWORD,
                )
                self.logger.info(f"Created new Qdrant collection: {collection_name}")
        except Exception as e:
            self.logger.error(f"Error initializing Qdrant collection: {e}")
            raise

    def delete_collection(self, knowledgebase_id: int):
        try:
            collection_name = self.get_collection_name(knowledgebase_id)
            collections = self.client.get_collections().collections

            if any(col.name == collection_name for col in collections):
                self.client.delete_collection(collection_name=collection_name)
                self.logger.info(f"Deleted collection: {collection_name}")
            else:
                self.logger.warning(f"Collection {collection_name} does not exist")

        except Exception as e:
            self.logger.error(f"Error deleting collection: {e}")
            raise

    def get_embeddings(self, texts: List[str], max_retires: int = 3, batch_size: int = 500) -> List[List[float]]:
        """Get embeddings for multiple texts using OpenAI's batch API"""
        try:
            embeddings = []
            # Process in batches to stay within API limits
            for i in range(0, len(texts), batch_size):
                batch = texts[i:i + batch_size]
                batch_embeddings = self.openai_client.create_embeddings(
                    texts=batch,
                    model=self.embedding_model,
                    max_retries=max_retires
                )
                embeddings.extend(batch_embeddings)
            return embeddings
        except Exception as e:
            self.logger.error(f"Error getting batch embeddings: {e}")
            raise

    def get_embedding(self, text: str, max_retries: int = 3) -> List[float]:
        """Get embedding for a single text"""
        try:
            embeddings = self.openai_client.create_embeddings(
                texts=[text],
                model=self.embedding_model,
                max_retries=max_retries
            )
            return embeddings[0]
        except Exception as e:
            self.logger.error(f"Error getting embedding: {e}")
            raise

    # Async versions if needed:

    async def aget_embeddings(self, texts: List[str], batch_size: int = 1000) -> List[List[float]]:
        """Get embeddings for multiple texts using OpenAI's batch API"""
        try:
            embeddings = []
            for i in range(0, len(texts), batch_size):
                batch = texts[i:i + batch_size]
                batch_embeddings = await self.openai_client.acreate_embeddings(
                    texts=batch,
                    model=self.embedding_model,
                    max_retries=3
                )
                embeddings.extend(batch_embeddings)
            return embeddings
        except Exception as e:
            self.logger.error(f"Error getting batch embeddings: {e}")
            raise

    async def aget_embedding(self, text: str) -> List[float]:
        """Get embedding for a single text"""
        try:
            embeddings = await self.openai_client.acreate_embeddings(
                texts=[text],
                model=self.embedding_model,
                max_retries=3
            )
            return embeddings[0]
        except Exception as e:
            self.logger.error(f"Error getting embedding: {e}")
            raise

    # decay rate: https://www.wolframalpha.com/input?i=1.0%2Fe%5E%280.00004*x%29+from+x+0+to+3600
    def search_similar(self, knowledgebase_ids: List[int], queries: List[str], limit: int = 4,
                       time_multiplier: float = 1.0, decay_rate: float = 0.00004) -> List[QDocument]:
        try:
            if not 1 <= len(queries) <= 3:
                raise ValueError("Number of queries must be between 1 and 3")

            # Validate and clean queries before getting embeddings
            cleaned_queries = [q.strip() for q in queries if q and q.strip()]
            if not cleaned_queries:
                raise ValueError("No valid queries provided after cleaning")
                
            query_vectors = [self.get_embedding(q) for q in cleaned_queries]
            results = []

            for knowledgebase_id in knowledgebase_ids:
                collection_name = self.get_collection_name(knowledgebase_id)
                search_requests = [
                    SearchRequest(
                        vector=vector,
                        limit=round(limit*1.5),
                        score_threshold=0.2,
                        with_payload=True
                    ) for vector in query_vectors
                ]

                batch_results = self.client.search_batch(
                    collection_name=collection_name,
                    requests=search_requests
                )

                for batch in batch_results:
                    results.extend(batch)

            # Apply scoring adjustments
            current_time = datetime.now(timezone.utc)

            for result in results:
                if not result.payload:
                    continue

                # Source type scoring
                source_type_multipliers = {
                    QSourceType.PDF: 1.0,
                    QSourceType.WEBSITE: 1.0,
                    QSourceType.FAQ: 1.2
                }

                source_type = result.payload.get('source', {}).get('source_type')
                if source_type in source_type_multipliers:
                    result.score *= source_type_multipliers[source_type]

                if source_type == QSourceType.FAQ:
                    # do not time-decay FAQ's
                    continue

                # Time decay scoring
                create_date = self._parse_date(result.payload.get('source', {}).get('create_date'))
                if create_date:
                    time_score = self._calculate_time_decay(
                        create_date,
                        current_time,
                        time_multiplier,
                        decay_rate
                    )
                    result.score *= time_score

            # Make unique by ID, sort by score, and limit
            results = [r for r in results if r.score >= 0.4]  # Filter low scores
            results = list({r.id: r for r in results}.values())
            results.sort(key=lambda x: x.score, reverse=True)
            results = results[:limit]

            documents = []
            for result in results:
                if result.payload:
                    doc = QDocument(**result.payload)
                    if doc.source.source_type == QSourceType.FAQ:
                        # update create date so its always recent
                        doc.source.create_date = datetime.now()
                    documents.append(doc)

            return documents
        except Exception as e:
            self.logger.error(f"Error searching documents: {e}")
            raise e

    def _parse_date(self, date_value: Optional[str | datetime]) -> Optional[datetime]:
        """Safely parse date string or datetime object to UTC datetime."""
        if not date_value:
            return None

        try:
            if isinstance(date_value, str):
                dt = datetime.fromisoformat(date_value.replace('Z', '+00:00'))
            elif isinstance(date_value, datetime):
                dt = date_value
            else:
                return None

            # Convert to UTC
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            else:
                dt = dt.astimezone(timezone.utc)

            return dt
        except (ValueError, TypeError):
            self.logger.warning(f"Failed to parse date: {date_value}")
            return None

    def _calculate_time_decay(
            self,
            create_date: datetime,
            current_time: datetime,
            time_multiplier: float,
            decay_rate: float
    ) -> float:
        """Calculate time decay score."""
        days_old = (current_time - create_date).total_seconds() / (24 * 3600)
        return time_multiplier / math.exp(decay_rate * days_old)

    def get_document_by_reference(self, knowledgebase_id: int, reference_id: str) -> Optional[QDocument]:
        try:
            collection_name = self.get_collection_name(knowledgebase_id)
            results = self.client.scroll(
                collection_name=collection_name,
                scroll_filter=models.Filter(
                    must=[
                        models.FieldCondition(
                            key="reference_id",
                            match=models.MatchValue(value=reference_id)
                        )
                    ]
                ),
                limit=1
            )[0]
            if results:
                return QDocument(**results[0].payload)
            return None
        except Exception as e:
            self.logger.error(f"Error getting document by reference: {e}")
            raise

    def recreate_collection(self, knowledgebase_id: int):
        """Drop and recreate a knowledge base collection"""
        try:
            collection_name = self.get_collection_name(knowledgebase_id)

            # Check if collection exists and delete it
            collections = self.client.get_collections().collections
            if any(col.name == collection_name for col in collections):
                self.client.delete_collection(collection_name=collection_name)
                self.logger.info(f"Deleted existing collection: {collection_name}")

            # Recreate the collection
            self.initialize_collection(knowledgebase_id)
            self.logger.info(f"Successfully recreated collection: {collection_name}")

        except Exception as e:
            self.logger.error(f"Error recreating collection: {e}")
            raise

    def delete_by_checksum(self, knowledgebase_id: int, checksum: str):
        """Delete document by checksum from a collection"""
        try:
            collection_name = self.get_collection_name(knowledgebase_id)

            # Delete using filter on checksum
            self.client.delete(
                collection_name=collection_name,
                points_selector=models.Filter(
                    must=[
                        models.FieldCondition(
                            key="checksum",
                            match=models.MatchValue(value=checksum)
                        )
                    ]
                )
            )
            self.logger.info(f"Deleted document with checksum {checksum} from collection {collection_name}")

        except Exception as e:
            self.logger.error(f"Error deleting document by checksum: {e}")
            raise

    def delete_by_reference_id(self, knowledgebase_id: int, reference_id: str):
        """Delete document by reference_id from a collection"""
        try:
            collection_name = self.get_collection_name(knowledgebase_id)

            if collection_name is None:
                raise ValueError("Collection name cannot be None")

            self.client.delete(
                collection_name=collection_name,
                points_selector=models.Filter(
                    must=[
                        models.FieldCondition(
                            key="reference_id",
                            match=models.MatchValue(value=reference_id)
                        )
                    ]
                )
            )
            self.logger.info(f"Deleted document with reference_id {reference_id} from collection {collection_name}")

        except Exception as e:
            self.logger.error(f"Error deleting document by reference_id: {e}")
            raise

    def get_points_count(self, knowledgebase_id: int) -> int:
        """Get the total number of points/documents in a collection"""
        try:
            collection_name = self.get_collection_name(knowledgebase_id)
            collection_info = self.client.get_collection(collection_name)
            return collection_info.points_count
        except Exception as e:
            self.logger.error(f"Error getting points count for collection {collection_name}: {e}")
            raise


    def get_reference_ids_by_source_origin(self, knowledgebase_id: int, origin_type: QSourceOriginType, origin_id: int) -> \
    set[str]:
        """Get all reference_ids for documents with matching source_origin type and id"""
        try:
            collection_name = self.get_collection_name(knowledgebase_id)

            # Scroll through all matching documents
            results = self.client.scroll(
                collection_name=collection_name,
                scroll_filter=models.Filter(
                    must=[
                        models.FieldCondition(
                            key="source.source_origin.type",
                            match=models.MatchValue(value=origin_type)
                        ),
                        models.FieldCondition(
                            key="source.source_origin.id",
                            match=models.MatchValue(value=origin_id)
                        )
                    ]
                ),
                limit=1000  # Adjust if needed
            )[0]

            # Extract reference_ids
            reference_ids = {doc.payload["reference_id"] for doc in results if doc.payload.get("reference_id")}

            self.logger.info(f"Found {len(reference_ids)} documents for origin type {origin_type} and id {origin_id}")
            return reference_ids

        except Exception as e:
            self.logger.error(f"Error getting reference_ids by source origin: {e}")
            raise
