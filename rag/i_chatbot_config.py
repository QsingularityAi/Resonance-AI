from abc import abstractmethod
from django.db import models


class IChatbotConfig:
    @property
    @abstractmethod
    def main_prompt_extras(self) -> str:
        pass

    @property
    @abstractmethod
    def query_optimizer_extras(self) -> str:
        pass

    @property
    @abstractmethod
    def related_questions_extras(self) -> str:
        pass

    @property
    @abstractmethod
    def no_sources_extras(self) -> str:
        pass

    @property
    @abstractmethod
    def knowledgebase(self) -> models.ManyToManyField:
        pass