import logging # Add logging import
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User, Group # Import Group
from django.forms.models import BaseInlineFormSet # Import BaseInlineFormSet
from backend.api.models import UserProfile, Tenant
from django.utils.translation import gettext_lazy as _
from django import forms

logger = logging.getLogger(__name__) # Add logger instance
from django.contrib.auth.forms import UserChangeForm, UserCreationForm

admin.site.unregister(User)

# Custom Formset to prevent inline creation of new profiles
class UserProfileInlineFormSet(BaseInlineFormSet):
    """
    Custom formset that prevents creating new UserProfile instances via the inline form.
    Instead, it returns the existing profile that should have been created by the signal handler.
    """
    def save_new(self, form, commit=True):
        """
        Override save_new to return the existing profile instead of creating a new one.
        The profile should be created by the post_save signal when the User is created.
        """
        logger.debug("UserProfileInlineFormSet: save_new called, fetching existing profile.")
        
        # The formset's instance is the parent object (User)
        user_instance = self.instance
        if user_instance and hasattr(user_instance, 'profile'):
            logger.debug(f"UserProfileInlineFormSet: Returning existing profile for user {user_instance.pk}")
            return user_instance.profile
        else:
            logger.error(f"UserProfileInlineFormSet: Could not find profile for user {user_instance.pk if user_instance else 'None'}.")
            return None

class UserProfileInline(admin.StackedInline):
    model = UserProfile
    formset = UserProfileInlineFormSet # Use the custom formset
    can_delete = False
    verbose_name_plural = _('Profile')
    fk_name = 'user'
    # Control is_tenant_admin visibility/editability
    fields = ('tenant', 'is_tenant_admin') # Add other profile fields if any
    # Show inline for existing users, allow editing
    # Prevent inline from rendering *at all* on the add form
    def get_max_num(self, request, obj=None, **kwargs):
        return 0 if obj is None else 1

    def get_min_num(self, request, obj=None, **kwargs):
        return 0 if obj is None else 1

    def get_formset(self, request, obj=None, **kwargs):
        formset = super().get_formset(request, obj, **kwargs)
        # For non-superusers on the change form (obj is not None)
        if not request.user.is_superuser and obj is not None:
            # Tenant Admins cannot change the tenant of a user
            if 'tenant' in formset.form.base_fields:
                formset.form.base_fields['tenant'].disabled = True

            # Check if the logged-in user is a Tenant Admin
            is_requester_tenant_admin = False
            try:
                is_requester_tenant_admin = request.user.profile.is_tenant_admin
            except UserProfile.DoesNotExist:
                pass # User has no profile, not a tenant admin

            # Check if this is a tenant admin user not created by the current admin
            is_read_only = False
            if hasattr(obj, 'profile') and obj.profile.is_tenant_admin:
                try:
                    # If the current user is a tenant admin and didn't create this user
                    # AND the user is not editing their own profile
                    if (is_requester_tenant_admin and
                        obj.profile.created_by != request.user and
                        obj != request.user):  # Allow users to edit themselves
                        is_read_only = True
                        logger.info(f"Making profile inline read-only for tenant admin {obj} not created by {request.user}")
                except (UserProfile.DoesNotExist, AttributeError):
                    pass

            # Enable/disable the is_tenant_admin field based on requester's status and creation
            if 'is_tenant_admin' in formset.form.base_fields:
                if is_requester_tenant_admin and not is_read_only:
                    # Tenant Admins can toggle this flag for users they created or non-tenant-admin users
                    formset.form.base_fields['is_tenant_admin'].disabled = False
                    formset.form.base_fields['is_tenant_admin'].help_text = _("Designates that this user can manage users and groups within their tenant.")
                else:
                    # Regular users or tenant admins viewing other tenant admins they didn't create
                    formset.form.base_fields['is_tenant_admin'].disabled = True
                    
                    if is_read_only:
                        formset.form.base_fields['is_tenant_admin'].help_text = _(
                            "This tenant admin was created by another admin. You can view but not edit their details."
                        )
                    else:
                        formset.form.base_fields['is_tenant_admin'].help_text = _(
                            "Only tenant administrators can change this setting."
                        )
        return formset

    # Only show the inline for existing users, not for new users
    # This prevents the inline from trying to create a profile
    # Removed get_max_num and get_min_num overrides, relying on formset override now


