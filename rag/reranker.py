"""
Copyright (c) 2024 Helm & Walter IT-Solutions
PROPRIETARY AND CONFIDENTIAL

This component and any modifications thereof remain the exclusive property of
Helm & Walter IT-Solutions. A non-exclusive, non-transferable license is granted
solely for the purpose of operating the delivered solution in its intended way.

While source code is provided, any use, copying, modification, distribution or
reuse outside the intended solution it was shipped with is strictly prohibited.
All rights reserved.

Version: 1.0.0
Initial version: 1.0.0 (2024-12-06) Bernd Helm (bernd.helm@helmundwalter.de)
"""

import asyncio
from typing import Dict
from openai import AsyncOpenAI
from pydantic import BaseModel
from functools import wraps
from hw_rag.dataclasses import QDocument


class RankResult(BaseModel):
    doc_key: str
    reasoning: str
    is_relevant: bool
    is_very_relevant: bool
    score: int


class Reranker:
    def __init__(self):
        self.client = AsyncOpenAI()
        self.system_prompt = """You are a document relevance evaluator. Analyze this document's relevance to the query.
Focus on semantic relevance rather than just keyword matches.
Provide:
- reasoning: Brief explanation of why the document is relevant or not
- is_relevant: true if document contains relevant information
- is_very_relevant: true if document is highly relevant and contains key information
- score: Integer between 0 and 100 indicating relevance (100 being most relevant, 0 being irrelevant)"""

        self.total_input_tokens = 0
        self.total_output_tokens = 0

    def token_tracker(func):
        @wraps(func)
        async def wrapper(self, *args, **kwargs):
            completion = await func(self, *args, **kwargs)

            # Track tokens
            self.total_input_tokens += completion.usage.prompt_tokens
            self.total_output_tokens += completion.usage.completion_tokens

            # Preserve original result handling
            result = completion.choices[0].message.parsed
            result.doc_key = args[1]  # key is the second argument
            return result

        return wrapper

    @token_tracker
    async def _evaluate_document(self, query: str, key: str, doc: QDocument) -> RankResult:
        messages = [
            {"role": "system", "content": self.system_prompt},
            {"role": "user", "content": f"Query: {query}\n\nDocument content:\n{doc.text}"}
        ]

        return await self.client.beta.chat.completions.parse(
            model="gpt-4o-mini",
            messages=messages,
            response_format=RankResult,
        )

    async def _rerank_sources_async(self, query: str, documents: Dict[str, QDocument], top_k: int = 3) -> Dict[
        str, QDocument]:
        tasks = [
            self._evaluate_document(query, key, doc)
            for key, doc in documents.items()
        ]

        results = await asyncio.gather(*tasks)

        sorted_results = sorted(results, key=lambda x: x.score, reverse=True)
        relevant_results = [r for r in sorted_results if r.is_relevant][:top_k]

        return {result.doc_key: documents[result.doc_key] for result in relevant_results}

    def get_token_usage(self):
        return {
            "input_tokens": self.total_input_tokens,
            "output_tokens": self.total_output_tokens,
            "total_cost in € cent (2024)": (15/1000000)*self.total_input_tokens + (60/1000000)*self.total_output_tokens
        }

    def _run_async(self, coro):
        """Safely run an async coroutine in a sync context, handling threaded environments"""
        try:
            # Create new event loop
            loop = asyncio.new_event_loop()
            # Set as thread's current event loop
            asyncio.set_event_loop(loop)

            try:
                # Run coroutine to completion
                return loop.run_until_complete(coro)
            finally:
                try:
                    # Cancel all running tasks
                    pending = asyncio.all_tasks(loop)
                    for task in pending:
                        task.cancel()
                    # Run loop to complete cancellation
                    loop.run_until_complete(asyncio.gather(*pending, return_exceptions=True))
                finally:
                    # Close loop
                    loop.close()
                    # Remove loop from thread
                    asyncio.set_event_loop(None)

        except Exception as e:
            raise Exception(f"Async execution failed: {str(e)}") from e

    def rerank_sources(self, query: str, documents: Dict[str, QDocument], top_k: int = 3) -> Dict[str, QDocument]:
        """Synchronous API for reranking documents"""
        return self._run_async(
            self._rerank_sources_async(query, documents, top_k)
        )
