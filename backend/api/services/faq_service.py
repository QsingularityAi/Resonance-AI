# backend/api/services/faq_service.py
from datetime import datetime
import hashlib
import logging
from typing import Optional, TYPE_CHECKING
from django.apps import apps

from hw_rag.dataclasses import QDocument, QSource, QDocType, QSourceType, QSourceOrigin, QSourceOriginType
from hw_rag.services.qdrant_service import QdrantService

if TYPE_CHECKING:
    from backend.api.models import FAQ, FAQCategory

logger = logging.getLogger(__name__)

class FaqService:
    def __init__(self, qdrant_service: QdrantService):
        self.qdrant = qdrant_service

    def _get_faq_model(self):
        return apps.get_model('api', 'FAQ')

    def _get_faq_category_model(self):
        return apps.get_model('api', 'FAQCategory')

    def _create_faq_document(self, faq: 'FAQ') -> QDocument:
        """Helper to create QDocument from FAQ instance"""
        faq_source = QSource(
            reference_id=f"faq-{faq.id}",
            url="",
            title=f"{faq.question}",
            source_type=QSourceType.FAQ,
            source_origin=QSourceOrigin(type=QSourceOriginType.FAQ_CATEGORY, id=faq.id),
            create_date=datetime.now()
        )

        return QDocument(
            source=faq_source,
            doc_type=QDocType.FAQ,
            reference_id=f"faq-{faq.id}",
            text=faq.question + "\n\n" + faq.answer,
            embedding_text=faq.question + "\n" + faq.answer,
            checksum=hashlib.md5(f"faq-{faq.id} {faq.question} {faq.answer}".encode('utf-8')).hexdigest(),
            metadata=dict()
        )

    def handle_faq_change(self, faq: 'FAQ', old_category_kb_id: Optional[int] = None):
        """Handle FAQ updates including knowledge base changes"""
        try:
            if old_category_kb_id:
                logger.info(
                    "Deleting FAQ from old knowledge base. Details: "
                    "faq_id=%s, old_kb_id=%s, question=%s",
                    faq.id, old_category_kb_id, faq.question[:50]
                )
                self.qdrant.delete_by_reference_id(old_category_kb_id, f"faq-{faq.id}")

            if faq.category:
                faq_doc = self._create_faq_document(faq)
                logger.info(
                    "Upserting FAQ to knowledge base. Details: "
                    "faq_id=%s, kb_id=%s, category_id=%s, question=%s",
                    faq.id, faq.category.knowledgebase_id, faq.category.id, faq.question[:50]
                )
                self.qdrant.smart_upsert(faq.category.knowledgebase_id, [faq_doc], f"faq-{faq.id}")

        except Exception as e:
            logger.error(
                "Error syncing FAQ with Qdrant. Details: "
                "faq_id=%s, old_kb_id=%s, new_kb_id=%s, category_id=%s, error_type=%s, error_msg=%s",
                faq.id,
                old_category_kb_id,
                getattr(faq.category, 'knowledgebase_id', 'N/A') if faq.category else 'N/A',
                getattr(faq.category, 'id', 'N/A') if faq.category else 'N/A',
                type(e).__name__,
                str(e),
                exc_info=True
            )

    def delete_faq(self, faq: 'FAQ'):
        """Delete FAQ from Qdrant"""
        try:
            if faq.category:
                logger.info(
                    "Deleting FAQ from knowledge base. Details: "
                    "faq_id=%s, kb_id=%s, category_id=%s, question=%s",
                    faq.id, faq.category.knowledgebase_id, faq.category.id, faq.question[:50]
                )
                self.qdrant.delete_by_reference_id(faq.category.knowledgebase_id, f"faq-{faq.id}")
        except Exception as e:
            logger.error(
                "Error deleting FAQ from Qdrant. Details: "
                "faq_id=%s, kb_id=%s, category_id=%s, question=%s, error_type=%s, error_msg=%s",
                faq.id,
                getattr(faq.category, 'knowledgebase_id', 'N/A') if faq.category else 'N/A',
                getattr(faq.category, 'id', 'N/A') if faq.category else 'N/A',
                faq.question[:50],
                type(e).__name__,
                str(e),
                exc_info=True
            )

    def sync_category(self, category: 'FAQCategory'):
        """Synchronize all FAQs in a category with Qdrant"""
        try:
            current_faqs = category.faqs.all()
            current_faq_refs = {f"faq-{faq.id}" for faq in current_faqs}

            existing_refs = self.qdrant.get_reference_ids_by_source_origin(
                category.knowledgebase_id,
                QSourceOriginType.FAQ_CATEGORY,
                category.id
            )

            refs_to_delete = existing_refs - current_faq_refs
            for ref_id in refs_to_delete:
                logger.info(f"Deleting obsolete FAQ {ref_id} from knowledge base {category.knowledgebase_id}")
                self.qdrant.delete_by_reference_id(category.knowledgebase_id, ref_id)

            faq_docs = [self._create_faq_document(faq) for faq in current_faqs]
            if faq_docs:
                logger.info(f"Upserting {len(faq_docs)} FAQs to knowledge base {category.knowledgebase_id}")
                self.qdrant.smart_upsert(category.knowledgebase_id, faq_docs, faq_docs[0].reference_id)

        except Exception as e:
            logger.error(
                "Error syncing FAQ category %s with Qdrant. Details: "
                "category_id=%s, knowledgebase_id=%s, faq_count=%s, error_type=%s, error_msg=%s",
                category.id,
                category.id,
                getattr(category, 'knowledgebase_id', 'N/A'),
                len(current_faqs) if 'current_faqs' in locals() else 'N/A',
                type(e).__name__,
                str(e),
                exc_info=True  # This will include the full stack trace
            )
