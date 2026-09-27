from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin
from .models import Post, Comment
from userProfile.models import Profile 

# создаем класс инлайна
class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'Модерация и Блокировка'

class CustomUserAdmin(UserAdmin):
    inlines = (ProfileInline, )
    list_display = ('username', 'email', 'is_staff', 'is_moderator_status', 'is_blocked_status')

    # выводим статус модератора в общий список
    def is_moderator_status(self, obj):
        return obj.profile.is_moderator if hasattr(obj, 'profile') else False
    is_moderator_status.boolean = True
    is_moderator_status.short_description = 'Модератор'

    # выводим статус блокировки в общий список 
    def is_blocked_status(self, obj):
        return obj.profile.is_blocked if hasattr(obj, 'profile') else False
    is_blocked_status.boolean = True
    is_blocked_status.short_description = 'Заблокирован'

# перерегистрируем стандартную модель User на CustomUserAdmin
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)


# регистрация постов и комментариев 
@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'created_at', 'update_at')
    list_filter = ('created_at', 'author')
    search_fields = ('title', 'author__username')
    
    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.author = request.user
        super().save_model(request, obj, form, change)

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('author', 'post', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('text', 'author__username')



# from django.contrib import admin
# from .models import Post, Comment
# # Register your models here.
# @admin.register(Post)
# class PostAdmin(admin.ModelAdmin):
#     list_display = ('title', 'created_at', 'update_at')#добавляем кортеж
#     list_filter = ('created_at', 'update_at', 'author') #добавляем кортеж
#     search_fields = ('title', 'contant', 'author__username')# добавляем поисковую строка
#     readonly_fields = ('created_at', 'update_at')# поля только для чтения, заполнить нельзя
#     # группировка полей на странице редактирования
#     # каждый кортеж это отдельнв\ая группа
#     fieldsets = (
#         ('Основная информация',{
#         'fields': ('title', 'content')
#     }),
#     ('Даты', {
#         'fields': ('created_at', 'update_at'),
#         'classes': ('collapse') #сворачиваемая секция
#     }),
#     )
# @admin.register(Comment)
# class CommentAdmin(admin.ModelAdmin):
#     list_display = ('text__preview', 'post', 'author', 'created_at') # обрезка текста
#     list_filter = ('created_at', 'author')
#     search_fields = ('text', 'author__username', 'post__title')
#     def text_preview(self, obj):
#         return obj.text[:50] + '...' if len(obj.text)>50 else obj.text
#     text_preview.short_desctiption = 'Текст комментария'
    

