from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Client(models.Model):
    # модель для хранения информации о клиентах 
    name = models.CharField(max_length=150, verbose_name="Название клиента / ФИО")
    
    # поиск в бд, во время импорта Excel
    email = models.EmailField(unique=True, db_index=True, verbose_name="Электронная почта")
    phone = models.CharField(max_length=20, blank=True, verbose_name="Номер телефона")
    company = models.CharField(max_length=150, blank=True, verbose_name="Компания")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата регистрации")

    class Meta:
        verbose_name = "Клиент"
        verbose_name_plural = "Клиенты"
        ordering = ["name"] # сортировка клиентов по алфавиту

    def __str__(self):
        return self.name


class Ticket(models.Model):
    # управление приоритетами заявок 
    class Priority(models.TextChoices):
        LOW = 'low', 'Низкий'
        NORMAL = 'normal', 'Обычный'
        HIGH = 'high', 'Высокий'
        CRITICAL = 'critical', 'Критический'

    # управление жизненным циклом заявки
    class Status(models.TextChoices):
        NEW = 'new', 'Новая'
        IN_PROGRESS = 'in_progress', 'В работе'
        WAITING = 'waiting', 'В ожидании'
        CLOSED = 'closed', 'Закрыта'

    # синхронизация и обновления данных из старой CRM системы
    external_id = models.CharField(max_length=30, unique=True, verbose_name="ID из старой CRM")
    
    # защита, запрещает удалять клиента, если за ним в базе числятся заявки
    client = models.ForeignKey(
        Client, 
        on_delete=models.PROTECT, 
        related_name="tickets", 
        verbose_name="Клиент"
    )
    subject = models.CharField(max_length=200, verbose_name="Тема заявки")
    description = models.TextField(blank=True, verbose_name="Описание проблемы")
    
    priority = models.CharField(
        max_length=20, 
        choices=Priority.choices, 
        default=Priority.NORMAL, 
        verbose_name="Приоритет"
    )
    status = models.CharField(
        max_length=20, 
        choices=Status.choices, 
        default=Status.NEW, 
        verbose_name="Статус"
    )
    
    # ссылка на сотрудника, который ведет заявку
    assignee = models.ForeignKey(
        User, 
        null=True, 
        blank=True, 
        on_delete=models.SET_NULL, 
        related_name="assigned_tickets", 
        verbose_name="Исполнитель"
    )
    
    # поле заполняется из Excel
    created_at = models.DateTimeField(verbose_name="Дата создания заявки")
    closed_at = models.DateTimeField(null=True, blank=True, verbose_name="Дата закрытия")

    class Meta:
        verbose_name = "Заявка"
        verbose_name_plural = "Заявки"
        ordering = ["-created_at"] # сортировка заявок
        # индексы в админ панели при фильтрации
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["assignee"]),
        ]

    def __str__(self):
        return f"#{self.external_id} {self.subject}"

    def save(self, *args, **kwargs):
        # выставление даты закрытия при переводе в статус закрыто
        if self.status == self.Status.CLOSED and not self.closed_at:
            self.closed_at = timezone.now()
        # сброс дату закрытия
        elif self.status != self.Status.CLOSED:
            self.closed_at = None
            
        super().save(*args, **kwargs)

    @property
    def is_overdue(self):
        # проверка просрочки: статус не закрыт, приоритет если прошло более 24 часов
        if self.status != self.Status.CLOSED and self.priority == self.Priority.CRITICAL:
            time_elapsed = timezone.now() - self.created_at
            return time_elapsed.total_seconds() > 86400 # 24 часа в секундах
        return False


class Comment(models.Model):
    # модель для ведения внутренней переписки по заявкам техподдержки
    ticket = models.ForeignKey(
        Ticket, 
        on_delete=models.CASCADE, 
        related_name="comments", 
        verbose_name="Заявка"
    )
    author = models.ForeignKey(
        User, 
        null=True, 
        on_delete=models.SET_NULL, 
        verbose_name="Автор комментария"
    )
    text = models.TextField(verbose_name="Текст комментария")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата добавления")

    class Meta:
        verbose_name = "Комментарий"
        verbose_name_plural = "Комментарии"
        ordering = ["created_at"]

    def __str__(self):
        # выводим первые 50 символов текста 
        return self.text[:50] if len(self.text) > 50 else self.text


class ImportLog(models.Model):
    # журнал для фиксации результатов выгрузок Excel
    user = models.ForeignKey(
        User, 
        null=True, 
        on_delete=models.SET_NULL, 
        verbose_name="Кто загрузил файл"
    )
    file_name = models.CharField(max_length=255, verbose_name="Имя файла")
    uploaded_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата загрузки")
    total_rows = models.PositiveIntegerField(verbose_name="Всего строк в файле")
    created_count = models.PositiveIntegerField(verbose_name="Создано заявок")
    updated_count = models.PositiveIntegerField(verbose_name="Обновлено заявок")
    skipped_count = models.PositiveIntegerField(verbose_name="Пропущено строк")
    
    # хранилище ошибок строк в формате JSON массива
    errors = models.JSONField(default=list, verbose_name="Ошибки по строкам")

    class Meta:
        verbose_name = "Журнал импорта"
        verbose_name_plural = "Журналы импортов"
        ordering = ["-uploaded_at"] # сначала выводим самые свежие 

    def __str__(self):
        # форматирование даты выгрузки при выводе 
        formatted_date = self.uploaded_at.strftime("%Y-%m-%d %H:%M")
        return f"{self.file_name} (uploaded_at: {formatted_date})"
