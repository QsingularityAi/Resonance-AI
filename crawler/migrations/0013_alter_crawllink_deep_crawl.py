# Generated by Django 5.1.3 on 2024-12-12 14:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crawler', '0012_remove_crawllink_file_deep_changed_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='crawllink',
            name='deep_crawl',
            field=models.BooleanField(default=True, help_text='Crawl the entire page or only the provided link', verbose_name='Deep Crawl'),
        ),
    ]
