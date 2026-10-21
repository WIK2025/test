from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Note, Tag
from .serializers import NoteSerializer, TagSerializer, RegisterSerializer

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer


class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # берем заметки текущего пользователя
      
        qs = Note.objects.filter(author=self.request.user).prefetch_related('tags')
        
        # получаем параметры фильтрации 
        search_query = self.request.query_params.get('search', None)
        tag_query = self.request.query_params.get('tag', None)
        
        # текстовый поиск
        if search_query:
            qs = qs.filter(title__icontains=search_query) | qs.filter(content__icontains=search_query)
            
        # фильтр по тегу
        if tag_query:
            qs = qs.filter(tags__name__iexact=tag_query)
            
        # уникальные записи
        return qs.distinct()

    def perform_create(self, serializer):
        # сохраняем автора при создании заметки
        serializer.save(author=self.request.user)


class RegisterView(APIView):
    permission_classes = [AllowAny]  # доступно всем 

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Пользователь успешно зарегистрирован!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
