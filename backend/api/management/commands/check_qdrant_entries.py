import json

from django.core.management.base import BaseCommand
from qdrant_client import QdrantClient
from qdrant_client.http import models
from django.conf import settings

from hw_rag.dataclasses import QSource, QSourceType
from backend.services.mongo_service import MongoService
from backend.tasks import process_qsource
from hw_rag.services.qdrant_service import QdrantService


class Command(BaseCommand):
    help = 'Check if MongoDB entries are registered in Qdrant vector database'

    def add_arguments(self, parser):
        parser.add_argument('knowledgebase_id', type=str, help='Knowledebase id')
        parser.add_argument('--requeue', action='store_true', help='requeue all entries that are missing')

    def handle(self, *args, **options):
        knowledgebase_id = options['knowledgebase_id']
        qdrant_manager = QdrantService()
        qdrant_collection_name = qdrant_manager.get_collection_name(int(knowledgebase_id))
        requeue = options['requeue'] if 'requeue' in options else False

        summary = {
            "stats": {
                "found": {
                    "pdf": 0,
                    "website": 0
                },
                "not_found": {
                    "pdf": 0,
                    "website": 0
                }
            },
            "not_found_entries": {
                "pdf": [],
                "website": [],
            }
        }

        # Initialize MongoDB service
        mongo_service = MongoService()

        # Connect to Qdrant
        qdrant_client = QdrantClient(
            host="qdrant",
            port=6333
        )

        processed_count = 0
        total_count = 0

        try:
            # Get all documents from MongoDB
            documents = mongo_service.get_data_as_cursor(knowledgebase_id, {})

            for document in documents:
                total_count += 1
                reference_id = str(document['_id'])

                search_result = qdrant_client.count(
                    collection_name=qdrant_collection_name,
                    count_filter=models.Filter(
                        must=[
                            models.FieldCondition(
                                key="source.reference_id",
                                match=models.MatchValue(value=reference_id)
                            )
                        ]
                    )
                )

                if search_result.count > 0:
                    self.stdout.write(self.style.SUCCESS(f"Found: {reference_id}"))
                    summary["stats"]["found"][document["type"]] += 1
                else:
                    self.stdout.write(self.style.SUCCESS(f"Not Found: {reference_id}"))
                    summary["stats"]["not_found"][document["type"]] += 1
                    summary["not_found_entries"][document["type"]].append({
                        "_id": reference_id,
                        "url": document["url"]
                    })
                    if requeue:
                        process_qsource.delay(
                            knowledgebase_id=knowledgebase_id,
                            source=QSource(
                                title=None,
                                reference_id=reference_id,
                                source_type=QSourceType.from_str(document['type']),
                                url=document['url']
                            ).dict()
                        )

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"An error occurred: {str(e.with_traceback())}"))

        finally:
            # Close connections
            mongo_service.close()
            qdrant_client.close()
            self.stdout.write(f"stats: {json.dumps(summary['stats'], indent=4)}")

            with open("./qdrant_summary.json", 'w+') as file:
                file.write(json.dumps(summary, indent=4))
