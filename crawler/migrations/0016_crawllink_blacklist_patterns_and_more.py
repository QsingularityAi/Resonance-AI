# Generated by Django 5.1.3 on 2025-04-14 09:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crawler', '0015_crawllink_custom_cookies'),
    ]

    operations = [
        migrations.AddField(
            model_name='crawllink',
            name='blacklist_patterns',
            field=models.TextField(blank=True, help_text="Comma-separated list of URL patterns to exclude from crawling (e.g. '/blog/*,/private/*')", null=True, verbose_name='Blacklisted URL Patterns'),
        ),
        migrations.AlterField(
            model_name='crawllink',
            name='custom_cookies',
            field=models.TextField(help_text='Pre-set cookies, each a dict like {"name": "session", "value": "...", "url": "..."}.. seperated by ","', null=True, verbose_name='Custom Cookies'),
        ),
    ]
