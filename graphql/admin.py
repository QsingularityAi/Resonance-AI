from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from django.contrib import messages
from django.urls import path, reverse
from django.http import HttpResponseRedirect
from django.utils.html import format_html
from django import forms
import json
from django.template.response import TemplateResponse

from graphql.models import GraphQlResource
from graphql.tasks import retrieve_graphql_data

class FieldMappingForm(forms.Form):
    """
    Form for editing field mappings.
    """
    # Basic Configuration
    static_url = forms.URLField(
        required=False,
        help_text=_("Base URL for static assets like images and documents")
    )
    title_field = forms.CharField(
        required=False,
        help_text=_("Field to use as the title in markdown output")
    )
    date_format = forms.CharField(
        required=False,
        initial="%Y-%m-%d",
        help_text=_("Format string for date fields (e.g., %Y-%m-%d)")
    )
    unwrap_node_field = forms.CharField(
        required=False,
        help_text=_("Field name to unwrap from edges/node structure")
    )
    
    # Image Links
    image_links_path_field = forms.CharField(
        required=False,
        initial="fullpath",
        label=_("Image Links Path Field"),
        help_text=_("Field containing the image path")
    )
    image_links_alt_field = forms.CharField(
        required=False,
        initial="filename",
        label=_("Image Links Alt Field"),
        help_text=_("Field containing the image alt text")
    )
    
    # Document Links
    document_links_path_field = forms.CharField(
        required=False,
        initial="fullpath",
        label=_("Document Links Path Field"),
        help_text=_("Field containing the document path")
    )
    document_links_label_field = forms.CharField(
        required=False,
        initial="filename",
        label=_("Document Links Label Field"),
        help_text=_("Field containing the document label")
    )
    
    # Field Lists
    image_fields = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={'rows': 3}),
        help_text=_("Fields containing image URLs or image objects (one per line)")
    )
    video_fields = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={'rows': 3}),
        help_text=_("Fields containing video URLs or video objects (one per line)")
    )
    date_fields = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={'rows': 3}),
        help_text=_("Fields containing date values (one per line)")
    )
    ignore_fields = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={'rows': 3}),
        help_text=_("Fields to ignore in the markdown output (one per line)")
    )
    
    # Link Fields
    link_fields = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={'rows': 5}),
        help_text=_("Fields containing links with optional URL templates (format: field_name=url_template, one per line)")
    )
    
    # Multi-Image Arrays
    multi_image_arrays = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={'rows': 5}),
        help_text=_("Fields containing arrays of images (format: field_name=array_path,item_path,limit, one per line)")
    )
    
    # Extract Fields
    extract_fields = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={'rows': 5}),
        help_text=_("Fields where you want to extract a specific value from a dictionary (format: field_name=extract_field, one per line)")
    )
    
    # Custom Formatters
    custom_formatters = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={'rows': 5}),
        help_text=_("Custom formatters for specific fields (format: field_name=format_template, one per line)")
    )
    
    def __init__(self, *args, **kwargs):
        initial = kwargs.get('initial', {})
        if 'field_mappings' in initial:
            mappings = initial.pop('field_mappings')
            
            # Basic Configuration
            initial['static_url'] = mappings.get('static_url', '')
            initial['title_field'] = mappings.get('title_field', '')
            initial['date_format'] = mappings.get('date_format', '%Y-%m-%d')
            initial['unwrap_node_field'] = mappings.get('unwrap_node_field', '')
            
            # Image Links
            image_links = mappings.get('image_links', {})
            initial['image_links_path_field'] = image_links.get('path_field', 'fullpath')
            initial['image_links_alt_field'] = image_links.get('alt_field', 'filename')
            
            # Document Links
            document_links = mappings.get('document_links', {})
            initial['document_links_path_field'] = document_links.get('path_field', 'fullpath')
            initial['document_links_label_field'] = document_links.get('label_field', 'filename')
            
            # Field Lists
            initial['image_fields'] = '\n'.join(mappings.get('image_fields', []))
            initial['video_fields'] = '\n'.join(mappings.get('video_fields', []))
            initial['date_fields'] = '\n'.join(mappings.get('date_fields', []))
            initial['ignore_fields'] = '\n'.join(mappings.get('ignore_fields', []))
            
            # Link Fields
            link_fields = mappings.get('link_fields', {})
            initial['link_fields'] = '\n'.join([f"{k}={v}" for k, v in link_fields.items()])
            
            # Multi-Image Arrays
            multi_image_arrays = mappings.get('multi_image_arrays', {})
            initial['multi_image_arrays'] = '\n'.join([
                f"{k}={v.get('array_path', '')},{v.get('item_path', '')},{v.get('limit', 0)}"
                for k, v in multi_image_arrays.items()
            ])
            
            # Extract Fields
            extract_fields = mappings.get('extract_fields', {})
            initial['extract_fields'] = '\n'.join([f"{k}={v}" for k, v in extract_fields.items()])
            
            # Custom Formatters
            custom_formatters = mappings.get('custom_formatters', {})
            initial['custom_formatters'] = '\n'.join([f"{k}={v}" for k, v in custom_formatters.items()])
            
            kwargs['initial'] = initial
        
        super().__init__(*args, **kwargs)
    
    def to_json(self):
        """
        Convert form data to JSON.
        """
        data = self.cleaned_data
        
        # Create the mappings dictionary
        mappings = {
            'static_url': data.get('static_url', ''),
            'title_field': data.get('title_field', ''),
            'date_format': data.get('date_format', '%Y-%m-%d'),
            'unwrap_node_field': data.get('unwrap_node_field', ''),
            'image_fields': [f.strip() for f in data.get('image_fields', '').splitlines() if f.strip()],
            'video_fields': [f.strip() for f in data.get('video_fields', '').splitlines() if f.strip()],
            'date_fields': [f.strip() for f in data.get('date_fields', '').splitlines() if f.strip()],
            'ignore_fields': [f.strip() for f in data.get('ignore_fields', '').splitlines() if f.strip()],
        }
        
        # Image Links
        mappings['image_links'] = {
            'path_field': data.get('image_links_path_field', 'fullpath'),
            'alt_field': data.get('image_links_alt_field', 'filename'),
        }
        
        # Document Links
        mappings['document_links'] = {
            'path_field': data.get('document_links_path_field', 'fullpath'),
            'label_field': data.get('document_links_label_field', 'filename'),
        }
        
        # Link Fields
        link_fields = {}
        for line in data.get('link_fields', '').splitlines():
            if '=' in line:
                key, value = line.split('=', 1)
                link_fields[key.strip()] = value.strip()
        mappings['link_fields'] = link_fields
        
        # Multi-Image Arrays
        multi_image_arrays = {}
        for line in data.get('multi_image_arrays', '').splitlines():
            if '=' in line:
                key, value = line.split('=', 1)
                key = key.strip()
                parts = value.split(',')
                if len(parts) >= 2:
                    array_path = parts[0].strip()
                    item_path = parts[1].strip()
                    limit = int(parts[2].strip()) if len(parts) > 2 and parts[2].strip().isdigit() else 0
                    multi_image_arrays[key] = {
                        'array_path': array_path,
                        'item_path': item_path,
                        'limit': limit,
                    }
        mappings['multi_image_arrays'] = multi_image_arrays
        
        # Extract Fields
        extract_fields = {}
        for line in data.get('extract_fields', '').splitlines():
            if '=' in line:
                key, value = line.split('=', 1)
                extract_fields[key.strip()] = value.strip()
        mappings['extract_fields'] = extract_fields
        
        # Custom Formatters
        custom_formatters = {}
        for line in data.get('custom_formatters', '').splitlines():
            if '=' in line:
                key, value = line.split('=', 1)
                custom_formatters[key.strip()] = value.strip()
        mappings['custom_formatters'] = custom_formatters
        
        return mappings


