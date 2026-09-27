from django.db import models
# Create your models here.
from django.contrib.auth.models import User
from django.utils import timezone

class Profile(models.Model):
    # Гарантирует уникальность профиля OneToOneField
    user = models.OneToOneField(
        User, on_delete=models.CASCADE,
        verbose_name='Пользователь',
        related_name='profile'
    )
    bio = models.TextField(
        max_length=500, blank=True, verbose_name='Биография'
    )
    # работа скартинками ImageField
    avatar = models.ImageField(
        upload_to='avatars/', blank=True, verbose_name='Аватар'
    )
    is_blocked = models.BooleanField(
        default=False, verbose_name='Заблокирован'
    )
    blocked_until = models.DateTimeField(
        null=True, blank=True, verbose_name='Заблокировани до'

    )
    is_moderator = models.BooleanField(
        default=False, verbose_name='Модератор'
    )

    def is_curently_blocked(self):
        if not self.is_blocked:
            return False
        if self.blocked_until and timezone.now() > self.blocked_until:
                    self.is_blocked = False
                    self.blocked_until = None
                    self.save()
                    return False
        return True
    def __str__(self):
          return f'Профиль {self.user.username}'
    class Meta:
          verbose_name = 'Профиль'
          verbose_name_plural = 'Профили'
                
