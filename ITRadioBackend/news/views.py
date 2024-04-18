
# Create your views here.
from rest_framework import viewsets
from .models import News

from news.serializers import NewsSerializer

class NewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.all()
    serializer_class = NewsSerializer