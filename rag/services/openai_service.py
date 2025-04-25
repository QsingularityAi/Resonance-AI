"""
Copyright (c) 2024 Helm & Walter IT-Solutions
PROPRIETARY AND CONFIDENTIAL

This component and any modifications thereof remain the exclusive property of
Helm & Walter IT-Solutions. A non-exclusive, non-transferable license is granted
solely for the purpose of operating the delivered solution in its intended way.

While source code is provided, any use, copying, modification, distribution or
reuse outside the intended solution it was shipped with is strictly prohibited.
All rights reserved.

Version: 1.1.2
Initial version: 1.0.0 (2024-12-06) Bernd Helm (bernd.helm@helmundwalter.de)
"""
import logging
import asyncio
from typing import TypeVar, Type, List, Dict, Callable, Any, Awaitable
from openai import OpenAI, AsyncOpenAI, RateLimitError
from dataclasses import dataclass
from enum import Enum
import time
import tiktoken

T = TypeVar('T')

@dataclass
class EmbeddingModelConfig:
    name: str
    cost: float  # cost per 1M tokens

@dataclass
class ModelConfig:
    name: str
    input_cost: float
    output_cost: float

class GPTModel(Enum):
    GPT4O = "gpt-4o"
    GPT4O_MINI = "gpt-4o-mini"

def exponential_backoff(attempt: int, base_delay: float = 2.0, max_delay: float = 62.0) -> float:
    try:
        delay = min(base_delay * (1.5 ** (attempt - 1)), max_delay)
        return max(delay, base_delay)
    except OverflowError:
        return max_delay

