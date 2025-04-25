"""
GraphQL Retriever

This module provides a service for retrieving data from GraphQL APIs based on
predefined queries stored in the GraphQlResource model.
"""
import logging
from typing import Dict, Any, List, Optional

from libfuturize.fixes.fix_division_safe import is_floaty
from uritemplate import variables

from graphql.models import GraphQlResource
from graphql.services import GraphQLProcessor
from graphql.services.retrieval.graphql_client import GraphQLClient
from graphql.services.retrieval.graphql_response_parser import GraphQLResponseParser

logger = logging.getLogger(__name__)


class GraphQLRetriever:
    """
    Service for retrieving data from GraphQL APIs.
    """

    def __init__(self, graph_ql_resource: GraphQlResource):
        """
        Initialize the GraphQL retriever with a GraphQlResource instance.

        Args:
            graph_ql_resource: The GraphQlResource instance containing the GraphQL API details.
        """
        self.resource = graph_ql_resource
        self.client = GraphQLClient(graph_ql_resource.url, graph_ql_resource.headers or {})
        self.parser = GraphQLResponseParser(unwrap_node_field=graph_ql_resource.unwrap_node_field)
        self.query = graph_ql_resource.query

    def _get_total_count(self, response: Dict[str, Any], total_count_field: str) -> Optional[int]:
        """
        Extract the total count from the GraphQL response.
        
        Args:
            response: The GraphQL response.
            total_count_field: The field path to the total count.
            
        Returns:
            The total count if found, None otherwise.
        """
        if not total_count_field:
            return None
            
        # Split the field path
        path_parts = total_count_field.split('.')
        
        # Navigate through the response to find the total count
        current = response.get('data', {})
        for part in path_parts:
            if part in current:
                current = current[part]
            else:
                logger.warning(f"Total count field '{total_count_field}' not found in response")
                return None
                
        # Ensure the value is an integer
        try:
            return int(current)
        except (ValueError, TypeError):
            logger.warning(f"Total count value '{current}' is not a valid integer")
            return None
    
    def _process_batch(self, items: List[Dict[str, Any]], processor: GraphQLProcessor, resource: GraphQlResource) -> \
    list[str]:
        """
        Process a batch of items.
        This method can be overridden by subclasses to implement custom processing.
        
        Args:
            items: The batch of items to process.
        """
        # In this base implementation, we just log the number of items
        logger.info(f"Processing batch of {len(items)} items")
        # Process items and save to MongoDB
        logger.info(f"Processing {len(items)} items from GraphQL API: {resource.url}")
        return processor.process_items(items, resource)
        # Subclasses can override this method to implement custom processing

    
    def retrieve_data(self, processor: GraphQLProcessor, resource: GraphQlResource) -> List[Dict[str, Any]]:
        """
        Retrieve data from the GraphQL API and extract items.
        If pagination is enabled, it will fetch multiple pages and process each batch separately.

        Returns:
            A list of items from the last batch processed.
        """
        try:
            all_items = []
            current_page = 1
            max_pages = 0
            
            # Check if pagination is enabled
            if self.resource.pagination_batch_size > 0 and self.resource.pagination_total_count_field is not None:
                pagination_enabled = True
                batch_size = self.resource.pagination_batch_size
                current_cursor = self.resource.pagination_start
                total_count_field = self.resource.pagination_total_count_field
                max_pages = self.resource.pagination_max_pages if self.resource.pagination_max_pages is not None else 0
            else:
                pagination_enabled = False
                return self._fetch_single_page()
            
            # Initialize total count to None
            total_count = 0
            items_processed = -1
            
            # Continue fetching pages until we reach max pages or have all items
            while current_page <= max_pages if max_pages > 0 else items_processed < total_count:
                # Configure pagination for this page
                pagination = {
                    'pagination_start': current_cursor,
                    'pagination_batch_size': batch_size,
                    'totalCountField': total_count_field,
                    'maxPages': max_pages
                }
                
                # Execute the query for this page
                response = self.client.execute(self.query, pagination)
                
                # Extract items from the response
                items = self.parser.extract_items(response)
                
                # Process this batch
                doc_ids = self._process_batch(items, processor, resource)
                
                # Keep track of the last batch for return value
                all_items += doc_ids
                items_processed += len(items)
                
                logger.info(f"Retrieved {len(items)} items from page {current_page}")
                
                # Get the total count if we don't have it yet
                if total_count == 0:
                    total_count = self._get_total_count(response, total_count_field)
                    logger.info(f"Total count: {total_count}")
                
                # Check if we need to fetch more pages
                if not items or (total_count != 0 and items_processed >= total_count):
                    logger.info("All items retrieved, stopping pagination")
                    break
                
                # Update the cursor for the next page
                if isinstance(current_cursor, str) and current_cursor != "null":
                    # For cursor-based pagination, we would need to extract the end cursor
                    # This is a simplified implementation that assumes the cursor is in the response
                    # In a real implementation, you would extract the cursor from the response
                    logger.warning("Cursor-based pagination not fully implemented, stopping after one page")
                    break
                else:
                    # For offset-based pagination, we increment by the batch size
                    current_cursor = items_processed
                
                current_page += 1
            
            logger.info(f"Retrieved a total of {items_processed +1} items from GraphQL API: {self.resource.url}")
            return all_items
        except Exception as e:
            logger.error(f"Failed to retrieve data from GraphQL API: {str(e)}")
            raise
            
    def _fetch_single_page(self) -> List[Dict[str, Any]]:
        """
        Fetch a single page of results when pagination is not enabled.
        
        Returns:
            A list of items extracted from the GraphQL response.
        """
        try:
            # Execute the query without pagination
            response = self.client.execute(self.query)
            
            # Extract items from the response
            items = self.parser.extract_items(response)
            
            # Process this batch
            self._process_batch(items)
            
            logger.info(f"Retrieved {len(items)} items from GraphQL API: {self.resource.url}")
            return items
        except Exception as e:
            logger.error(f"Failed to retrieve data from GraphQL API: {str(e)}")
            raise
