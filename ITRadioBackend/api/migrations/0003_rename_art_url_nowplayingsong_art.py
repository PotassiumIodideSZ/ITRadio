# Generated by Django 5.0.4 on 2024-04-21 18:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_remove_nowplayingsong_duration'),
    ]

    operations = [
        migrations.RenameField(
            model_name='nowplayingsong',
            old_name='art_url',
            new_name='art',
        ),
    ]
