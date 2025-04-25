"""
GraphQL Client

This module provides a client for executing GraphQL queries against external APIs.
"""
import json
import logging
from typing import Dict, Any, Optional, Union

import requests

logger = logging.getLogger(__name__)


class GraphQLClient:
    """
    Client for executing GraphQL queries.
    """
    
    def __init__(self, url: str, headers: Dict[str, str] = None):
        """
        Initialize the GraphQL client.
        
        Args:
            url: The URL of the GraphQL API.
            headers: Optional headers to include in the request.
        """
        self.url = url
        self.headers = headers or {}
        
        # Add content type header if not present
        if "Content-Type" not in self.headers:
            self.headers["Content-Type"] = "application/json"
    
    def execute(self, query: str, pagination: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Execute a GraphQL query.
        
        Args:
            query: The GraphQL query to execute.
            pagination: Optional pagination configuration.
            
        Returns:
            The JSON response from the GraphQL API.
            
        Raises:
            Exception: If the request fails or returns an error.
        """
        # Replace pagination variables in the query if provided
        if pagination:
            start = pagination.get("pagination_start", 0)
            batch_size = pagination.get("pagination_batch_size", 100)
            
            # Format the start value based on its type
            start_value = f'"{start}"' if isinstance(start, str) and start != "null" else start
            
            # Replace the pagination variables in the query
            formatted_query = query.replace("${PAGINATION_START}", str(start_value))
            formatted_query = formatted_query.replace("${PAGINATION_BATCH_SIZE}", str(batch_size))
            
            payload = {"query": formatted_query}

        else:
            payload = {"query": query}
        
        try:
            response = requests.post(
                self.url,
                headers=self.headers,
                json=payload,
                timeout=30  # 30 seconds timeout
            )
            response.raise_for_status()
            result = response.json()
            
            # Check for GraphQL errors
            if "errors" in result:
                error_messages = [error.get("message", "Unknown error") for error in result["errors"]]
                logger.error(f"GraphQL query returned errors: {', '.join(error_messages)}")
                raise Exception(f"GraphQL errors: {', '.join(error_messages)}")
            
            return result
        except requests.RequestException as e:
            logger.error(f"Failed to execute GraphQL query: {str(e)}")
            raise Exception(f"Request failed: {str(e)}")
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse GraphQL response: {str(e)}")
            raise Exception(f"Invalid JSON response: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error executing GraphQL query: {str(e)}")
            raise
