from django.contrib import admin
from .models import MoodPost

@admin.register(MoodPost)
class MoodPostAdmin(admin.ModelAdmin):
    # какие колонки отображаются в таблице 
    list_display = ('id', 'author', 'text', 'created_at')
    # поля
    list_display_links = ('id', 'author')
    #  фильтр по дате создания
    list_filter = ('created_at',)
    # поиск по автору и тексту 
    search_fields = ('author', 'text')
