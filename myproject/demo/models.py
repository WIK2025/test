from django.db import models
# Create your models here.
class Article(models.Model): 
    title = models.CharField(max_length=200, verbose_name='Заголовок')
    content = models.TextField(verbose_name='Текст')
    # строковое представление объекта в админке метод STR
    def __str__(self):
        return self.title
    
    
