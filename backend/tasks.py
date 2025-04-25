import logging

from celery import shared_task
from backend.api.di.di import DI
from hw_rag.dataclasses import QSource
from backend.api.worker.autotranslate.autotranslate import Autotranslate
from dependency_injector.wiring import inject, Provide

from hw_rag.rag_processing import RagProcessing
from hw_rag.services.qdrant_service import QdrantService
from celery import signals
import os
import sentry_sdk
from sentry_sdk.integrations.celery import CeleryIntegration
from django_scopes import scopes_disabled

from crawler.tasks import CRAWLER_CELERY_BEAT_SCHEDULE
from webdav.tasks import WEBDAV_CELERY_BEAT_SCHEDULE

CELERY_BEAT_SCHEDULE = {**CRAWLER_CELERY_BEAT_SCHEDULE, **WEBDAV_CELERY_BEAT_SCHEDULE}

logger = logging.getLogger(__name__)

@signals.celeryd_init.connect
def init_sentry(**kwargs):
    SENTRY_DSN = os.getenv('SENTRY_DSN')

    if SENTRY_DSN:
        sentry_sdk.init(
            dsn=SENTRY_DSN,
            integrations=[CeleryIntegration(monitor_beat_tasks=True)],
            traces_sample_rate=0.0
        )


@shared_task(queue="rag")
@scopes_disabled()
@inject
def process_qsource(knowledgebase_id: int, source: QSource, rag_processing: RagProcessing = Provide[DI.rag_processing]):
    print(source)
    source = QSource.model_validate(source)  # For Pydantic v2
    logger.info("Celery starting Rag Processing " + str(source.reference_id))

    success = rag_processing.process_document(
        knowledgebase_id=knowledgebase_id,
        source=source,
    )


@shared_task(queue="main")
@scopes_disabled()
@inject
def delete_qsource(knowledgebase_id: int, reference_id: str, qdrant_service: QdrantService = Provide[DI.qdrant_service]):
    qdrant_service.delete_by_reference_id(knowledgebase_id, reference_id)


@shared_task(queue="main")
@scopes_disabled()
def autotranslate():
    logger.info("Celery starting Autotranslate")
    autotranslate = Autotranslate()
    autotranslate.translate_all_missing()
