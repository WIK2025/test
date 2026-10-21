from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from .views import NoteViewSet, TagViewSet, RegisterView

# инициализируем роутер для автоматической генерации путей
router = DefaultRouter()
router.register(r'tags', TagViewSet, basename='tag')
router.register(r'notes', NoteViewSet, basename='note')

urlpatterns = [
    # подключаем CRUD маршруты для заметок и тегов
    path('', include(router.urls)),
    
    # эндпоинт для регистрации пользователей
    path('register/', RegisterView.as_view(), name='register'), 
    
    # эндпоинт для логина и пароля 
    path('login/', obtain_auth_token, name='login'),  
]
