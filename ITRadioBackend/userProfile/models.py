from django.contrib.auth.models import User
from django.db import models
from django.db.models import JSONField

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    
    likedSongs = JSONField(blank=True, null=True)
    
    
    # likedSongs = models.ManyToManyField(Song)
    # likedSongs = models.TextField() 
    # podcasts = models.ManyToManyField(Podcast)
    # playlists = models.ManyToManyField(Playlist)
    
    
    
    
    
    
    
    
# #JWT    
# from django.contrib.auth.models import User
# from rest_framework.authtoken.models import Token

# for user in User.objects.all():
#     Token.objects.get_or_create(user=user)
    
# from django.conf import settings
# from django.db.models.signals import post_save
# from django.dispatch import receiver

# @receiver(post_save, sender=settings.AUTH_USER_MODEL)
# def create_auth_token(sender, instance=None, created=False, **kwargs):
#     if created:
#         Token.objects.create(user=instance)