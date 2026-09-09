from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(max_length=500, blank=True, verbose_name='Биография')
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True, verbose_name='Аватар')
    is_moderator = models.BooleanField(default=False, verbose_name='Модератор')
    is_blocked = models.BooleanField(default=False, verbose_name='Заблокирован')
    blocked_until = models.DateTimeField(blank=True, null=True, verbose_name='Заблокирован до')

    class Meta:
        verbose_name = 'Профиль'
        verbose_name_plural = 'Профили'

    def __str__(self):
        return f'Профиль пользователя {self.user.username}'

    def is_currently_blocked(self):
        """Проверяет, активна ли блокировка в данный момент"""
        if not self.is_blocked:
            return False
        if self.blocked_until and timezone.now() > self.blocked_until:
            self.is_blocked = False
            self.blocked_until = None
            self.save()
            return False
        return True
