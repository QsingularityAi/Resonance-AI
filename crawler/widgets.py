import json
from django import forms
from django.forms.widgets import Widget
from django.utils.safestring import mark_safe
from django.templatetags.static import static


class BlacklistPatternWidget(Widget):
    """
    Ein benutzerdefiniertes Widget zur Verwaltung von Blacklist-Patterns im Admin-Interface.
    Ermöglicht das Hinzufügen, Bearbeiten und Entfernen von URL-Mustern.
    """
    
    class Media:
        css = {
            'all': ('crawler/css/widgets.css',)
        }
        js = ('crawler/js/blacklist_pattern_widget.js',)
    
    def render(self, name, value, attrs=None, renderer=None):
        """
        Rendert das HTML für das Blacklist-Pattern-Widget.
        """
        if value is None:
            value = []
        elif isinstance(value, str):
            try:
                value = json.loads(value)
            except (ValueError, TypeError):
                value = []
        
        # Sicherstellen, dass value eine Liste ist
        if not isinstance(value, list):
            value = []
        
        # Eindeutige ID für das Widget generieren
        final_attrs = self.build_attrs(attrs)
        widget_id = final_attrs.get('id', 'blacklist-pattern-widget')
        
        # HTML für das Widget erstellen
        html = f"""
        <div id="{widget_id}-container" class="blacklist-pattern-widget-container">
            <input type="hidden" name="{name}" id="{widget_id}" value="{json.dumps(value)}">
            <div class="blacklist-pattern-list">
                <div class="blacklist-pattern-header">
                    <label>URL-Muster</label>
                    <span class="blacklist-pattern-actions-header">Aktionen</span>
                </div>
                <div id="{widget_id}-items" class="blacklist-pattern-items">
        """
        
        # Zeilen für vorhandene Patterns hinzufügen
        for i, pattern in enumerate(value):
            html += f"""
                    <div class="blacklist-pattern-item" data-index="{i}">
                        <input type="text" class="blacklist-pattern-input" value="{pattern}"
                               placeholder="z.B. *.example.com/* oder https://example.com/private/*" required>
                        <button type="button" class="blacklist-pattern-remove-btn">Entfernen</button>
                    </div>
            """
        
        # Abschluss der Liste und Hinzufügen-Button
        html += f"""
                </div>
                <div class="blacklist-pattern-actions">
                    <button type="button" id="{widget_id}-add" class="blacklist-pattern-add-btn">Pattern hinzufügen</button>
                </div>
            </div>
        </div>
        """
        
        return mark_safe(html)
    
    def value_from_datadict(self, data, files, name):
        """
        Extrahiert den Wert aus dem Formular-Daten-Dictionary.
        """
        value = data.get(name, '[]')
        try:
            return json.loads(value)
        except (ValueError, TypeError):
            return []

class CookieWidget(Widget):
    """
    Ein benutzerdefiniertes Widget zur Verwaltung von Cookies im Admin-Interface.
    Ermöglicht das Hinzufügen, Bearbeiten und Entfernen von Cookies mit den Feldern
    'name', 'value' und 'url'.
    """
    template_name = 'admin/cookie_widget.html'
    
    class Media:
        css = {
            'all': ('crawler/css/widgets.css',)
        }
        js = ('crawler/js/cookie_widget.js',)
    
    def render(self, name, value, attrs=None, renderer=None):
        """
        Rendert das HTML für das Cookie-Widget.
        """
        if value is None:
            value = []
        elif isinstance(value, str):
            try:
                value = json.loads(value)
            except (ValueError, TypeError):
                value = []
        
        # Sicherstellen, dass value eine Liste ist
        if not isinstance(value, list):
            value = []
        
        # Eindeutige ID für das Widget generieren
        final_attrs = self.build_attrs(attrs)
        widget_id = final_attrs.get('id', 'cookie-widget')
        
        # HTML für das Widget erstellen
        html = f"""
        <div id="{widget_id}-container" class="cookie-widget-container">
            <input type="hidden" name="{name}" id="{widget_id}" value="{json.dumps(value)}">
            <table class="cookie-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Value</th>
                        <th>URL</th>
                        <th>Aktionen</th>
                    </tr>
                </thead>
                <tbody id="{widget_id}-tbody">
        """
        
        # Zeilen für vorhandene Cookies hinzufügen
        for i, cookie in enumerate(value):
            html += f"""
                    <tr class="cookie-row" data-index="{i}">
                        <td>
                            <input type="text" class="cookie-name" value="{cookie.get('name', '')}" 
                                   placeholder="Cookie-Name" required>
                        </td>
                        <td>
                            <input type="text" class="cookie-value" value="{cookie.get('value', '')}" 
                                   placeholder="Cookie-Wert" required>
                        </td>
                        <td>
                            <input type="url" class="cookie-url" value="{cookie.get('url', '')}" 
                                   placeholder="https://example.com" required>
                        </td>
                        <td>
                            <button type="button" class="cookie-remove-btn">Entfernen</button>
                        </td>
                    </tr>
            """
        
        # Abschluss der Tabelle und Hinzufügen-Button
        html += f"""
                </tbody>
            </table>
            <div class="cookie-actions">
                <button type="button" id="{widget_id}-add" class="cookie-add-btn">Cookie hinzufügen</button>
            </div>
        </div>
        """
        
        return mark_safe(html)
    
    def value_from_datadict(self, data, files, name):
        """
        Extrahiert den Wert aus dem Formular-Daten-Dictionary.
        """
        value = data.get(name, '[]')
        try:
            return json.loads(value)
        except (ValueError, TypeError):
            return []