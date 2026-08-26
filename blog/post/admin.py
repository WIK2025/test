from django.contrib import admin
from .models import Post, Comment
# Register your models here.
@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at', 'update_at')#добавляем кортеж
    list_filter = ('created_at', 'update_at', 'author') #добавляем кортеж
    search_fields = ('title', 'contant', 'author__username')# добавляем поисковую строка
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
@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('text__preview', 'post', 'author', 'created_at') # обрезка текста
    list_filter = ('created_at', 'author')
    search_fields = ('text', 'author__username', 'post__title')
    def text_preview(self, obj):
        return obj.text[:50] + '...' if len(obj.text)>50 else obj.text
    text_preview.short_desctiption = 'Текст комментария'
    

