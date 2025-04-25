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
Initial version: 1.0.0 (2024-11-20) Bernd Helm (bernd.helm@helmundwalter.de)
"""
import logging
import textwrap
from typing import List

from django.template import Template, Context
from django.template.loader import render_to_string
from pydantic import BaseModel
from django.utils.translation import gettext as _


from hw_rag.i_chatbot_config import IChatbotConfig

from hw_rag.services.openai_service import OpenAIService, GPTModel
from dependency_injector.wiring import inject, Provide
from hw_rag.rag_di import RAGDI


class RelatedQuestions(BaseModel):
    reasoning: str
    related_questions: List[str]

class RelatedQuestionGenerator:
    @inject
    def __init__(self, chatbot: IChatbotConfig, openai_service: OpenAIService = Provide[RAGDI.openai_service]):
        self.openai = openai_service
        self.logger = logging.getLogger(__name__)
        self.chatbot = chatbot

    def related_questions(self, answer: str, lang: str):
        extras_template = Template(self.chatbot.related_questions_extras)
        rendered_extras = "" + extras_template.render(Context({
            'lang': lang,
        }))
        prompt = "" + render_to_string('related_questions.html',{
            'prompt_extras': rendered_extras,
            'lang': lang
        })
        answer_prefix = _("Now answer in language:")
        messages = [
            {
                "role": "system",
                "content": textwrap.dedent(prompt)
            },
            {
                "role": "user",
                "content": textwrap.dedent(f"""
                                    Question: {answer}
                                    {answer_prefix}
                                    """)}
        ]

        return self.openai.call_openai(messages, RelatedQuestions, GPTModel.GPT4O)
