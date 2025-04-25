# yourapp/management/commands/count_tokens.py
from django.core.management.base import BaseCommand
from qdrant_client import QdrantClient
import tiktoken
from tqdm import tqdm


class Command(BaseCommand):
    help = 'Count tokens in Qdrant collection texts using tiktoken'

    def add_arguments(self, parser):
        parser.add_argument(
            '--collection',
            type=str,
            required=True,
            help='Name of the Qdrant collection'
        )
        parser.add_argument(
            '--batch-size',
            type=int,
            default=100,
            help='Batch size for scrolling through points'
        )

    def handle(self, *args, **options):
        # Initialize
        enc = tiktoken.encoding_for_model("gpt-4o-mini")
        client = QdrantClient("qdrant", port=6333)
        collection_name = options['collection']
        batch_size = options['batch_size']

        # Get total count first
        collection_info = client.get_collection(collection_name)
        total_points = collection_info.points_count

        total_tokens = 0
        processed = 0
        offset = None
        scroll_token = None

        with tqdm(total=total_points) as pbar:
            while True:
                response = client.scroll(
                    collection_name=collection_name,
                    limit=batch_size,
                    offset=offset,
                    with_payload=True
                )

                points, next_scroll_token = response

                if not points:
                    break

                batch_tokens = sum(
                    len(enc.encode(point.payload.get("text", "")))
                    for point in points
                )

                total_tokens += batch_tokens
                processed += len(points)
                pbar.update(len(points))

                # Update offset and scroll token for next iteration
                offset = points[-1].id if points else None
                scroll_token = next_scroll_token

                if processed >= total_points or (not offset and not scroll_token):
                    break

                self.stdout.write(f"Processed {processed}/{total_points} points...")

        self.stdout.write(self.style.SUCCESS(
            f"\nTotal tokens across {processed} documents: {total_tokens}"
        ))