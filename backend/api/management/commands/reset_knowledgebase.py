import logging
from django.core.management.base import BaseCommand

from hw_rag.services.qdrant_service import QdrantService
logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Recreate a Qdrant collection with specified knowledgebase ID'

    def add_arguments(self, parser):
        parser.add_argument('knowledgebase', type=str, help='ID of the knowledgebase collection to recreate')

    def handle(self, *args, **options):
        knowledgebase = options['knowledgebase']

        qdrant_manager = QdrantService()
        qdrant_manager.recreate_collection(knowledgebase)