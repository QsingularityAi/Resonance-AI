import json
from django import forms
from django.core.exceptions import ValidationError
from django.db.models import ForeignKey, ManyToManyField, OneToOneField
from django.utils.translation import gettext_lazy as _
from django_scopes.forms import SafeModelChoiceField, SafeModelMultipleChoiceField

from backend.api.models import Knowledgebase, Tenant, UserProfile
from crawler.models import CrawlLink
from crawler.widgets import CookieWidget, BlacklistPatternWidget
from django_scopes import scopes_disabled, ScopedManager

def update_safe_field_classes( model_class, existing_field_classes = None ):
    fields = {}
    for f in model_class._meta.get_fields():
        if isinstance( f, ForeignKey ):
            fields[f.name] = SafeModelChoiceField
        elif isinstance( f, ManyToManyField ):
            fields[f.name] = SafeModelMultipleChoiceField
        elif isinstance( f, OneToOneField ):
            fields[f.name] = SafeModelChoiceField
    if existing_field_classes:
        fields.update( existing_field_classes )
    return fields

class CrawlLinkAdminForm(forms.ModelForm):
    """
    Benutzerdefiniertes ModelForm für das CrawlLink-Modell im Admin-Interface.
    Verwendet die benutzerdefinierten Widgets für custom_cookies und blacklist_patterns.
    """

    def __init__(self, *args, **kwargs):
        """
        Initialisiert das Formular.
        """
        super().__init__(*args, **kwargs)
        self.user = self.request.user
        self.user_profile = UserProfile.objects.get(user=self.user)
        if self.user.is_superuser:
            self.fields['tenant'].queryset = Tenant.objects.all()
        self.fields['knowledgebase'].queryset = Knowledgebase.objects.filter(tenant=self.user_profile.tenant) if not self.user.is_superuser else Knowledgebase.objects.all()


    class Meta:
        model = CrawlLink
        fields = '__all__'
        field_classes = update_safe_field_classes(CrawlLink)
        widgets = {
            'custom_cookies': CookieWidget(),
            'blacklist_patterns': BlacklistPatternWidget(),
        }

    def clean_custom_cookies(self):
        """
        Validiert die Struktur der custom_cookies-Daten.
        Stellt sicher, dass es sich um eine Liste von Dictionaries handelt,
        wobei jedes Dictionary die erforderlichen Schlüssel enthält.
        """
        custom_cookies = self.cleaned_data.get('custom_cookies')
        
        if custom_cookies is None:
            return []
        
        if not isinstance(custom_cookies, list):
            raise ValidationError(_('Custom Cookies müssen als Liste formatiert sein.'))
        
        for cookie in custom_cookies:
            if not isinstance(cookie, dict):
                raise ValidationError(_('Jedes Cookie muss ein Dictionary sein.'))
            
            required_keys = ['name', 'value', 'url']
            for key in required_keys:
                if key not in cookie:
                    raise ValidationError(_(f'Jedes Cookie muss den Schlüssel "{key}" enthalten.'))
                
                # Überprüfen, ob die Werte nicht leer sind
                if not cookie[key]:
                    raise ValidationError(_(f'Der Wert für "{key}" darf nicht leer sein.'))
            
            # Überprüfen, ob die URL gültig ist
            try:
                from urllib.parse import urlparse
                result = urlparse(cookie['url'])
                if not all([result.scheme, result.netloc]):
                    raise ValidationError(_('Die URL muss gültig sein (z.B. https://example.com).'))
            except Exception:
                raise ValidationError(_('Die URL muss gültig sein (z.B. https://example.com).'))
        
        return custom_cookies

    def clean_blacklist_patterns(self):
        """
        Validiert die Struktur der blacklist_patterns-Daten.
        Stellt sicher, dass es sich um eine Liste von Strings handelt,
        wobei jeder String ein gültiges URL-Muster ist.
        """
        blacklist_patterns = self.cleaned_data.get('blacklist_patterns')
        
        if blacklist_patterns is None:
            return []
        
        if not isinstance(blacklist_patterns, list):
            raise ValidationError(_('Blacklist-Muster müssen als Liste formatiert sein.'))
        
        for pattern in blacklist_patterns:
            if not isinstance(pattern, str):
                raise ValidationError(_('Jedes Blacklist-Muster muss ein String sein.'))
            
            # Überprüfen, ob das Muster nicht leer ist
            if not pattern:
                raise ValidationError(_('Blacklist-Muster dürfen nicht leer sein.'))
            
            # Überprüfen, ob das Muster gültige Zeichen enthält
            invalid_chars = set(r'<>{}|^`\'"')
            if any(char in pattern for char in invalid_chars):
                raise ValidationError(_('Blacklist-Muster enthalten ungültige Zeichen.'))
        
        return blacklist_patterns