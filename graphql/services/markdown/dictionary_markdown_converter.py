"""
Dictionary Markdown Converter

This module provides a converter for dictionary data to markdown format.
"""
import logging
from typing import Dict, Any, Optional, List

from graphql.models import GraphQlResource
from graphql.services.field_mapper import FieldMapper
from graphql.services.markdown.base_markdown_converter import MarkdownConverter

logger = logging.getLogger(__name__)


class DictionaryMarkdownConverter(MarkdownConverter):
    """
    Converter for dictionary data to markdown.
    """
    
    def convert(self, data: Dict[str, Any], resource: GraphQlResource) -> str:
        """
        Convert a dictionary to markdown.
        
        Args:
            data: The dictionary to convert.
            
        Returns:
            The markdown representation of the dictionary.
        """
        if not data:
            return ""
        
        markdown = ""
        
        # Add title
        title = self._get_title(data) + "|" +  data.get(resource.item_identification_field, "")
        if title:
            markdown += f"# {title}  \n\n"
        
        # Process each field
        for key, value in data.items():
            # Skip the field if it's used as the title
            title = self._get_title(data)
            if title is not None and title == value:
                continue
            
            # Skip fields that should be ignored
            if self.field_mapper and self.field_mapper.should_ignore_field(key):
                continue
            
            # Process field based on type and field mapper
            field_markdown = self._process_field(key, value)
            if field_markdown:
                markdown += field_markdown
        
        return markdown
    
    def _extract_meaningful_value_from_dict(self, data: Dict[str, Any]) -> str:
        """
        Extract a meaningful string representation from a dictionary.
        
        This method tries to extract the most meaningful value from a dictionary
        without relying on specific field names. It uses a generic approach that
        should work with any GraphQL API.
        
        Args:
            data: The dictionary to extract a value from.
            
        Returns:
            A string representation of the dictionary.
        """
        if not data:
            return ""
        
        # If there's only one key-value pair, just use the value
        if len(data) == 1:
            value = next(iter(data.values()))
            if isinstance(value, (str, int, float, bool)):
                return str(value)

            if isinstance(value, dict) and value:
                return self._extract_meaningful_value_from_dict(value)
        
        # Try to find a string value that might be a good representation
        for value in data.values():
            if isinstance(value, str) and value:
                return value
        
        # If no string value found, try to find a numeric value
        for value in data.values():
            if isinstance(value, (int, float)) and value:
                return str(value)

        for value in data.values():
            if isinstance(value, dict) and value:
                return self._extract_meaningful_value_from_dict(value)
        
        # If no simple value found, return a summary of the dictionary
        return f"({len(data)} properties)"
    
    def _process_field(self, key: str, value: Any) -> str:
        """
        Process a field based on its type and field mapper.
        
        Args:
            key: The field name.
            value: The field value.
            
        Returns:
            The markdown representation of the field.
        """
        # Skip None values
        if value is None:
            return ""
        
        # Use field mapper if available
        if self.field_mapper:
            # Apply custom formatter if available
            custom_format = self.field_mapper.apply_custom_formatters(key, value)
            if custom_format:
                return f"{custom_format}\n\n"
            
            # Process image field
            if self.field_mapper.is_image_field(key):
                return self.field_mapper.process_image_field(key, value)
            
            # Process link field
            if self.field_mapper.is_link_field(key):
                return self.field_mapper.process_link_field(key, value)
            
            # Process date field
            if self.field_mapper.is_date_field(key):
                formatted_date = self.field_mapper.process_date_field(value)
                return f"**{self._format_field_name(key)}**: {formatted_date}\n\n"
        
        # Process based on value type
        if isinstance(value, dict):
            # Check if this is an image field - if so, let the field mapper handle it
            if self.field_mapper and self.field_mapper.is_image_field(key):
                return self.field_mapper.process_image_field(key, value)
            # For complex dictionary fields, use the dedicated method
            elif len(value) > 1 or any(isinstance(v, (dict, list)) for v in value.values()):
                return self._process_dict_field(key, value)
            else:
                # For simple dictionary fields, extract a meaningful value
                formatted_value = self._extract_meaningful_value_from_dict(value)
                return f"**{self._format_field_name(key)}**: {formatted_value}\n\n"
        elif isinstance(value, list):
            return self._process_list_field(key, value)
        else:
            return f"**{self._format_field_name(key)}**: {value}\n\n"
    
    def _process_dict_field(self, key: str, value: Dict[str, Any]) -> str:
        """
        Process a dictionary field.
        
        Args:
            key: The field name.
            value: The dictionary value.
            
        Returns:
            The markdown representation of the dictionary field.
        """
        if not value:
            return ""
        
        markdown = f"## {self._format_field_name(key)}\n\n"
        
        for sub_key, sub_value in value.items():
            if sub_value is None:
                continue
            
            if isinstance(sub_value, dict):
                markdown += f"### {self._format_field_name(sub_key)}\n\n"
                for k, v in sub_value.items():
                    if v is not None:
                        if isinstance(v, dict):
                            # Handle nested dictionaries
                            formatted_value = self._extract_meaningful_value_from_dict(v)
                        else:
                            formatted_value = v
                        markdown += f"**{self._format_field_name(k)}**: {formatted_value}\n\n"
            elif isinstance(sub_value, list):
                markdown += self._process_list_field(sub_key, sub_value)
            else:
                markdown += f"**{self._format_field_name(sub_key)}**: {sub_value}\n\n"
        
        return markdown
    
    def _process_list_field(self, key: str, value: List[Any]) -> str:
        """
        Process a list field.
        
        Args:
            key: The field name.
            value: The list value.
            
        Returns:
            The markdown representation of the list field.
        """
        if not value:
            return ""
        
        markdown = f"## {self._format_field_name(key)}\n\n"
        
        # Check if the list contains dictionaries
        if all(isinstance(item, dict) for item in value):
            # Find common keys and swap the table if needed
            common_keys = set()
            for item in value:
                if not common_keys:
                    common_keys = set(item.keys())
                else:
                    common_keys &= set(item.keys())
            
            # Check if the keys are dictionaries - if so, we need to swap the table
            # This is a common pattern in GraphQL responses where the keys are objects
            keys_are_dicts = False
            for item in value:
                for key in common_keys:
                    if isinstance(key, dict):
                        keys_are_dicts = True
                        break
                if keys_are_dicts:
                    break
            
            # If the keys are dictionaries, swap the table
            if keys_are_dicts:
                # Create a new list of dictionaries with the keys and values swapped
                swapped_value = []
                
                # First, collect all the values for each item
                all_values = {}
                for i, item in enumerate(value):
                    for key in common_keys:
                        if key not in all_values:
                            all_values[key] = {}
                        all_values[key][f"value_{i}"] = item.get(key)
                
                # Then, create a new dictionary for each key
                for key, values in all_values.items():
                    new_item = {"key": key}
                    new_item.update(values)
                    swapped_value.append(new_item)
                
                # Update the value and common keys
                value = swapped_value
                common_keys = set(value[0].keys()) if value else set()
            
            # If there are common keys, create a table
            if common_keys:
                # Create table header
                # Format the header keys - if they are dictionaries, extract a meaningful value
                formatted_headers = []
                for k in common_keys:
                    if isinstance(k, dict):
                        if self.field_mapper:
                            # Use the field mapper to extract a meaningful value
                            formatted_headers.append(self.field_mapper.extract_field_from_dict(k, 'header'))
                        else:
                            # Without field mapper, just extract a meaningful value
                            formatted_headers.append(self._extract_meaningful_value_from_dict(k))
                    else:
                        formatted_headers.append(self._format_field_name(k))
                
                markdown += "| " + " | ".join(formatted_headers) + " |\n"
                markdown += "| " + " | ".join("---" for _ in common_keys) + " |\n"
                
                # Create table rows
                for item in value:
                    row = []
                    for key in common_keys:
                        cell_value = item.get(key)
                        if isinstance(cell_value, list) and all(isinstance(i, dict) for i in cell_value):
                            # For lists of dictionaries (like document collections)
                            if self.field_mapper:
                                # Check if this is an image field
                                if self.field_mapper.is_image_field(key):
                                    # For image lists, format as images
                                    links = []
                                    for dict_item in cell_value:
                                        links.append(self.field_mapper.process_image_link(dict_item, key))
                                    cell = ", ".join(links)
                                # Check if we have document_links configuration
                                elif 'document_links' in self.field_mapper.mappings:
                                    # For document lists, format as links
                                    links = []
                                    for dict_item in cell_value:
                                        links.append(self.field_mapper.process_document_link(dict_item))
                                    cell = ", ".join(links)
                                else:
                                    # Otherwise, render as a bullet point list
                                    bullet_points = []
                                    for i, dict_item in enumerate(cell_value):
                                        item_points = []
                                        for k, v in dict_item.items():
                                            if v is not None and v != "":
                                                if isinstance(v, dict):
                                                    v_str = self._extract_meaningful_value_from_dict(v)
                                                else:
                                                    v_str = str(v)
                                                item_points.append(f"{k}: {v_str}")
                                        if item_points:
                                            bullet_points.append(f"Item {i+1}: " + ", ".join(item_points))
                                    cell = "<br>• " + "<br>• ".join(bullet_points) if bullet_points else ""
                            else:
                                # Without field mapper, render as a bullet point list
                                bullet_points = []
                                for i, dict_item in enumerate(cell_value):
                                    item_points = []
                                    for k, v in dict_item.items():
                                        if v is not None and v != "":
                                            if isinstance(v, dict):
                                                v_str = self._extract_meaningful_value_from_dict(v)
                                            else:
                                                v_str = str(v)
                                            item_points.append(f"{k}: {v_str}")
                                    if item_points:
                                        bullet_points.append(f"Item {i+1}: " + ", ".join(item_points))
                                cell = "<br>• " + "<br>• ".join(bullet_points) if bullet_points else ""
                        elif isinstance(cell_value, dict):
                            # For single dictionaries
                            if self.field_mapper:
                                # Check if this is an image field
                                if self.field_mapper.is_image_field(key):
                                    # For image dictionaries, format as image
                                    cell = self.field_mapper.process_image_link(cell_value, key)
                                # Check if this is a video field
                                elif self.field_mapper.is_video_field(key):
                                    # For video dictionaries, format as link
                                    cell = self.field_mapper.process_video_link(cell_value, key)
                                # Check if we have document_links configuration
                                elif 'document_links' in self.field_mapper.mappings:
                                    # For document dictionaries, format as link
                                    cell = self.field_mapper.process_document_link(cell_value)
                                # Check for operating manual structure
                                elif 'operatingManual' in cell_value:
                                    # For operating manuals, format as link
                                    cell = self.field_mapper.process_document_link(cell_value['operatingManual'])
                                # Check if this is a name field
                                elif 'name' in cell_value:
                                    cell = str(cell_value['name'])
                                else:
                                    # For other dictionaries, extract the most meaningful value
                                    cell = self._extract_meaningful_value_from_dict(cell_value)
                            else:
                                # Without field mapper, render as a bullet point list
                                bullet_points = []
                                for k, v in cell_value.items():
                                    if v is not None and v != "":
                                        if isinstance(v, dict):
                                            v_str = self._extract_meaningful_value_from_dict(v)
                                        else:
                                            v_str = str(v)
                                        bullet_points.append(f"{k}: {v_str}")
                                cell = "<br>• " + "<br>• ".join(bullet_points) if bullet_points else ""
                        else:
                            cell = str(cell_value) if cell_value is not None else ""
                        
                        # Escape pipe characters in cell content
                        cell = cell.replace("|", "\\|")
                        row.append(cell)
                    markdown += "| " + " | ".join(row) + " |\n"
                
                markdown += "\n"
            else:
                # If no common keys, list each item
                for i, item in enumerate(value):
                    markdown += f"### Item {i+1}\n\n"
                    for k, v in item.items():
                        if v is not None:
                            if isinstance(v, dict):
                                # Handle nested dictionaries
                                formatted_value = self._extract_meaningful_value_from_dict(v)
                            else:
                                formatted_value = v
                            markdown += f"**{self._format_field_name(k)}**: {formatted_value}\n\n"
        else:
            # Handle lists with mixed content types
            for item in value:
                if isinstance(item, dict):
                    # For dictionary items, extract a meaningful representation
                    markdown += f"- {self._extract_meaningful_value_from_dict(item)}\n"
                elif isinstance(item, list):
                    # For nested lists, format as a sub-list
                    markdown += "- List with " + str(len(item)) + " items:\n"
                    for sub_item in item:
                        if isinstance(sub_item, dict):
                            markdown += f"  - {self._extract_meaningful_value_from_dict(sub_item)}\n"
                        else:
                            markdown += f"  - {sub_item}\n"
                else:
                    # For simple items
                    markdown += f"- {item}\n"
            markdown += "\n"
        
        return markdown
