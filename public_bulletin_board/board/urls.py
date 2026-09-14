from django.urls import path
from . import views

app_name = 'board'

urlpatterns = [
    path('', views.index, name='index'),  # главная страница
    path('notice/<int:pk>/', views.notice_detail, name='notice_detail'),  
    path('notice/<int:pk>/delete/', views.delete_notice, name='delete_notice'),
]
