import asyncio
import logging
import re

from bson import ObjectId
from celery.utils.log import get_task_logger
from crawl4ai import AsyncWebCrawler, CrawlResult, CrawlerRunConfig
from crawl4ai.async_crawler_strategy import AsyncPlaywrightCrawlerStrategy
from crawl4ai.markdown_generation_strategy import DefaultMarkdownGenerator
from crawl4ai.content_filter_strategy import PruningContentFilter
from django.conf import settings
from playwright.async_api import Page, BrowserContext

from hw_rag.dataclasses import QSource, QSourceType, QSourceOrigin, QSourceOriginType
from backend.services.mongo_service import MongoService
from crawler.models import CrawlLink

logger = get_task_logger(__name__)
logger.setLevel(logging.INFO)


class WebScraper:
    def __init__(self, url: str, content_type: str, crawl_link: CrawlLink, reference_id: str, processing_task,
                 stamps=None):
        self.url = url
        self.content_type = content_type
        self.reference_id = ObjectId(reference_id)
        self.crawl_link = crawl_link
        self.processing_task = processing_task
        self.mongo = MongoService()
        self.stamps = stamps or {}
        self.collection = f"{settings.CRAWLER_RESULT_COLLECTION_NAME}_{self.crawl_link.knowledgebase.id}"



    def __del__(self):
        self.mongo.close()

    def scrape(self):
        if self.content_type == QSourceType.PDF:
            self._save_content()
        elif self.content_type == QSourceType.WEBSITE:
            asyncio.run(self._scrape_website())
        else:
            logger.warning(f"Unsupported content type: {self.content_type}")

    async def _scrape_website(self):
        crawler_strategy = AsyncPlaywrightCrawlerStrategy(verbose=False, cookies=self.crawl_link.cookies)
        crawler_strategy.set_hook('before_return_html', self._process_html_hook)

        async with AsyncWebCrawler(crawler_strategy=crawler_strategy) as crawler:
            run_config = CrawlerRunConfig(
                css_selector=self.crawl_link.content_selector if self.crawl_link else None,
                excluded_tags=["form", "nav"],  # Remove entire tag blocks
                remove_forms=True,  # Specifically strip <form> elements
                remove_overlay_elements=True,  # Attempt to remove modals/popups
                exclude_social_media_links=True,
            )

            result = await crawler.arun(
                url=self.url,
                config=run_config
            )
            if result.success:
                self._save_website_content(result)
            else:
                logger.error(f"Failed to scrape website: {self.url}: {result.error}")
                self._save_website_content_error()

    async def _process_html_hook(self, page: Page, context: BrowserContext, html: str, **kwargs):
        try:
            if self.crawl_link:
                if self.crawl_link.excluded_selectors is None:
                    return page
                excluded_selectors = self.crawl_link.excluded_selectors.split(";")
                for selector in excluded_selectors:
                    await page.evaluate(f"document.querySelectorAll('{selector}').forEach(el => el.remove());")
        except Exception as e:
            logger.error(f"Error processing html: {e}| {str(e)}")
        return page

    def convert_bold_to_headings(self, markdown_text):
        lines = markdown_text.split('\n')
        current_parent_level = 0
        section_bold_lines = []
        modified_lines = lines.copy()

        # First pass: find the parent heading level
        for i, line in enumerate(lines):
            if line.startswith('#'):
                # Count the actual number of # at the start
                level = 0
                for char in line:
                    if char == '#':
                        level += 1
                    else:
                        break

                if level > current_parent_level:
                    current_parent_level = level

            # Check for standalone bold lines
            stripped = line.strip()
            if (stripped.startswith('**') and
                    stripped.endswith('**') and
                    len(stripped) > 4 and  # Must have content
                    len(stripped) == len(line.strip())):  # Must be alone on line
                section_bold_lines.append(i)

        # Convert bold lines if we have at least 2
        if len(section_bold_lines) >= 2:
            for bold_index in section_bold_lines:
                text = lines[bold_index].strip()[2:-2]  # Remove ** markers
                # Create heading one level deeper than parent
                modified_lines[bold_index] = "\n" + '#' * (current_parent_level + 1) + ' ' + text

        return '\n'.join(modified_lines)

    @staticmethod
    def convert_to_absolute_urls(markdown_content, base_url):
        """
        Converts relative links and image sources in markdown content to absolute paths.

        Args:
        - markdown_content: The markdown content as a string.
        - base_url: The base URL to prepend to relative links.

        Returns:
        - Updated markdown content with absolute URLs.
        """
        # Pattern to match markdown links and images
        md_link_pattern = re.compile(r'(!?\[.*?]\()(/.*?)(\))')

        def replace_relative_url(match):
            # Check if it's a relative URL (starts with '/')
            if match.group(2).startswith('/'):
                # Prepend base_url to make the URL absolute
                return match.group(1) + base_url + match.group(2) + match.group(3)
            else:
                # Return the original match if it's not a relative URL
                return match.group(0)

        # Replace all relative URLs in markdown content
        updated_content = re.sub(md_link_pattern, replace_relative_url, markdown_content)

        return updated_content

    def _save_website_content_error(self):
        # Update the document with the new error count
        self.mongo.update_rag_data(
            self.crawl_link.knowledgebase.id,
            {"_id": self.reference_id},
            {"content": "error.1"}
        )

    def _save_website_content(self, result: CrawlResult):
        markdown_content = self.convert_to_absolute_urls(result.markdown, self.crawl_link.url)
        markdown_content = self.convert_bold_to_headings(markdown_content)
        content = {
            'content': markdown_content,
            'created': result.metadata['published_date'] if 'published_date' in result.metadata else None
        }
        self._save_content(content, result)


    def _save_content(self, content: dict = None, result: CrawlResult = None):
        if content:
            if self.content_type == QSourceType.WEBSITE:
                # Get existing document
                existing_doc = self.mongo.get_one_rag_data(self.crawl_link.knowledgebase.id, {"_id": self.reference_id})

                # Return early if _parsed_ content hasn't changed
                if existing_doc and existing_doc.get('content') == content.get('content'):
                    logger.warning(
                        f'Duplicate content: website markdown content after parsing is the same, wont queue rag worker job '
                        f'(url={self.url}, reference_id={self.reference_id}).')
                    return

            self.mongo.update_rag_data(self.crawl_link.knowledgebase.id, {"_id": self.reference_id}, content)

        source = QSource(
            url=self.url,
            source_type=QSourceType.from_str(self.content_type),
            source_origin=QSourceOrigin(
                type=QSourceOriginType.CRAWLER,
                id=self.crawl_link.id
            ),
            title=result.metadata["title"] if result else None,
            create_date=None,
            reference_id=str(self.reference_id),
        )
        task_kwargs = {
            'knowledgebase_id': self.crawl_link.knowledgebase.id,
            'source': source.model_dump()
        }
        if self.stamps:
            self.processing_task.apply_async(
                kwargs=task_kwargs,
                stamped_headers=list(self.stamps.keys()),
                **self.stamps
            )
        else:
            self.processing_task.apply_async(
                kwargs=task_kwargs
            )


def scrape_page(content_type: str, url: str, crawl_link: CrawlLink, reference_id: str, processing_task, stamps=None):
    scraper = WebScraper(
        url,
        content_type,
        crawl_link,
        reference_id,
        processing_task,
        stamps
    )
    scraper.scrape()
