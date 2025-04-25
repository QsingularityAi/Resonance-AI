import hashlib
import logging
import random
import re
from datetime import datetime, timezone
from typing import Any
from urllib.parse import urlparse

import scrapy
from bs4 import BeautifulSoup
from bson import ObjectId
from celery.utils.log import get_task_logger

from scrapy.http import Response
from scrapy.linkextractors import LinkExtractor
from hw_rag.dataclasses import QSourceType
from backend.services.mongo_service import MongoService
from .models import CrawlLink
from django_scopes import scopes_disabled
from os.path import splitext

logger = get_task_logger(__name__)
logger.setLevel(logging.INFO)
logging.getLogger('pymongo').setLevel(logging.INFO)


class LinkValidator:
    @staticmethod
    def is_valid_internal_link(link: str, blacklist_patterns: list[str] = None) -> bool:
        if not link or link.startswith('#'):
            return False

        # Only these extensions are allowed
        allowed_extensions = ['.html', '.htm', '.php', '.asp', '.aspx', '.jsp', '.pdf', '']
        invalid_substrings = [".js", ".css"]

        parsed_url = urlparse(link)
        root, ext = splitext(parsed_url.path)
        # Extract extension (handle paths with no extension)
        # If it's not an allowed extension, reject it
        if ext not in allowed_extensions:
            return False

        # Check blacklist patterns
        if blacklist_patterns:
            patterns = [p.strip() for p in blacklist_patterns if p.strip()]
            for pattern in patterns:
                pattern = pattern.replace('*', '.*')
                if pattern.startswith('http'):
                    if re.match(pattern, link):
                        return False
                else:
                    if re.search(pattern, link):
                        return False

        # Check for invalid substrings
        return not any(substring in link.lower() for substring in invalid_substrings)


