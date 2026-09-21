from django.db import models

class Notice(models.Model):
    # заголовок объявления максимум 100 символов
    title = models.CharField(max_length=100, verbose_name="Заголовок")

    
    # текст объявления 
    content = models.TextField(verbose_name="Текст объявления")
    
    # имя автора максимум 50 символов
    author_name = models.CharField(max_length=50, verbose_name="Имя автора")
    
    # дата публикации 
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата публикации")

    class Meta:
        verbose_name = "Объявление"
        verbose_name_plural = "Объявления"
        # сортировка от новых к старым 
        ordering = ['-created_at']

    def __str__(self):
        return self.title
