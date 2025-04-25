from django.db import models
from django.utils.translation import gettext_lazy as _


class CrawlingStatus(models.TextChoices):
    PENDING = 'pending', _('Pending')
    STARTED = 'started', _('Started')
    STOPPING = 'stopping', _('Stopping')
