from django.urls import path
from .views import PointOfSaleAPIView, calculate_shipping, reset_diary

urlpatterns = [
    path('points/', PointOfSaleAPIView.as_view(), name='diary-data'),       # GET запрос истории сессии
    path('calculate_shipping/', calculate_shipping, name='save-mood'),    # POST запрос сохранения настроения
    path('reset/', reset_diary, name='reset-diary'),                      # POST запрос очистки истории
]
