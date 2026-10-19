from django.urls import path
from . import views

app_name = 'quiz'

urlpatterns = [
    path('', views.start_page, name='start_page'),
    path('quiz/', views.quiz_question, name='quiz_question'),
    path('quiz/result/', views.quiz_result, name='quiz_result'),
]
