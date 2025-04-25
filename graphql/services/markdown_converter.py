"""
Markdown Converter Service

This service is responsible for converting various data structures to markdown format.
It provides specialized converters for different types of data.
"""
import logging
from typing import Dict, Any, List, Optional

from graphql.services.field_mapper import FieldMapper

logger = logging.getLogger(__name__)


class MarkdownConverter:
    """
    Base class for markdown converters.
    """
    
    def convert(self, data: Any) -> str:
        """
        Convert data to markdown format.
        
        Args:
            data: The data to convert.
            
        Returns:
            The markdown representation of the data.
        """
        raise NotImplementedError("Subclasses must implement this method")


class DictionaryMarkdownConverter(MarkdownConverter):
    """
    Converter for dictionary data.
    """
    
    def __init__(self, field_mapper: Optional[FieldMapper] = None):
        """
        Initialize the converter with an optional field mapper.
        
        Args:
            field_mapper: Optional field mapper to customize the conversion.
        """
        self.field_mapper = field_mapper
    
    def convert(self, data: Dict[str, Any], level: int = 1) -> str:
        """
        Convert a dictionary to markdown format.
        
        Args:
            data: The dictionary to convert.
            level: The current heading level.
            
        Returns:
            The markdown representation of the dictionary.
        """
        if not isinstance(data, dict):
            logger.warning(f"Expected dict, got {type(data)}")
            return str(data)
            
        return self._process_dictionary(data, level)
    
    def _process_dictionary(self, data: Dict[str, Any], level: int) -> str:
        """
        Process a dictionary and convert it to markdown.
        
        Args:
            data: The dictionary to process.
            level: The current heading level.
            
        Returns:
            The markdown representation of the dictionary.
        """
        markdown = ""
        
        # Process title based on field mapper if available
        title = None
        if self.field_mapper:
            title = self.field_mapper.get_title(data)
        
        # Fall back to default title extraction if no field mapper or no title found
        if title is None:
            title = self._extract_title(data)
        
        if title:
            markdown += f"{'#' * level} {title}\n\n"
        
        # Process the rest of the data
        for key, value in data.items():
            # Skip the title key we already processed
            if title and key in self._get_title_keys() and data[key] == title:
                continue
            
            # Skip ignored fields if field mapper is available
            if self.field_mapper and self.field_mapper.should_ignore_field(key):
                continue
            
            # Apply custom formatters if field mapper is available
            if self.field_mapper:
                custom_format = self.field_mapper.apply_custom_formatters(key, value)
                if custom_format is not None:
                    markdown += custom_format
                    continue
            
            # Process based on field type
            if self.field_mapper and self.field_mapper.is_image_field(key) and value:
                markdown += self.field_mapper.process_image_field(key, value)
            elif self.field_mapper and self.field_mapper.is_link_field(key) and value:
                markdown += self.field_mapper.process_link_field(key, value)
            elif self.field_mapper and self.field_mapper.is_date_field(key) and value:
                formatted_key = key.replace('_', ' ').title()
                formatted_value = self.field_mapper.process_date_field(value)
                markdown += f"**{formatted_key}**: {formatted_value}\n\n"
            elif isinstance(value, dict):
                markdown += self._process_nested_dict(key, value, level)
            elif isinstance(value, list):
                markdown += self._process_list(key, value, level)
            elif value is not None:
                markdown += self._process_simple_value(key, value)
        
        return markdown
    
    def _extract_title(self, data: Dict[str, Any]) -> Optional[str]:
        """
        Extract a title from the dictionary if present.
        
        Args:
            data: The dictionary to extract from.
            
        Returns:
            The title if found, None otherwise.
        """
        for key in self._get_title_keys():
            if key in data and isinstance(data[key], str):
                return data[key]
        return None
    
    def _get_title_keys(self) -> List[str]:
        """
        Get the keys that could represent a title.
        
        Returns:
            A list of possible title keys.
        """
        return ["title", "name", "heading", "subject"]
    
    def _process_nested_dict(self, key: str, value: Dict[str, Any], level: int) -> str:
        """
        Process a nested dictionary.
        
        Args:
            key: The key of the nested dictionary.
            value: The nested dictionary.
            level: The current heading level.
            
        Returns:
            The markdown representation of the nested dictionary.
        """
        markdown = f"{'#' * (level + 1)} {key.replace('_', ' ').title()}\n\n"
        markdown += self._process_dictionary(value, level + 2)
        return markdown
    
    def _process_list(self, key: str, value: List[Any], level: int) -> str:
        """
        Process a list.
        
        Args:
            key: The key of the list.
            value: The list.
            level: The current heading level.
            
        Returns:
            The markdown representation of the list.
        """
        markdown = ""
        
        if value and isinstance(value[0], dict):
            # For lists of dictionaries, create a subheading and process each item
            markdown += f"{'#' * (level + 1)} {key.replace('_', ' ').title()}\n\n"
            for item in value:
                markdown += self._process_dictionary(item, level + 2)
                markdown += "---\n\n"  # Separator between list items
        else:
            # For simple lists, create a bullet list
            markdown += f"**{key.replace('_', ' ').title()}**:\n\n"
            for item in value:
                markdown += f"* {item}\n"
            markdown += "\n"
            
        return markdown
    
    def _process_simple_value(self, key: str, value: Any) -> str:
        """
        Process a simple value.
        
        Args:
            key: The key of the value.
            value: The value.
            
        Returns:
            The markdown representation of the key-value pair.
        """
        formatted_key = key.replace('_', ' ').title()
        
        if isinstance(value, bool):
            value_str = "Yes" if value else "No"
        elif isinstance(value, (int, float)):
            value_str = str(value)
        elif isinstance(value, str):
            value_str = value
        else:
            value_str = str(value)
        
        return f"**{formatted_key}**: {value_str}\n\n"


