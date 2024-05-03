from rest_framework.permissions import IsAuthenticated, AllowAny 
from django.shortcuts import get_object_or_404
from django.db import transaction
from rest_framework import viewsets, status, views
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed

from .models import Profile
from .serializers import ProfileSerializer

class ProfileViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def AddSong(request):
    if request.method == 'POST':
        try:
            user, validated_token = JWTAuthentication().authenticate(request)
        except (InvalidToken, AuthenticationFailed):
            return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
        new_song = request.data.get('new_song')  # new_song should be a dict
        
        profile = get_object_or_404(Profile, user=user)
        
        serializer = ProfileSerializer(profile, data={'likedSongs': new_song}, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def DeleteSong(request):
    try:
        user, _ = JWTAuthentication().authenticate(request)
    except (InvalidToken, AuthenticationFailed):
        return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)

    song_id = request.data.get('id')  # Assuming each song has a unique 'id' field
    if not song_id:
        return Response({'error': 'Song ID is required'}, status=status.HTTP_400_BAD_REQUEST)

    profile = get_object_or_404(Profile, user=user)

    if profile.likedSongs:
        # Filter out the song with the given ID
        updated_songs = [song for song in profile.likedSongs if song.get('id') != song_id]
        profile.likedSongs = updated_songs
        profile.save()
        return Response({'message': 'Song deleted'}, status=status.HTTP_204_NO_CONTENT)
    else:
        return Response({'error': 'No songs to delete'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetLikedSongs(request):
    if request.method == 'GET':
        try:
            user, _ = JWTAuthentication().authenticate(request)
        except (InvalidToken, AuthenticationFailed):
            return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
        
        profile = get_object_or_404(Profile, user=user)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data['likedSongs'], status=status.HTTP_200_OK)
    
    