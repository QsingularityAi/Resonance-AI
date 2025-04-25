"""
Markdown Converter Factory

This module provides a factory for creating markdown converters based on data type.
"""
import logging
from typing import Any, Optional

from graphql.models import GraphQlResource
from graphql.services.field_mapper import FieldMapper
from graphql.services.markdown.base_markdown_converter import MarkdownConverter
from graphql.services.markdown.dictionary_markdown_converter import DictionaryMarkdownConverter
from graphql.services.markdown.list_markdown_converter import ListMarkdownConverter

logger = logging.getLogger(__name__)


class MarkdownConverterFactory:
    """
    Factory for creating markdown converters based on data type.
    """
    
    @staticmethod
    def create_converter(data: Any, field_mapper: Optional[FieldMapper] = None) -> MarkdownConverter:
        """
        Create a markdown converter based on the data type.
        
        Args:
            data: The data to convert.
            field_mapper: Optional field mapper for customizing the markdown conversion.
            
        Returns:
            A markdown converter for the data type.
            
        Raises:
            ValueError: If the data type is not supported.
        """
        if isinstance(data, dict):
            return DictionaryMarkdownConverter(field_mapper)
        elif isinstance(data, list):
            return ListMarkdownConverter(field_mapper)
        else:
            raise ValueError(f"Unsupported data type: {type(data)}")
