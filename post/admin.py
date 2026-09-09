from django.contrib import admin
from .models import Post, Comment

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'created_at', 'update_at')
    list_filter = ('created_at', 'update_at', 'author')
    search_fields = ('title', 'content', 'author__username')
    readonly_fields = ('created_at', 'update_at')
    # группировка полей на странице редактирования
    fieldsets = (
        ('Основная информация', {
            'fields': ('title', 'content', 'author')
        }),
        ('Даты', {
            'fields': ('created_at', 'update_at'),
            'classes': ('collapse',) #сворачиваемая секция
        }),
    )

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('text_preview', 'post', 'author', 'created_at')
    list_filter = ('created_at', 'author')
    search_fields = ('text', 'author__username', 'post__title')

    def text_preview(self, obj):
        return obj.text[:50] + '...' if len(obj.text)>50 else obj.text
    
    text_preview.short_description = 'Текст комментария'