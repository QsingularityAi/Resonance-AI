import logging

import crochet
from scrapy.crawler import CrawlerRunner
from scrapy.utils.log import configure_logging
from scrapy.utils.project import get_project_settings
from twisted.internet import defer

from celery.utils.log import get_task_logger

from crawler.models import CrawlLink
from crawler.spiders import WebsiteSpider

logger = get_task_logger(__name__)
logger.setLevel(logging.INFO)

logger = get_task_logger(__name__)
logger.setLevel(logging.INFO)

crochet.setup()
@crochet.run_in_reactor
def discover(crawl_link_id:int, scrape_task, end_of_crawl_task, task_kwargs=None, stamps=None):
    configure_logging()
    settings = get_project_settings()
    settings.set("CONCURRENT_REQUESTS", 4)

    runner = CrawlerRunner(settings)

    @defer.inlineCallbacks
    def crawl():
        yield runner.crawl(
            WebsiteSpider,
            crawl_link_id=crawl_link_id,
            scrape_task=scrape_task,
            end_of_crawl_task=end_of_crawl_task,
            task_kwargs=task_kwargs,
            stamps=stamps
        )

    return crawl()


