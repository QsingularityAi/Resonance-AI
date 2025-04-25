"""
Copyright (c) 2024 Helm & Walter IT-Solutions
PROPRIETARY AND CONFIDENTIAL

This component and any modifications thereof remain the exclusive property of
Helm & Walter IT-Solutions. A non-exclusive, non-transferable license is granted
solely for the purpose of operating the delivered solution in its intended way.

While source code is provided, any use, copying, modification, distribution or
reuse outside the intended solution it was shipped with is strictly prohibited.
All rights reserved.

Version: 1.0.1
Initial version: 1.0.0 (2025-01-21) Bernd Helm (bernd.helm@helmundwalter.de)
"""
from abc import ABC, abstractmethod
from typing import Optional
from pathlib import Path

from hw_rag.dataclasses import QSource


class IRAGDataManager(ABC):
    """Interface defining contract for RAG data management operations"""

    @abstractmethod
    def __init__(self, benchmark: bool = False) -> None:
        pass

    @abstractmethod
    def get_markdown_content(self, knowledgebase_id: int, source: QSource) -> Optional[str]:
        pass

    @abstractmethod
    def get_url(self, knowledgebase_id: int, reference_id: str) -> Optional[str]:
        pass

    @abstractmethod
    def update_last_processed(self, knowledgebase_id: int, reference_id: str) -> bool:
        pass