""" Production Settings """

from .base import *

############
# SECURITY #
############

DEBUG = bool(os.getenv('DJANGO_DEBUG', 0))

# Host settings
ALLOWED_HOSTS = [
    'localhost',
] + CHATBOT_HOSTS

# CSRF settings (with protocols)
CSRF_TRUSTED_ORIGINS = [
    *[f"https://{domain}" for domain in CHATBOT_HOSTS],
]

# CORS settings (with protocols)
CORS_ALLOWED_ORIGINS = [
    *[f"https://{domain}" for domain in CHATBOT_HOSTS],
    *[f"https://{domain}" for domain in WEBSITE_HOSTS],
    'http://localhost:3001',
    'http://localhost:3000'
]

CORS_ALLOWED_ORIGIN_REGEXES = [
    r'^https://.+\.pages\.dev$',
]

base_logging = LOGGING.copy()
base_logging['loggers'].update({
    "django.server": {  # Make sure this logger is explicitly defined
        "handlers": ["console"],
        "level": "INFO",
        "filters": ['exclude_health_check'],
        "propagate": False,
    },
    "backend.api": {
        "handlers": ["console"],
        "level": "INFO",
        "propagate": False,
    },
    "hw_rag": {
        "handlers": ["console"],
        "level": "INFO",
        "propagate": False,
    },
    'httpx': {
        'handlers': ["console"],
        'level': 'WARNING',  # This will silence INFO messages
        'propagate': False,
    },
})

LOGGING = base_logging
