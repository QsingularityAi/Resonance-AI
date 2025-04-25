"""
Django-Admin-Klassen für WebDAV-Ressourcen.
"""
from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from django.utils.html import format_html
from django.urls import reverse
from django.http import HttpResponseRedirect

from webdav.models import WebdavResource
from webdav.service.crawl_control import CrawlManager
from webdav.dataclasses import CrawlingStatus


@admin.register(WebdavResource)
class WebdavResourceAdmin(admin.ModelAdmin):
    """
    Django-Admin-Klasse für WebDAV-Ressourcen.
    """
    
    list_display = ('name', 'url', 'starting_directory','knowledgebase', 'deep', 'last_crawl_start', 'last_crawl_end', 'number_of_resources_processed', 'crawling_status', 'crawl_button')
    list_filter = ('knowledgebase', 'deep', 'crawling_status')
    search_fields = ('name', 'url')

    readonly_fields = ('last_crawl_start', 'last_crawl_end', 'number_of_resources_processed', 'crawling_status')
    fieldsets = (
        (None, {
            'fields': ('name', 'url', 'knowledgebase', 'tenant')
        }),
        (_('Authentication'), {
            'fields': ('auth_user_name', 'auth_user_password')
        }),
        (_('Crawling Options'), {
            'fields': ('starting_directory', 'deep', 'supported_extensions', 'crawl_interval', 'deletion_timeout')
        }),
        (_('Crawling Statistics'), {
            'fields': ('last_crawl_start', 'last_crawl_end', 'number_of_resources_processed', 'crawling_status')
        }),
    )
    
    def crawl_button(self, obj):
        """
        Erstellt einen Button zum manuellen Starten des Crawling-Prozesses.
        
        Args:
            obj: Die WebdavResource-Instanz
            
        Returns:
            HTML-Code für den Button
        """
        if obj.crawling_status == CrawlingStatus.CRAWLING.value:
            return format_html('<span style="color: #999;">Crawling...</span>')
        else:
            return format_html(
                '<a class="button" href="{}">Crawl</a>',
                reverse('admin:webdav_webdavresource_crawl', args=[obj.pk])
            )
    crawl_button.short_description = _('Crawl')
    
    def get_urls(self):
        """
        Fügt eine URL für die Crawl-Aktion hinzu.
        
        Returns:
            Eine Liste von URLs
        """
        from django.urls import path
        urls = super().get_urls()
        custom_urls = [
            path(
                '<path:object_id>/crawl/',
                self.admin_site.admin_view(self.crawl_view),
                name='webdav_webdavresource_crawl'
            ),
            path(
                '<path:object_id>/delete_resources/',
                self.admin_site.admin_view(self.delete_resources_view),
                name='webdav_webdavresource_delete_resources'
            ),
        ]
        return custom_urls + urls
    
    def crawl_view(self, request, object_id):
        """
        Startet den Crawling-Prozess für eine WebDAV-Ressource.
        
        Args:
            request: Die HTTP-Anfrage
            object_id: Die ID der WebDAV-Ressource
            
        Returns:
            Eine HTTP-Antwort
        """
        resource = self.get_object(request, object_id)
        if resource:
            message = CrawlManager.start_crawl(resource.id)
            self.message_user(request, message)
        return HttpResponseRedirect(reverse('admin:webdav_webdavresource_changelist'))
    
    def delete_resources_view(self, request, object_id):
        """
        Löscht Ressourcen einer WebDAV-Ressource.
        
        Args:
            request: Die HTTP-Anfrage
            object_id: Die ID der WebDAV-Ressource
            
        Returns:
            Eine HTTP-Antwort
        """
        resource = self.get_object(request, object_id)
        if resource:
            message = CrawlManager.delete_resources(resource.id, force_delete=True)
            self.message_user(request, message)
        return HttpResponseRedirect(reverse('admin:webdav_webdavresource_changelist'))

    def get_readonly_fields(self, request, obj=None):
        readonly_fields = list(self.readonly_fields)
        if not request.user.is_superuser and 'tenant' not in readonly_fields:
            readonly_fields.append('tenant')
        return readonly_fields


    def save_model(self, request, obj, form, change):
        # Set create_user for new objects
        if not obj.pk:
            obj.create_user = request.user

            # Set tenant from the user's profile if not already set
            if not obj.tenant and hasattr(request.user, 'profile') and hasattr(request.user.profile, 'tenant'):
                obj.tenant = request.user.profile.tenant
                self.message_user(
                    request,
                    f"Set tenant for new Crawl Link to {obj.tenant}",
                    level='SUCCESS'
                )

        # Always set update_user
        obj.update_user = request.user

        # Check if the tenant of the knowledgebase matches the tenant of the crawling
        if obj.knowledgebase and obj.tenant and obj.knowledgebase.tenant != obj.tenant:
            self.message_user(
                request,
                f"Error: The tenant of the knowledgebase ({obj.knowledgebase.tenant}) does not match the tenant of the crawling ({obj.tenant}).",
                level='ERROR'
            )
            # Don't save the model and return to prevent the save operation
            return

        # Call the parent save_model method
        super().save_model(request, obj, form, change)

    def get_list_display(self, request):
        """
        Modify list_display to include tenant field only for superusers
        """
        list_display = list(self.list_display)
        if request.user.is_superuser:
            # Add tenant after url to keep url as the first clickable column
            list_display.insert(1, 'tenant')
        return list_display