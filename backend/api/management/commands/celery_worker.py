from django.core.management.base import BaseCommand
import shlex
import subprocess

class Command(BaseCommand):
    help = 'Starts the Celery worker'

    def handle(self, *args, **options):
        cmd = 'celery -A backend worker --loglevel=info'
        subprocess.call(shlex.split(cmd))