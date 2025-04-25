"""
GraphQL Response Parser

This module provides a parser for extracting structured data from GraphQL responses.
"""
import logging
from typing import Dict, Any, Optional, List

logger = logging.getLogger(__name__)


class GraphQLResponseParser:
    """
    Parser for GraphQL responses.
    """
    
    def __init__(self, unwrap_node_field: Optional[str] = None):
        """
        Initialize the GraphQL response parser.
        
        Args:
            unwrap_node_field: Optional field name to unwrap (e.g., "node" for edges/node structure).
        """
        self.unwrap_node_field = unwrap_node_field
    
    def extract_items(self, data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Extract items from a GraphQL response.
        This method attempts to find arrays of items in the response data.
        
        Args:
            data: The GraphQL response data.
            
        Returns:
            A list of items extracted from the response.
        """
        items = []
        
        def extract_arrays(obj, path=""):
            """Recursively extract arrays from the response"""
            if isinstance(obj, dict):
                # Check for edges/node structure
                if "edges" in obj and isinstance(obj["edges"], list):
                    edges = obj["edges"]
                    logger.info(f"Found edges array with {len(edges)} items at path: {path}")
                    
                    # Process each edge
                    for edge in edges:
                        if isinstance(edge, dict) and self.unwrap_node_field in edge:
                            # Unwrap the node
                            node = edge[self.unwrap_node_field]
                            if isinstance(node, dict):
                                items.append(node)
                    
                    # Skip further processing of this object since we've handled the edges
                    return
                
                # Regular dictionary processing
                for key, value in obj.items():
                    new_path = f"{path}.{key}" if path else key
                    extract_arrays(value, new_path)
            elif isinstance(obj, list) and obj and isinstance(obj[0], dict):
                # Found an array of objects
                logger.info(f"Found array of {len(obj)} items at path: {path}")
                
                # Check if we need to unwrap nodes
                if self.unwrap_node_field:
                    for item in obj:
                        if isinstance(item, dict) and self.unwrap_node_field in item:
                            node = item[self.unwrap_node_field]
                            if isinstance(node, dict):
                                items.append(node)
                        else:
                            items.append(item)
                else:
                    items.extend(obj)
            elif isinstance(obj, list):
                for item in obj:
                    extract_arrays(item, path)
        
        # Start extraction from the data field which is standard in GraphQL responses
        if "data" in data:
            extract_arrays(data["data"])
        else:
            extract_arrays(data)
        
        return items