# Custom Forms to handle tenant assignment on creation
class CustomUserCreationForm(UserCreationForm):
    # Add tenant and is_tenant_admin fields to the creation form
    tenant = forms.ModelChoiceField(
        queryset=Tenant.objects.all(),
        required=False,
        label=_('Tenant'),
        help_text=_('The tenant this user belongs to.')
    )
    is_tenant_admin = forms.BooleanField(
        required=False,
        label=_('Tenant Administrator'),
        help_text=_('Designates that this user can manage users and groups within their tenant.')
    )
    
    class Meta(UserCreationForm.Meta):
        model = User
        fields = ("username", "email", "first_name", "last_name")

class CustomUserChangeForm(UserChangeForm):
    # Ensure password field isn't accidentally exposed if not intended
    class Meta(UserChangeForm.Meta):
        model = User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm
    inlines = (UserProfileInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'get_tenant', 'is_tenant_admin_display')
    list_select_related = ('profile__tenant',) # Ensure tenant is fetched efficiently
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups', 'profile__tenant', 'profile__is_tenant_admin') # Add new filters
    search_fields = ('username', 'first_name', 'last_name', 'email', 'profile__tenant__name')
    add_fieldsets = ( # This is for the ADD form
        (None, {
            'classes': ('wide',),
            # Use fields from the add_form (CustomUserCreationForm)
            # Default UserCreationForm has 'password', 'password2'
            'fields': ('username', 'password1', 'password2'),
        }),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'email')}),
        (_('Profile'), {'fields': ('tenant', 'is_tenant_admin')}),
    )

    # Default fieldsets for superusers
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'email')}),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    
    def get_fieldsets(self, request, obj=None):
        """
        Override fieldsets for tenant admins to hide the permissions tab
        """
        if not request.user.is_superuser and obj is not None:
            # For tenant admins, hide the permissions tab
            try:
                if request.user.profile.is_tenant_admin:
                    return (
                        (None, {'fields': ('username', 'password')}),
                        (_('Personal info'), {'fields': ('first_name', 'last_name', 'email')}),
                        (_('Account status'), {'fields': ('is_active',)}),
                        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
                    )
            except UserProfile.DoesNotExist:
                pass
        
        return super().get_fieldsets(request, obj)
    # Note: UserProfile fields are handled by the inline on the change form

    def get_inlines(self, request, obj=None):
        """
        Return no inlines for the add view (obj is None),
        otherwise return the default inlines.
        We're handling profile fields directly in the add_fieldsets for new users.
        """
        if obj is None:
            return []  # No inlines for add view
        return super().get_inlines(request, obj)
    def get_add_fieldsets(self, request):
        """
        Return simplified add_fieldsets for tenant admins
        """
        if not request.user.is_superuser:
            try:
                if request.user.profile.is_tenant_admin:
                    return (
                        (None, {
                            'classes': ('wide',),
                            'fields': ('username', 'password1', 'password2'),
                        }),
                        (_('Personal info'), {'fields': ('first_name', 'last_name', 'email')}),
                        (_('Profile'), {'fields': ('is_tenant_admin',)}),  # Tenant is auto-set and hidden
                    )
            except UserProfile.DoesNotExist:
                pass
        
        return self.add_fieldsets
        
    def add_view(self, request, form_url='', extra_context=None):
        """
        Override to use get_add_fieldsets for the add view
        """
        self.fieldsets = None
        self.add_fieldsets = self.get_add_fieldsets(request)
        return super().add_view(request, form_url, extra_context)
    # Note: UserProfile fields are handled by the inline

    def get_tenant(self, obj):
        # Use try-except for robustness if profile might not exist yet
        try:
            return obj.profile.tenant
        except UserProfile.DoesNotExist:
            return None
    get_tenant.short_description = _('Tenant')
    get_tenant.admin_order_field = 'profile__tenant' # Enable sorting

    def is_tenant_admin_display(self, obj):
         try:
             return obj.profile.is_tenant_admin
         except UserProfile.DoesNotExist:
             return False
    is_tenant_admin_display.short_description = _('Tenant Admin')
    is_tenant_admin_display.boolean = True
    is_tenant_admin_display.admin_order_field = 'profile__is_tenant_admin'

    def get_queryset(self, request):
        """ Filter users based on the request user's tenancy. """
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs # Superusers see all
        try:
            user_tenant = request.user.profile.tenant
            if user_tenant and request.user.profile.is_tenant_admin:
                 # Tenant Admins only see users within their tenant (including themselves)
                 # Also include users without a profile/tenant yet for initial setup? Maybe not.
                 return qs.filter(profile__tenant=user_tenant)
            else:
                 # Regular users or admins without a tenant assigned see nothing (or maybe just themselves?)
                 return qs.none() # Or filter(pk=request.user.pk)
        except UserProfile.DoesNotExist:
             # User has no profile, likely shouldn't see any users unless superuser
             return qs.none()

    def save_model(self, request, obj, form, change):
        """
        Ensure tenant and permissions are correctly set for users created or modified by Tenant Admins.
        
        This method handles:
        1. Setting the tenant for new users
        2. Managing tenant admin status
        3. Setting appropriate permissions based on user role
        4. Handling profile updates
        5. Tracking which admin created the user
        """
        is_new = not change
        
        # Get tenant and is_tenant_admin from the form if provided
        tenant = None
        is_tenant_admin = False
        
        if hasattr(form, 'cleaned_data'):
            # Get values from the form if they exist
            tenant = form.cleaned_data.get('tenant')
            is_tenant_admin = form.cleaned_data.get('is_tenant_admin', False)
            
            # If tenant not explicitly selected and not superuser, use admin's tenant
            if not tenant and not request.user.is_superuser:
                try:
                    tenant = request.user.profile.tenant
                    if is_new:
                        logger.info(f"Using admin's tenant {tenant} for new user {obj}")
                except UserProfile.DoesNotExist:
                    logger.error(f"TenantAdmin {request.user} modifying user {obj} has no profile/tenant.")
            
            # Automatically set is_staff for tenant admins and all users created by tenant admins
            if (is_tenant_admin or (is_new and not request.user.is_superuser and request.user.profile.is_tenant_admin)) and not obj.is_staff:
                obj.is_staff = True
                logger.info(f"Automatically setting is_staff=True for user {obj} created by tenant admin {request.user}")
        
        # Save the user first
        super().save_model(request, obj, form, change)
        
        # After the user is saved, update profile and permissions
        obj.refresh_from_db()
        
        # The profile should be created by the signal handler
        # Now we should have a profile
        if hasattr(obj, 'profile'):
            profile_updated = False
            
            # Update tenant if provided
            if tenant:
                obj.profile.tenant = tenant
                profile_updated = True
            
            # Update is_tenant_admin if it's in the form
            if 'is_tenant_admin' in form.cleaned_data:
                obj.profile.is_tenant_admin = is_tenant_admin
                profile_updated = True
                
            # Set created_by for new users
            if is_new:
                obj.profile.created_by = request.user
                profile_updated = True
                logger.info(f"Set created_by={request.user} for new user {obj}")
            
            # Save profile if updated
            if profile_updated:
                obj.profile.save()
                logger.info(f"Updated profile for user {obj}: tenant={tenant}, is_tenant_admin={is_tenant_admin}")
        else:
            logger.error(f"Profile not found for user {obj} after save_model. Signal handler may have failed.")
        
        # Handle permissions based on tenant admin status changes
        # This should happen regardless of whether the profile was found
        if not request.user.is_superuser and request.user.profile.is_tenant_admin:
            # If this is a new user created by a tenant admin
            if is_new:
                # Copy permissions from the admin user to the new user
                self._assign_user_permissions(obj, request.user, is_tenant_admin)
                logger.info(f"Assigned permissions to new user {obj} from tenant admin {request.user}")


    def _assign_user_permissions(self, user_obj, admin_user, is_tenant_admin=False):
        """
        Assign appropriate permissions to a user by copying them from the creator admin.
        
        When a tenant admin creates another user, the new one gets the Django groups
        and permissions copied over from the creator.
        
        Args:
            user_obj: The new user
            admin_user: The creator admin user whose permissions will be copied
            is_tenant_admin: Whether the new user is a tenant admin
        """
        # Copy groups from the creator admin to the new user
        for group in admin_user.groups.all():
            user_obj.groups.add(group)
            logger.info(f"Copied group {group} from {admin_user} to new user {user_obj}")
        
        # Copy permissions from the creator admin to the new user
        for perm in admin_user.user_permissions.all():
            user_obj.user_permissions.add(perm)
            logger.info(f"Copied permission {perm} from {admin_user} to new user {user_obj}")
        
        # Save the user to ensure permissions are updated
        user_obj.save()
        logger.info(f"Successfully copied all groups and permissions from {admin_user} to {user_obj}")

    def save_related(self, request, form, formsets, change):
        """
        Ensure inline profile gets the tenant set correctly if needed.
        
        The custom formset prevents saving new profiles via inline.
        We call super() to save changes to *existing* profiles if the inline was used for editing.
        """
        super().save_related(request, form, formsets, change)
        # Note: We don't need to manually set the tenant here again,
        # as save_model should have handled it for new users,
        # and the inline form handles changes for existing users.

    def get_form(self, request, obj=None, **kwargs):
        """
        Customize the form based on user permissions.
        For tenant admins, make all fields read-only when viewing tenant admin users they didn't create.
        """
        form = super().get_form(request, obj, **kwargs)
        if not request.user.is_superuser:
            # Check if this is an existing tenant admin user that wasn't created by the current admin
            is_read_only = False
            if obj and hasattr(obj, 'profile') and obj.profile.is_tenant_admin:
                try:
                    # If the current user is a tenant admin and didn't create this user
                    # AND the user is not editing their own profile
                    if (request.user.profile.is_tenant_admin and
                        obj.profile.created_by != request.user and
                        obj != request.user):  # Allow users to edit themselves
                        is_read_only = True
                        logger.info(f"Making form read-only for tenant admin {obj} not created by {request.user}")
                except UserProfile.DoesNotExist:
                    pass
            
            # Tenant Admins cannot make users superusers or staff (admin access)
            if 'is_superuser' in form.base_fields:
                form.base_fields['is_superuser'].disabled = True
                form.base_fields['is_superuser'].help_text = _("Only global administrators can assign superuser status.")
            if 'is_staff' in form.base_fields:
                 form.base_fields['is_staff'].disabled = True
                 form.base_fields['is_staff'].help_text = _("Tenant administrators cannot grant Django admin access (staff status).")

            # Tenant Admins cannot manage standard Django groups/permissions
            if 'groups' in form.base_fields:
                form.base_fields['groups'].disabled = True
                form.base_fields['groups'].queryset = Group.objects.none() # Hide standard groups
                form.base_fields['groups'].help_text = _("Manage access via Tenant Groups instead.")
            if 'user_permissions' in form.base_fields:
                form.base_fields['user_permissions'].disabled = True
                form.base_fields['user_permissions'].queryset = User._meta.get_field('user_permissions').remote_field.model.objects.none() # Hide perms
                form.base_fields['user_permissions'].help_text = _("Specific permissions are managed globally.")
            
            # For tenant admins, restrict tenant selection to their own tenant
            if 'tenant' in form.base_fields:
                try:
                    if request.user.profile.is_tenant_admin and request.user.profile.tenant:
                        # Tenant admins can only assign users to their own tenant
                        form.base_fields['tenant'].queryset = Tenant.objects.filter(pk=request.user.profile.tenant.pk)
                        form.base_fields['tenant'].initial = request.user.profile.tenant
                        # Make it read-only since there's only one option
                        form.base_fields['tenant'].disabled = True
                except UserProfile.DoesNotExist:
                    # User has no profile, restrict access
                    form.base_fields['tenant'].queryset = Tenant.objects.none()
                    
            # If this is a tenant admin user not created by the current admin, make all fields read-only
            if is_read_only:
                for field_name in form.base_fields:
                    form.base_fields[field_name].disabled = True
                    
                # Add a help text to explain why the form is read-only
                if 'username' in form.base_fields:
                    form.base_fields['username'].help_text = _(
                        "This tenant admin was created by another admin. You can view but not edit their details."
                    )

        return form
    def _check_tenant_admin_permission(self, request, obj=None):
        """
        Helper method to check if a tenant admin has permission to access a user.
        
        Args:
            request: The HTTP request
            obj: The user object being accessed, or None for list views
            
        Returns:
            bool: True if the user has permission, False otherwise
        """
        # Superusers always have permission
        if request.user.is_superuser:
            return True
            
        # For list views, rely on get_queryset filtering
        if obj is None:
            return True
            
        # Check if the user being accessed belongs to the admin's tenant
        try:
            admin_tenant = request.user.profile.tenant
            user_tenant = obj.profile.tenant
            
            # Basic tenant check - user must be in admin's tenant
            tenant_match = (admin_tenant and
                           request.user.profile.is_tenant_admin and
                           admin_tenant == user_tenant)
                           
            if not tenant_match:
                return False
                
            # Additional check for tenant admins:
            # If the user being accessed is a tenant admin, the current admin must be their creator
            if obj.profile.is_tenant_admin:
                return obj.profile.created_by == request.user
                
            # Non-tenant-admin users can be managed by any tenant admin in the same tenant
            return True
            
        except UserProfile.DoesNotExist:
            return False  # Cannot access users without profiles unless superuser

    def has_change_permission(self, request, obj=None):
        """
        Allow Tenant Admins to change users only within their tenant.
        For tenant admin users, only allow editing if:
        1. The current admin created them, OR
        2. The user is editing their own profile
        """
        if not super().has_change_permission(request, obj):
            return False
            
        # For list view or superusers
        if obj is None or request.user.is_superuser:
            return True
            
        # Users can always edit themselves
        if obj == request.user:
            return True
            
        try:
            # Basic tenant check
            admin_tenant = request.user.profile.tenant
            user_tenant = obj.profile.tenant
            
            if not (admin_tenant and request.user.profile.is_tenant_admin and admin_tenant == user_tenant):
                return False
                
            # For tenant admin users, only allow editing if created by this admin
            if obj.profile.is_tenant_admin:
                return obj.profile.created_by == request.user
                
            # Regular users can be edited by any tenant admin in the same tenant
            return True
            
        except UserProfile.DoesNotExist:
            return False

    def has_delete_permission(self, request, obj=None):
        """
        Allow Tenant Admins to delete users only within their tenant.
        For tenant admin users, only allow deletion if the current admin created them.
        We generally prevent users from deleting themselves for safety.
        """
        if not super().has_delete_permission(request, obj):
            return False
        
        # Prevent deleting self - this is generally a good safety measure
        # We keep this restriction even though users can edit themselves
        if obj and obj == request.user:
            return False
            
        # For list view or superusers
        if obj is None or request.user.is_superuser:
            return True
            
        try:
            # Basic tenant check
            admin_tenant = request.user.profile.tenant
            user_tenant = obj.profile.tenant
            
            if not (admin_tenant and request.user.profile.is_tenant_admin and admin_tenant == user_tenant):
                return False
                
            # For tenant admin users, only allow deletion if created by this admin
            if obj.profile.is_tenant_admin:
                return obj.profile.created_by == request.user
                
            # Regular users can be deleted by any tenant admin in the same tenant
            return True
            
        except UserProfile.DoesNotExist:
            return False

    def has_view_permission(self, request, obj=None):
        """
        Allow Tenant Admins to view all users within their tenant,
        including tenant admin users they didn't create.
        """
        if not super().has_view_permission(request, obj):
            return False
            
        # Superusers can view all users
        if request.user.is_superuser:
            return True
            
        # For list view
        if obj is None:
            return True
            
        try:
            # Basic tenant check - only check if user is in the same tenant
            admin_tenant = request.user.profile.tenant
            user_tenant = obj.profile.tenant
            
            return (admin_tenant and
                   request.user.profile.is_tenant_admin and
                   admin_tenant == user_tenant)
                   
        except UserProfile.DoesNotExist:
            return False

    def has_add_permission(self, request):
        """Allow Tenant Admins to add users if they belong to a tenant."""
        if not super().has_add_permission(request):
            return False
        if request.user.is_superuser:
            return True
        try:
            # Check if the user is a tenant admin and belongs to a tenant
            return (request.user.profile.tenant is not None and
                   request.user.profile.is_tenant_admin)
        except UserProfile.DoesNotExist:
            return False  # Cannot add users if not a tenant admin with a tenant
            
    def get_model_perms(self, request):
        """
        Hide the User admin from users who are not tenant admins or superusers.
        This effectively removes the User model from the admin index for regular users.
        """
        if not request.user.is_authenticated:
            return {}
            
        if request.user.is_superuser:
            return super().get_model_perms(request)
            
        try:
            # Check if the user is a tenant admin
            if request.user.profile.is_tenant_admin:
                return super().get_model_perms(request)
        except UserProfile.DoesNotExist:
            pass
            
        # For regular users (not tenant admins or superusers), hide this admin
        return {}