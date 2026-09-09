from django.db import models
from django.contrib.auth.models import User 



class Post(models.Model):
    title = models.CharField(
        max_length=200,
        verbose_name='Заголовок', 
        help_text='Введите заголовок поста'
    )
    content = models.TextField(
        verbose_name='Содержание',
        help_text='Введите текст поста'
    )
    created_at = models.DateTimeField(
        auto_now_add=True, #фиксирует один раз при добавлении
        verbose_name='Дата создания'
    )
    update_at = models.DateTimeField(
        auto_now=True,#фиксирует каждый раз при обнов.
        verbose_name='Дата обновления'
    )

    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name='Автор',
        # user.posts.all()
        related_name='posts',
        null=True, # может быть null
        blank=True # может быть пустым
    )

    def __str__(self):
        return self.title

    def can_edit(self, user):
        if not user.is_authenticated: # проверяем авторизовани ли пользователь
            return False
        # автор или модератор
        return user == self.author or (hasattr(user, 'profile') and user.profile.is_moderator) #у объекта юзаер присутствует поле профайл
# удаление модератором
    def can_delete(self, user):
           if not user.is_authenticated: # проверяем авторизовани ли пользователь
               return False
           # автор или модератор
           return user == self.author or (hasattr(user, 'profile') and user.profile.is_moderator) # у объекта  юзер присутствует поле профайл
    class Meta:
        verbose_name = 'Пост'
        verbose_name_plural = 'Посты'

        ordering = ['-created_at']


class Comment(models.Model):
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        verbose_name='Пост',
        related_name='comments' #post.comments.all()
    )
    text = models.TextField(verbose_name='Текст комментария')

    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name='Автор',
        related_name='comments' # user.comments.all()
    )
    created_at = models.DateTimeField(
        auto_now_add=True, 
        verbose_name='Дата создания'
    )

    def __str__(self):
        return f'Комментарий от {self.author} к "{self.post.title}"'

    def can_delete(self, user):
                if not user.is_authenticated: # проверяем авторизовани ли пользователь
                   return False
                return user == self.author or (hasattr(user, 'profile') and user.profile.is_moderator) # у объекта  юзер присутствует поле профайл
    class Meta:
        verbose_name = 'Комментарий'
        verbose_name_plural = 'Комментарии'
        ordering = ['-created_at']
