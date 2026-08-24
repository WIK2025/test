from django.contrib import admin
from .models import Post
# Register your models here.
@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at', 'update_at')#добавляем кортеж
    list_filter = ('created_at', 'update_at') #добавляем кортеж
    search_fields = ('title', 'contant')# добавляем поисковую строка
    readonly_fields = ('created_at', 'update_at')# поля только для чтения, заполнить нельзя
    # группировка полей на странице редактирования
    # каждый кортеж это отдельнв\ая группа
    fieldsets = (
        ('Основная информация',{
        'fields': ('title', 'content')
    }),
    ('Даты', {
        'fields': ('created_at', 'update_at'),
        'classes': ('collapse') #сворачиваемая секция
    }),
    )