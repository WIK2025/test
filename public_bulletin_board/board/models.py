from django.db import models
from django.contrib.auth.models import User

class Notice(models.Model):
    title = models.CharField(max_length=100, verbose_name="Заголовок")
    content = models.TextField(verbose_name="Текст объявления")
    # объявление привязано к id аккаунта из таблицы users.
    author = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='notices', 
        verbose_name="Автор"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата публикации")

    class Meta:
        verbose_name = "Объявление"
        verbose_name_plural = "Объявления"
        ordering = ['-created_at']

    def __str__(self):
        return self.title