class GraphQlResourceAdmin(admin.ModelAdmin):
    list_display = ('name', 'url', 'knowledgebase', 'get_crawl_button', 'get_field_mappings_button')
    search_fields = ('name', 'url')
    list_filter = ('knowledgebase',)
    readonly_fields = ('last_crawled', 'get_crawl_button_detail', 'get_field_mappings_button_detail', 'get_preview_button_detail')
    fieldsets = (
        (None, {
            'fields': ('name', 'url', 'knowledgebase', "tenant")
        }),
        (_('GraphQL Query'), {
            'fields': ('query', 'headers', 'extract_document_resources', 'item_identification_field', 
                      'source_url_template', 'result_metadata_fields', 
                      'pagination_start', 'pagination_batch_size', 'pagination_total_count_field', 'pagination_max_pages'),
            'classes': ('collapse',),
            'description': _(
                "Configure the GraphQL query and data processing options. For source URLs, use template syntax with {placeholder} "
                "where placeholder is a field name from the GraphQL response. Example: https://app.example.com/{language}/items/{item_id}"
            )
        }),
        (_('Response Structure'), {
            'fields': ('unwrap_node_field',),
            'classes': ('collapse',),
            'description': _(
                "Configure how to extract items from the GraphQL response structure. "
                "This is particularly useful for handling GraphQL APIs with edges/node patterns."
            )
        }),
        (_('Field Mappings'), {
            'fields': ('field_mappings', 'get_field_mappings_button_detail'),
            'classes': ('collapse',),
            'description': _(
                "Configure how fields from the GraphQL response are converted to markdown. "
                "This allows for customizing the output based on the specific structure of the API."
            )
        }),
        (_('Crawl Information'), {
            'fields': ('last_crawled', 'get_crawl_button_detail'),
            'classes': ('collapse',),
        }),
        (_('Preview'), {
            'fields': ('get_preview_button_detail',),
            'classes': ('collapse',),
            'description': _(
                "Preview the results of a GraphQL query, including the converted markdown and URL generation. "
                "This helps you test your configuration before running a full crawl."
            )
        }),
    )

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

    def save_model(self, request, obj, form, change):
        # Set create_user for new objects
        if not obj.pk:
            obj.create_user = request.user

            # Set tenant from the user's profile if not already set
            if not obj.tenant and hasattr(request.user, 'profile') and hasattr(request.user.profile, 'tenant'):
                obj.tenant = request.user.profile.tenant
                self.message_user(
                    request,
                    f"Set tenant for new GraphQl Resource to {obj.tenant}",
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
    
    actions = ['trigger_crawl']
    
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                '<int:resource_id>/crawl/',
                self.admin_site.admin_view(self.start_crawl_view),
                name='graphql_resource_crawl',
            ),
            path(
                '<int:resource_id>/field-mappings/',
                self.admin_site.admin_view(self.field_mappings_view),
                name='graphql_resource_field_mappings',
            ),
            path(
                '<int:resource_id>/preview-ajax/',
                self.admin_site.admin_view(self.preview_ajax_view),
                name='graphql_resource_preview_ajax',
            ),
        ]
        return custom_urls + urls
    
    def get_crawl_button(self, obj):
        """
        Generate a "Start Crawl" button for the list view.
        """
        if obj.pk:
            url = reverse('admin:graphql_resource_crawl', args=[obj.pk])
            return format_html(
                '<a class="button" href="{}">{}</a>',
                url,
                _("Start Crawl")
            )
        return ""
    get_crawl_button.short_description = _("Crawl")
    get_crawl_button.allow_tags = True
    
    def get_field_mappings_button(self, obj):
        """
        Generate a "Edit Field Mappings" button for the list view.
        """
        if obj.pk:
            url = reverse('admin:graphql_resource_field_mappings', args=[obj.pk])
            return format_html(
                '<a class="button" href="{}">{}</a>',
                url,
                _("Edit Field Mappings")
            )
        return ""
    get_field_mappings_button.short_description = _("Field Mappings")
    get_field_mappings_button.allow_tags = True
    
    def get_crawl_button_detail(self, obj):
        """
        Generate a "Start Crawl" button for the detail view.
        """
        if obj.pk:
            url = reverse('admin:graphql_resource_crawl', args=[obj.pk])
            return format_html(
                '<a class="button" href="{}">{}</a>',
                url,
                _("Start Crawl Now")
            )
        return ""
    get_crawl_button_detail.short_description = _("Crawl Actions")
    get_crawl_button_detail.allow_tags = True
    
    def get_field_mappings_button_detail(self, obj):
        """
        Generate a "Edit Field Mappings" button for the detail view.
        """
        if obj.pk:
            url = reverse('admin:graphql_resource_field_mappings', args=[obj.pk])
            return format_html(
                '<a class="button" href="{}">{}</a>',
                url,
                _("Edit Field Mappings")
            )
        return ""
    get_field_mappings_button_detail.short_description = _("Field Mappings Actions")
    get_field_mappings_button_detail.allow_tags = True
    
    def get_preview_button_detail(self, obj):
        """
        Render the inline preview template instead of a button.
        """
        if obj.pk:
            from django.template.loader import render_to_string
            return render_to_string(
                'admin/graphql/graphqlresource/preview_inline.html',
                {'original': obj}
            )
        return ""
    get_preview_button_detail.short_description = _("Preview GraphQL Results")
    get_preview_button_detail.allow_tags = True
    
    def preview_ajax_view(self, request, resource_id):
        """
        AJAX view for retrieving preview data with support for item selection.
        """
        from django.http import JsonResponse
        from backend.services.mongo_service import MongoService
        from graphql.services.retrieval import GraphQLRetriever
        from graphql.services.processing import GraphQLProcessor
        from graphql.services.processing import DocumentCreator
        from graphql.services.field_mapper import FieldMapper
        from graphql.services.markdown.markdown_converter_factory import MarkdownConverterFactory
        import re
        
        try:
            resource = GraphQlResource.objects.get(pk=resource_id)
            
            # Get the requested item index (default to 0)
            item_index = int(request.GET.get('item_index', 0))
            if item_index < 0:
                item_index = 0
                
            try:
                # Create a mock MongoDB service that doesn't actually save anything
                class MockMongoService:
                    def __init__(self):
                        pass
                    def get_one_rag_data(self, *args, **kwargs):
                        return None  # Always return None so we simulate a new document
                    def close(self):
                        pass
                
                mongo_service = MockMongoService()
                
                # Initialize the actual components used in processing
                retriever = GraphQLRetriever(resource)
                processor = GraphQLProcessor(mongo_service)
                document_creator = DocumentCreator(resource)
                
                # Use a larger batch size to retrieve multiple items
                # This allows us to get the requested item by index and also count total items
                sample_pagination = {
                    "pagination_start": 0,  # Always start from the beginning
                    "pagination_batch_size": max(20, item_index + 1)  # Get at least up to the requested item
                }
                
                # Execute the query to get a batch of items
                response = retriever.client.execute(resource.query, sample_pagination)
                items = retriever.parser.extract_items(response)
                
                if not items:
                    return JsonResponse({
                        'error': _("No items found in GraphQL response.")
                    })
                
                # If the requested index is out of bounds, cap it at the last item
                if item_index >= len(items):
                    item_index = len(items) - 1
                
                # Get the item at the requested index
                sample_item = items[item_index]
                
                # Convert to markdown
                field_mappings = FieldMapper(resource.get_mappings())
                converter = MarkdownConverterFactory.create_converter(sample_item, field_mappings)
                markdown = converter.convert(sample_item, resource)
                
                # Prepare the response
                result = {
                    'markdown': markdown,
                    'raw_json': json.dumps(sample_item, indent=2),
                    'resource_url': resource.url,
                    'total_items': len(items),  # Return the total number of items we retrieved
                    'current_index': item_index  # Return the actual index used
                }
                
                # Generate URL from template
                if resource.source_url_template:
                    try:
                        processed_url = document_creator._process_url_template(resource.source_url_template, sample_item)
                        
                        # Highlight placeholders in the template
                        template_with_placeholders = resource.source_url_template
                        for placeholder in re.findall(r'\{([^}]+)\}', resource.source_url_template):
                            template_with_placeholders = template_with_placeholders.replace(
                                f"{{{placeholder}}}", 
                                f'<span class="placeholder">{{{placeholder}}}</span>'
                            )
                        
                        result['source_url_template'] = True
                        result['template_with_placeholders'] = template_with_placeholders
                        result['processed_url'] = processed_url
                    except Exception as e:
                        result['error'] = str(e)
                
                return JsonResponse(result)
            
            except Exception as e:
                return JsonResponse({
                    'error': str(e)
                })
            
        except GraphQlResource.DoesNotExist:
            return JsonResponse({
                'error': _(f"GraphQL resource with ID {resource_id} does not exist.")
            })
    
    
    def start_crawl_view(self, request, resource_id):
        """
        View for handling the "Start Crawl" button click.
        """
        try:
            resource = GraphQlResource.objects.get(pk=resource_id)
            self.trigger_crawl_for_resource(request, resource)
            
            # Redirect back to the resource detail page
            return HttpResponseRedirect(
                reverse('admin:graphql_graphqlresource_change', args=[resource_id])
            )
        except GraphQlResource.DoesNotExist:
            messages.error(request, _(f"GraphQL resource with ID {resource_id} does not exist."))
            return HttpResponseRedirect(
                reverse('admin:graphql_graphqlresource_changelist')
            )
    
    def field_mappings_view(self, request, resource_id):
        """
        View for editing field mappings.
        """
        try:
            resource = GraphQlResource.objects.get(pk=resource_id)
            
            if request.method == 'POST':
                form = FieldMappingForm(request.POST)
                if form.is_valid():
                    # Update the resource with the new field mappings
                    resource.field_mappings = form.to_json()
                    resource.save()
                    
                    messages.success(request, _("Field mappings updated successfully."))
                    return HttpResponseRedirect(
                        reverse('admin:graphql_graphqlresource_change', args=[resource_id])
                    )
            else:
                # Initialize the form with the current field mappings
                form = FieldMappingForm(initial={'field_mappings': resource.field_mappings})
            
            # Render the form using the custom template
            context = {
                'title': _("Edit Field Mappings"),
                'form': form,
                'resource': resource,
                'opts': self.model._meta,
                'app_label': self.model._meta.app_label,
                'has_change_permission': self.has_change_permission(request, resource),
                'original': resource,
                'save_as': False,
                'show_save': True,
            }
            
            return TemplateResponse(
                request,
                'admin/graphql/graphqlresource/field_mappings_form.html',
                context
            )
        
        except GraphQlResource.DoesNotExist:
            messages.error(request, _(f"GraphQL resource with ID {resource_id} does not exist."))
            return HttpResponseRedirect(
                reverse('admin:graphql_graphqlresource_changelist')
            )
    
    def save_model(self, request, obj, form, change):
        if not obj.pk:  # Check if this is a new object
            obj.create_user = request.user  # Set the create_user to the current user
        obj.update_user = request.user  # Always set update_user to the current user
        super().save_model(request, obj, form, change)
        
        # Trigger the crawl task when a resource is saved
        if 'query' in form.changed_data or not change:
            self.trigger_crawl_for_resource(request, obj)
    
    def trigger_crawl(self, request, queryset):
        """
        Admin action to trigger crawling for selected GraphQL resources.
        """
        for resource in queryset:
            self.trigger_crawl_for_resource(request, resource)
        
        messages.success(request, _(f"Crawling triggered for {queryset.count()} GraphQL resources."))
    trigger_crawl.short_description = _("Trigger crawl for selected resources")
    
    def trigger_crawl_for_resource(self, request, resource):
        """
        Helper method to trigger crawling for a single GraphQL resource.
        """
        try:
            # Trigger the Celery task
            task = retrieve_graphql_data.delay(resource.id)
            
            # Update the resource with the task ID
            resource.last_crawled = task.id
            resource.save(update_fields=['last_crawled'])
            
            messages.success(
                request, 
                _(f"Crawling triggered for '{resource.name}'. Task ID: {task.id}")
            )
        except Exception as e:
            messages.error(
                request, 
                _(f"Failed to trigger crawling for '{resource.name}': {str(e)}")
            )


admin.site.register(GraphQlResource, GraphQlResourceAdmin)
