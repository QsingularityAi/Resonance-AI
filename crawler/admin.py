from django.contrib import admin
from django_scopes import scopes_disabled

from crawler.models import CrawlLink
from crawler.forms import CrawlLinkAdminForm


@admin.register(CrawlLink)
class CrawlLinkAdmin(admin.ModelAdmin):
    form = CrawlLinkAdminForm
    change_form_template = 'admin/crawler/crawllink/change_form.html'
    fields = ['url', 'knowledgebase', 'deep_crawl', 'content_selector', 'excluded_selectors','blacklist_patterns', 'custom_cookies',
              'deletion_timeout', 'crawl_interval', 'last_crawl_start', 'last_crawl_end',
              'number_of_resources_processed', 'created_at']

    readonly_fields = ('last_crawl_start', 'last_crawl_end', 'number_of_resources_processed', 'created_at')

    list_display = ['url', 'last_crawl_start', 'last_crawl_end']
    search_fields = ['url', 'content_selector']

    def get_form(self, request, obj=None, **kwargs):
        form = super(CrawlLinkAdmin, self).get_form(request, obj=obj, **kwargs)
        form.request = request
        return form

    def get_list_display(self, request):
        """
        Modify list_display to include tenant field only for superusers
        """
        list_display = list(self.list_display)
        if request.user.is_superuser:
            # Add tenant after url to keep url as the first clickable column
            list_display.insert(1, 'tenant')
        return list_display

    def get_readonly_fields(self, request, obj=None):
        readonly_fields = list(self.readonly_fields)
        if not request.user.is_superuser and 'tenant' not in readonly_fields:
            readonly_fields.append('tenant')
        return readonly_fields
    
    def get_fieldsets(self, request, obj=None):
        """
        Modify fieldsets to include tenant field only for superusers
        """
        # Create a copy of the fields list
        fields = list(self.fields)
        
        # Add tenant field for superusers at the beginning
        if request.user.is_superuser and 'tenant' not in fields:
            fields.insert(0, 'tenant')
        elif not request.user.is_superuser and 'tenant' in fields:
            fields.remove('tenant')
            
        return [(None, {'fields': fields})]

    @scopes_disabled()
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
