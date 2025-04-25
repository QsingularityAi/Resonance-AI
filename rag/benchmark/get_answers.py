"""
Copyright (c) 2024 Helm & Walter IT-Solutions
PROPRIETARY AND CONFIDENTIAL

This component and any modifications thereof remain the exclusive property of
Helm & Walter IT-Solutions. A non-exclusive, non-transferable license is granted
solely for the purpose of operating the delivered solution in its intended way.

While source code is provided, any use, copying, modification, distribution or
reuse outside the intended solution it was shipped with is strictly prohibited.
All rights reserved.

Version: 1.2.0
Initial version: 1.0.0 (2024-07-14)
"""
import json
from concurrent.futures import ThreadPoolExecutor, as_completed
from threading import Lock
from decimal import Decimal
import logging
from django.core.management.base import BaseCommand
from hw_rag.i_chatbot_config import IChatbotConfig
from ..answer_generator import RAGFactory
from hw_rag.services.openai_service import OpenAIService
from dependency_injector.wiring import inject, Provide
from hw_rag.rag_di import RAGDI


class GetAnswers:
    @inject
    def __init__(self, chatbot: IChatbotConfig, max_workers: int = 8, openai_service: OpenAIService = Provide[RAGDI.openai_service]):
        self.chatbot = chatbot
        self.max_workers = max_workers
        self.lock = Lock()
        self.total_cost = Decimal('0.0')
        self.openai = openai_service

    def generate_single_answer(self, question, question_idx, iteration_idx):
        logging.getLogger().setLevel(logging.WARNING)
        logging.getLogger("backend.api").setLevel(logging.WARNING) # todo: remove reference to backend
        generator = RAGFactory.create_answer_generator(self.chatbot)

        cost_before = Decimal(str(self.openai.total_cost))

        answer = generator.generate_answer_sync(question)[0]

        cost_after = Decimal(str(self.openai.total_cost))
        cost_difference = cost_after - cost_before

        with self.lock:
            self.total_cost += cost_difference

        return {
            'question_idx': question_idx,
            'iteration_idx': iteration_idx,
            'answer': answer,
            'cost': cost_difference
        }

    def run_benchmark(self, questions):
        # Initialize answer slots
        for question in questions:
            question['answer'] = [None] * 5

        tasks = [
            (question['question'], q_idx, i_idx)
            for q_idx, question in enumerate(questions)
            for i_idx in range(5)
        ]

        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            future_to_task = {
                executor.submit(self.generate_single_answer, q, q_idx, i_idx): (q_idx, i_idx)
                for q, q_idx, i_idx in tasks
            }

            for future in as_completed(future_to_task):
                result = future.result()
                q_idx = result['question_idx']
                i_idx = result['iteration_idx']
                questions[q_idx]['answer'][i_idx] = result['answer']

        return questions, self.total_cost