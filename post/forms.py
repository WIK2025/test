from django import forms
from .models import Comment, Post

class PostCreateForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['title', 'content']
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'Введите заголовок...'
            }),
            'content': forms.Textarea(attrs={
                'class': 'form-input',
                'placeholder': 'Введите текст поста...'
            }),
        }
        labels = {
            'title': 'Заголовок',
            'content': 'Содержание'
        }

class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['text']
        widgets = {
        'text': forms.Textarea(attrs={
            'class': 'form-input',
            'placeholder': 'Напишите комментарий...'
        })
        }