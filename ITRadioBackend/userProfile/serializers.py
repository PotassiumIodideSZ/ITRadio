from rest_framework import serializers, views, status
from rest_framework.response import Response
from .models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['user', 'likedSongs']

    def update(self, instance, validated_data):
        new_song = validated_data.get('likedSongs')
        if new_song:
            # Assuming likedSongs is a list of dicts
            current_songs = instance.likedSongs or []
            current_songs.append(new_song)
            instance.likedSongs = current_songs
        instance.save()
        return instance
