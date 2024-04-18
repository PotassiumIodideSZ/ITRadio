from django.db import models

# class Song(models.Model):
#     name = models.CharField(max_length=255)
#     artist = models.CharField(max_length=255)
#     album = models.ForeignKey('Album', on_delete=models.CASCADE)
#     ...

# class Playlist(models.Model):
#     songs = models.ManyToManyField(Song)

# class Podcast(models.Model):
#     name = models.CharField(max_length=255)
#     hosts = models.CharField(max_length=255)