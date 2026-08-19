from django.contrib import admin
# Register your models here.
from .models import Article

# admin.site.register(Article)
# декоратор оборачивает класс который наследуется от базоваой модели админа
@admin.register(Article)
class  ArticleAdmin(admin.ModelAdmin):
    # какие колонки показывать в списке
    list_display = ('id', 'title')
    # по каким полям искать
    search_fields = ('title', 'content')