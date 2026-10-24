from rest_framework import serializers
from .models import MoodPost

class MoodPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoodPost
        fields = ['id', 'text', 'author', 'created_at']
