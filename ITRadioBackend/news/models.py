from django.db import models


class News(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField()
    date = models.DateTimeField(blank=True)
    author = models.CharField(max_length=255, blank=True)