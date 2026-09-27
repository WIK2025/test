from django.db import models
from django.contrib.auth.models import User

class Post(models.Model):
    # если пользователя удалят, то его посты тоже удалятся 
    author = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='posts', 
        verbose_name='Автор'
    )
    title = models.CharField(
        max_length=200,
        help_text='Введите заголовок поста'
    )
    content = models.TextField(
        verbose_name='Содержание',
        help_text='Введите текст поста'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата создания'
    )
    update_at = models.DateTimeField(
        auto_now=True, # фиксирует кажды раз при обновлении
        verbose_name='Дата обновления'
    )
    
    # посты будут в админке выводиться,строковые
    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Пост'
        verbose_name_plural = 'Посты'
        # сортировка по полю
        ordering = ['-created_at'] # данные будут сортироваться в обратном порядке.

class Comment(models.Model):
    # связываем комментарий с постом
    post = models.ForeignKey(
        Post, 
        on_delete=models.CASCADE, 
        related_name='comments', 
        verbose_name='Пост'
    )
    # связываем комментарий с пользователем
    author = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='comments', 
        verbose_name='Автор'
    )
    text = models.TextField(
        verbose_name='Текст комментария',
        help_text='Введите текст вашего комментария'
    )
    created_at = models.DateTimeField(
        auto_now_add=True, 
        verbose_name='Дата добавления'
    )

    class Meta:
        verbose_name = 'Комментарий'
        verbose_name_plural = 'Комментарии'
        ordering = ['-created_at'] # комментарии будут отображаться вверху списка

    def __str__(self):
        return f'Комментарий от {self.author.username} к посту {self.post.title}'
