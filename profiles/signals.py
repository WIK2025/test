from django.db.models.signals import post_save # импортируем сигнал, срабатывающий ПОСЛЕ сохранения модели
from django.dispatch import receiver # импортируем декоратор ресивера для связывания с функциями
from django.contrib.auth.models import User #импортируем модель User
from .models import Profile # импортируем Profile

@receiver(post_save, sender=User) 
# создание профиля
def create_user_profile(sender, instance, created, **kwargs): 
   
    if created: 
        # добавляем объект профиля в бд
        Profile.objects.create(user=instance)
        
        print(f"Сигнал: создан Профиль для юзера {instance.username}")

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs): # синхронизации данных профиля
    
    if hasattr(instance, 'profile'):
        # сохраняем и обновиляем данные профиля
        instance.profile.save()
        # выводим сообщение о успешной синхронизации
        print(f"===> [Django Signals]: Синхронизировано и сохранено состояние Profile для {instance.username}")
