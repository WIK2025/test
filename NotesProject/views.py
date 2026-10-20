from rest_framework import viewsets
from .models import Note, Tag
from .serializers import NoteSerializer, TagSerializer

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer

    def get_queryset(self):
        qs = Note.objects.prefetch_related('tags').all()
        search_query = self.request.query_params.get('search', None)
        tag_query = self.request.query_params.get('tag', None)

        if search_query:
            qs = qs.filter(title__icontains=search_query) | qs.filter(content__icontains=search_query)
        if tag_query:
            qs = qs.filter(tags__name__iexact=tag_query)
        return qs.distinct()
