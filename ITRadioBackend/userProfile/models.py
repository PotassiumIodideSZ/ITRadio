from django.contrib.auth.models import User
from django.db import models

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    
    # likedSongs = models.ManyToManyField(Song)
    # likedSongs = models.TextField() 
    # podcasts = models.ManyToManyField(Podcast)
    # playlists = models.ManyToManyField(Playlist)