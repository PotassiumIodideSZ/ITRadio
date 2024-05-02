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
            current_songs = instance.likedSongs or []
            # Check if the song ID already exists in the current songs
            if not any(song['id'] == new_song['id'] for song in current_songs):
                current_songs.append(new_song)
                instance.likedSongs = current_songs
            instance.save()
        return instance
