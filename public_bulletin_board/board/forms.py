from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import Notice

# форма создания объявления 
class NoticeForm(forms.ModelForm):
    class Meta:
        model = Notice
        fields = ['title', 'content']
        widgets = {
            'title': forms.TextInput(attrs={'placeholder': 'Введите заголовок'}),
            'content': forms.Textarea(attrs={'placeholder': 'Текст объявления', 'rows': 4}),
        }

# форма регистрации пользователя
class SignUpForm(UserCreationForm):
    email = forms.EmailField(
        required=True,
        widget=forms.EmailInput(attrs={'placeholder': 'Введите ваш email'}),
        label='Электронная почта'
    )

    class Meta:
        model = User
        fields = ['username', 'email']

    def __init__(self, *args, **kwargs):
        super(SignUpForm, self).__init__(*args, **kwargs)
        self.fields['username'].widget.attrs.update({'placeholder': 'Введите имя пользователя'})
        self.fields['username'].label = 'Имя пользователя'
