from django.contrib import admin
from backend.api.models import Tenant
from django.db import models
from django.utils.translation import gettext_lazy as _

# Create a proxy model for Tenant that will appear in the auth app
class AuthTenant(Tenant):
    class Meta:
        proxy = True
        app_label = 'auth'
        verbose_name = _('Tenant')
        verbose_name_plural = _('Tenants')

# Create the admin class
class TenantAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    ordering = ('name',)
    
    def has_view_permission(self, request, obj=None):
        return request.user.is_superuser
        
    def has_add_permission(self, request):
        return request.user.is_superuser
        
    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser
        
    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser

# Unregister the original Tenant model if it was registered
try:
    admin.site.unregister(Tenant)
except admin.sites.NotRegistered:
    pass

# Register the proxy model instead
admin.site.register(AuthTenant, TenantAdmin)