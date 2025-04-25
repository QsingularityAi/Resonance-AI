"""
Base Markdown Converter

This module provides a base class for converting data to markdown format.
"""
import logging
from typing import Dict, Any, Optional

from graphql.models import GraphQlResource
from graphql.services.field_mapper import FieldMapper

logger = logging.getLogger(__name__)


class MarkdownConverter:
    """
    Base class for markdown converters.
    """
    
    def __init__(self, field_mapper: Optional[FieldMapper] = None):
        """
        Initialize the markdown converter.
        
        Args:
            field_mapper: Optional field mapper for customizing the markdown conversion.
        """
        self.field_mapper = field_mapper
    
    def convert(self, data: Any, resource: GraphQlResource) -> str:
        """
        Convert data to markdown.
        
        Args:
            data: The data to convert.
            
        Returns:
            The markdown representation of the data.
        """
        raise NotImplementedError("Subclasses must implement this method")
    
    def _get_title(self, data: Dict[str, Any]) -> Optional[str]:
        """
        Get the title from the data.
        
        Args:
            data: The data to extract the title from.
            
        Returns:
            The title if found, None otherwise.
        """
        if self.field_mapper:
            return self.field_mapper.get_title(data)
        
        # Default behavior: use "name" or "title" field if available
        if "name" in data:
            return str(data["name"])
        elif "title" in data:
            return str(data["title"])
        
        return None
    
    def _format_field_name(self, name: str) -> str:
        """
        Format a field name for display in markdown.
        
        Args:
            name: The field name to format.
            
        Returns:
            The formatted field name.
        """
        # Convert snake_case or camelCase to Title Case with spaces
        words = []
        current_word = ""
        
        for char in name:
            if char.isupper() and current_word:
                words.append(current_word)
                current_word = char.lower()
            elif char == '_':
                if current_word:
                    words.append(current_word)
                    current_word = ""
            else:
                current_word += char
        
        if current_word:
            words.append(current_word)
        
        return " ".join(word.capitalize() for word in words)
