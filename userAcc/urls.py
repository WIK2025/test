from django.urls import path
from . import views

app_name = 'userAcc'

urlpatterns = [
    path('', views.register, name='register')
]