class WebsiteSpider(scrapy.Spider):
    name = 'website_spider'
    filename_regex = re.compile(r'filename[^;\n]*=(UTF-\d[\'"]*)?(([\'"]).*?\3|[^;\n]*)?')

    @scopes_disabled()
    def __init__(self, crawl_link_id: int, scrape_task, end_of_crawl_task, task_kwargs=None, stamps=None, *args, **kwargs):
        super(WebsiteSpider, self).__init__(*args, **kwargs)

        self.crawl_link = CrawlLink.objects.get(id=crawl_link_id)
        self.start_urls = [self.crawl_link.url]
        self.knowledgebase_id = self.crawl_link.knowledgebase.id
        self.scrape_task = scrape_task
        self.end_of_crawl_task = end_of_crawl_task
        self.number_of_processed_pages = 0
        self.processed_urls = set()
        self.allowed_domains = [urlparse(self.crawl_link.url).netloc]
        self.task_kwargs = task_kwargs or {}
        self.stamps = stamps or {}
        self.mongo = MongoService()
        ignored_extensions = set(scrapy.linkextractors.IGNORED_EXTENSIONS) - {'pdf'}
        self.link_extractor = LinkExtractor(
            allow_domains=self.allowed_domains,
            deny_extensions=ignored_extensions
        )

    def parse(self, response: Response, **kwargs: Any) -> Any:
        duplicate, reference_id, source_type, checksum = self._check_for_duplicates(response)
        links = self.link_extractor.extract_links(response) if source_type == QSourceType.WEBSITE else []

        if duplicate:
            logger.info(f"found duplicate Resource: {response.url} | type: {source_type} | checksum: {checksum}")
            self._save_discovered_document(response, source_type, duplicate, reference_id, checksum)
        else:
            if source_type == QSourceType.WEBSITE:
                ref_id = self._save_discovered_document(response, source_type, duplicate, reference_id, checksum)
                self._increment_and_scrape(response.url, QSourceType.WEBSITE, ref_id)

            if source_type == QSourceType.PDF:
                filename = self.get_filename_from_response(response)
                if filename:
                    new_rsp = response.replace(url=f"{response.url}#{filename}")
                    ref_id = self._save_discovered_document(new_rsp, source_type, duplicate, reference_id, checksum)
                    self.processed_urls.add(f"{response.url}#{filename}")
                else:
                    ref_id = self._save_discovered_document(response, source_type, duplicate, reference_id, checksum)
                    self.processed_urls.add(f"{response.url}")
                self._increment_and_scrape(f"{response.url}#{filename}" if filename else response.url, QSourceType.PDF, ref_id)

        if self.crawl_link.deep_crawl:
            for link in links:
                full_url = link.url
                if full_url not in self.processed_urls and not link.nofollow:
                    self.processed_urls.add(full_url)
                    yield from self._process_link(full_url)

    def get_filename_from_response(self, response):
        content_disposition = response.headers.get('Content-Disposition', '').decode('utf-8', 'ignore').lower()
        match = self.filename_regex.search(content_disposition)
        filename = None
        if match:
            filename = match.group(2)
            filename = filename.strip('\'"')
        return filename

    def _check_for_duplicates(self, response: Response) -> tuple[bool, str | None, QSourceType, str]:
        if not response.body:
            raise ValueError("Response body is empty")

        filename = None
        source_type = self._get_source_type_from_rsp(response)
        if source_type == QSourceType.PDF:
            md5_body = hashlib.md5(response.body).hexdigest()
            filename = self.get_filename_from_response(response)
        elif source_type == QSourceType.WEBSITE:
            soup = BeautifulSoup(response.body, 'html.parser')
            selector = self.crawl_link.content_selector.replace("#","") if self.crawl_link.content_selector else None
            content = soup.find(id=selector) if selector else soup
            if content is None:
                content = soup
            md5_body = hashlib.md5(content.get_text(strip=True).encode('utf-8')).hexdigest()
        else:
            raise ValueError(f'Unexpected source type')

        doc = self.mongo.get_one_rag_data(self.knowledgebase_id, {"url": f"{response.url}#{filename}" if filename else response.url})
        if not doc:
            self.number_of_processed_pages += 1
            # Resource does not exist. Return and continue normally.
            return False, None, source_type, md5_body

        # Check if the document was modified
        if doc["content"] == "error.1":
            if random.randint(1, 100) > 5:
                return True, doc["_id"], source_type, md5_body
            return False, doc["_id"], source_type, md5_body

        if doc['content'] is None and doc['md5'] is not None:
            return False, doc["_id"], source_type, md5_body  # requeue if content ist empty, sign of error in processing

        if ((doc.get('last_processed') is not None and doc.get('last_crawled') is not None and
             doc.get('last_processed') < doc.get('last_crawled'))  # requeue if processing is still pending
                or doc.get('md5') == md5_body):  # or checksum has changed
            return True, doc["_id"], source_type, md5_body

        return False, doc["_id"], source_type, md5_body

    @staticmethod
    def _get_source_type_from_rsp(response: Response) -> QSourceType:
        content_disposition = response.headers.get('Content-Disposition', '').decode('utf-8', 'ignore').lower()
        content_type = response.headers.get('Content-Type', b'').decode('utf-8').lower()
        if 'application/pdf' in content_type:
            return QSourceType.PDF
        if 'attachment' in content_disposition or 'filename=' in content_disposition:
            return QSourceType.PDF
        if response.url.lower().endswith('.pdf'):
            return QSourceType.PDF
        else:
            return QSourceType.WEBSITE

    def _save_discovered_document(self, response: Response, source_type: QSourceType,
                                  duplicate=False, reference_id: ObjectId = None, checksum: str = None) -> str:
        content = {
            'url': response.url,
            'last_crawled': datetime.now(timezone.utc),
            'type': source_type,
            'created': None,
            'md5': checksum,
            'content': None,
            'crawl_link_id': self.crawl_link.id,
        }

        if source_type == QSourceType.PDF:
            content['content'] = checksum

        doc = None
        if reference_id:
            self.mongo.update_rag_data(
                self.knowledgebase_id,
                {"_id": reference_id},  # Assuming _id is present
                {"last_crawled": datetime.now(timezone.utc)} if duplicate else content
            )
        else:
            doc = self.mongo.insert_rag_data(self.knowledgebase_id, content)
        return str(reference_id) if reference_id else str(doc.inserted_id)

    def _process_link(self, full_url: str):
        if LinkValidator.is_valid_internal_link(full_url, self.crawl_link.blacklist_patterns):
            yield scrapy.Request(full_url, callback=self.parse)
        else:
            logger.info(f"skip invalid url {full_url}")

    def _handle_document_link(self, full_url: str, reference_id: str):
        self._increment_and_scrape(full_url, QSourceType.PDF, reference_id)
        yield

    def _increment_and_scrape(self, url: str, content_type: str, reference_id: str):
        task = self.scrape_task.apply_async(
            kwargs={
                'url': url,
                'content_type': content_type,
                'knowledgebase_id': self.knowledgebase_id,
                'crawl_link_id': self.task_kwargs['crawl_link_id'],
                'reference_id': reference_id
            },
            stamped_headers=list(self.stamps.keys()),
            **self.stamps
        )
        pass

    @scopes_disabled()
    def close(self, spider, reason):
        try:
            # Get crawl_link_id from passed kwargs
            crawl_link_id = self.task_kwargs.get('crawl_link_id')
            if not crawl_link_id:
                logger.error("No crawl_link_id found in task_kwargs")
                return super(WebsiteSpider, self).close(spider, reason)
            link = CrawlLink.objects.get(id=crawl_link_id)
            link.number_of_resources_processed = self.number_of_processed_pages
            link.save()
            self.end_of_crawl_task.delay(
                crawl_link_id=crawl_link_id
            )
        except CrawlLink.DoesNotExist:
            logger.error(f"CrawlLink {self.crawl_link.id} not found in close method")
        except Exception as e:
            logger.error(f"Error in close method: {str(e)}")
        finally:
            self.mongo.close()

        return super(WebsiteSpider, self).close(spider, reason)


