from django.core.management.base import BaseCommand

from hw_rag.dataclasses import QSourceType
from backend.tasks import process_qsource
from crawler.services.scrape_service import scrape_page


class Command(BaseCommand):
    help = 'Process a set of example documents'

    def add_arguments(self, parser):
        parser.add_argument('knowledgebase_id', type=int,
                            help='Knowledgebase id')
        parser.add_argument('url', type=str,
                            help='The page to scrape')



    def handle(self, *args, **options):

        url = options['url']
        knowledgebase_id = options['knowledgebase_id']

        scrape_page(QSourceType.WEBSITE, url, knowledgebase_id, process_qsource)

        self.stdout.write(self.style.SUCCESS(f'scraped page'))
