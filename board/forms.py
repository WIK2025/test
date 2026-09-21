from django import forms
from .models import Notice

class NoticeForm(forms.ModelForm):
    class Meta:
        model = Notice
        # поля которые будут выводиться 
        fields = ['title', 'author_name', 'content']
        widgets = {
            'title': forms.TextInput(attrs={'placeholder': 'Введите заголовок'}),
            'author_name': forms.TextInput(attrs={'placeholder': 'Ваше имя'}),
            'content': forms.Textarea(attrs={'placeholder': 'Текст объявления', 'rows': 4}),
        }
