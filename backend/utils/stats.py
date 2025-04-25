from django.conf import settings
from piwikapi.tracking import PiwikTracker

import urllib.parse
import logging

class HwPiwikTracker(PiwikTracker):
    def __init__(self, api_url, id_site, conversation_id, request):
        super().__init__(id_site, request)
        self.set_api_url(api_url)
        self.set_user_id(conversation_id)
        self.logger = logging.getLogger(__name__)
    def _get_request(self, id_site):
        self.set_url("")
        super()._get_request(id_site)
        url = super()._get_request(id_site)
        if self.user_id:
            url += '&%s' % urllib.parse.urlencode({'uid': self.user_id})
        return url
    def set_user_id(self, user_id):
        self.user_id = user_id
    def _send_request(self, url):
        self.logger.debug(f"Matomo: {url}")
        super()._send_request(url)

    # @see https://developer.matomo.org/api-reference/tracking-api#optional-event-tracking-info
    # e_c — The event category. Must not be empty. (eg. Videos, Music, Games...)
    # e_a — The event action. Must not be empty. (eg. Play, Pause, Duration, Add Playlist, Downloaded, Clicked...)
    # e_n — The event name. (eg. a Movie name, or Song name, or File name...)
    # e_v — The event value. Must be a float or integer value (numeric), not a string.
    def __get_url_track_event(self, action):
        url = self._get_request(self.id_site)
        url += '&%s' % urllib.parse.urlencode({
            'e_c': 'Chat',
            'e_a': action,
            #'e_n': '',
            #'e_v': '',
        })
        return url
    def do_track_event(self, action):
        url = self.__get_url_track_event(action)
        return self._send_request(url)

def track_stats(request, conversation_id, action):
    pt = HwPiwikTracker(settings.MATOMO_ENDPOINT + "/matomo.php", settings.MATOMO_SITE_ID, conversation_id, request)
    pt.do_track_event(action)

def track_new_message(request, conversation_id):
    track_stats(request,conversation_id, "neue Nachricht")

def track_like(request, conversation_id):
    track_stats(request,conversation_id, "Like")

def track_dislike(request, conversation_id):
    track_stats(request,conversation_id, "Dislike")