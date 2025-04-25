from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

from hw_rag.dataclasses import RAGType
from hw_rag.i_chatbot_config import IChatbotConfig
from django_scopes.manager import ScopedManager
from django.utils.translation import gettext_lazy as _
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from django.db import models
import base64
import uuid
import logging
import os

logger = logging.getLogger(__name__)



class Tenant(models.Model):
    name = models.CharField(max_length=255, unique=True, verbose_name=_('name'))

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("Tenant")
        verbose_name_plural = _("Tenants")


class UserProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.PROTECT,
        null=True,
        blank=True
    )
    is_tenant_admin = models.BooleanField(
        default=False,
        verbose_name=_('tenant administrator'),
        help_text=_('Designates that this user can manage users and groups within their tenant.')
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_users',
        verbose_name=_('created by'),
        help_text=_('The admin who created this user.')
    )

    def __str__(self):
        return f"{self.user.username}'s Profile"

# Signal handler to create a user profile when a user is created
# The created_by field will be set in the admin's save_model method
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        # Create a new profile for the user
        UserProfile.objects.create(user=instance)
        logger.info(f"Created profile for new user {instance.username}")

class Knowledgebase(models.Model):
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.PROTECT,  # Or CASCADE if KB should delete with Tenant
        null=True,
        blank=True,
        related_name='knowledgebases'  # Use plural model name
    )
    name = models.CharField(max_length=255, verbose_name=_('name'))
    description = models.TextField(blank=True, verbose_name=_('description'))
    objects = ScopedManager(tenant="tenant")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("Knowledgebase")
        verbose_name_plural = _("Knowledgebases")




class Chatbot(models.Model, IChatbotConfig):
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.PROTECT,  # Or CASCADE
        null=True,
        blank=True,
        related_name='chatbots'
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    primary_color = models.CharField(max_length=7, verbose_name=_('primary color'))
    text_color = models.CharField(max_length=7, verbose_name=_('text color'))
    header_title = models.CharField(max_length=255, verbose_name=_('header title'))
    assistant_name = models.CharField(max_length=255, verbose_name=_('assistant name'))
    main_prompt_extras = models.TextField(verbose_name=_('prompt extras for main prompt'))
    query_optimizer_extras = models.TextField(verbose_name=_('prompt extras for query-optimizer'))
    related_questions_extras = models.TextField(verbose_name=_('prompt extras for related questions'))
    no_sources_extras = models.TextField(verbose_name=_('prompt extras for for no sources answer'))

    def get_chatbot_image_path(instance, filename, usage):
        """
        Define the upload path for chatbot images.
        Creates a subdirectory with tenant_id (or 0 if no tenant).
        Renames the file to <chatbot_uuid>-<usage>.<ext>

        Args:
            instance: The Chatbot instance
            filename: Original filename
            usage: Usage identifier (e.g., 'logo', 'avatar')
        """
        # Determine tenant directory - use 0 if no tenant
        tenant_dir = '0'
        if instance.tenant and instance.tenant.id:
            tenant_dir = str(instance.tenant.id)

        # Get file extension
        ext = filename.split('.')[-1] if '.' in filename else ''

        # Create filename with chatbot UUID and usage
        new_filename = f"{instance.id}-{usage}.{ext}"

        # Return the complete path
        return f"chatbot_images/{tenant_dir}/{new_filename}"

    def logo_upload_path(instance, filename):
        return Chatbot.get_chatbot_image_path(instance, filename, 'logo')

    def avatar_upload_path(instance, filename):
        return Chatbot.get_chatbot_image_path(instance, filename, 'avatar')

    logo = models.ImageField(upload_to=logo_upload_path, blank=True, null=True, verbose_name=_('logo'))
    avatar = models.ImageField(upload_to=avatar_upload_path, blank=True, null=True, verbose_name=_('avatar'))

    CHATBOT_STYLES = [
        ('default', _('Default')),
        ('glass', _('Glass (same as default)')),
        ('dosb', _('DOSB')),
    ]
    chatbot_style = models.CharField(
        max_length=20,
        choices=CHATBOT_STYLES,
        default='default',
        verbose_name=_('Chatbot Style')
    )

    # Contact information
    contact_name = models.CharField(max_length=255, verbose_name=_('contact name'))
    contact_email = models.EmailField(verbose_name=_('contact email'))
    tech_contact_name = models.CharField(max_length=255, verbose_name=_('technical contact name'))
    tech_contact_email = models.EmailField(verbose_name=_('technical contact email'))

    # Multilingual fields
    welcome_title = models.TextField(verbose_name=_('welcome title'))
    welcome_text = models.TextField(verbose_name=_('welcome text'))
    welcome_additional_text = models.TextField(verbose_name=_('welcome additional text'))
    first_message = models.CharField(max_length=255, verbose_name=_('first message'))

    knowledgebase = models.ManyToManyField(Knowledgebase, blank=True, verbose_name=_('knowledgebase'))
    rag_type = models.CharField(
        max_length=10,
        choices=RAGType.choices(),
        default=RAGType.SIMPLE.value
    )
    objects = ScopedManager(tenant="tenant")

    class Meta:
        verbose_name = _('Chatbot')
        verbose_name_plural = _('Chatbots')

    def __str__(self):
        return self.header_title

    def get_logo_base64(self):
        return self._get_image_base64(self.logo)

    def get_avatar_base64(self):
        return self._get_image_base64(self.avatar)

    def _get_image_base64(self, image_field):
        if not image_field:
            return ""

        img_format = image_field.name.split('.')[-1].lower()
        if img_format == 'jpg':
            img_format = 'jpeg'

        return f"data:image/{img_format};base64,{base64.b64encode(image_field.read()).decode()}"

class FAQCategory(models.Model):
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.PROTECT,  # Or CASCADE if KB should delete with Tenant
        null=True,
        blank=True,
        related_name='faqcategories'  # Use plural model name
    )
    # Multilingual fields
    name = models.CharField(
        max_length=100,
        unique=True,
        verbose_name=_('name')
    )
    knowledgebase = models.ForeignKey(
        Knowledgebase,
        on_delete=models.RESTRICT,
        verbose_name=_('knowledgebase')
    )
    objects = ScopedManager(tenant="tenant")

    class Meta:
        verbose_name = _("FAQ")  # Changed from "FAQ Category" for the admin menu
        verbose_name_plural = _("FAQs")  # Changed from "FAQ Categories"  for the admin menu

    def __str__(self):
        return self.name


class FAQ(models.Model):
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.PROTECT,  # Or CASCADE if KB should delete with Tenant
        null=True,
        blank=True,
        related_name='faqs'  # Use plural model name
    )
    category = models.ForeignKey(
        FAQCategory,
        on_delete=models.SET_NULL,
        related_name='faqs',
        null=True,
        blank=True,
        verbose_name=_('category')
    )

    question = models.TextField(
        verbose_name=_('question')
    )
    answer = models.TextField(
        verbose_name=_('answer')
    )
    objects = ScopedManager(tenant="tenant")

    class Meta:
        verbose_name = _("FAQ")
        verbose_name_plural = _("FAQs")
