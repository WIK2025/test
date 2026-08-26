from django import forms
from .models import Comment, Post

class PostCreateForm(forms.ModelForm):
    class Meta:
        model = Post #модель в форме
        fields = ['title', 'content']
        widgets = { #ключем являнтся поле
            'title': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'Введите текст поста...'
                
            }),
        }
        labels = {
            'title': 'Заголовок', 
            'content': 'Содежание'
        } 
class CommentForm(forms.ModelForm):
    class Meta:
        model = Post #модель в форме
        fields = ['text']
        widgets = { #ключем являнтся поле
            'title': forms.Textarea(attrs={
            'class': 'form-input',
            'placeholder': 'Напишите коммантарии...'
                        
        }),
        }