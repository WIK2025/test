from django import forms
from django.contrib.auth.models import User
from .models import Profile

# форма для обновления бд пользователя 
class UserUpdateForm(forms.ModelForm):
    
    email = forms.EmailField(label='Электронная почта')
    class Meta:
        model = User
        fields = ['username', 'email']
        widgets = {
            'username': forms.TextInput(attrs={'class': 'form-input'}),
            'email': forms.EmailInput(attrs={'class': 'form-input'}),
        }

    def __init__(self, *args, **kwargs):
        super(UserUpdateForm, self).__init__(*args, **kwargs)
        self.fields['username'].label = 'Имя пользователя'
        self.fields['username'].help_text = ''

#  форма для обновления данных профиля 
class ProfileUpdateForm(forms.ModelForm):
   
    class Meta:
        model = Profile
        fields = ['bio', 'avatar']
        widgets = {
            'bio': forms.Textarea(attrs={'class': 'form-input', 'rows': 4, 'placeholder': 'Расскажите о себе...'}),
            'avatar': forms.FileInput(attrs={'class': 'form-file-input'}),
        }

    def __init__(self, *args, **kwargs):
        super(ProfileUpdateForm, self).__init__(*args, **kwargs)
        self.fields['bio'].label = 'О себе'
        self.fields['avatar'].label = 'Аватар профиля'

