#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
from django_scopes import scope, scopes_disabled

def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings.base')
    os.environ.setdefault('OPENAI_API_KEY', 'please set key in .env')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    with scopes_disabled():
        execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
