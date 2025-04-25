"""
List Markdown Converter

This module provides a converter for list data to markdown format.
"""
import logging
from typing import List, Any, Optional

from graphql.models import GraphQlResource
from graphql.services.field_mapper import FieldMapper
from graphql.services.markdown.base_markdown_converter import MarkdownConverter
from graphql.services.markdown.dictionary_markdown_converter import DictionaryMarkdownConverter

logger = logging.getLogger(__name__)


class ListMarkdownConverter(MarkdownConverter):
    """
    Converter for list data to markdown.
    """
    
    def convert(self, data: List[Any], resource: GraphQlResource) -> str:
        """
        Convert a list to markdown.
        
        Args:
            data: The list to convert.
            
        Returns:
            The markdown representation of the list.
        """
        if not data:
            return ""
        
        markdown = ""
        
        # Initialize dictionary converter for handling dictionary items
        dict_converter = DictionaryMarkdownConverter(self.field_mapper)
        
        # Check if the list contains only dictionaries
        if all(isinstance(item, dict) for item in data):
            # Convert each dictionary item
            for i, item in enumerate(data):
                item_markdown = dict_converter.convert(item)
                
                # Add separator between items
                if i > 0 and item_markdown:
                    markdown += "---\n\n"
                
                markdown += item_markdown
        else:
            # Handle lists with mixed content types
            for item in data:
                if isinstance(item, dict):
                    # For dictionary items
                    if self.field_mapper:
                        # Check if we have document_links configuration
                        if 'document_links' in self.field_mapper.mappings:
                            # For document dictionaries, format as link
                            markdown += f"- {self.field_mapper.process_document_link(item)}\n"
                        # Check if we have image_links configuration
                        elif 'image_links' in self.field_mapper.mappings:
                            # For image dictionaries, format as image
                            markdown += f"- {self.field_mapper.process_image_link(item)}\n"
                        else:
                            # For other dictionaries, render as a bullet point list
                            bullet_points = []
                            for k, v in item.items():
                                if v is not None and v != "":
                                    if isinstance(v, dict):
                                        v_str = dict_converter._extract_meaningful_value_from_dict(v)
                                    else:
                                        v_str = str(v)
                                    bullet_points.append(f"{k}: {v_str}")
                            if bullet_points:
                                markdown += f"- " + ", ".join(bullet_points) + "\n"
                            else:
                                markdown += f"- (Empty dictionary)\n"
                    else:
                        # Without field mapper, render as a bullet point list
                        bullet_points = []
                        for k, v in item.items():
                            if v is not None and v != "":
                                if isinstance(v, dict):
                                    v_str = dict_converter._extract_meaningful_value_from_dict(v)
                                else:
                                    v_str = str(v)
                                bullet_points.append(f"{k}: {v_str}")
                        if bullet_points:
                            markdown += f"- " + ", ".join(bullet_points) + "\n"
                        else:
                            markdown += f"- (Empty dictionary)\n"
                elif isinstance(item, list):
                    # For nested lists, format as a sub-list
                    markdown += "- List with " + str(len(item)) + " items:\n"
                    for sub_item in item:
                        if isinstance(sub_item, dict):
                            if self.field_mapper:
                                # Check if we have document_links configuration
                                if 'document_links' in self.field_mapper.mappings:
                                    # For document dictionaries, format as link
                                    markdown += f"  - {self.field_mapper.process_document_link(sub_item)}\n"
                                # Check if we have image_links configuration
                                elif 'image_links' in self.field_mapper.mappings:
                                    # For image dictionaries, format as image
                                    markdown += f"  - {self.field_mapper.process_image_link(sub_item)}\n"
                                else:
                                    # For other dictionaries, render as a bullet point list
                                    bullet_points = []
                                    for k, v in sub_item.items():
                                        if v is not None and v != "":
                                            if isinstance(v, dict):
                                                v_str = dict_converter._extract_meaningful_value_from_dict(v)
                                            else:
                                                v_str = str(v)
                                            bullet_points.append(f"{k}: {v_str}")
                                    if bullet_points:
                                        markdown += f"  - " + ", ".join(bullet_points) + "\n"
                                    else:
                                        markdown += f"  - (Empty dictionary)\n"
                            else:
                                # Without field mapper, render as a bullet point list
                                bullet_points = []
                                for k, v in sub_item.items():
                                    if v is not None and v != "":
                                        if isinstance(v, dict):
                                            v_str = dict_converter._extract_meaningful_value_from_dict(v)
                                        else:
                                            v_str = str(v)
                                        bullet_points.append(f"{k}: {v_str}")
                                if bullet_points:
                                    markdown += f"  - " + ", ".join(bullet_points) + "\n"
                                else:
                                    markdown += f"  - (Empty dictionary)\n"
                        else:
                            markdown += f"  - {sub_item}\n"
                else:
                    # For simple items
                    markdown += f"- {item}\n"
            markdown += "\n"
        
        return markdown
