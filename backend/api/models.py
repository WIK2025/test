from django.db import models

class MoodPost(models.Model):
    # текст сообщения длина 280 символов
    text = models.CharField(max_length=280)
    # имя автора 
    author = models.CharField(max_length=100, default="Аноним")
    # дата и время создания 
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.author}: {self.text[:20]}"
