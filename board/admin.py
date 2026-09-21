from django.contrib import admin
from .models import Notice

@admin.register(Notice)
class NoticeAdmin(admin.ModelAdmin):
    # колонки в списке объявлений
    list_display = ('title', 'author_name', 'created_at')
    
    # фильтрация по дате публикации 
    list_filter = ('created_at',)
    
    # строка поиска по заголовку 
    search_fields = ('title',)
