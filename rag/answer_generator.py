"""
Copyright (c) 2024 Helm & Walter IT-Solutions
PROPRIETARY AND CONFIDENTIAL

This component and any modifications thereof remain the exclusive property of
Helm & Walter IT-Solutions. A non-exclusive, non-transferable license is granted
solely for the purpose of operating the delivered solution in its intended way.

While source code is provided, any use, copying, modification, distribution or
reuse outside the intended solution it was shipped with is strictly prohibited.
All rights reserved.

Version: 1.3.0
Initial version: 1.0.0 (2024-03-12) Bernd Helm (bernd.helm@helmundwalter.de)
"""

import logging
from django_scopes import scopes_disabled
from .query_optimizer import QueryOptimizer
from .reranker import Reranker
from .base_rag import BaseAnswerGenerator, GeneratedAnswer, NoSourceAnswer
from .vipr.answer_generator import VIPRAnswerGenerator
from hw_rag.dataclasses import QDocument, RAGType
from hw_rag.i_chatbot_config import IChatbotConfig


class RAGFactory:
    @staticmethod
    def create_answer_generator(chatbot: IChatbotConfig):
        """
         Creates appropriate RAG generator based on chatbot configuration.

         Args:
             chatbot: Chatbot model instance containing RAG configuration

         Returns:
             BaseAnswerGenerator: Configured RAG generator instance

         Raises:
             ValueError: If RAG type is invalid
         """
        logger = logging.getLogger(__name__)
        rag_type = RAGType.from_string(chatbot.rag_type)

        rag_generators = {
            RAGType.SIMPLE: StandardAnswerGenerator,
            RAGType.VIPR: VIPRAnswerGenerator
        }

        generator_class = rag_generators.get(rag_type)
        if not generator_class:
            logger.warning(f"Invalid RAG type '{chatbot.rag_type}'. Defaulting to SIMPLE.")
            with scopes_disabled():
                return StandardAnswerGenerator(chatbot)

        with scopes_disabled():
            return generator_class(chatbot)


class StandardAnswerGenerator(BaseAnswerGenerator):
    def __init__(self, chatbot: IChatbotConfig):
        super().__init__(chatbot)
        self.reranker = Reranker()
        self.query_optimizer = QueryOptimizer(self.chatbot)
        self.enable_reranker = False # currently broken
        self.multi_optimizer = False

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
        if messages is None:
            messages = []

        user_query = self._sanitize_user_input(user_query)

        doc_by_checksum = self._get_docs(messages, user_query, 16)
        doc_by_checksum = self.reduce_docs_to_token_limit(doc_by_checksum, 5000)

        if len(doc_by_checksum) >= 1:
            context = self._build_context(doc_by_checksum)
            prompt_messages = self._prepare_prompt(user_query, context, messages, lang)
            generated_answer = self.client.call_openai(prompt_messages, GeneratedAnswer)
            if len(generated_answer.sources) >= 1:
                relevant_images = self._process_references(generated_answer, doc_by_checksum, 'images')
                relevant_sources = self._process_references(generated_answer, doc_by_checksum, 'sources')
                return generated_answer.answer, relevant_sources[:5], relevant_images[:1], generated_answer.topic

        self.logger.warning("No answers found, creating answer without sources")
        # when we had sources but the llm did not use them, create a new answer with a special prompt
        prompt_messages = self._prepare_prompt(user_query, None, messages, lang, 'no_sources')

        #for message in all_messages:
        #    self.logger.debug("\t\t"+message['role'] + ":\n" + message['content'])
        no_sources_answer = self.client.call_openai(prompt_messages, NoSourceAnswer)
        return no_sources_answer.answer, [], [], 'Anderes'

    def _get_docs(self, messages, user_query, number):
        queries = []
        if self.multi_optimizer:
            optimized_query = self.query_optimizer.multi(user_query, messages)
            queries.extend(optimized_query.queries[:3])
        else:
            optimized_query = self.query_optimizer.simple(user_query, messages)
            queries.append(optimized_query.query)

        self.logger.debug(f"Optimized query: {optimized_query}")

        if optimized_query.user_is_frustrated:
            return {}

        if self.enable_reranker:
            if optimized_query.prefer_latest_documents:
                doc_by_checksum = self._search_documents(queries, number, 1.1, 0.0001)
            else:
                doc_by_checksum = self._search_documents(queries, number)
            # fixme
            #doc_by_checksum = self.reranker.rerank_sources(queries, doc_by_checksum, number)
            self.logger.info(self.reranker.get_token_usage())
        else:
            if optimized_query.prefer_latest_documents:
                doc_by_checksum = self._search_documents(queries, number, 1.1, 0.0001)
            else:
                doc_by_checksum = self._search_documents(queries, number)

        return doc_by_checksum
