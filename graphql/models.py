from django.db import models
from django.utils.translation import gettext_lazy as _

from backend.api.models import Knowledgebase, Tenant
from django_scopes.manager import ScopedManager


class GraphQlResource(models.Model):
    """
    Model for storing GraphQL API resources.
    """
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    name = models.CharField(max_length=200)
    url = models.URLField()
    knowledgebase = models.ForeignKey(
        Knowledgebase,  # Adjusted to reference the Knowledgebase model from another app
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_('Knowledgebase')
    )
    headers = models.JSONField(default=dict, blank=True)
    query = models.TextField()
    last_crawled = models.CharField(max_length=255, blank=True, null=True, help_text=_("ID of the last crawl task"))
    
    # Field mappings for markdown conversion
    field_mappings = models.JSONField(
        default=dict,
        blank=True,
        help_text=_(
            "JSON configuration for field mappings. Use this to customize how fields are converted to markdown. "
            "Example: {'title_field': 'name', 'image_fields': ['thumbnail', 'image'], "
            "'link_fields': {'url': 'https://example.com/{path}'}}"
        )
    )

    pagination_start = models.IntegerField(default=0, help_text=_("Start of the pagination. Default is to start with the first item found."))
    pagination_batch_size = models.IntegerField(default=0, help_text=_("Number of items to fetch per request. Set to 0 to fetch all items."))
    pagination_total_count_field = models.CharField(blank=True, null=True, max_length=255, help_text=_("Field in the Result that represents the total number of items found with the query."))
    pagination_max_pages = models.IntegerField(default=0, help_text=_("Limit the amount of pages retrieved by the pagination.")) #special field for testing/dev purposes to limit retrieved content

    item_identification_field = models.CharField(blank=True, null=True, max_length=255, help_text=_("Result Representation of some kind of item id, to update entries")) #identification key to update content entries instead of creating new ones every time
    source_url_template = models.CharField(
        max_length=500, 
        blank=True, 
        null=True,
        help_text=_(
            "Template for source URLs. Use placeholders like {field_name} to insert values from the response. "
            "Example: https://app.example.com/{language}/items/{item_id}"
        )
    )
    result_metadata_fields = models.TextField(blank=True, null=True, help_text=_("Comma seperated list of keys, that get extracted from the query result to form the metadata."))

    extract_document_resources = models.BooleanField(default=False, help_text=_("Whether or not to extract documents from this resource."))
    # GraphQL response structure configuration
    unwrap_node_field = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        help_text=_(
            "Field name to unwrap from edges/node structure. "
            "For GraphQL responses with structure like edges:[{node:{...}}, {node:{...}}], "
            "set this to 'node' to extract the contents of each node."
        )
    )
    objects = ScopedManager(tenant="tenant")


    class Meta:
        verbose_name = _("GraphQL Resource")
        verbose_name_plural = _("GraphQL Resources")

    def __str__(self):
        return self.name

    def get_default_mappings(self):
        """
        Get the default field mappings if none are specified.
        
        Returns:
            A dictionary with default field mappings.
        """
        return {
            "title_field": "title",  # Field to use as the title
            "image_fields": [],      # Fields containing image URLs
            "video_fields": [],      # Fields containing video URLs
            "link_fields": {},       # Fields containing links with optional URL templates
            "date_fields": [],       # Fields containing dates
            "ignore_fields": []      # Fields to ignore in the markdown output
        }

    def get_mappings(self):
        """
        Get the field mappings, using defaults for any missing values.
        
        Returns:
            A dictionary with field mappings.
        """
        default_mappings = self.get_default_mappings()
        
        # Use the specified mappings, falling back to defaults for missing keys
        mappings = self.field_mappings or {}
        for key, default_value in default_mappings.items():
            if key not in mappings:
                mappings[key] = default_value

        return mappings
