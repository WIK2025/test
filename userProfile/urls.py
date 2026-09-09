from django.urls import path
from . import views

app_name = 'userProfile'

urlpatterns = [
    path('', views.profile, name='profile'),
    path('edit/', views.profile_edit, name='profile_edit'), 
    path('user/<int:user_id>/', views.user_profile_view, name='user_profile_view'),
    path('user/<int:user_id>/block/', views.toggle_block_user, name='toggle_block_user'),
]


# git commit -m "feat: add profile urls "