class ListMarkdownConverter(MarkdownConverter):
    """
    Converter for list data.
    """
    
    def __init__(self, field_mapper: Optional[FieldMapper] = None):
        """
        Initialize with a dictionary converter for nested dictionaries.
        
        Args:
            field_mapper: Optional field mapper to customize the conversion.
        """
        self.field_mapper = field_mapper
        self.dict_converter = DictionaryMarkdownConverter(field_mapper)
    
    def convert(self, data: List[Any], title: Optional[str] = None) -> str:
        """
        Convert a list to markdown format.
        
        Args:
            data: The list to convert.
            title: An optional title for the list.
            
        Returns:
            The markdown representation of the list.
        """
        if not isinstance(data, list):
            logger.warning(f"Expected list, got {type(data)}")
            return str(data)
        
        markdown = ""
        
        if title:
            markdown += f"# {title}\n\n"
        
        if not data:
            return markdown + "*No items*\n\n"
        
        if isinstance(data[0], dict):
            # For lists of dictionaries, process each item
            for item in data:
                markdown += self.dict_converter.convert(item, level=2)
                markdown += "---\n\n"
        else:
            # For simple lists, create a bullet list
            for item in data:
                markdown += f"* {item}\n"
            markdown += "\n"
        
        return markdown


class MarkdownConverterFactory:
    """
    Factory for creating markdown converters based on data type.
    """
    
    @staticmethod
    def create_converter(data: Any, field_mapper: Optional[FieldMapper] = None) -> MarkdownConverter:
        """
        Create a converter based on the data type.
        
        Args:
            data: The data to convert.
            field_mapper: Optional field mapper to customize the conversion.
            
        Returns:
            An appropriate markdown converter.
        """
        if isinstance(data, dict):
            return DictionaryMarkdownConverter(field_mapper)
        elif isinstance(data, list):
            return ListMarkdownConverter(field_mapper)
        else:
            # Default to string representation for other types
            return MarkdownConverter()
