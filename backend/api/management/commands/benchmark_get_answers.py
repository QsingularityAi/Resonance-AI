import json
from django.core.management import BaseCommand
from backend.api.models import Chatbot
from hw_rag.benchmark.get_answers import GetAnswers


class Command(BaseCommand):
    help = 'Generate multiple answers for benchmark questions'

    def add_arguments(self, parser):
        parser.add_argument('chatbot', type=str, help='id of the chatbot')
        parser.add_argument('input_file', type=str, help='Path to input JSON file with questions')
        parser.add_argument('output_file', type=str, help='Path to save results')
        parser.add_argument('--workers', type=int, default=8, help='Number of parallel workers')

    def handle(self, *args, **options):
        chatbot = Chatbot.objects.get(id=str(options['chatbot']))
        if not chatbot:
            raise Exception(f"Chatbot not found, id: {options['chatbot']}")

        with open(options['input_file'], 'r', encoding='utf-8') as f:
            questions = json.load(f)

        benchmark = GetAnswers(chatbot, options['workers'])
        results, total_cost = benchmark.run_benchmark(questions)

        self.stdout.write(f"Total cost of all requests: {total_cost:.2f} cent")

        with open(options['output_file'], 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)