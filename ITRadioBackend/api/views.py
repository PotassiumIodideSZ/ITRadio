from rest_framework.views import APIView
from rest_framework.response import Response
from .models import NowPlayingSong
from .serializers import WebhookSerializer
import json

class AzuraNowPlayingWebhookView(APIView):
    queryset = NowPlayingSong.objects.all()
    def post(self, request, *args, **kwargs):
    # Ensure the 'now_playing' data includes a 'song' key
        data = request.data.get('now_playing')
        serializer = WebhookSerializer(data=data)
        print(data)
        if serializer.is_valid():
            song = serializer.save()
            print("valid")
            return Response(data, status=201)
        return Response(serializer.errors, status=400)