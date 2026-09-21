from django.apps import AppConfig #импортируем класс конфигурации 
# объявляем класс для модуля профилей
class ProfilesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'public_bulletin_board.profiles' 
    verbose_name = 'Профили участников'
   # готовность приложения
    def ready(self): 
        # относительный импорт через одну точку
        from . import signals 
        print("Сигнал: Модуль автоматических сигналов успешно запущен!")
