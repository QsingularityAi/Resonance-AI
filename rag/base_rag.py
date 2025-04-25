"""
Copyright (c) 2025 Helm & Walter IT-Solutions
PROPRIETARY AND CONFIDENTIAL

This component and any modifications thereof remain the exclusive property of
Helm & Walter IT-Solutions. A non-exclusive, non-transferable license is granted
solely for the purpose of operating the delivered solution in its intended way.

While source code is provided, any use, copying, modification, distribution or
reuse outside the intended solution it was shipped with is strictly prohibited.
All rights reserved.

Version: 1.0.0 (2025-01-08) Nico Hoffmann (nico.hoffmann@saxony.ai)
"""
import logging
import textwrap
from datetime import date
from abc import abstractmethod
from hw_rag.dataclasses import QDocument
from typing import List, Dict, Optional
from pydantic import BaseModel
from django.template.loader import render_to_string
from django.utils.translation import gettext as _, override
from dateutil.relativedelta import relativedelta
from django.template import Template, Context
from hw_rag.i_chatbot_config import IChatbotConfig
from hw_rag.services.openai_service import OpenAIService
from dependency_injector.wiring import inject, Provide
from hw_rag.rag_di import RAGDI
from hw_rag.services.qdrant_service import QdrantService


class GeneratedAnswer(BaseModel):
    answer: str
    sources: List[str]
    images: List[str]
    topic: str

class NoSourceAnswer(BaseModel):
    reasoning: str
    instruction: str
    answer: str

class BaseAnswerGenerator:
    @inject
    def __init__(self, chatbot: IChatbotConfig, qdrant: QdrantService = Provide[RAGDI.qdrant_service], openai_service: OpenAIService = Provide[RAGDI.openai_service]):
        self.logger = logging.getLogger(__name__)
        self.chatbot = chatbot
        if not self.chatbot:
            raise Exception('Chatbot is required')
        self.knowledgebases = [kb['id'] for kb in self.chatbot.knowledgebase.values()]
        self.client = openai_service
        self.qdrant = qdrant

    @abstractmethod
    def generate_answer_sync(
            self,
            user_query: str,
            lang: str = 'de',
            messages=None
    ) -> tuple[
        str,
        list[QDocument],
        list[QDocument],
        str
    ]:
        pass

    def _sanitize_user_input(self, user_query):
        # input sanitization
        # prevent prompt injection by escaping special chars
        user_query = (user_query.replace("{", "{{")
                      .replace("}", "}}")
                      .replace("<!--", "")
                      .replace("--!>", "")
                      .replace("##", "")
                      .replace("\"\"", "\"")
                      )
        return user_query

    def _search_documents(self, query: List[str], limit: int = 8, time_multiplier: float = 1.0, decay_rate: float = 0.00004) -> dict[str, QDocument]:
        results = self.qdrant.search_similar(self.knowledgebases, query, limit=limit, time_multiplier=time_multiplier, decay_rate=decay_rate)
        self.logger.info(f"Found {len(results)} relevant documents")
        doc_by_checksum = {}
        for doc in results:
            doc_by_checksum[doc.checksum] = doc
        return doc_by_checksum

    def _process_references(
            self,
            generated_answer: GeneratedAnswer,
            doc_by_checksum: Dict[str, QDocument],
            attr_name: str
    ) -> List[QDocument]:
        relevant_docs = []
        if hasattr(generated_answer, attr_name):
            attr_value = getattr(generated_answer, attr_name)
            self.logger.info(f"answer contains {len(attr_value)} {attr_name}")

            for checksum in attr_value:
                if checksum in doc_by_checksum:
                    doc = doc_by_checksum[checksum]
                    # For images, we need additional image_content check
                    if attr_name == 'images' and doc.image_content is None:
                        continue
                    relevant_docs.append(doc)

        return relevant_docs

    def _prepare_prompt(
            self,
            query: str,
            context: Optional[str] = None,
            messages: dict[str, str] = None,
            lang: str = 'de',
            template: str = 'system_prompt'
    ) -> List[Dict[str, str]]:

        extras = ''
        if template == 'system_prompt':
            extras = self.chatbot.main_prompt_extras
        elif template == 'no_sources':
            extras = self.chatbot.no_sources_extras
        with override('de'): # we prompt in german for all languages
            extras_template = Template(extras)
            rendered_extras = "" + extras_template.render(Context({
                'context': context,
                'lang': lang,
                'next_year': date.today() + relativedelta(years=1)
            }))
            system_prompt = "" + render_to_string(f'{template}.html', {
                'context': context,
                'prompt_extras': str(rendered_extras),
                'lang': lang,
                'next_year': date.today() + relativedelta(years=1)
            })

        answer_prefix = _("Now answer in language:")  # will be translated to the users language
        all_messages = [
            {"role": "system", "content": textwrap.dedent(system_prompt)},
            *messages[:3]
        ]

        # Add context message only if context exists
        if context is not None:
            all_messages.append({"role": "system", "content": f"context: \n{context}"})

        all_messages.append({"role": "user", "content": textwrap.dedent(f"""
            User Question: \"\"\"{query}\"\"\"
            {answer_prefix}
            """)})

        return all_messages

    def _build_context(self, documents: dict[str, QDocument]) -> str:
        text_parts = []
        image_parts = []

        for doc in documents.values():
            # Start document block
            doc_block = [
                "=== DOCUMENT START ===" if doc.doc_type.value != "image" else "=== IMAGE START ===",
                f"ID: {doc.checksum}",
                f"Type: {doc.doc_type.value}",

                #"--- SOURCE INFO ---",
                #f"Source Type: {doc.source.source_type.value}",
                #f"URL: {doc.source.url}"
            ]

            # Add optional source fields
            if doc.source.title:
                doc_block.append(f"Title: {doc.source.title}")
            if doc.source.create_date:
                doc_block.append(f"Create Date: {doc.source.create_date.isoformat()}")
            if doc.source.summary:
                doc_block.append(f"Summary: {doc.source.summary}")

            # Add metadata if present
            if doc.metadata:
                #doc_block.append("--- METADATA ---")
                for key, value in doc.metadata.items():
                    doc_block.append(f"{key}: {value}")

            # Add content
            doc_block.extend([
                "--- CONTENT ---",
                doc.text,
                "=== DOCUMENT END ===" if doc.doc_type.value != "image" else "=== IMAGE END ===",
                ""  # Empty line between documents
            ])

            # Add to appropriate list based on document type
            if doc.doc_type.value == "image":
                image_parts.append("\n".join(doc_block))
            else:
                text_parts.append("\n".join(doc_block))

        # Combine text documents first, then image documents
        return "\n".join(text_parts + image_parts)

    def reduce_docs_to_token_limit(
            self,
            doc_by_checksum: dict[str, QDocument],
            max_tokens: int = 4000
    ) -> dict[str, QDocument]:
        result: dict[str, QDocument] = {}
        current_tokens = 0

        for checksum, doc in doc_by_checksum.items():
            doc_tokens = self.client.tiktoken_len(doc.text)
            if current_tokens + doc_tokens <= max_tokens:
                result[checksum] = doc
                current_tokens += doc_tokens
            else:
                break

        return result