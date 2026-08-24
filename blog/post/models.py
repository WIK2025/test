from django.db import models

# Create your models here.
class Post(models.Model):
    title = models.CharField(
        max_lenght=200,
        help_text='Введите заголовок поста'
    )
    content = models.TextField(
        verbose_name='Содержание',
        help_text='Введите тектс поста'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата создания'
    )
    update_at = models.DateTimeField(
        auto_now=True, # фиксирует кажды раз при обновлении
        verbose_name='Дата обновления'
    )
    #посты будут в админке выводиться,строковые
def __str__(self):
    return self.title

class Meta:
    verbose_name = 'Пост'
    verbose_name_plural = 'Посты'
#сортировка по полю
    ordering = ['-created_at'] # данные будут сортироваться в обратном порядке