from ..tasks import spider_task, end_of_crawl
from ..models import CrawlLink
import logging
from backend.celery import app
from django.utils import timezone
from ..dataclasses import CrawlingStatus

logger = logging.getLogger(__name__)


class CrawlManager:
    @staticmethod
    def start_crawl(crawl_link_id: int) -> dict:
        crawl_link = CrawlLink.objects.get(pk=crawl_link_id)
        # Skip if crawling was already initiated (either by periodic task or manual backend trigger)
        if crawl_link.crawling_status in [CrawlingStatus.STARTED, CrawlingStatus.STOPPING]:
            message = f'Crawl {crawl_link.crawling_status} for link ID {crawl_link_id} already '
            logger.info(message)
            return {'status': message}

        crawlingdate = timezone.now()
        crawl_link.last_crawl_start = crawlingdate
        crawl_link.crawling_status = CrawlingStatus.STARTED
        crawl_link.save()
        task_params = {'crawl_link_id': crawl_link_id}
        task = spider_task.apply_async(
            kwargs=task_params,
            stamped_headers=['crawl_run'],
            crawl_run=str(crawlingdate)
        )
        return {'status': f'Crawl started for link ID {crawl_link_id}'}


    @staticmethod
    def stop_crawl(crawl_link_id: int) -> dict:  # Removed @require_POST and request parameter
        try:
            logger.debug(f"Received stop request for crawl_link_id: {crawl_link_id}")
            crawl_link = CrawlLink.objects.get(pk=crawl_link_id)

            if not crawl_link.last_crawl_start:
                logger.error(f"No last_crawl_start found for crawl_link {crawl_link_id}")
                return {
                    'status': 'error',
                    'message': 'No active crawl found to stop'
                }

            result = app.control.revoke_by_stamped_headers(
                {'crawl_run': [str(crawl_link.last_crawl_start)]},
                terminate=True,
                signal='SIGKILL',
            )
            logger.info(f"[STOP] Active tasks after revocation: {result}")

            crawl_link.crawling_status = CrawlingStatus.STOPPING
            crawl_link.save()
            # Gets called to ensure correct database settings (end of crawl etc.,
            # as with normal stoppage after all tasks are done):
            end_of_crawl.apply_async(
                kwargs={'crawl_link_id': crawl_link_id},
                countdown=10
            )
            return {'status': 'success'}

        except Exception as e:
            logger.error(f"Error in stop_crawl: {str(e)}")
            return {'status': 'error', 'message': str(e)}