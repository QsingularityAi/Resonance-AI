# Generated by Django 5.1.3 on 2024-12-09 07:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crawler', '0004_crawllink_crawling_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='crawllink',
            name='crawling_status',
            field=models.CharField(choices=[('pending', 'pending'), ('started', 'started'), ('stopping', 'stopping')], default='pending', max_length=10),
        ),
    ]
