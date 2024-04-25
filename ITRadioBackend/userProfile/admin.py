from django.contrib import admin

from rest_framework.authtoken.admin import TokenAdmin
from .models import Profile



TokenAdmin.raw_id_fields = ['user']



class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'likedSongs')  # Add other fields if necessary

admin.site.register(Profile, ProfileAdmin)