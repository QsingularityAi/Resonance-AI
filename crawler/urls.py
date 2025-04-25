from django.urls import path

from .views import start_crawl, stop_crawl

urlpatterns = [
    path('crawler/<int:crawl_link_id>/start/', start_crawl, name='start_crawl'),
    path('crawler/<int:crawl_link_id>/stop/', stop_crawl, name='stop_crawl'),
]
