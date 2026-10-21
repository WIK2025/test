from django.db import models
from django.contrib.auth.models import User

class Tag(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="Название тега")

    class Meta:
        verbose_name = "Тег"
        verbose_name_plural = "Теги"
        ordering = ['name']

    def __str__(self):
        return self.name

class Note(models.Model):
    title = models.CharField(max_length=200, verbose_name="Заголовок")
    content = models.TextField(blank=True, verbose_name="Содержание")
    tags = models.ManyToManyField(Tag, blank=True, related_name="notes", verbose_name="Теги")
    is_pinned = models.BooleanField(default=False, verbose_name="Закреплено")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата изменения")
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notes', null=True, blank=True)
   
    class Meta:
        verbose_name = "Заметка"
        verbose_name_plural = "Заметки"
        ordering = ['-is_pinned', '-created_at']

    def __str__(self):
        return self.title
