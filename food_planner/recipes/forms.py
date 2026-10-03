from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

# форма регистрации 
class SignUpForm(UserCreationForm):
    email = forms.EmailField(
        required=True,
        widget=forms.EmailInput(attrs={
            'placeholder': 'Введите ваш действующий email',
            'style': 'width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc;'
        }),
        label='Электронная почта'
    )

    class Meta:
        model = User
        fields = ['username', 'email'] # поля, которые будут видны на странице регистрации

    def __init__(self, *args, **kwargs):
        super(SignUpForm, self).__init__(*args, **kwargs)
        # плейсхолдеры и стили 
        self.fields['username'].widget.attrs.update({
            'placeholder': 'Придумайте имя пользователя',
            'style': 'width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc;'
        })
        self.fields['username'].label = 'Имя пользователя'
