from django.core.management.base import BaseCommand
from django.apps import apps

from backend.api.worker.autotranslate.autotranslate import Autotranslate
from backend.tasks import autotranslate


class Command(BaseCommand):
    help = 'Find and translate missing translations for all translated models'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.autotranslate = Autotranslate()

    def handle(self, *args, **options):
        autotranslate()