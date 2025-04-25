from datetime import datetime

from django.core.management.base import BaseCommand

from hw_rag.dataclasses import QSource, QSourceType, QSourceOrigin, QSourceOriginType
from backend.tasks import process_qsource


class Command(BaseCommand):
    help = 'Process document with given reference ID'

    def add_arguments(self, parser):
        parser.add_argument('document_id', type=str,
                            help='The document ID to link with other databases')
        parser.add_argument('knowledgebase_id', type=int,
                            help='The knowledge base ID')
        parser.add_argument('document_type', type=str,
                            help='Type of document (pdf, website, image)')
        parser.add_argument('--sync', action='store_true',
                            help='Run processing synchronously')

    def handle(self, *args, **options):
        document_id = options['document_id']
        knowledgebase_id = options['knowledgebase_id']
        document_type = options['document_type']
        is_sync = options['sync']

        source = QSource(
            reference_id=document_id,
            url="https://example.com",
            source_type=QSourceType.from_str(document_type),
            source_origin=QSourceOrigin(type=QSourceOriginType.CRAWLER, id=knowledgebase_id),
            title="Example Document",
            create_date=datetime.now(),
            summary="This is a test document"
        )

        try:
            if is_sync:
                self.stdout.write("Running synchronous processing...")
                # Call the Celery task function directly for sync processing
                process_qsource(knowledgebase_id, source)
            else:
                self.stdout.write("Running asynchronous processing (worker)...")
                # Queue the Celery task
                process_qsource.delay(
                    knowledgebase_id=knowledgebase_id,
                    source=source
                )
                self.stdout.write(self.style.SUCCESS('Processing initiated successfully'))

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error processing document: {str(e)}')
            )
