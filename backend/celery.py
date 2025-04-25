from __future__ import absolute_import, unicode_literals
import os
import sys
from celery import Celery
from django.apps import apps

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings.base')

app = Celery('backend')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.conf.update(
    # Connection settings
    broker_connection_retry=True,
    broker_connection_retry_on_startup=True,
    broker_connection_max_retries=10,
    broker_connection_backoff=3,
    broker_connection_timeout=60,
    broker_heartbeat=60,
    broker_pool_limit=10,

    # Worker settings
    worker_prefetch_multiplier=1,  # Process one task at a time
    worker_max_tasks_per_child=50,  # Restart worker after 50 tasks to prevent memory leaks

    # Task settings
    task_acks_late=True,  # Acknowledge after task completes
    task_reject_on_worker_lost=True,  # Requeue if worker dies
    task_time_limit=14400,  # 4 hours
    task_soft_time_limit=14100,  # 3 hours 55 minutes
    task_track_started=True,  # Track when tasks are started
)
app.autodiscover_tasks(lambda: [n.name for n in apps.get_app_configs()])
