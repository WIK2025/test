from django.urls import path
from .import views 

# пространство имен: post:post_list
app_name = 'post'
urlpatterns = [
    path('', views.post_list, name='post_list'),
    path('post/<int:post_id>/', views.post_detail, name='post_detail'), 
]