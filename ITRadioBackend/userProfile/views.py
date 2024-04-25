from rest_framework import viewsets, status, views
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny 
from django.contrib.auth.models import User
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed

# authenitcate() verifies and decode the token
# if token is invalid, it raises an exception and returns 401
# response = JWT_authenticator.authenticate(request)
# if response is not None:
#     # unpacking
#     user , token = response
#     print("this is decoded token claims", token.payload)
# else:
#     print("no token is provided in the header or the header is missing")


from .models import Profile
from .serializers import ProfileSerializer

class ProfileViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

# def get_profile_by_jwt(token):
#     try:
#         payload = jwt_decode_handler(token)
#         username = payload['username']
#         user = User.objects.get(username=username)
#         profile = Profile.objects.get(user=user)
#         return profile
#     except Exception as e:
#         # Handle exceptions such as invalid token, user or profile not found
#         return str(e)
    
@api_view(['POST'])
@permission_classes([AllowAny ])
def AddSong(request):
    if request.method == 'POST':
        token = request.data.get('token')
        if token is None:
            return Response({'error': 'No token provided'}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Manually set the Authorization header to the token string
        request.META['HTTP_AUTHORIZATION'] = f'Bearer {token}'
        
        try:
            user, validated_token = JWTAuthentication().authenticate(request)
        except (InvalidToken, AuthenticationFailed):
            return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
        new_song = request.data.get('new_song')  # new_song should be a dict
        
        try:
            profile = Profile.objects.get(user=user)
            serializer = ProfileSerializer(profile, data={'likedSongs': new_song}, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Profile.DoesNotExist:
            return Response({}, status=status.HTTP_404_NOT_FOUND)


'''
{
"user":"picc",
    "new_song": {
        "songId": "1235",
        "songName": "Example Song3"
    }
}

{
"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE0MDY2NDAyLCJpYXQiOjE3MTQwNjYxMDIsImp0aSI6ImNkNzQ0MjM2YWE3NDQ2YTBhMGZkM2ViMzYxMjQ2MmQxIiwidXNlcl9pZCI6MX0.N-Zohmlsine4onoKFDJ9oC8VIwwMI7AASdrDsOxZ0HQ",
    "new_song": {
        "songId": "1235",
        "songName": "Example Song3"
    }
}
'''