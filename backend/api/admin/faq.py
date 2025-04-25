import csv
from typing import List, Optional, Set
from django.http import HttpResponse, HttpRequest
from django.urls import path
from django.shortcuts import redirect
from backend.api.models import FAQ, Chatbot, FAQCategory
from django.utils.html import format_html
from django.contrib import admin
from django.template.response import TemplateResponse
from django.contrib import messages
from django.urls import reverse
from logging import getLogger
logger = getLogger(__name__)


class FAQInline(admin.TabularInline):  # or use StackedInline for a more detailed view
    model = FAQ
    extra = 1  # number of empty forms to display
    fields = ('question', 'answer')
    
    class Media:
        css = {
            'all': ('admin/faq_admin.css',)
        }


@admin.register(FAQCategory)
class FAQCategoryAdmin(admin.ModelAdmin):
    """Admin interface for managing FAQ Categories with import/export functionality."""

    list_display = ('name', 'knowledgebase', 'faq_count')
    change_form_template = 'admin/faqcategory_change_form.html'
    list_filter = ('knowledgebase',)
    
    def get_list_display(self, request):
        """
        Modify list_display to include tenant field only for superusers
        """
        list_display = list(self.list_display)
        if request.user.is_superuser:
            # Add tenant after name to keep name as the first clickable column
            list_display.insert(1, 'tenant')
        return list_display
    search_fields = ('name',)
    inlines = [FAQInline]
    def save_model(self, request, obj, form, change):
        """
        Override save_model to:
        1. Set tenant for new FAQ categories
        2. Update tenant for all related FAQs when FAQCategory tenant changes
        3. Check that the tenant of the knowledgebase and the FAQCategory match
        """
        # If this is a new object (not a change) and tenant is not set
        if not change and not obj.tenant and hasattr(request.user, 'profile') and hasattr(request.user.profile, 'tenant'):
            # Set tenant from the user's profile
            obj.tenant = request.user.profile.tenant
            self.message_user(
                request,
                f"Set tenant for new FAQ category to {obj.tenant}",
                level=messages.SUCCESS
            )
        
        # Check if the tenant of the knowledgebase matches the tenant of the FAQCategory
        if obj.knowledgebase and obj.tenant and obj.knowledgebase.tenant != obj.tenant:
            self.message_user(
                request,
                f"Error: The tenant of the knowledgebase ({obj.knowledgebase.tenant}) does not match the tenant of the FAQ category ({obj.tenant}).",
                level=messages.ERROR
            )
            # Don't save the model and return to prevent the save operation
            return
        
        # Check if this is an existing object and if the tenant has changed
        if change and 'tenant' in form.changed_data:
            # Save the model first
            super().save_model(request, obj, form, change)
            
            # Update all related FAQs with the new tenant
            obj.faqs.update(tenant=obj.tenant)
            
            # Log the update
            faq_count = obj.faqs.count()
            if faq_count > 0:
                self.message_user(
                    request,
                    f"Updated tenant for {faq_count} related FAQ(s)",
                    level=messages.SUCCESS
                )
        else:
            # Normal save behavior
            super().save_model(request, obj, form, change)
            
    def save_formset(self, request, form, formset, change):
        """
        Override save_formset to ensure tenant is set for inline FAQs
        """
        instances = formset.save(commit=False)
        
        for instance in instances:
            # If it's a FAQ instance and tenant is not set, set it from the parent category
            if isinstance(instance, FAQ) and not instance.tenant:
                instance.tenant = form.instance.tenant
            instance.save()
            
        # Also handle deleted objects
        for deleted_object in formset.deleted_objects:
            deleted_object.delete()
            
        formset.save_m2m()

    def faq_count(self, obj: FAQCategory) -> int:
        """Return the number of FAQs in this category."""
        return obj.faqs.count()

    faq_count.short_description = 'Number of FAQs'

    def export_import_buttons(self, obj: FAQCategory) -> str:
        """Render export/import buttons for the admin interface."""
        return format_html(
            '<a class="button" href="{}">Export CSV</a> '
            '<a class="button" href="{}">Import CSV</a>',
            reverse('admin:faqcategory_export_csv', args=[obj.pk]),
            reverse('admin:faqcategory_import_csv', args=[obj.pk])
        )

    export_import_buttons.short_description = 'Actions'

    def get_readonly_fields(self, request, obj=None):
        """
        Ensure tenant field is not in readonly_fields for superusers
        """
        readonly_fields = list(super().get_readonly_fields(request, obj))
        if not request.user.is_superuser and 'tenant' not in readonly_fields:
            readonly_fields.append('tenant')
        return readonly_fields
    
    def get_fieldsets(self, request, obj=None):
        """
        Modify fieldsets to include tenant field only for superusers
        """
        # Define base fieldsets if not already defined
        base_fieldsets = [
            (None, {
                'fields': ('name', 'knowledgebase')
            }),
        ]
        
        # If user is superuser, add tenant field
        if request.user.is_superuser:
            base_fieldsets[0] = (
                base_fieldsets[0][0],
                {'fields': ('tenant', 'name', 'knowledgebase')}
            )
            
        return base_fieldsets
    
    def get_urls(self) -> List:
        """Add custom URLs for import/export functionality."""
        urls = super().get_urls()
        custom_urls = [
            path('<int:category_id>/export-csv/',
                 self.admin_site.admin_view(self.export_csv),
                 name='faqcategory_export_csv'),
            path('<int:category_id>/import-csv/',
                 self.admin_site.admin_view(self.import_csv),
                 name='faqcategory_import_csv'),
        ]
        return custom_urls + urls



    def handle_csv_export(self, category: FAQCategory) -> HttpResponse:
        """Create and format CSV response for FAQ export."""
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="{category.name}_faqs.csv"'
        response.write(u'\ufeff'.encode('utf-8'))  # Excel UTF-8 BOM

        writer = csv.writer(response, dialect='excel')
        writer.writerow(['id', 'question', 'answer'])

        for faq in category.faqs.all():
            writer.writerow([faq.id, faq.question, faq.answer])

        return response

    def export_csv(self, request: HttpRequest, category_id: int) -> HttpResponse:
        """Export FAQs from a specific category as CSV."""
        category = self.get_object(request, category_id)
        if not category:
            self.message_user(request, 'Category not found', level=messages.ERROR)
            return redirect('..')
        return self.handle_csv_export(category)

    def _handle_existing_faq(self, row: dict, category: FAQCategory, imported_faq_ids: Set[int]) -> None:
        """Handle row with existing FAQ ID."""
        try:
            faq = FAQ.objects.get(id=row['id'])
            if faq.category_id != category.id:
                self._create_new_faq(row, category, imported_faq_ids)
            else:
                # Only save if content has actually changed
                if faq.question != row['question'] or faq.answer != row['answer'] or faq.tenant != category.tenant:
                    faq.question = row['question']
                    faq.answer = row['answer']
                    faq.tenant = category.tenant  # Ensure tenant is set correctly
                    faq.save()
                imported_faq_ids.add(faq.id)
        except FAQ.DoesNotExist:
            self._create_new_faq(row, category, imported_faq_ids)

    def _create_new_faq(self, row: dict, category: FAQCategory, imported_faq_ids: Set[int]) -> None:
        """Create a new FAQ entry."""
        faq = FAQ.objects.create(
            category=category,
            question=row['question'],
            answer=row['answer'],
            tenant=category.tenant  # Set the tenant to the category's tenant
        )
        imported_faq_ids.add(faq.id)

    def import_csv(self, request: HttpRequest, category_id: int) -> HttpResponse:
        """Import FAQs from CSV into a specific category."""
        category = self.get_object(request, category_id)
        if not category:
            self.message_user(request, 'Category not found', level=messages.ERROR)
            return redirect('..')

        if request.method == 'POST':
            try:
                return self._handle_csv_import(request, category)
            except Exception as e:
                self.message_user(request, f'Error importing data: {str(e)}', level=messages.ERROR)
                return redirect('.')

        return TemplateResponse(request, 'admin/faqcategory_import.html', {
            'title': f'Import FAQs for category: {category.name}',
            'category': category,
            'opts': self.model._meta,
        })

    def _handle_csv_import(self, request: HttpRequest, category: FAQCategory) -> HttpResponse:
        """Handle the CSV import process."""
        try:
            csv_file = request.FILES.get('csv_file')
            if not csv_file:
                self.message_user(request, 'No file was uploaded', level=messages.ERROR)
                return redirect('.')

            # Try different encodings
            encodings_to_try = ['utf-8', 'latin1', 'cp1252', 'iso-8859-1']
            decoded_file = None
            successful_encoding = None

            for encoding in encodings_to_try:
                try:
                    # Reset file pointer
                    csv_file.seek(0)
                    decoded_file = csv_file.read().decode(encoding)
                    successful_encoding = encoding
                    break
                except UnicodeDecodeError:
                    continue

            if decoded_file is None:
                self.message_user(
                    request,
                    'Could not decode file. Please save the CSV with UTF-8 encoding.',
                    level=messages.ERROR
                )
                return redirect('.')

            logger.info(f"Successfully decoded CSV with {successful_encoding} encoding")

            # Process the CSV data
            from io import StringIO
            csv_data = csv.DictReader(StringIO(decoded_file))

            # Validate CSV structure
            required_fields = {'question', 'answer'}
            if not csv_data.fieldnames or not all(field in csv_data.fieldnames for field in required_fields):
                self.message_user(
                    request,
                    'Invalid CSV structure. Required columns: question, answer',
                    level=messages.ERROR
                )
                return redirect('.')

            remove_others = request.POST.get('remove_others') == 'on'
            imported_faq_ids = set()

            # Process rows
            row_count = 0
            for row in csv_data:
                try:
                    self.process_csv_row(row, category, imported_faq_ids)
                    row_count += 1
                except Exception as e:
                    logger.error(f"Error processing row {row_count + 1}: {str(e)}")
                    self.message_user(
                        request,
                        f'Error in row {row_count + 1}: {str(e)}',
                        level=messages.ERROR
                    )
                    return redirect('.')

            if remove_others:
                deleted_count = category.faqs.exclude(id__in=imported_faq_ids).delete()[0]
                logger.info(f"Deleted {deleted_count} FAQs not in import file")

            self.message_user(
                request,
                f'Successfully imported {row_count} FAQs'
                + (f' and deleted {deleted_count} existing FAQs' if remove_others else ''),
                level=messages.SUCCESS
            )
            return redirect('admin:api_faqcategory_change', category.id)

        except Exception as e:
            logger.error(f"CSV import error: {str(e)}")
            self.message_user(
                request,
                f'Error during import: {str(e)}',
                level=messages.ERROR
            )
            return redirect('.')


    def process_csv_row(self, row: dict, category: FAQCategory, imported_faq_ids: Set[int]) -> None:
        """Process a single row from the imported CSV file."""
        if 'id' in row and row['id']:
            self._handle_existing_faq(row, category, imported_faq_ids)
        else:
            self._create_new_faq(row, category, imported_faq_ids)

    def changelist_view(self, request: HttpRequest, extra_context: Optional[dict] = None) -> HttpResponse:
        """Override changelist view to add import permission."""
        extra_context = extra_context or {}
        extra_context['has_import_permission'] = True
        return super().changelist_view(request, extra_context)