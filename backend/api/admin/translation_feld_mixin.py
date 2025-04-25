from django.urls import path
from django.shortcuts import redirect
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from ..worker.autotranslate.autotranslate import Autotranslate
from logging import getLogger
logger = getLogger(__name__)


class TranslationFieldsetMixin:
    change_form_template = 'admin/custom_change_form.html'

    def response_change(self, request, obj):
        response = super().response_change(request, obj)
        if '_continue_to' in request.POST:
            return redirect(request.POST['_continue_to'])
        return response

    def get_fieldsets(self, request, obj=None):
        fieldsets = super().get_fieldsets(request, obj)
        trans_fields = self.get_translation_fields()
        for lang_code, lang_name in settings.LANGUAGES:
            if lang_code != settings.LANGUAGE_CODE:
                fieldsets += (
                    (_('Translations') + f' - {lang_name}', {
                        'fields': [f'{field}_{lang_code}' for field in trans_fields],
                        'classes': ('collapse',),
                    }),
                )
        return fieldsets

    def get_translation_fields(self):
        raise NotImplementedError("Subclasses must implement get_translation_fields()")

    def auto_translate(self, request, object_id):
        try:
            obj = self.get_object(request, object_id)
            if obj is None:
                raise self.model.DoesNotExist

            translator = Autotranslate()
            updated_obj = translator.translate_object(obj)
            updated_obj.save()

            self.message_user(request, "Auto-translation completed successfully!")
        except Exception as e:
            self.message_user(request, f"Error during auto-translation: {str(e)}", level='ERROR')

        return redirect(
            'admin:%s_%s_change' % (
                self.model._meta.app_label,
                self.model._meta.model_name,
            ),
            object_id,
        )

    def get_urls(self):
        urls = super().get_urls()
        info = self.model._meta.app_label, self.model._meta.model_name
        custom_urls = [
            path(
                '<str:object_id>/auto-translate/',  # Changed to str from path
                self.admin_site.admin_view(self.auto_translate),
                name='%s_%s_auto-translate' % info,
            ),
        ]
        return custom_urls + urls