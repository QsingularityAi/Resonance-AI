from django.conf import settings
from django.core.cache import cache
from extra_settings.models import Setting
import logging

logger = logging.getLogger(__name__)

JAZZMIN_MAPPING = {
    'JAZZMIN_SITE_TITLE': 'site_title',
    'JAZZMIN_LOGIN_LOGO': 'login_logo',
    'JAZZMIN_SITE_LOGO': 'site_logo',
    'JAZZMIN_WELCOME_SIGN': 'welcome_sign',
    'JAZZMIN_SITE_ICON': 'site_icon',
    'JAZZMIN_SITE_HEADER': 'site_header',
    'JAZZMIN_SITE_BRAND': 'site_brand',
    'JAZZMIN_COPYRIGHT': 'copyright',
}

def update_jazzmin_settings(setting_instance=None):
    """
    Update Jazzmin settings either for all mapped settings or a single instance
    """
    try:
        jazzmin_updates = cache.get('jazzmin_settings') or {}

        # Always fetch settings if cache is empty or we're updating a single setting
        if not jazzmin_updates or setting_instance:
            extra_settings = Setting.objects.filter(
                name__in=JAZZMIN_MAPPING.keys()
            ).values(
                'name',
                'value_type',
                'value_bool',
                'value_date',
                'value_datetime',
                'value_decimal',
                'value_email',
                'value_file',
                'value_float',
                'value_image',
                'value_int',
                'value_string',
                'value_text',
                'value_time',
                'value_url',
                'value_duration',
                'value_json'
            )

            jazzmin_updates = {
                JAZZMIN_MAPPING[setting['name']]: setting[f'value_{setting["value_type"]}']
                for setting in extra_settings
            }

            cache.set('jazzmin_settings', jazzmin_updates, 300)

        settings.JAZZMIN_SETTINGS.update(jazzmin_updates)

    except Exception as e:
        logger.error(f"Failed to update Jazzmin settings: {e}")