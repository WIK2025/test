from django.contrib import admin
from .models import Notice

@admin.register(Notice)
class NoticeAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'created_at')
    list_filter = ('created_at',)
    # поиск по заголовку и по имени пользователя
    search_fields = ('title', 'author__username')
