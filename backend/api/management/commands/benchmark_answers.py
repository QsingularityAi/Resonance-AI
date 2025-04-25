import logging
from django.core.management.base import BaseCommand
import asyncio

from hw_rag.services.openai_service import OpenAIService
from backend.utils.openai_client import GPTModel, OpenAIClient
from hw_rag.benchmark.benchmark import Benchmark


class Command(BaseCommand):
    help = 'Compare answers between two JSON files'

    def add_arguments(self, parser):
        parser.add_argument('file_a', type=str, help='Path to first JSON file')
        parser.add_argument('file_b', type=str, help='Path to second JSON file')

    def handle(self, *args, **options):
        logging.getLogger().setLevel(logging.WARNING)

        async def run_comparison():
            try:
                OpenAIService._client = OpenAIClient()
                benchmark = Benchmark()
                return await benchmark.async_handle(options['file_a'], options['file_b'])
            except Exception as e:
                logging.getLogger(__name__).error(f"Error in comparison: {e}")
                raise

        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            return loop.run_until_complete(run_comparison())
        finally:
            loop.close()


