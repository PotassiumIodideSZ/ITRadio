# Generated by Django 5.0.4 on 2024-05-06 19:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('userProfile', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='likedSongs',
            field=models.JSONField(blank=True, null=True),
        ),
    ]
