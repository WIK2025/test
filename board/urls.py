from django.urls import path
from . import views

app_name = 'board'

urlpatterns = [
    path('', views.index, name='index'),
    path('notice/<int:pk>/', views.notice_detail, name='notice_detail'),
    path('notice/<int:pk>/delete/', views.delete_notice, name='delete_notice'),
    path('register/', views.register, name='register'), 
    path('notice/<int:pk>/edit/', views.edit_notice, name='edit_notice'),
    

]
