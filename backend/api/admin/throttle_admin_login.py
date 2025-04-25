from rest_framework.throttling import AnonRateThrottle
from django.contrib.auth import views as auth_views
from django.utils.translation import gettext_lazy as _
from django.contrib import admin
from logging import getLogger
logger = getLogger(__name__)


class AdminLoginRateThrottle(AnonRateThrottle):
    rate = '10/hour'
    scope = 'admin_login'
    def get_cache_key(self, request, view):
        # Override to ensure localhost is not treated specially
        return self.cache_format % {
            'scope': self.scope,
            'ident': self.get_ident(request)
        }


class ThrottledLoginView(auth_views.LoginView):
    template_name = 'admin/login.html'

    def post(self, request, *args, **kwargs):
        throttle = AdminLoginRateThrottle()
        if not throttle.allow_request(request, self):
            form = self.get_form()
            form.add_error(None, _("Too many login attempts. Please try again later."))
            return self.form_invalid(form)
        return super().post(request, *args, **kwargs)

# Override the default admin login view
admin.site.login = ThrottledLoginView.as_view()