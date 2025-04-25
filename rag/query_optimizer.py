"""
Copyright (c) 2024 Helm & Walter IT-Solutions
PROPRIETARY AND CONFIDENTIAL

This component and any modifications thereof remain the exclusive property of
Helm & Walter IT-Solutions. A non-exclusive, non-transferable license is granted
solely for the purpose of operating the delivered solution in its intended way.

While source code is provided, any use, copying, modification, distribution or
reuse outside the intended solution it was shipped with is strictly prohibited.
All rights reserved.

Version: 1.3.3
Initial version: 1.0.0 (2024-03-11) Bernd Helm (bernd.helm@helmundwalter.de)
"""
import logging
from datetime import datetime
from typing import List, Dict

from dependency_injector.wiring import inject, Provide
from django.template import Template, Context
from pydantic import BaseModel
from django.template.loader import get_template

from hw_rag.i_chatbot_config import IChatbotConfig
from hw_rag.services.openai_service import OpenAIService, GPTModel
from hw_rag.rag_di import RAGDI


class MultiQuery(BaseModel):
    reasoning: str
    queries: List[str]
    prefer_latest_documents: bool
    user_is_frustrated: bool

class OptimizedQuery(BaseModel):
    reasoning: str
    prefer_latest_documents: bool
    user_is_frustrated: bool
    query: str

class QueryOptimizer:
    @inject
    def __init__(self, chatbot: IChatbotConfig, openai_service: OpenAIService = Provide[RAGDI.openai_service]):
        self.client = openai_service
        self.template = get_template('query_optimizer.html')
        self.logger = logging.getLogger(__name__)
        self.chatbot = chatbot

    def _get_prompt_content(self, multi: bool) -> str:
        now = datetime.now()
        extras_template = Template(self.chatbot.query_optimizer_extras)
        rendered_extras = "" + extras_template.render(Context({}))
        prompt = "" + self.template.render({
            'prompt_extras': str(rendered_extras),
            'current_year': now.year,
            'next_year': now.year + 1,
            'multi': multi
        })
        return prompt

    def multi(self, query: str, conversation_history: List[Dict[str, str]]) -> MultiQuery:
        prompt_messages = [
            {
                "role": "system",
                "content": self._get_prompt_content(multi=True)
            }
        ]
        prompt_messages.extend(conversation_history)
        prompt_messages.append({
            "role": "user",
            "content": f"Question: {query}"
        })

        return self.client.call_openai(prompt_messages, MultiQuery, GPTModel.GPT4O)

    def simple(self, query: str, messages: List[Dict[str, str]]) -> OptimizedQuery:
        # System message must be first
        prompt_messages = [
            {
                "role": "system",
                "content": self._get_prompt_content(multi=False)
            }
        ]
        # Add conversation history
        if messages:
            prompt_messages.extend(messages)
        # Add the current query
        prompt_messages.append({
            "role": "user",
            "content": query
        })
        optimized = self.client.call_openai(prompt_messages, OptimizedQuery, GPTModel.GPT4O, 0.4)
        
        # If query is empty or just whitespace, use the original query
        if not optimized.query or not optimized.query.strip():
            self.logger.warning("Query optimizer returned empty query, using original query")
            optimized.query = query
            
        return optimized
