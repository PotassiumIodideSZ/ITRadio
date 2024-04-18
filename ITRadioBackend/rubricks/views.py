from rest_framework import viewsets
from .models import Rubric
from .serializers import RubricSerializer

class RubricViewSet(viewsets.ModelViewSet):
    queryset = Rubric.objects.all()
    serializer_class = RubricSerializer
