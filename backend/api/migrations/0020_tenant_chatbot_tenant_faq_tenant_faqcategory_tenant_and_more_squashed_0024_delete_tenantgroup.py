# Generated by Django 5.1.3 on 2025-04-04 12:52

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


# Functions from the following migrations need manual copying.
# Move them and any dependencies into this file, then update the
# RunPython operations to refer to the local versions:
# backend.api.migrations.0021_create_user_profiles

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0019_alter_chatbot_chatbot_style'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Tenant',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True, verbose_name='name')),
            ],
            options={
                'verbose_name': 'Tenant',
                'verbose_name_plural': 'Tenants',
            },
        ),
        migrations.AddField(
            model_name='chatbot',
            name='tenant',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='chatbots', to='api.tenant'),
        ),
        migrations.AddField(
            model_name='faq',
            name='tenant',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='faqs', to='api.tenant'),
        ),
        migrations.AddField(
            model_name='faqcategory',
            name='tenant',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='faqcategories', to='api.tenant'),
        ),
        migrations.AddField(
            model_name='knowledgebase',
            name='tenant',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='knowledgebases', to='api.tenant'),
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tenant', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='api.tenant')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='userprofile',
            name='is_tenant_admin',
            field=models.BooleanField(default=False, help_text='Designates that this user can manage users and groups within their tenant.', verbose_name='tenant administrator'),
        ),
        migrations.AddField(
            model_name='userprofile',
            name='created_by',
            field=models.ForeignKey(blank=True, help_text='The admin who created this user.', null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='created_users', to=settings.AUTH_USER_MODEL, verbose_name='created by'),
        ),
    ]