class OpenAIService:
    MODEL_CONFIGS = {
        GPTModel.GPT4O: ModelConfig(GPTModel.GPT4O.value, 250, 1000),
        GPTModel.GPT4O_MINI: ModelConfig(GPTModel.GPT4O_MINI.value, 15, 60)
    }
    EMBEDDING_CONFIGS = {
        "text-embedding-3-small": EmbeddingModelConfig("text-embedding-3-small", 0.02)
    }
    def __init__(self, max_concurrent_requests: int = 50):
        self.client = OpenAI()
        self.async_client = AsyncOpenAI()
        self.total_cost = 0.0
        self.logger = logging.getLogger(__name__)
        self._semaphore = asyncio.Semaphore(max_concurrent_requests)
        print("openai service loaded")


    def update_concurrency_limit(self, new_limit: int) -> None:
        self._semaphore = asyncio.Semaphore(new_limit)

    async def _retry_async(
            self,
            operation: Callable[[], Awaitable[T]],
            max_retries: int,
            description: str
    ) -> T:
        attempt = 1
        while True:
            try:
                return await operation()
            except Exception as e:
                #if isinstance(e, RateLimitError):
                self.logger.error(f"Error details:")
                self.logger.error(f"Error type: {type(e).__name__}")
                self.logger.error(f"Error message: {str(e)}")
                self.logger.error(
                    f"Headers: {getattr(e, 'response', {}).headers if hasattr(e, 'response') else 'N/A'}")
                self.logger.error(
                    f"Status code: {getattr(e, 'response', {}).status_code if hasattr(e, 'response') else 'N/A'}")

                if max_retries == 0 or (max_retries > 0 and attempt > max_retries):
                    raise
                delay = exponential_backoff(attempt)
                self.logger.warning(
                    f"{description} - Attempt {attempt}/{max_retries if max_retries > 0 else 'inf'}, "
                    f"retrying in {delay:.1f}s"
                )
                await asyncio.sleep(delay)
                attempt += 1

    def _retry_sync(
            self,
            operation: Callable[[], T],
            max_retries: int,
            description: str
    ) -> T:
        attempt = 1
        while True:
            try:
                return operation()
            except Exception as e:
                #if isinstance(e, RateLimitError):
                self.logger.error(f"Error details:")
                self.logger.error(f"Error type: {type(e).__name__}")
                self.logger.error(f"Error message: {str(e)}")
                self.logger.error(
                    f"Headers: {getattr(e, 'response', {}).headers if hasattr(e, 'response') else 'N/A'}")
                self.logger.error(
                    f"Status code: {getattr(e, 'response', {}).status_code if hasattr(e, 'response') else 'N/A'}")
                if max_retries == 0 or (max_retries > 0 and attempt > max_retries):
                    raise
                delay = exponential_backoff(attempt)
                self.logger.warning(
                    f"{description} - Attempt {attempt}/{max_retries if max_retries > 0 else 'inf'}, "
                    f"retrying in {delay:.1f}s"
                )
                time.sleep(delay)
                attempt += 1

    def call_openai(
            self,
            messages: List[Dict[str, str]],
            response_type: Type[T],
            model: GPTModel = GPTModel.GPT4O,
            temperature: float = 0.4,
            max_retries: int = 0
    ) -> T:
        model_config = self.MODEL_CONFIGS[model]

        def _operation():
            completion = self.client.beta.chat.completions.parse(
                model=model_config.name,
                messages=messages,
                temperature=temperature,
                response_format=response_type
            )
            self._update_cost(completion, model_config)
            return completion.choices[0].message.parsed

        return self._retry_sync(_operation, max_retries, "OpenAI API call")

    async def acall_openai(
            self,
            messages: List[Dict[str, str]],
            response_type: Type[T],
            model: GPTModel = GPTModel.GPT4O,
            temperature: float = 0.4,
            max_retries: int = 0
    ) -> T:
        model_config = self.MODEL_CONFIGS[model]

        async def _operation():
            async with self._semaphore:
                completion = await self.async_client.beta.chat.completions.parse(
                    model=model_config.name,
                    messages=messages,
                    temperature=temperature,
                    response_format=response_type
                )
                self._update_cost(completion, model_config)
                return completion.choices[0].message.parsed

        return await self._retry_async(_operation, max_retries, "OpenAI API call")

    async def acreate_embeddings(
            self,
            texts: List[str],
            model: str = "text-embedding-3-small",
            max_retries: int = 3
    ) -> List[List[float]]:
        # Validate and clean input texts
        cleaned_texts = []
        for text in texts:
            if not isinstance(text, str):
                self.logger.warning(f"Skipping non-string input: {text}")
                continue
            cleaned = text.strip()
            if cleaned:
                cleaned_texts.append(cleaned)
        
        if not cleaned_texts:
            raise ValueError("No valid texts provided for embeddings after cleaning")

        model_config = self.EMBEDDING_CONFIGS[model]

        async def _operation():
            async with self._semaphore:
                response = await self.async_client.embeddings.create(
                    model=model,
                    input=cleaned_texts
                )
                # Update cost - embeddings only charge for input tokens
                self.total_cost += (model_config.cost / 1000000) * response.usage.total_tokens
                return [data.embedding for data in response.data]

        return await self._retry_async(_operation, max_retries, "OpenAI Embeddings API call")

    def create_embeddings(
            self,
            texts: List[str],
            model: str = "text-embedding-3-small",
            max_retries: int = 3
    ) -> List[List[float]]:
        # Validate and clean input texts
        cleaned_texts = []
        for text in texts:
            if not isinstance(text, str):
                self.logger.warning(f"Skipping non-string input: {text}")
                continue
            cleaned = text.strip()
            if cleaned:
                cleaned_texts.append(cleaned)
        
        if not cleaned_texts:
            raise ValueError("No valid texts provided for embeddings after cleaning")

        token_counts = [self.tiktoken_len(text) for text in cleaned_texts]
        max_tokens = max(token_counts)

        def _operation():
            response = self.client.embeddings.create(
                model=model,
                input=cleaned_texts
            )
            model_config = self.EMBEDDING_CONFIGS[model]
            # Update cost - embeddings only charge for input tokens
            self.total_cost += (model_config.cost / 1000000) * response.usage.total_tokens
            return [data.embedding for data in response.data]

        return self._retry_sync(_operation, max_retries, f"OpenAI Embeddings API call {len(texts)} embeddings with max token {max_tokens}")

    async def aclose(self) -> None:
        """Close the async client and cleanup resources."""
        try:
            if hasattr(self.async_client, 'close'):
                await self.async_client.close()
            elif hasattr(self.async_client, 'aclose'):
                await self.async_client.aclose()
        except Exception as e:
            self.logger.warning(f"Error closing async client: {e}")
        finally:
            # Cleanup any other resources
            self.async_client = None

    def _update_cost(self, completion, model_config: ModelConfig) -> None:
        call_cost = ((model_config.input_cost / 1000000) * completion.usage.prompt_tokens +
                     (model_config.output_cost / 1000000) * completion.usage.completion_tokens)
        self.total_cost += call_cost

    def tiktoken_len(self, input):
        encoding = tiktoken.encoding_for_model("gpt-4")

        # Encode and count tokens
        tokens = encoding.encode(input)
        return len(tokens)
