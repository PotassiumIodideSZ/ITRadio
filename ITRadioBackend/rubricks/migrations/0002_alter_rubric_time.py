# Generated by Django 5.0.4 on 2024-04-16 16:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rubricks', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='rubric',
            name='time',
            field=models.DateTimeField(blank=True),
        ),
    ]
