from django.urls import path
from .import views 

# пространство имен: post:post_list
app_name = 'post'
urlpatterns = [
    path('', views.post_list, name='post_list'),
    path('post/<int:post_id>/', views.post_detail, name='post_detail'), 
    path('post/create', views.create_post, name='create_post'),
    path('post/edit/<int:post_id>/', views.edit_post, name='edit_post'),
    path('post/<int:post_id>/delete/', views.delete_post, name='delete_post'),

]