import os

from backend.api.admin.translation_feld_mixin import TranslationFieldsetMixin
from backend.api.models import Chatbot, Knowledgebase
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
from django import forms
from django.contrib import admin
from modeltranslation.admin import TranslationAdmin
from logging import getLogger
from django_scopes.forms import SafeModelChoiceField, SafeModelMultipleChoiceField


logger = getLogger(__name__)

class ChatbotAdminForm(forms.ModelForm):
    primary_color = forms.CharField(widget=forms.TextInput(attrs={'type': 'color'}))
    text_color = forms.CharField(widget=forms.TextInput(attrs={'type': 'color'}))
    
    # Explicitly define the knowledgebase field to ensure it's properly rendered
    knowledgebase = forms.ModelMultipleChoiceField(
        queryset=Knowledgebase.objects.none(),  # Start with empty queryset, will be populated by django-scopes
        required=False,
        widget=admin.widgets.FilteredSelectMultiple(
            verbose_name=_('Knowledgebases'),
            is_stacked=False
        )
    )

    class Meta:
        model = Chatbot
        fields = '__all__'
        field_classes = {
            'knowledgebase': SafeModelMultipleChoiceField,
        }

    def _filter_field_choices(self, field_name, env_var_value, default_value):
        """Filter field choices based on environment variable.
        
        Args:
            field_name: Name of the form field to filter
            env_var_value: Value from environment variable
            default_value: Default value to use if env var is empty/default
        """
        if field_name not in self.fields:
            return

        # If env var not set, show all choices (default behavior)
        if not env_var_value:
            return

        # If env var is set, filter based on allowed values
        allowed = [s.strip().lower() for s in env_var_value.split(",") if s.strip()]
        if not allowed:
            return

        full_choices = self.fields[field_name].choices
        filtered_choices = [choice for choice in full_choices if choice[0].lower() in allowed]
        
        # Get current value
        current_value = self.instance and getattr(self.instance, field_name, None)
        current_value_allowed = any(choice[0].lower() == current_value.lower() for choice in filtered_choices) if current_value else False

        if len(filtered_choices) == 1:
            # If only one choice, make the field hidden and readonly
            allowed_value = filtered_choices[0][0]
            self.fields[field_name].widget = forms.HiddenInput()
            self.fields[field_name].initial = allowed_value
            self.fields[field_name].disabled = True
            
            # If current value is not allowed, update it to the only allowed value
            if not current_value_allowed:
                setattr(self.instance, field_name, allowed_value)
        else:
            # If multiple choices, show only allowed ones
            self.fields[field_name].choices = filtered_choices
            
            # If current value is not in allowed choices, clear it
            if current_value and not current_value_allowed:
                self.fields[field_name].initial = None

    def _apply_field_filters(self):
        """Apply filtering to all configurable fields."""
        allow_rag_types = os.environ.get("ALLOW_RAG_TYPES", "").strip().lower()
        self._filter_field_choices("rag_type", allow_rag_types, "simple")
        
        allow_chatbot_styles = os.environ.get("ALLOW_CHATBOT_STYLES", "").strip().lower()
        self._filter_field_choices("chatbot_style", allow_chatbot_styles, "default")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._apply_field_filters()
        
        # Make prompt extras fields optional with default empty string
        prompt_extras_fields = [
            'main_prompt_extras',
            'no_sources_extras',
            'query_optimizer_extras',
            'related_questions_extras'
        ]
        
        for field_name in prompt_extras_fields:
            if field_name in self.fields:
                self.fields[field_name].required = False
                if not self.initial.get(field_name):
                    self.initial[field_name] = ''
        
        # Initialize the knowledgebase field with the correct queryset
        if 'knowledgebase' in self.fields:
            # Let django-scopes handle the tenant scoping
            self.fields['knowledgebase'].queryset = Knowledgebase.objects.all().order_by('name')

    def save(self, commit=True):
        """Override save to ensure field values are updated before saving."""
        self._apply_field_filters()
        return super().save(commit)


