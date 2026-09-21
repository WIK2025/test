from django import forms # импортируем модуль форм 
from django.contrib.auth.forms import UserCreationForm # импортируем стандартную форму регистрации 
from django.contrib.auth.models import User # импортируем модель пользователя
from .models import Profile # импортируем модель профиля

 # форма для редактирования личного кабинета
class ProfileUpdateForm(forms.ModelForm):
    class Meta: 
        model = Profile 
        fields = ['bio', 'phone', 'birth_date'] 
        widgets = { 
            'bio': forms.Textarea(attrs={'placeholder': 'Расскажите о себе:', 'rows': 4}),
            'phone': forms.TextInput(attrs={'placeholder': '+7 (999) 000-00-00'}),
            'birth_date': forms.DateInput(attrs={'type': 'date'}), 
        }
# форма регистрации нового аккаунта 
class SignUpForm(UserCreationForm): 
    email = forms.EmailField(
        required=True,
        widget=forms.EmailInput(attrs={'placeholder': 'Введите ваш email'}),
        label='Электронная почта'
    )
    # Регистрируем поля юзера и почты
    class Meta: 
        model = User
        fields = ['username', 'email'] 

    def __init__(self, *args, **kwargs):
        super(SignUpForm, self).__init__(*args, **kwargs)
        self.fields['username'].widget.attrs.update({'placeholder': 'Введите имя пользователя'})
        self.fields['username'].label = 'Имя пользователя'
