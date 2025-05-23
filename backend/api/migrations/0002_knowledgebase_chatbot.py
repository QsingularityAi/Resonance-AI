# Generated by Django 5.1.2 on 2024-11-13 16:52

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Knowledgebase',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Chatbot',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('primary_color', models.CharField(max_length=7)),
                ('text_color', models.CharField(max_length=7)),
                ('header_title', models.CharField(max_length=255)),
                ('assistant_name', models.CharField(max_length=255)),
                ('logo', models.ImageField(blank=True, null=True, upload_to='chatbot_images/')),
                ('avatar', models.ImageField(blank=True, null=True, upload_to='chatbot_images/')),
                ('contact_name', models.CharField(max_length=255)),
                ('contact_email', models.EmailField(max_length=254)),
                ('welcome_title', models.TextField()),
                ('welcome_title_de', models.TextField(null=True)),
                ('welcome_title_en', models.TextField(null=True)),
                ('welcome_title_tk', models.TextField(null=True)),
                ('welcome_title_ru', models.TextField(null=True)),
                ('welcome_title_ar', models.TextField(null=True)),
                ('welcome_text', models.TextField()),
                ('welcome_text_de', models.TextField(null=True)),
                ('welcome_text_en', models.TextField(null=True)),
                ('welcome_text_tk', models.TextField(null=True)),
                ('welcome_text_ru', models.TextField(null=True)),
                ('welcome_text_ar', models.TextField(null=True)),
                ('welcome_additional_text', models.TextField()),
                ('welcome_additional_text_de', models.TextField(null=True)),
                ('welcome_additional_text_en', models.TextField(null=True)),
                ('welcome_additional_text_tk', models.TextField(null=True)),
                ('welcome_additional_text_ru', models.TextField(null=True)),
                ('welcome_additional_text_ar', models.TextField(null=True)),
                ('first_message', models.CharField(max_length=255)),
                ('first_message_de', models.CharField(max_length=255, null=True)),
                ('first_message_en', models.CharField(max_length=255, null=True)),
                ('first_message_tk', models.CharField(max_length=255, null=True)),
                ('first_message_ru', models.CharField(max_length=255, null=True)),
                ('first_message_ar', models.CharField(max_length=255, null=True)),
                ('knowledgebase', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.knowledgebase')),
            ],
        ),
    ]
