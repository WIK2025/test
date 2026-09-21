from django.contrib import admin # импортируем модуль админин
from .models import Profile # импортируем модель профиля

# регистрируем модель через декоратор admin.register
@admin.register(Profile) 
# объявляем класс профиля админа
class ProfileAdmin(admin.ModelAdmin): 
    # список колонок, профилей
    list_display = ('user', 'phone', 'birth_date')
    # добавляем поисковую строку по имени пользователя
    search_fields = ('user__username', 'phone')
