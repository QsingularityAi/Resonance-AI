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
from hw_rag.dataclasses import QDocument
from hw_rag.i_chatbot_config import IChatbotConfig
from ..base_rag import BaseAnswerGenerator

class VIPRAnswerGenerator(BaseAnswerGenerator):
    def __init__(self, chatbot: IChatbotConfig):
        super().__init__(chatbot)

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

        return None, None, None, None