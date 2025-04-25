"""
Field Mapper Service

This service is responsible for applying field mappings to GraphQL data
during the markdown conversion process.
"""
import logging
import re
from typing import Dict, Any, List, Optional, Union
from datetime import datetime

from django.utils import timezone

logger = logging.getLogger(__name__)


class FieldMapper:
    """
    Service for applying field mappings to GraphQL data.
    """
    
    def __init__(self, mappings: Dict[str, Any]):
        """
        Initialize the field mapper with mappings.
        
        Args:
            mappings: The field mappings to apply.
        """
        self.mappings = mappings
    
    def get_title(self, data: Dict[str, Any]) -> Optional[str]:
        """
        Get the title from the data based on the title_field mapping.
        
        Args:
            data: The data to extract the title from.
            
        Returns:
            The title if found, None otherwise.
        """
        title_field = self.mappings.get('title_field')
        if not title_field:
            return None
        
        # Handle nested fields with dot notation (e.g., "product.name")
        if '.' in title_field:
            parts = title_field.split('.')
            value = data
            for part in parts:
                if isinstance(value, dict) and part in value:
                    value = value[part]
                else:
                    return None
            return str(value) if value is not None else None
        
        # Handle simple field
        return str(data[title_field]) if title_field in data and data[title_field] is not None else None
    
    def process_image_field(self, key: str, value: Any) -> str:
        """
        Process an image field and convert it to markdown.
        
        Args:
            key: The field name.
            value: The field value.
            
        Returns:
            The markdown representation of the image.
        """
        # Check if there's a multi-image array mapping for this key
        multi_image_arrays = self.mappings.get('multi_image_arrays', {})
        if key in multi_image_arrays:
            # Extract multiple images from an array
            array_path = multi_image_arrays[key].get('array_path', '')
            item_path = multi_image_arrays[key].get('item_path', '')
            limit = multi_image_arrays[key].get('limit', 0)
            
            if array_path and item_path:
                return self._process_multi_image_array(value, array_path, item_path, key, limit)
        
        # Check if there's a complex path mapping for this key
        complex_image_paths = self.mappings.get('complex_image_paths', {})
        if key in complex_image_paths:
            # Extract the image URL using the complex path
            path_expr = complex_image_paths[key]
            image_url = self._extract_value_by_complex_path(value, path_expr)
            if image_url:
                value = image_url
            else:
                logger.warning(f"Failed to extract image URL using path '{path_expr}'")
                return ""
        
        # Handle relative URLs
        if isinstance(value, str) and value and not (value.startswith('http://') or value.startswith('https://')):
            base_url = self.mappings.get('base_url', '')
            value = f"{base_url.rstrip('/')}/{value.lstrip('/')}"
        
        # Handle static URL prefix
        static_url = self.mappings.get('static_url', '')
        if static_url and isinstance(value, str):
            value = f"{static_url.rstrip('/')}/{value.lstrip('/')}"
        
        alt_text = key.replace('_', ' ').title()
        return f"![{alt_text}]({value})\n\n"
    
    def _process_multi_image_array(self, data: Any, array_path: str, item_path: str, key: str, limit: int = 0) -> str:
        """
        Process multiple images from an array.
        
        Args:
            data: The data containing the image array.
            array_path: The path to the array.
            item_path: The path within each array item to the image URL.
            key: The field name.
            limit: Maximum number of images to process (0 for all).
            
        Returns:
            The markdown representation of the images.
        """
        # Check if data is already an array
        if isinstance(data, list):
            array = data
        else:
            # Extract the array using the path
            array = self._extract_value_by_complex_path(data, array_path)
            if not array or not isinstance(array, list):
                logger.warning(f"Failed to extract image array using path '{array_path}' from {data}")
                return ""
        
        # Apply limit if specified
        if limit > 0 and len(array) > limit:
            array = array[:limit]
        
        # Process each item in the array
        markdown = ""
        for i, item in enumerate(array):
            # Extract the image URL from the item
            image_url = self._extract_value_by_complex_path(item, item_path)
            if not image_url:
                continue
            
            # Handle relative URLs
            if isinstance(image_url, str) and image_url and not (image_url.startswith('http://') or image_url.startswith('https://')):
                base_url = self.mappings.get('base_url', '')
                image_url = f"{base_url.rstrip('/')}/{image_url.lstrip('/')}"
            
            # Handle static URL prefix
            static_url = self.mappings.get('static_url', '')
            if static_url and isinstance(image_url, str):
                image_url = f"{static_url.rstrip('/')}/{image_url.lstrip('/')}"
            
            # Generate alt text with index
            alt_text = f"{key.replace('_', ' ').title()} {i+1}"
            markdown += f"![{alt_text}]({image_url})\n\n"
        
        return markdown
    
    def _extract_value_by_complex_path(self, data: Any, path_expr: str) -> Optional[str]:
        """
        Extract a value from nested data using a complex path expression.
        
        The path expression can include array indices and nested fields, e.g.:
        - "images[0].url"
        - "node.images[0].img1.fullpath"
        
        Args:
            data: The data to extract from.
            path_expr: The path expression.
            
        Returns:
            The extracted value if found, None otherwise.
        """
        if not data or not path_expr:
            return None
        
        # Split the path into parts
        parts = []
        # Match either a field name or an array index expression like [0]
        for match in re.finditer(r'([^\.\[\]]+)|\[(\d+)\]', path_expr):
            if match.group(1):  # Field name
                parts.append(match.group(1))
            else:  # Array index
                parts.append(int(match.group(2)))
        
        # Navigate through the data
        current = data
        for part in parts:
            try:
                if isinstance(part, int) and isinstance(current, list):
                    # Array index
                    if part < len(current):
                        current = current[part]
                    else:
                        return None
                elif isinstance(part, str) and isinstance(current, dict):
                    # Dictionary key
                    if part in current:
                        current = current[part]
                    else:
                        return None
                else:
                    # Type mismatch
                    return None
            except (IndexError, KeyError, TypeError):
                return None
        
        # Convert the result to a string
        return str(current) if current is not None else None
    
    def extract_field_from_dict(self, value: Dict[str, Any], key: str) -> str:
        """
        Extract a field from a dictionary based on the extract_fields configuration.
        
        This method is used to extract a meaningful value from a dictionary
        based on the field name specified in the extract_fields configuration.
        
        Args:
            value: The dictionary to extract from.
            key: The field name to look up in the extract_fields configuration.
            
        Returns:
            The extracted value if found, a string representation of the dictionary otherwise.
        """
        if not isinstance(value, dict):
            return str(value)
        
        # Check if there's an extract_fields configuration for this key
        extract_fields = self.mappings.get('extract_fields', {})
        if key in extract_fields:
            # Get the field to extract
            field_to_extract = extract_fields[key]
            
            # Extract the field
            if field_to_extract in value:
                return str(value[field_to_extract])
        
        # If no extract_fields configuration or field not found,
        # try to find a meaningful value
        
        # If there's only one key-value pair, just use the value
        if len(value) == 1:
            val = next(iter(value.values()))
            if isinstance(val, (str, int, float, bool)):
                return str(val)
        
        # Try to find a string value that might be a good representation
        for val in value.values():
            if isinstance(val, str) and val:
                return val
        
        # If no string value found, try to find a numeric value
        for val in value.values():
            if isinstance(val, (int, float)) and val:
                return str(val)
        
        # If no simple value found, return a summary of the dictionary
        return f"({len(value)} properties)"
    
    def process_link_field(self, key: str, value: Any) -> str:
        """
        Process a link field and convert it to markdown.
        
        Args:
            key: The field name.
            value: The field value.
            
        Returns:
            The markdown representation of the link.
        """
        link_fields = self.mappings.get('link_fields', {})
        
        # Check if there's a template for this field
        if key in link_fields:
            template = link_fields[key]
            
            # Replace placeholders in the template
            if isinstance(value, dict):
                # For dictionary values, replace {field} with value[field]
                url = template
                for field, field_value in value.items():
                    url = url.replace(f"{{{field}}}", str(field_value))
            else:
                # For simple values, replace {value} with the value
                url = template.replace("{value}", str(value))
            
            link_text = key.replace('_', ' ').title()
            return f"[{link_text}]({url})\n\n"
        
        # If no template, just use the value as a URL
        if isinstance(value, str):
            link_text = key.replace('_', ' ').title()
            return f"[{link_text}]({value})\n\n"
        
        # If value is not a string and no template, return empty string
        return ""
    
    def process_document_link(self, value: Dict[str, Any], label_field: str = None) -> str:
        """
        Process a document dictionary and convert it to a markdown link.
        
        This method is generic and can be used with any API that returns document
        dictionaries with path information.
        
        Args:
            value: The document dictionary.
            label_field: Optional field to use as the link text.
            
        Returns:
            The markdown representation of the document link.
        """
        # Get document link configuration
        doc_link_config = self.mappings.get('document_links', {})
        path_field = doc_link_config.get('path_field', 'fullpath')
        label_field = label_field or doc_link_config.get('label_field', 'filename')
        
        # Extract path and label
        if not isinstance(value, dict):
            return str(value)
        
        # Try to find a path field in the dictionary
        path = None
        if path_field in value:
            path = value.get(path_field)
        else:
            # Look for nested document structure
            for k, v in value.items():
                if isinstance(v, dict) and path_field in v:
                    path = v.get(path_field)
                    break
        
        if not path:
            return str(value)
        
        # Try to find a label field in the dictionary
        label = None
        if label_field in value:
            label = value.get(label_field)
        else:
            # Look for nested document structure
            for k, v in value.items():
                if isinstance(v, dict) and label_field in v:
                    label = v.get(label_field)
                    break
        
        # If no label found, use the path as label
        label = label or path
        
        # Apply static URL if available
        static_url = self.mappings.get('static_url', '')
        if static_url and path:
            url = f"{static_url.rstrip('/')}/{path.lstrip('/')}"
            return f"[{label}]({url})"
        
        return label
    
    def process_video_link(self, value: Dict[str, Any], title: str = None) -> str:
        """
        Process a video dictionary and convert it to a markdown link.
        
        This method is generic and can be used with any API that returns video
        dictionaries with path information.
        
        Args:
            value: The video dictionary.
            title: Optional title for the video link.
            
        Returns:
            The markdown representation of the video link.
        """
        # Extract path and title
        if not isinstance(value, dict):
            return str(value)
        
        # Try to find a path field in the dictionary
        path = None
        # Common path fields in video objects
        path_fields = ['fullpath', 'url', 'src', 'path']
        
        for field in path_fields:
            if field in value:
                path = value.get(field)
                break
            else:
                # Look for nested video structure
                for k, v in value.items():
                    if isinstance(v, dict) and field in v:
                        path = v.get(field)
                        if path:
                            break
                    # Look for data field that might contain the path
                    elif isinstance(v, dict) and 'data' in v and isinstance(v['data'], dict) and field in v['data']:
                        path = v['data'].get(field)
                        if path:
                            break
                if path:
                    break
        
        if not path:
            return str(value)
        
        # Try to find a title field in the dictionary
        if not title:
            # Common title fields in video objects
            title_fields = ['title', 'name', 'label', 'filename']
            
            for field in title_fields:
                if field in value:
                    title = value.get(field)
                    break
                else:
                    # Look for nested video structure
                    for k, v in value.items():
                        if isinstance(v, dict) and field in v:
                            title = v.get(field)
                            if title:
                                break
                        # Look for data field that might contain the title
                        elif isinstance(v, dict) and 'data' in v and isinstance(v['data'], dict) and field in v['data']:
                            title = v['data'].get(field)
                            if title:
                                break
                    if title:
                        break
        
        # If no title found, use a generic title
        title = title or "Video"
        
        # Apply static URL if available
        static_url = self.mappings.get('static_url', '')
        if static_url and path:
            url = f"{static_url.rstrip('/')}/{path.lstrip('/')}"
            return f"[{title}]({url})"
        
        return title
    
    def process_image_link(self, value: Dict[str, Any], alt_text: str = None) -> str:
        """
        Process an image dictionary and convert it to a markdown image.
        
        This method is generic and can be used with any API that returns image
        dictionaries with path information.
        
        Args:
            value: The image dictionary.
            alt_text: Optional alt text for the image.
            
        Returns:
            The markdown representation of the image.
        """
        # Get image link configuration
        image_config = self.mappings.get('image_links', {})
        path_field = image_config.get('path_field', 'fullpath')
        alt_field = image_config.get('alt_field', 'filename')
        
        # Extract path and alt text
        if not isinstance(value, dict):
            return str(value)
        
        # Try to find a path field in the dictionary
        path = None
        if path_field in value:
            path = value.get(path_field)
        else:
            # Look for nested image structure
            for k, v in value.items():
                if isinstance(v, dict) and path_field in v:
                    path = v.get(path_field)
                    break
                # Look for data field that might contain the path
                elif isinstance(v, dict) and 'data' in v and isinstance(v['data'], dict) and path_field in v['data']:
                    path = v['data'].get(path_field)
                    break
        
        if not path:
            return str(value)
        
        # Try to find an alt text field in the dictionary
        alt = alt_text
        if not alt and alt_field in value:
            alt = value.get(alt_field)
        else:
            # Look for nested image structure
            for k, v in value.items():
                if isinstance(v, dict) and alt_field in v:
                    alt = v.get(alt_field)
                    break
                # Look for data field that might contain the alt text
                elif isinstance(v, dict) and 'data' in v and isinstance(v['data'], dict) and alt_field in v['data']:
                    alt = v['data'].get(alt_field)
                    break
        
        # If no alt text found, use the path as alt text
        alt = alt or path
        
        # Apply static URL if available
        static_url = self.mappings.get('static_url', '')
        if static_url and path:
            url = f"{static_url.rstrip('/')}/{path.lstrip('/')}"
            return f"![{alt}]({url})"
        
        return alt
    
    def process_date_field(self, value: Any) -> str:
        """
        Process a date field and convert it to a formatted date string.
        
        Args:
            value: The date value.
            
        Returns:
            The formatted date string.
        """
        date_format = self.mappings.get('date_format', '%Y-%m-%d')
        
        try:
            if isinstance(value, str):
                # Try to parse the string as a date
                dt = datetime.fromisoformat(value.replace('Z', '+00:00'))
                return dt.strftime(date_format)
            elif isinstance(value, (int, float)):
                # Assume timestamp in seconds
                dt = datetime.fromtimestamp(value, tz=timezone.get_current_timezone())
                return dt.strftime(date_format)
        except (ValueError, TypeError) as e:
            logger.warning(f"Failed to parse date value '{value}': {str(e)}")
        
        # Return the original value if parsing fails
        return str(value)
    
    def should_ignore_field(self, key: str) -> bool:
        """
        Check if a field should be ignored based on the ignore_fields mapping.
        
        Args:
            key: The field name.
            
        Returns:
            True if the field should be ignored, False otherwise.
        """
        ignore_fields = self.mappings.get('ignore_fields', [])
        return key in ignore_fields
    
    def is_image_field(self, key: str) -> bool:
        """
        Check if a field is an image field based on the image_fields mapping.
        
        Args:
            key: The field name.
            
        Returns:
            True if the field is an image field, False otherwise.
        """
        image_fields = self.mappings.get('image_fields', [])
        
        # Check if the key is directly in the image_fields list
        if key in image_fields:
            return True
        
        # Check if there's a complex path mapping for this key
        complex_image_paths = self.mappings.get('complex_image_paths', {})
        return key in complex_image_paths
    
    def is_video_field(self, key: str) -> bool:
        """
        Check if a field is a video field based on the video_fields mapping.
        
        Args:
            key: The field name.
            
        Returns:
            True if the field is a video field, False otherwise.
        """
        video_fields = self.mappings.get('video_fields', [])
        return key in video_fields
    
    def is_link_field(self, key: str) -> bool:
        """
        Check if a field is a link field based on the link_fields mapping.
        
        Args:
            key: The field name.
            
        Returns:
            True if the field is a link field, False otherwise.
        """
        link_fields = self.mappings.get('link_fields', {})
        return key in link_fields
    
    def is_date_field(self, key: str) -> bool:
        """
        Check if a field is a date field based on the date_fields mapping.
        
        Args:
            key: The field name.
            
        Returns:
            True if the field is a date field, False otherwise.
        """
        date_fields = self.mappings.get('date_fields', [])
        return key in date_fields
    
    def apply_custom_formatters(self, key: str, value: Any) -> Optional[str]:
        """
        Apply custom formatters to a field based on the custom_formatters mapping.
        
        Args:
            key: The field name.
            value: The field value.
            
        Returns:
            The formatted value if a custom formatter is found, None otherwise.
        """
        custom_formatters = self.mappings.get('custom_formatters', {})
        
        if key in custom_formatters:
            formatter = custom_formatters[key]
            
            # Handle template strings
            if isinstance(formatter, str):
                if isinstance(value, dict):
                    # For dictionary values, replace {field} with value[field]
                    result = formatter
                    for field, field_value in value.items():
                        result = result.replace(f"{{{field}}}", str(field_value))
                    return result
                else:
                    # For simple values, replace {value} with the value
                    return formatter.replace("{value}", str(value))
        
        return None
