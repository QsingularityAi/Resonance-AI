from datetime import datetime
from hashlib import md5

from django.core.management.base import BaseCommand
import glob
import os

from hw_rag.dataclasses import QSourceType, QSource
from backend.services.mongo_service import MongoService
from backend.tasks import process_qsource

mock_markdown = [
    {
        "url": "https://raw.githubusercontent.com",
        "markdown": "test.md"
    }
]


def process_content(url, content_type, file_path):
    with open(file_path, 'rb') as file:
        if content_type == QSourceType.WEBSITE:
            content_data = file.read().decode('utf-8')
        else:  # PDF
            content_data = md5(file.read()).hexdigest()

    content = {
        'url': url,
        'last_crawled': datetime.now(),
        'content': content_data,
        'type': content_type,
        'created': datetime.now()
    }

    mongo_service = MongoService()

    source = {}
    try:
        # todo: use a special knowledgebase id to
        result = mongo_service.insert_rag_data(0, content)
        source["url"] = url
        source["source_type"] = content_type
        source["title"] = (url.split("/"))[-1]
        source["create_date"] = datetime.now()
        source["reference_id"] = str(result.inserted_id)
        print(f"Inserted document with ID: {str(result.inserted_id)}")
    finally:
        mongo_service.close()

    return QSource(**source)


class Command(BaseCommand):
    help = 'Process a set of example documents'

    def add_arguments(self, parser):
        parser.add_argument('knowledgebase_id', type=int,
                            help='The knowledge base ID used for the benchmark')

    def handle(self, *args, **options):
        base_dir = 'benchmark_data'
        markdown_dir = os.path.join(base_dir, 'markdown')
        documents_dir = os.path.join(base_dir, 'documents')
        knowledgebase_id = options['knowledgebase_id']
        resources = []

        mongo_service = MongoService()
        try:
            mongo_service.delete_rag_data(0, # magic id for benchmark
                                          {"deleteMany": {
                                              "filter": {}
                                          }})
        finally:
            mongo_service.close()

        # Process markdown files
        for file_path in glob.glob(os.path.join(markdown_dir, '*.md')):
            filename = os.path.basename(file_path)
            url = f'http://localhost:8000/benchmark/download/{filename}/'
            resources.append(process_content(url, QSourceType.WEBSITE, file_path))

        # Process PDF files
        for file_path in glob.glob(os.path.join(documents_dir, '*.pdf')):
            filename = os.path.basename(file_path)
            url = f'http://localhost:8000/benchmark/download/{filename}/'
            resources.append(process_content(url, QSourceType.PDF, file_path))

        for resource in resources:
            process_qsource(knowledgebase_id, resource,True)

        self.stdout.write(self.style.SUCCESS(f'Successfully processed {len(resources)} benchmark documents'))
