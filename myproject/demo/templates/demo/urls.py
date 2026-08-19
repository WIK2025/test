from django.urls import path
from .views import home
# список корневого пути http://localhost:8000/
urlpatterns = [
    path('', home, name='home'), 
    

]