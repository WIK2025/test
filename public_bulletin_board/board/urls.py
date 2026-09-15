from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

app_name = 'board'

urlpatterns = [
    # главная страница 
    path('', views.index, name='index'),
    # страница конкретного объявления
    path('notice/<int:pk>/', views.notice_detail, name='notice_detail'),
    path('notice/<int:pk>/edit/', views.edit_notice, name='edit_notice'),
    
    # удаление объявлений
    path('notice/<int:pk>/delete/', views.delete_notice, name='delete_notice'),
    
    # маршруты регистрации
    path('register/', views.register, name='register'),
    path('login/', auth_views.LoginView.as_view(template_name='board/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='board:index'), name='logout'),
]
