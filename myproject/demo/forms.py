# 2 вида forms forms.Form - это базовая,Если не надо в БД сохранять,
# form.ModelForm - привязываем к конкретной модели.
#django из HTML будет тянуть
# ключевые методы:
# request.metods == 'POST' - проверяет отправил ли пользователь данные
# forms.is_valid() - запускает встроенные и кастомные валидаторы
# form.clened_data - словарь с данными которые были олчищены и приведенными к Python-типам данными(доступен только после проаверки валидации is_valids())
# form.save - создает 

from django import forms
from .models import Article

class ArticleForm(forms.ModelForm):
    # связь с моделью
    class Meta:
        model = Article
        fields = ['title', 'content'] # какие поля модели выводим в форму
        # аналог TextArea в HTML
        # кастомизировать поля <input type='text'>
        # настройка кастомных виджетов
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-input', 'placeholder':'Введите заголовок',
                                            'content': forms.Textarea(attrs={'class': 'form-input':'placeholder':'Текст статьи', 'rows': 4})
        }


