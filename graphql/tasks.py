import logging
from celery import shared_task

from django.db import transaction
from django.core.exceptions import ObjectDoesNotExist

from backend.services.mongo_service import MongoService
from graphql.models import GraphQlResource
from graphql.services.retrieval import GraphQLRetriever
from graphql.services.processing import GraphQLProcessor
from django_scopes import scopes_disabled

logger = logging.getLogger(__name__)


@shared_task(queue="main", bind=True, max_retries=3)
@scopes_disabled()
def retrieve_graphql_data(self, graph_ql_resource_id: int):
    """
    Celery task to retrieve data from a GraphQL API and process it.
    
    Args:
        graph_ql_resource_id: The ID of the GraphQlResource to process.
    
    Returns:
        A list of MongoDB document IDs for the processed items.
    """
    try:
        # Get the GraphQlResource
        resource = GraphQlResource.objects.get(id=graph_ql_resource_id)
        
        # Initialize services
        mongo_service = MongoService()
        retriever = GraphQLRetriever(resource)
        processor = GraphQLProcessor(mongo_service)
        
        # Retrieve data from GraphQL API
        logger.info(f"Retrieving data from GraphQL API: {resource.url}")
        document_ids = retriever.retrieve_data(processor, resource)
        
        if not document_ids:
            logger.warning(f"No items found in GraphQL API: {resource.url}")
            return []

        logger.info(f"Successfully processed {len(document_ids)} items from GraphQL API: {resource.url}")
        return document_ids
    
    except ObjectDoesNotExist:
        logger.error(f"GraphQlResource with ID {graph_ql_resource_id} not found")
        return []
    except Exception as e:
        logger.error(f"Error retrieving GraphQL data: {str(e)}")
        # Retry the task with exponential backoff
        retry_countdown = 60 * (2 ** self.request.retries)  # 60s, 120s, 240s
        self.retry(exc=e, countdown=retry_countdown)
        return []
    finally:
        # Ensure MongoDB connection is closed
        if 'mongo_service' in locals():
            mongo_service.close()
