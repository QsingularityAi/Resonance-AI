from django.db import models
from django.utils.translation import gettext_lazy as _


class Language(models.TextChoices):
    DE = 'de', _('German')
    EN = 'en', _('English')
    TR = 'tr', _('Turkish')
    RU = 'ru', _('Russian')
    AR = 'ar', _('Arabic')
