import re
import time

from bson import ObjectId
from celery import shared_task
from celery.schedules import crontab
from celery.signals import worker_process_init

from celery.utils.log import get_task_logger
import logging
import datetime
from celery import current_task
from crawler.dataclasses import CrawlingStatus
from crochet import setup
from django_scopes import scopes_disabled
import os

from celery import signals

import sentry_sdk
from sentry_sdk.integrations.celery import CeleryIntegration

# Define a schedule for tasks in app_two
CRAWLER_CELERY_BEAT_SCHEDULE = {
    'deletion_check': {
        'task': 'crawler.tasks.check_crawl_link_resources_for_deletion',
        'schedule': crontab(hour=12),
        'args': (),
    },
    'delete_dangling_mongo_resources': {
        'task': 'crawler.tasks.delete_dangling_mongo_resources',
        'schedule': crontab(hour=1),
        'args': (),
    },
    'check_for_resources_to_be_crawled': {
        'task': 'crawler.tasks.crawl_periodically',
        'schedule': crontab(hour=1),
        'args': (),
    },
}

logger = get_task_logger(__name__)
logger.setLevel(logging.INFO)


@signals.celeryd_init.connect
def init_sentry(**kwargs):
    SENTRY_DSN = os.getenv('SENTRY_DSN')
    if SENTRY_DSN:
        sentry_sdk.init(
            dsn=SENTRY_DSN,
            integrations=[CeleryIntegration(monitor_beat_tasks=True)],  # 👈
        )


@worker_process_init.connect
def init_worker(**kwargs):
    setup()


@shared_task(queue="main")
def spider_task(crawl_link_id: int):
    from crawler.services.link_discovery import discover
    current_stamped_headers = current_task.request.stamped_headers or []
    current_stamps = {
        header: current_task.request.stamps.get(header)
        for header in current_stamped_headers
    }
    result = discover(
        crawl_link_id=crawl_link_id,
        scrape_task=scrape_task,
        end_of_crawl_task=end_of_crawl,
        task_kwargs={
            'crawl_link_id': crawl_link_id
        },
        stamps=current_stamps
    )
    result.wait(timeout=3600)
    logger.info(f"Starting spider task for crawl link id: {crawl_link_id}")


@shared_task(rate_limit="100/m", queue="crawler")
@scopes_disabled()
def scrape_task(url: str, content_type: str, knowledgebase_id: int, crawl_link_id: int, reference_id: str):
    from crawler.services.scrape_service import scrape_page
    from backend.tasks import process_qsource
    from .models import CrawlLink

    current_stamped_headers = current_task.request.stamped_headers or []
    current_stamps = {
        header: current_task.request.stamps.get(header)
        for header in current_stamped_headers
    }
    try:
        crawl_link = CrawlLink.objects.get(pk=crawl_link_id)
        scrape_page(
            content_type=content_type,
            url=url,
            crawl_link=crawl_link,
            reference_id=reference_id,
            processing_task=process_qsource,
            stamps=current_stamps  # Pass context forward
        )
    except Exception as e:
        logger.error(f"Error in scrape task for link ID {crawl_link_id}: {str(e)}")


@shared_task(queue="rag")
@scopes_disabled()
def rag_end(crawl_link_id: int):
    from .models import CrawlLink
    from django.utils import timezone
    try:
        link = CrawlLink.objects.get(pk=crawl_link_id)
        # Task could have been called twice in theory (from spider's close event and user's button press in backend)
        # -> avoiding second change of last_crawl_end
        if link.crawling_status != CrawlingStatus.PENDING:
            link.last_crawl_end = timezone.now()
            link.crawling_status = CrawlingStatus.PENDING
            link.save()
    except CrawlLink.DoesNotExist:
        logger.error(f"CrawlLink {crawl_link_id} not found in end_of_crawl task")


@shared_task(queue="crawler") # put in crawler queue to terminates the rag after all entries in crawler queue are done
def end_of_crawl(crawl_link_id: int):
    rag_end.delay(crawl_link_id)


@shared_task(queue="main")
@scopes_disabled()
def insert_crawl_links_for_deletion_check():
    from .models import CrawlLink
    links = CrawlLink.objects.all()

    for link in links:
        if link.deletion_timeout != 0:
            check_crawl_link_resources_for_deletion.delay(link.id, link.knowledgebase.id, link.deletion_timeout,
                                                          False)


@shared_task(queue="main")
@scopes_disabled()
def check_crawl_link_resources_for_deletion(crawl_link_id: str, knowledgebase_id: int, deletion_timeout: int):
    from backend.services.mongo_service import MongoService
    from backend.tasks import delete_qsource

    mongo = MongoService()
    query = {
        'crawl_link_id': crawl_link_id,
        'last_crawled': {"$lt": datetime.datetime.now()-datetime.timedelta(days=deletion_timeout)}
    }
    try:
        docs = mongo.get_rag_data(knowledgebase_id, query)
        deleted_ids: list[ObjectId] = []
        for doc in docs:
            delete_qsource(knowledgebase_id, str(doc['_id']))
            deleted_ids.append(doc['_id'])
        result = mongo.delete_many_rag_data(knowledgebase_id, query)
        logger.info(f"Deleted {result.deleted_count} documents.")
    except Exception as e:
        logger.warning(f"Error while deleting Resources: {str(e)}")
    finally:
        mongo.close()


@shared_task(queue="crawler")
@scopes_disabled()
def delete_dangling_mongo_resources():
    from .models import CrawlLink
    from backend.services.mongo_service import MongoService
    mongo = MongoService()
    try:
        # Get all CrawlLinks and group by knowledgebase
        links = CrawlLink.objects.all().select_related('knowledgebase')
        kb_groups = {}
        for link in links:
            if link.knowledgebase.id:
                if link.knowledgebase.id not in kb_groups:
                    kb_groups[link.knowledgebase.id] = []
                kb_groups[link.knowledgebase.id].append(link.url)

        # Process each knowledgebase separately
        for kb_id, urls in kb_groups.items():
            regex_patterns = [f'^{re.escape(url)}' for url in urls]
            query = {'url': {'$not': {'$regex': '|'.join(regex_patterns)}}}
            result = mongo.get_rag_data(kb_id, query)
            ids_to_delete = [doc['_id'] for doc in result]
            if ids_to_delete:
                result = mongo.delete_many_rag_data(kb_id, {'_id': {'$in': ids_to_delete}})
                logger.info(f"Deleted {result.deleted_count} dangling documents for knowledgebase {kb_id}")
    finally:
        mongo.close()


@shared_task(queue="main")
@scopes_disabled()
def crawl_periodically():
    from crawler.models import CrawlLink
    from crawler.services.crawl_control import CrawlManager
    from django.utils import timezone

    for link in CrawlLink.objects.all():
        if link.last_crawl_end is None:
            continue  # continue if no initial crawl was started to allow for proper configuration first
        if timezone.now() > link.last_crawl_end + datetime.timedelta(
                days=link.crawl_interval) and link.crawl_interval > 0:
            result = CrawlManager.start_crawl(link.id)
            logger.info(result)
