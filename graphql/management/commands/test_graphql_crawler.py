"""
Management command to test the GraphQL crawler functionality.

This command allows testing the GraphQL crawler with existing resources
or creating a test resource using the GitHub GraphQL API.
"""
import json
import logging
from django.core.management.base import BaseCommand, CommandError
from django.conf import settings
from django.utils import timezone

from graphql.models import GraphQlResource
from graphql.tasks import retrieve_graphql_data
from graphql.services.retrieval import GraphQLRetriever, GraphQLClient
from graphql.services.processing import GraphQLProcessor
from graphql.services.markdown import MarkdownConverterFactory
from backend.services.mongo_service import MongoService

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Test the GraphQL crawler functionality'

    def add_arguments(self, parser):
        parser.add_argument(
            '--resource-id',
            type=int,
            help='ID of an existing GraphQlResource to test',
        )
        parser.add_argument(
            '--create-test',
            action='store_true',
            help='Create a test GraphQlResource using the GitHub GraphQL API',
        )
        parser.add_argument(
            '--knowledgebase-id',
            type=int,
            default=1,
            help='Knowledgebase ID to use for the test resource',
        )
        parser.add_argument(
            '--verbose',
            action='store_true',
            help='Show detailed information about the process',
        )
        parser.add_argument(
            '--test-components',
            action='store_true',
            help='Test individual components instead of the full task',
        )

    def handle(self, *args, **options):
        resource_id = options.get('resource_id')
        create_test = options.get('create_test')
        knowledgebase_id = options.get('knowledgebase_id')
        verbose = options.get('verbose')

        if not resource_id and not create_test:
            raise CommandError('You must specify either --resource-id or --create-test')

        if create_test:
            resource_id = self._create_test_resource(knowledgebase_id)
        
        # Get the resource
        try:
            resource = GraphQlResource.objects.get(id=resource_id)
        except GraphQlResource.DoesNotExist:
            raise CommandError(f'GraphQlResource with ID {resource_id} does not exist')
        
        self.stdout.write(self.style.SUCCESS(f'Testing GraphQL crawler for resource: {resource.name}'))

        self._test_full_task(resource, verbose)
    
    def _create_test_resource(self, knowledgebase_id):
        """Create a test GraphQL resource using the GitHub GraphQL API."""
        self.stdout.write(self.style.SUCCESS('Creating test GraphQlResource...'))
        
        # Example query to get GitHub repositories
        query = """
        {
          viewer {
            repositories(first: 10) {
              nodes {
                name
                description
                url
                stargazerCount
                forkCount
                primaryLanguage {
                  name
                }
                owner {
                  login
                }
              }
            }
          }
        }
        """
        
        # Create the resource
        from backend.api.models import Knowledgebase
        try:
            kb = Knowledgebase.objects.get(id=knowledgebase_id)
        except Knowledgebase.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'Knowledgebase with ID {knowledgebase_id} does not exist'))
            return None
            
        resource = GraphQlResource.objects.create(
            name='GitHub Repositories Test',
            url='https://api.github.com/graphql',
            knowledgebase=kb,
            headers={
                'Authorization': 'Bearer YOUR_GITHUB_TOKEN'  # Replace with a real token for testing
            },
            query=query
        )
        resource_id = resource.id
        self.stdout.write(self.style.SUCCESS(f'Created test GraphQlResource with ID {resource_id}'))
        return resource_id
    
    def _test_full_task(self, resource, verbose):
        """Test the full Celery task."""
        self.stdout.write(self.style.SUCCESS('Executing GraphQL crawler task...'))
        document_ids = retrieve_graphql_data(resource.id)
        
        if not document_ids:
            self.stdout.write(self.style.WARNING('No items were processed'))
            return
        
        self.stdout.write(self.style.SUCCESS(f'Processed {len(document_ids)} items'))


    def _test_components(self, resource, verbose):
        """Test individual components of the GraphQL crawler."""
        # Test the GraphQL retriever
        self.stdout.write(self.style.SUCCESS('Testing GraphQL retriever...'))
        retriever = GraphQLRetriever(resource)
        
        try:
            items = retriever.retrieve_data()
            self.stdout.write(self.style.SUCCESS(f'Retrieved {len(items)} items'))
            
            if verbose and items:
                self.stdout.write('First item:')
                self.stdout.write(json.dumps(items[0], indent=2))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error retrieving data: {str(e)}'))
            return
        
        # Test the markdown converter
        if items:
            self.stdout.write(self.style.SUCCESS('Testing markdown converter...'))
            converter = MarkdownConverterFactory.create_converter(items[0])
            
            try:
                markdown = converter.convert(items[0])
                self.stdout.write(self.style.SUCCESS('Converted item to markdown'))
                
                if verbose:
                    self.stdout.write('Markdown preview:')
                    preview = markdown[:500] + '...' if len(markdown) > 500 else markdown
                    self.stdout.write(preview)
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Error converting to markdown: {str(e)}'))
                return
        
        # Test the processor
        self.stdout.write(self.style.SUCCESS('Testing GraphQL processor...'))
        mongo_service = MongoService()
        processor = GraphQLProcessor(mongo_service)
        
        try:
            document_ids = processor.process_items(items[:1], resource)  # Process only the first item
            self.stdout.write(self.style.SUCCESS(f'Processed {len(document_ids)} items'))
            
            # Check the MongoDB documents
            #self._check_mongodb_documents(resource, document_ids, verbose)
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error processing items: {str(e)}'))
        finally:
            mongo_service.close()
    
    def _check_mongodb_documents(self, resource, document_ids, verbose):
        """Check the MongoDB documents created by the crawler."""
        self.stdout.write(self.style.SUCCESS('Checking MongoDB documents...'))
        mongo_service = MongoService()
        kb_id = resource.knowledgebase.id if resource.knowledgebase else 0
        
        try:
            for doc_id in document_ids[:3]:  # Show the first 3 documents
                document = mongo_service.get_one_rag_data(kb_id, {'_id': doc_id})
                if document:
                    self.stdout.write(self.style.SUCCESS(f'Document {doc_id}:'))
                    self.stdout.write(f'Title: {document.get("title")}')
                    self.stdout.write(f'URL: {document.get("url")}')
                    
                    # Show a preview of the markdown content
                    content = document.get('content', '')
                    preview = content[:500] + '...' if len(content) > 500 else content
                    
                    if verbose:
                        self.stdout.write(f'Content preview:\n{preview}')
                    else:
                        self.stdout.write(f'Content length: {len(content)} characters')
                    
                    # Show raw data if verbose
                    if verbose and 'raw_data' in document:
                        try:
                            raw_data = json.loads(document['raw_data'])
                            self.stdout.write('Raw data:')
                            self.stdout.write(json.dumps(raw_data, indent=2)[:500] + '...')
                        except json.JSONDecodeError:
                            self.stdout.write('Raw data: (invalid JSON)')
                else:
                    self.stdout.write(self.style.ERROR(f'Document {doc_id} not found'))
        finally:
            mongo_service.close()
        
        self.stdout.write(self.style.SUCCESS('Test completed successfully'))
