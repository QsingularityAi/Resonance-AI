import urllib
from django.conf import settings
from django.utils.decorators import method_decorator
from django.views.decorators.clickjacking import xframe_options_exempt

from revproxy.views import ProxyView
from django.contrib.auth.mixins import LoginRequiredMixin

# enable iframe embeddable for this route
@method_decorator(xframe_options_exempt, name='dispatch')
class StatsProxyView(LoginRequiredMixin, ProxyView):
    upstream = settings.MATOMO_ENDPOINT
    add_x_forwarded = True

    def get_encoded_query_params(self):
        encoded_query_params = super(StatsProxyView, self).get_encoded_query_params()

        encoded_query_params += '&%s' % urllib.parse.urlencode({
            'token_auth': settings.MATOMO_TOKEN,
            'idSite': settings.MATOMO_SITE_ID
        })

        return encoded_query_params