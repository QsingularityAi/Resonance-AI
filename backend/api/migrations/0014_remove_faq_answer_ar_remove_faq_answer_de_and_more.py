# Generated by Django 5.1.3 on 2024-12-11 16:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_chatbot_prompt_into_squashed_0013_chatbot_no_sources_extras'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='faq',
            name='answer_ar',
        ),
        migrations.RemoveField(
            model_name='faq',
            name='answer_de',
        ),
        migrations.RemoveField(
            model_name='faq',
            name='answer_en',
        ),
        migrations.RemoveField(
            model_name='faq',
            name='answer_ru',
        ),
        migrations.RemoveField(
            model_name='faq',
            name='answer_tr',
        ),
        migrations.RemoveField(
            model_name='faq',
            name='question_ar',
        ),
        migrations.RemoveField(
            model_name='faq',
            name='question_de',
        ),
        migrations.RemoveField(
            model_name='faq',
            name='question_en',
        ),
        migrations.RemoveField(
            model_name='faq',
            name='question_ru',
        ),
        migrations.RemoveField(
            model_name='faq',
            name='question_tr',
        ),
    ]
