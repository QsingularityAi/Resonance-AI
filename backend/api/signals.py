# backend/api/signals.py
from django.db.models.signals import pre_save, post_save, post_delete
from django.dispatch import receiver
from django.db import models
from dependency_injector.wiring import inject, Provide
from extra_settings.models import Setting

from backend.api.models import FAQ, Knowledgebase, FAQCategory, Chatbot
from backend.api.di.di import DI
from backend.api.services.faq_service import FaqService
from hw_rag.services.qdrant_service import QdrantService
from typing import Optional, TYPE_CHECKING
import logging
import os
from django.conf import settings
from django.core.cache import cache
from django.core.files.storage import default_storage

logger = logging.getLogger(__name__)



@receiver(pre_save, sender=FAQ)
@inject
def handle_faq_knowledge_change(sender, instance, faq_service: FaqService = Provide[DI.faq_service], **kwargs):
    if not instance.pk:  # Skip for new instances
        return

    try:
        old_instance = FAQ.objects.select_related('category').get(pk=instance.pk)
        if not old_instance.category:
            return

        # Handle knowledge base change
        if not instance.category or old_instance.category.knowledgebase_id != instance.category.knowledgebase_id:
            faq_service.handle_faq_change(instance, old_instance.category.knowledgebase_id)

    except FAQ.DoesNotExist:
        pass

@receiver(post_save, sender=FAQ)
@inject
def handle_faq_save(sender, instance: FAQ, created, faq_service: FaqService = Provide[DI.faq_service], **kwargs):
    faq_service.handle_faq_change(instance)

@receiver(post_delete, sender=FAQ)
@inject
def handle_faq_deletion(sender, instance: FAQ, faq_service: FaqService = Provide[DI.faq_service], **kwargs):
    faq_service.delete_faq(instance)

@receiver(pre_save, sender=FAQCategory)
@inject
def handle_category_knowledge_change(sender, instance, faq_service: FaqService = Provide[DI.faq_service], **kwargs):
    if not instance.pk:  # Skip for new instances
        return

    try:
        old_instance = FAQCategory.objects.get(pk=instance.pk)
        if old_instance.knowledgebase_id != instance.knowledgebase_id:
            # Get all FAQs before the category changes
            faqs = list(instance.faqs.all())
            for faq in faqs:
                # Delete from old KB and insert into new KB
                faq_service.handle_faq_change(faq, old_instance.knowledgebase_id)
    except FAQCategory.DoesNotExist:
        pass

@receiver(post_save, sender=Knowledgebase)
@inject
def create_qdrant_collection(sender, instance, created, qdrant: QdrantService = Provide[DI.qdrant_service],  **kwargs):
    if created:
        logger.info("Creating qdrant collection " + qdrant.get_collection_name(instance.id))
        qdrant.initialize_collection(instance.id)
    # No exception handling (rollback transaction in MySQL if Qdrant collection creation fails)


@receiver(post_delete, sender=Knowledgebase)
@inject
def delete_qdrant_collection(sender, instance, qdrant: QdrantService = Provide[DI.qdrant_service],  **kwargs):
    qdrant.delete_collection(instance.id)
    logger.info("Deleting qdrant collection " + qdrant.get_collection_name(instance.id))
    # No exception handling (rollback transaction in MySQL if Qdrant deletion fails)


@receiver(post_save, sender=Setting)
def update_jazzmin_setting(sender, instance, **kwargs):
    from backend.utils.jazzmin import update_jazzmin_settings
    update_jazzmin_settings(instance)


# File cleanup functionality for Chatbot images

def file_cleanup(sender, **kwargs):
    """
    File cleanup callback used to emulate the old delete
    behavior using signals. Initially django deleted linked
    files when an object containing a File/ImageField was deleted.
    """
    for fieldname in [f.name for f in sender._meta.get_fields()]:
        try:
            field = sender._meta.get_field(fieldname)
        except:
            field = None

        if field and isinstance(field, models.FileField):
            inst = kwargs["instance"]
            f = getattr(inst, fieldname)
            
            # Skip if the field is empty or None
            if not f:
                continue
                
            # Skip if the file doesn't exist
            if not hasattr(f, 'path') or not f.name:
                continue
                
            m = inst.__class__._default_manager
            
            # Check if the file exists and is not used by other instances
            if (
                os.path.exists(f.path)
                and not m.filter(
                    **{"%s__exact" % fieldname: getattr(inst, fieldname)}
                ).exclude(pk=inst.pk)
            ):
                try:
                    logger.info(f"Deleting file on model deletion: {f.path}")
                    default_storage.delete(f.path)
                except Exception as e:
                    logger.error(f"Error deleting file {f.path}: {str(e)}")


def pre_save_file_cleanup(sender, instance, **kwargs):
    """
    Delete old file when replacing with a new file.
    """
    if not instance.pk:
        return  # Skip for new instances

    try:
        old_instance = sender.objects.get(pk=instance.pk)
    except sender.DoesNotExist:
        return  # Skip if old instance doesn't exist

    for fieldname in [f.name for f in sender._meta.get_fields()]:
        try:
            field = sender._meta.get_field(fieldname)
        except:
            field = None

        if field and isinstance(field, models.FileField):
            old_file = getattr(old_instance, fieldname)
            new_file = getattr(instance, fieldname)
            
            # Skip if old file is empty
            if not old_file or not old_file.name:
                continue
                
            # Only delete if the file has changed
            if old_file != new_file:
                try:
                    # Check if the file exists before trying to delete it
                    if hasattr(old_file, 'path') and os.path.exists(old_file.path):
                        logger.info(f"Deleting old file: {old_file.path}")
                        default_storage.delete(old_file.path)
                except Exception as e:
                    logger.error(f"Error deleting file {old_file}: {str(e)}")


# Connect signals for Chatbot model to handle file cleanup
post_delete.connect(file_cleanup, sender=Chatbot, dispatch_uid="chatbot.file_cleanup")
pre_save.connect(pre_save_file_cleanup, sender=Chatbot, dispatch_uid="chatbot.pre_save_file_cleanup")