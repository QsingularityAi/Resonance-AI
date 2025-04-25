import json
import logging

from django.db import models
from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver

from backend.api.models import Knowledgebase, Tenant
from crawler.dataclasses import CrawlingStatus
from crawler.tasks import check_crawl_link_resources_for_deletion
from django.utils.translation import gettext_lazy as _
from django_scopes.manager import ScopedManager

logger = logging.getLogger(__name__)


class CrawlLink(models.Model):
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='crawl_links'  # Use plural model name
    )
    url = models.URLField(
        unique=False,
        verbose_name=_('Website-URL')
    )
    knowledgebase = models.ForeignKey(
        Knowledgebase,  # Adjusted to reference the Knowledgebase model from another app
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_('Knowledgebase')
    )
    deep_crawl = models.BooleanField(
        default=True, null=False,
        help_text=_("Crawl the entire page or only the provided link"),
        verbose_name=_('Deep Crawl')
    )
    crawl_interval = models.IntegerField(
        null=False, default=0,
        blank=False,
        help_text=_("Time (in days) after which an already crawled resource is crawled again.\n The value '0' disables recrawling. The crawling interval  needs to be less than the delete intervall"),
        verbose_name=_('Crawling interval')
    )
    deletion_timeout = models.IntegerField(
        null=False,
        default=0,
        blank=False,
        help_text=_("Time (in days) after which an already crawled resource is deleted.\n The value '0' disables resource deletion"),
        verbose_name=_('Delete missing resources after days')
    )
    last_crawl_start = models.DateTimeField(
        null=True,
        blank=True,
        help_text=_("The date and time the link was last cralwed"),
        verbose_name=_('Last Crawl Start')
    )
    last_crawl_end = models.DateTimeField(
        null=True,
        blank=True,
        help_text=_("The date and time the last crawl finished"),
        verbose_name=_('Last Crawl End')
    )
    number_of_resources_processed = models.IntegerField(
        null=True,
        blank=True,
        help_text=_("The number of resources found in the crawl"),
        verbose_name=_('Number of Resources Processed')
    )

    custom_cookies = models.JSONField(
        default=list,
        null=True,
        blank=True,
        verbose_name=_('Custom Cookies'),
        help_text=_('Pre-set cookies, each a dict like {"name": "session", "value": "...", "url": "..."}')
    )
    blacklist_patterns = models.JSONField(
        default=list,
        null=True,
        blank=True,
        help_text=_("List of URL patterns to exclude from crawling (e.g. ['/blog/*', '/private/*'])"),
        verbose_name=_('Blacklisted URL Patterns')
    )

    content_selector = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        help_text=_("A selector in which webpage content is found; For Example Typo3 '#main'-selector"),
        verbose_name=_('Content Selector')
    )
    excluded_selectors = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        help_text=_("A comma-separated list of selectors, to be removed before content processing"),
        verbose_name=_('Excluded Selectors')
    )
    crawling_status = models.CharField(
        max_length=10,
        choices=CrawlingStatus.choices,
        default=CrawlingStatus.PENDING,
        verbose_name=_('Crawling Status')
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Created At')
    )

    objects = ScopedManager(tenant="tenant")

    @property
    def cookies(self) -> list[dict]:
        return self.custom_cookies if self.custom_cookies is not None else []

    def clean(self):
        """
        Validates URLs before saving to ensure uniqueness regardless of trailing slashes.
        Prevents duplicate URLs in the database while providing user-friendly error messages
        in the Django admin interface.

        Also validates the JSON structure of custom_cookies and blacklist_patterns.
        """
        from django.core.exceptions import ValidationError
        from django.utils.translation import gettext_lazy as _


        # Validate custom_cookies structure
        if self.custom_cookies:
            if not isinstance(self.custom_cookies, list):
                raise ValidationError({
                    'custom_cookies': _('Custom Cookies müssen als Liste formatiert sein.')
                })

            for cookie in self.custom_cookies:
                if not isinstance(cookie, dict):
                    raise ValidationError({
                        'custom_cookies': _('Jedes Cookie muss ein Dictionary sein.')
                    })

                required_keys = ['name', 'value', 'url']
                for key in required_keys:
                    if key not in cookie:
                        raise ValidationError({
                            'custom_cookies': _(f'Jedes Cookie muss die Schlüssel "{key}" enthalten.')
                        })

        # Validate blacklist_patterns structure
        if self.blacklist_patterns:
            if not isinstance(self.blacklist_patterns, list):
                raise ValidationError({
                    'blacklist_patterns': _('Blacklist-Muster müssen als Liste formatiert sein.')
                })

            for pattern in self.blacklist_patterns:
                if not isinstance(pattern, str):
                    raise ValidationError({
                        'blacklist_patterns': _('Jedes Blacklist-Muster muss ein String sein.')
                    })


    class Meta:
        verbose_name = _('Crawl Link')
        verbose_name_plural = _('Crawl Links')
        db_table = 'crawl_links'


@receiver(post_delete, sender=CrawlLink)
def delete_crawl_link_resources(sender, instance, **kwargs):
    check_crawl_link_resources_for_deletion.delay(
        instance.url,
        instance.knowledgebase.id,
        instance.deletion_timeout,
        True
    )
    logger.info("remove resources from crawl link")


@receiver(pre_save, sender=CrawlLink)
def save_crawl_link_resources(sender, instance, **kwargs):

    instance.url = instance.url.rstrip('/')

    if 0 < instance.crawl_interval >= instance.deletion_timeout > 0:
        instance.crawl_interval = instance.deletion_timeout - 1

    if instance.deletion_timeout < 0:
        instance.deletion_timeout = 0

    if instance.crawl_interval < 0:
        instance.crawl_interval = 0

    logger.info("automatically set intervalls to allowed values")


