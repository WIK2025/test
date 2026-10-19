import os
from django.core.wsgi import get_wsgi_application

# связываем переменную с модулем настроек
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# создаем глобальный объект приложения 
application = get_wsgi_application()
