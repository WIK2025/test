from rest_framework import viewsets
from .models import MoodPost
from .serializers import MoodPostSerializer

class MoodPostViewSet(viewsets.ModelViewSet):
    # извлекаем посты и сортируем их 
    queryset = MoodPost.objects.all().order_by('-created_at')
    serializer_class = MoodPostSerializer
