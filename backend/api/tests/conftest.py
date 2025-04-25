# backend/api/tests/conftest.py
from django.conf import settings

def pytest_configure():
    settings.DEPENDENCY_INJECTOR_WIRE_MODULES = []
