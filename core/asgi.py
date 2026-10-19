import os
from django.core.asgiref import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# инициализируем асинхронное приложение
application = get_asgi_application()
