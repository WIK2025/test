from django import forms
from django.contrib.auth.models import User
from .models import Profile

# Формы
from django import forms
from django.contrib.auth.models import User
from .models import Profile

class UserUpdateForm(forms.ModelForm):
    email = forms.EmailField(
        required=True,
        widget=forms.EmailInput(attrs={
            'class': 'form-input',
            'placeholder': 'Введите Email'
        }),
        label='Электронная почта'
    )

    class Meta:
        model = User
        fields = ['username', 'email']
        widgets = {
            'username': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'Введите имя пользователя'
            }),
        }
       
        labels = {
            'username': 'Имя пользователя',
            'email': 'Электронная почта'
        }

class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ['bio', 'avatar']
        widgets = {
            'bio': forms.Textarea(attrs={
                'class': 'form-input',
                'placeholder': 'Расскажите о себе',
                'rows': 4
            }),
            'avatar': forms.FileInput(attrs={
                'class': 'form-input',
                'accept': 'image/*'
            }),
        }
        
        labels = {
            'bio': 'Биография',
            'avatar': 'Аватар'
        }

        # git commit -m "feat: add profile editing forms"

