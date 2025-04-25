from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied
import logging

logger = logging.getLogger(__name__)


def check_crawllink_permission(user, crawl_link_id: int, action: str) -> bool:
    if not user.has_perm(f'crawler.{action}_crawllink'):
        return False
    return True


@login_required
def start_crawl(request, crawl_link_id: int):
    if not check_crawllink_permission(request.user, crawl_link_id, 'change'):
        raise PermissionDenied("You don't have permission to start crawls")

    from .services.crawl_control import CrawlManager
    result = CrawlManager.start_crawl(crawl_link_id)
    return JsonResponse(result)


@login_required
@require_POST
def stop_crawl(request, crawl_link_id: int):
    if not check_crawllink_permission(request.user, crawl_link_id, 'change'):
        raise PermissionDenied("You don't have permission to stop crawls")

    from .services.crawl_control import CrawlManager
    result = CrawlManager.stop_crawl(crawl_link_id)
    return JsonResponse(result)
