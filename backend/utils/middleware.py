# yourapp/middleware.py
import logging
import re
from django.conf import settings
from django.urls import resolve, Resolver404
from django.core.exceptions import ImproperlyConfigured, ObjectDoesNotExist
from django_scopes import scope, scopes_disabled

# Optional: Configure logging
logger = logging.getLogger(__name__)

class TenantAdminScopeMiddleware:
    """
    Applies django-scopes scoping within the Django admin interface based
    on the logged-in user's profile tenant.

    Assumes:
    - A related profile model accessible via `settings.SCOPES_ADMIN_PROFILE_ATTRIBUTE` (default: 'profile').
    - A tenant field on the profile model accessible via `settings.SCOPES_ADMIN_TENANT_ATTRIBUTE` (default: 'tenant').
    - The scope dimension used in ScopedManager is defined in `settings.SCOPES_ADMIN_DIMENSION_NAME` (default: 'tenant').

    If the user is staff and has a non-null tenant associated via their profile,
    admin requests will be scoped to that tenant.

    If the user is staff but has no tenant (or no profile), or is not logged in
    (e.g., accessing the admin login page), scopes will be disabled for the request,
    allowing global access (subject to standard Django admin permissions).
    """
    def __init__(self, get_response):
        self.get_response = get_response
        self.scope_dimension = getattr(settings, 'SCOPES_ADMIN_DIMENSION_NAME', 'tenant')
        self.profile_attr_name = getattr(settings, 'SCOPES_ADMIN_PROFILE_ATTRIBUTE', 'profile')
        self.tenant_attr_name = getattr(settings, 'SCOPES_ADMIN_TENANT_ATTRIBUTE', 'tenant')

        if not self.scope_dimension:
            raise ImproperlyConfigured("SCOPES_ADMIN_DIMENSION_NAME setting cannot be empty.")
        if not self.profile_attr_name:
            raise ImproperlyConfigured("SCOPES_ADMIN_PROFILE_ATTRIBUTE setting cannot be empty.")
        if not self.tenant_attr_name:
            raise ImproperlyConfigured("SCOPES_ADMIN_TENANT_ATTRIBUTE setting cannot be empty.")


    def __call__(self, request):

        # First, check if this request is targeting the admin interface
        is_admin_request = self._is_admin_request(request)

        if not is_admin_request:
            # Not an admin request, process normally without modifying scopes here
            return self.get_response(request)

        # --- It is an admin request ---

        user_tenant = self._get_user_tenant(request)

        if user_tenant:
            # User is authenticated, staff, has a profile, and a tenant is assigned.
            # Activate the specific tenant scope for this request.
            logger.debug(f"Admin Scope: Activating scope '{self.scope_dimension}={user_tenant}' for user {request.user.pk}")
            with scope(**{self.scope_dimension: user_tenant}):
                response = self.get_response(request)
        else:
            # User is anonymous, not staff, or has no specific tenant assigned.
            # Disable scopes for this request (allowing global view).
            user_pk = request.user.pk if hasattr(request, 'user') and request.user.is_authenticated else 'Anonymous'
            logger.debug(f"Admin Scope: Disabling scopes for user {user_pk}")
            with scopes_disabled():
                response = self.get_response(request)

        return response

    def _is_admin_request(self, request):
        """Checks if the request path resolves to the Django admin app."""
        try:
            # Use resolve to be independent of the actual admin URL prefix
            resolver_match = resolve(request.path_info)
            return resolver_match.app_name == 'admin'
        except Resolver404:
            # Not a standard Django URL, likely static file or similar
            return False
        except Exception as e:
            # Log unexpected errors during resolution
            logger.error(f"Error resolving admin path '{request.path_info}': {e}", exc_info=True)
            return False

    def _get_user_tenant(self, request):
        """
        Attempts to retrieve the tenant associated with the request's user.
        Returns the tenant object if found and user is staff, otherwise None.
        """
        if not hasattr(request, 'user') or not request.user.is_authenticated:
            # User not logged in (e.g., admin login page)
            return None

        if not request.user.is_staff:
             # User is logged in but not staff - shouldn't access admin anyway,
             # but we definitely don't apply scopes based on them.
             return None

        # --- User is authenticated and staff ---
        try:
            # Get the profile object using the configured attribute name
            profile = getattr(request.user, self.profile_attr_name, None)
            if profile:
                # Get the tenant object using the configured attribute name
                tenant = getattr(profile, self.tenant_attr_name, None)
                return tenant # Will be None if the tenant field is null
            else:
                # User has no profile object
                logger.warning(f"Admin Scope: Staff user {request.user.pk} has no '{self.profile_attr_name}' attribute.")
                return None
        except ObjectDoesNotExist:
             # This can happen if the relation exists but the related object (profile) wasn't created
             logger.warning(f"Admin Scope: Profile object does not exist for staff user {request.user.pk} via attribute '{self.profile_attr_name}'.")
             return None
        except AttributeError:
            # Should be caught by getattr above, but belt-and-suspenders
            logger.error(f"Admin Scope: Error accessing profile/tenant for user {request.user.pk}. Check attributes '{self.profile_attr_name}', '{self.tenant_attr_name}'.")
            return None
        except Exception as e:
            # Catch-all for unexpected errors during profile/tenant access
            logger.error(f"Admin Scope: Unexpected error getting tenant for user {request.user.pk}: {e}", exc_info=True)
            return None


class PublicApiScopeMiddleware:
    """
    Disables django-scopes for public API endpoints.
    
    This middleware ensures that public API endpoints don't require a tenant scope,
    allowing them to be accessed without a tenant context.
    """
    def __init__(self, get_response):
        self.get_response = get_response
        # Regex pattern to match API endpoints that should be unscoped
        self.api_pattern = re.compile(r'^/api/')
        logger.info("PublicApiScopeMiddleware initialized")
        
    def __call__(self, request):
        # Check if this is an API request
        if self.is_api_request(request):
            # Log detailed information about the request
            logger.info(f"API Scope: Processing request - Method: {request.method}, Path: {request.path_info}")
            
            # Disable scopes for API requests
            logger.debug(f"API Scope: Disabling scopes for API request {request.path_info}")
            
            # Use a more robust approach to disable scopes
            with scopes_disabled():
                try:
                    # Process the request with disabled scopes
                    response = self.get_response(request)
                    logger.info(f"API Scope: Successfully processed {request.method} request to {request.path_info}")
                    return response
                except Exception as e:
                    # Log any exceptions that occur during processing
                    logger.error(f"API Scope: Error processing request {request.path_info}: {e}", exc_info=True)
                    raise
        
        # Not an API request, process normally
        return self.get_response(request)
    
    def is_api_request(self, request):
        """Checks if the request path matches the API pattern."""
        is_api = bool(self.api_pattern.match(request.path_info))
        if is_api:
            logger.debug(f"API Scope: Identified API request - Method: {request.method}, Path: {request.path_info}")
        return is_api