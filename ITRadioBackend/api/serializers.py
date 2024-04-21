from rest_framework import serializers
from .models import NowPlayingSong

        
class NowPlayingSongSerializer(serializers.ModelSerializer):
    class Meta:
        model = NowPlayingSong
        fields = ['title', 'artist', 'album', 'genre', 'art']

class WebhookSerializer(serializers.Serializer):
    song = NowPlayingSongSerializer()
    def create(self, validated_data):
        print("create")
        song_data = validated_data.get('song')
        print(song_data)
        return NowPlayingSong.objects.create(**song_data)