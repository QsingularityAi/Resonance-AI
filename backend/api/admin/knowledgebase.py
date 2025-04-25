from backend.api.models import Knowledgebase
from django.contrib import admin
from hw_rag.services.qdrant_service import QdrantService
from dependency_injector.wiring import inject, Provide
from backend.api.di.di import DI
from logging import getLogger
logger = getLogger(__name__)


@admin.register(Knowledgebase)
class KnowledgebaseAdmin(admin.ModelAdmin):
    list_display = ('name', 'id', 'points_count', 'description_preview')
    search_fields = ('name', 'description')
    
    def get_list_display(self, request):
        """
        Modify list_display to include tenant field only for superusers
        """
        list_display = list(self.list_display)
        if request.user.is_superuser:
            # Add tenant after name to keep name as the first clickable column
            list_display.insert(1, 'tenant')
        return list_display
    list_filter = ('name',)
    ordering = ('id',)
    
    def get_readonly_fields(self, request, obj=None):
        """
        Ensure tenant field is not in readonly_fields for superusers
        """
        readonly_fields = list(super().get_readonly_fields(request, obj))
        if not request.user.is_superuser and 'tenant' not in readonly_fields:
            readonly_fields.append('tenant')
        return readonly_fields

    def get_queryset(self, request, qdrant: QdrantService = Provide[DI.qdrant_service]):
        queryset = super().get_queryset(request)
        qdrant = qdrant

        for kb in queryset:
            try:
                collection_name = qdrant.get_collection_name(kb.id)
                qdrant.client.get_collection(collection_name)
            except Exception as e:
                self.message_user(
                    request,
                    f"Warning: Knowledgebase {kb.name} ({kb.id}) exists but Qdrant collection is missing",
                    level='WARNING'
                )

        return queryset

    fieldsets = (
        (None, {
            'fields': ('name', 'description')
        }),
    )
    
    def get_fieldsets(self, request, obj=None):
        """
        Modify fieldsets to include tenant field only for superusers
        """
        fieldsets = list(self.fieldsets)
        fields = list(fieldsets[0][1]['fields'])
        
        # Add tenant field for superusers at the beginning
        if request.user.is_superuser and 'tenant' not in fields:
            fields.insert(0, 'tenant')
            fieldsets[0] = (fieldsets[0][0], {
                'fields': tuple(fields)
            })
        
        return fieldsets

    def description_preview(self, obj):
        return obj.description[:50] + '...' if len(obj.description) > 50 else obj.description
    description_preview.short_description = 'Description Preview'

    @inject
    def points_count(self, obj, qdrant: QdrantService = Provide[DI.qdrant_service]) -> int:
        try:
            return qdrant.get_points_count(obj.id)
        except AttributeError as e:
            logger.error(f"Invalid object or missing ID attribute: {e}")
            return -1
        except Exception as e:
            logger.error(f"Error getting points count for object {obj}: {e}")
            return -1

    points_count.short_description = 'Points Count'
    
    def save_model(self, request, obj, form, change):
        """
        Override save_model to:
        1. Set tenant for new Knowledgebase objects
        2. Prevent changing tenant when knowledgebase is assigned to other entities
        """
        # If this is an existing object and tenant has changed
        if change and 'tenant' in form.changed_data:
            # Check for related objects directly using the model relationships
            from backend.api.models import Chatbot, FAQCategory
            
            # Check for related Chatbots
            related_chatbots = Chatbot.objects.filter(knowledgebase=obj)
            
            # Check for related FAQCategories
            related_faq_categories = FAQCategory.objects.filter(knowledgebase=obj)
            
            # If there are related objects, prevent the tenant change
            has_related = related_chatbots.exists() or related_faq_categories.exists()
            
            if has_related:
                # Format the related objects for display
                related_objects_display = []
                
                # Add Chatbots if any
                if related_chatbots.exists():
                    chatbot_count = related_chatbots.count()
                    chatbot_names = []
                    
                    for chatbot in related_chatbots[:3]:
                        if hasattr(chatbot, 'header_title') and chatbot.header_title:
                            chatbot_names.append(chatbot.header_title)
                        else:
                            chatbot_names.append(str(chatbot))
                    
                    if chatbot_count <= 3:
                        chatbots_display = ", ".join(chatbot_names)
                    else:
                        chatbots_display = f"{', '.join(chatbot_names)} and {chatbot_count - 3} more"
                    
                    related_objects_display.append(f"- {chatbot_count} Chatbots: {chatbots_display}")
                
                # Add FAQCategories if any
                if related_faq_categories.exists():
                    faq_count = related_faq_categories.count()
                    faq_names = []
                    
                    for faq in related_faq_categories[:3]:
                        if hasattr(faq, 'name') and faq.name:
                            faq_names.append(faq.name)
                        else:
                            faq_names.append(str(faq))
                    
                    if faq_count <= 3:
                        faqs_display = ", ".join(faq_names)
                    else:
                        faqs_display = f"{', '.join(faq_names)} and {faq_count - 3} more"
                    
                    related_objects_display.append(f"- {faq_count} FAQ Categories: {faqs_display}")
                    
                # Create the error message
                error_msg = "Cannot change tenant because this knowledgebase is referenced by the following objects:\n"
                error_msg += "\n".join(related_objects_display)
                
                self.message_user(
                    request,
                    error_msg,
                    level='ERROR'
                )
                return
        
        # If this is a new object (not a change) and tenant is not set
        if not change and not obj.tenant and hasattr(request.user, 'profile') and hasattr(request.user.profile, 'tenant'):
            # Set tenant from the user's profile
            obj.tenant = request.user.profile.tenant
            self.message_user(
                request,
                f"Set tenant for new Knowledgebase to {obj.tenant}",
                level='SUCCESS'
            )
        
        # Normal save behavior
        super().save_model(request, obj, form, change)