@admin.register(Chatbot)
class ChatbotAdmin(TranslationFieldsetMixin, TranslationAdmin):
    form = ChatbotAdminForm
    list_display = (
        'assistant_name',
        'contact_name',
        'contact_email',
        'display_logo',
        'display_avatar',
        'display_knowledgebases',
        'display_demo',
        'rag_type')
    
    def get_list_display(self, request):
        """
        Modify list_display to include tenant field only for superusers
        """
        list_display = list(self.list_display)
        if request.user.is_superuser:
            # Add tenant after assistant_name to keep assistant_name as the first clickable column
            list_display.insert(1, 'tenant')
        return list_display
    
    list_filter = ('knowledgebase',)
    search_fields = ('header_title', 'assistant_name', 'contact_name', 'contact_email')
    readonly_fields = ('id', 'display_logo_preview', 'display_avatar_preview', 'get_embed_code')
    filter_horizontal = ('knowledgebase',)
    
    def get_readonly_fields(self, request, obj=None):
        """
        Ensure tenant field is not in readonly_fields for superusers
        """
        readonly_fields = list(self.readonly_fields)
        if not request.user.is_superuser and 'tenant' not in readonly_fields:
            readonly_fields.append('tenant')
        return readonly_fields
        
    def get_form(self, request, obj=None, **kwargs):
        """
        Override get_form to pass the request object to the form.
        This allows the form to access the request.user to determine the tenant.
        """
        form = super().get_form(request, obj, **kwargs)
        form.request = request
        return form

    fieldsets = (
        (_('Basic Information'), {
            'fields': ('id',
                       'header_title',
                       'assistant_name',
                       'rag_type',
                       'knowledgebase',
                       'main_prompt_extras',
                       'no_sources_extras',
                       'query_optimizer_extras',
                       'related_questions_extras'),
            'classes': ('basic-info-section',)
        }),
        (_('Appearance'), {
            'fields': (
                ('primary_color', 'text_color'),
                ('chatbot_style'),
                ('logo', 'display_logo_preview'),
                ('avatar', 'display_avatar_preview')
            ),
            'classes': ('appearance-section', 'wide')
        }),
        (_('Contact Details'), {
            'fields': (
                ('contact_name', 'contact_email'), ('tech_contact_name', 'tech_contact_email'),
            ),
            'classes': ('contact-section',)
        }),
        (_('Integration'), {
            'fields': ('get_embed_code',),
            'classes': ('integration-section',)
        }),
    )
        
    def get_fieldsets(self, request, obj=None):
        """
        Modify fieldsets to include tenant field only for superusers
        and add translation tabs for each language
        """
        # First, get the fieldsets from the parent class (TranslationFieldsetMixin)
        # This will add the translation tabs for each language
        fieldsets = super().get_fieldsets(request, obj)
        
        # Now modify the first fieldset to include the tenant field for superusers
        if len(fieldsets) > 0:
            basic_info_fields = list(fieldsets[0][1]['fields'])
            
            # Add tenant field for superusers at the beginning of basic info
            if request.user.is_superuser and 'tenant' not in basic_info_fields:
                basic_info_fields.insert(0, 'tenant')
                fieldsets[0] = (fieldsets[0][0], {
                    'fields': tuple(basic_info_fields),
                    'classes': fieldsets[0][1]['classes']
                })
        
        return fieldsets

    def get_translation_fields(self):
        return ['welcome_title', 'welcome_text', 'welcome_additional_text', 'first_message']

    @admin.display(description=_('Knowledgebases'))
    def display_knowledgebases(self, obj):
        return ", ".join([kb.name for kb in obj.knowledgebase.all()])

    def display_logo(self, obj):
        if obj.logo:
            return format_html('<img src="{}" height="30"/>', obj.logo.url)
        return "-"
    display_logo.short_description = _('Logo')

    def display_avatar(self, obj):
        if obj.avatar:
            return format_html('<img src="{}" height="30"/>', obj.avatar.url)
        return "-"
    display_avatar.short_description = _('Avatar')

    def display_logo_preview(self, obj):
        if obj.logo:
            return format_html('<img src="{}" height="100"/>', obj.logo.url)
        return _("No logo uploaded")

    def display_avatar_preview(self, obj):
        if obj.avatar:
            return format_html('<img src="{}" height="100"/>', obj.avatar.url)
        return _("No avatar uploaded")


    def display_colors(self, obj):
        return format_html(
            '<div style="display: flex; gap: 10px;">'
            '<div style="width: 20px; height: 20px; background-color: {}; border: 1px solid #ddd;"></div>'
            '<div style="width: 20px; height: 20px; background-color: {}; border: 1px solid #ddd;"></div>'
            '</div>',
            obj.primary_color,
            obj.text_color
        )
    display_colors.short_description = _('Colors')

    # We don't need this method as we're handling the tenant queryset in the form
    
    # We don't need to override formfield_for_manytomany as the middleware should handle tenant scoping

    def display_demo(self, obj):
        return format_html(
            '<div>'
                '<a href="/demo/{}/" target="_blank">Widget</a> | '
                '<a href="/demo/{}/fullscreen" target="_blank">Fullscreen</a> | '
                '<a href="/demo/{}/inline" target="_blank">Inline</a>'
            '</div>',
            obj.id,
            obj.id,
            obj.id
        )
    display_demo.short_description = 'Demo'

    def get_embed_code(self, obj):
        embed_code = f"""<script
            id="hw-chatbot-widget" 
            type="module"
            crossorigin
            data-fullscreen="<INSERT true or false>"
            src="/static/chatbot.js"
            data-chatbot-id="{obj.id}"
            data-toggle-text-de="Hallo, ich bin dein KI-Assistent. Für Fragen zu den Inhalten der Website stehe ich zur Verfügung."
            data-toggle-text-en="Hello, I'm your AI assistant. I am available for questions about the contents of the website."
            data-api-url="/api"
            <!-- 
            The element-id can be used to embed the chatbot into an existing element.
            make sure that the Element has a height + width set and the fullscreen flag is set to false.
            -->            
            <!-- data-element-id="elementToAttachTo" -->
        ></script>"""
        return format_html(
            '<div class="embed-code-di">'
            '<textarea readonly class="embed-code" rows="6" id="embed-code-text">{}</textarea>'
            '<button type="button" class="copy-button" onclick="copyEmbedCode(this)">'
            'Copy Code</button>'
            '<script>'
            'document.addEventListener("DOMContentLoaded", function() {{'
            '    const textarea = document.getElementById("embed-code-text");'
            '    const code = textarea.value;'
            '    const fullUrl = window.location.protocol + "//" + window.location.host;'
            '    const fullJsUrl = fullUrl + "/static/chatbot.js";'
            '    const fullApiUrl = fullUrl + "/api";'
            '    textarea.value = code.replace("/static/chatbot.js", fullJsUrl)'
            '                         .replace("/api", fullApiUrl);'
            '}});'
            '</script>'
            '</div>',
            embed_code
        )

    get_embed_code.short_description = _('Embed Code')

    class Media:
        css = {
            'all': ('admin/chatbot_admin.css',)
        }
        js = ('admin/chatbot_admin.js',)
        
    def save_model(self, request, obj, form, change):
        """
        Override save_model to set tenant for new Chatbot objects
        """
        # If this is a new object (not a change) and tenant is not set
        if not change and not obj.tenant and hasattr(request.user, 'profile') and hasattr(request.user.profile, 'tenant'):
            # Set tenant from the user's profile
            obj.tenant = request.user.profile.tenant
            self.message_user(
                request,
                f"Set tenant for new Chatbot to {obj.tenant}",
                level='SUCCESS'
            )
        
        # Normal save behavior
        super().save_model(request, obj, form, change)
        
    def save_related(self, request, form, formsets, change):
        """
        Override save_related to validate that knowledgebases have the same tenant as the chatbot
        """
        # Get the chatbot instance
        obj = form.instance
        
        # Get the selected knowledgebases from the form data
        if hasattr(form, 'cleaned_data') and 'knowledgebase' in form.cleaned_data:
            selected_knowledgebases = form.cleaned_data['knowledgebase']
            
            # If the chatbot has a tenant, validate that all selected knowledgebases have the same tenant
            if obj.tenant and selected_knowledgebases:
                mismatched_kbs = []
                tenant_missing_kbs = []
                
                for kb in selected_knowledgebases:
                    if kb.tenant is None:
                        tenant_missing_kbs.append(kb)
                    elif kb.tenant != obj.tenant:
                        mismatched_kbs.append(kb)
                
                error_messages = []
                
                if mismatched_kbs:
                    kb_names = ", ".join([kb.name for kb in mismatched_kbs])
                    error_messages.append(
                        f"The following knowledgebases have a different tenant than the chatbot: {kb_names}"
                    )
                
                if tenant_missing_kbs:
                    kb_names = ", ".join([kb.name for kb in tenant_missing_kbs])
                    error_messages.append(
                        f"The following knowledgebases do not have a tenant assigned: {kb_names}"
                    )
                
                if error_messages:
                    for message in error_messages:
                        self.message_user(request, message, level='ERROR')
                    # Remove the problematic knowledgebases from the selection
                    form.cleaned_data['knowledgebase'] = [
                        kb for kb in selected_knowledgebases
                        if kb not in mismatched_kbs and kb not in tenant_missing_kbs
                    ]
        
        # Call the parent method to save the related objects
        super().save_related(request, form, formsets, change)
