from django.urls import path
from . import views

app_name = 'userProfile'

urlpatterns = [
    path('profile/', views.profile_view, name='profile'),
    path('profile/edit/', views.profile_edit, name='profile_edit'),
    path('profile/<int:user_id>/', views.user_profile_view, name='user_profile_view'),
]
