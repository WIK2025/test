from django.db import models # импортируем модуль моделей 
from django.contrib.auth.models import User # импортируем модель пользователя

# Объявляем класс модели профиля
class Profile(models.Model): 
    # подключаем связь один к одному пользоватя. при удалении удалится и профиль.
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile', verbose_name='Пользователь')
    
    # добавляем поле Биография максимальной длиной 500 символов
    bio = models.TextField(max_length=500, blank=True, verbose_name='Биография')
    
    # добавляем поле для телефона
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name='Номер телефона')
    
    # добавляем поле даты рождения
    birth_date = models.DateField(blank=True, null=True, verbose_name='Дата рождения')

    # внутренний класс метаданных для админа
    class Meta: 
        verbose_name = 'Профиль' # название модели в единственном числе
        verbose_name_plural = 'Профили' # название модели во множественном числе

    def __str__(self): 
        # взвращаем профиль пользователя
        return f'Профиль пользователя {self.user.username}'
