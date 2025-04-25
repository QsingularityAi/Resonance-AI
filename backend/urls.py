"""djangoHeroku URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.views.static import serve
from rest_framework import routers
from django.conf.urls.static import static
from django.conf import settings
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from django.views.generic import TemplateView
from django.views.decorators.cache import never_cache

from backend.utils.benchmark import download_pdf

from .stats.views import StatsProxyView
from django.urls import re_path

from . import views

router = routers.DefaultRouter()

def trigger_error(request):
    division_by_zero = 1 / 0

urlpatterns = [
    # http://localhost:8000/
    path('', views.index, name='index'),
    # http://localhost:8000/api/
    path('api/', include([
        # Include router URLs
        path('', include(router.urls)),
        # Include your custom API URLs
        path('', include('backend.api.urls')),
        # DRF browsable API
        path('explorer/', include('rest_framework.urls', namespace='rest_framework')),
        #crawler routes
        path('', include('crawler.urls'))
    ])),

    path('', include('demo.urls')),

    path('admin/sentry-debug/', trigger_error),

    re_path(r'admin/stats/(?P<path>.*)', StatsProxyView.as_view(), name='stats'),
    path(r'ht/', include('health_check.urls')),
    re_path(r'^api/media/(?P<path>.*)$', serve, {
        'document_root': settings.MEDIA_ROOT,
    }),

    # http://localhost:8000/admin/
    path('admin/', admin.site.urls),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

if settings.DEBUG:
    urlpatterns += [
        path('doc/', SpectacularAPIView.as_view(), name='schema'),
        # Optional UI:
        path('doc/swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
        path('doc/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
        path('benchmark/download/<str:filename>/', download_pdf, name='download_pdf'),

    ]
