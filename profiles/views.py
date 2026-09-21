from django.shortcuts import render, redirect, get_object_or_404 
from django.contrib.auth.decorators import login_required # импортируем декоратор авторизации для защиты страниц
from django.contrib import messages # импортируем модуль всплывающих уведомлений 
from .forms import ProfileUpdateForm # импортируем форму изменения персональных данных
from .models import Profile #импортируем модель Профиля 
from public_bulletin_board.board.models import Notice # импортируем модель объявлений 

# защищаем страницу просмотра от незарегистрированных пользователей
@login_required 
# отображение личного кабинета пользователя
def profile_view(request): 
    # Проверяем, есть ли профиль у текущего пользователя.если нет создаем
    profile, created = Profile.objects.get_or_create(user=request.user)
    
    # фильтруем объявления пользователя
    user_notices = Notice.objects.filter(author_name=request.user.username) 
    
    context = { 
        'page_title': f'Личный кабинет — {request.user.username}', 
        'notices': user_notices # передаем список объявлений автора
    }
    return render(request, 'profiles/profile_view.html', context)

@login_required 
 # изменения персональных данных профиля
def profile_edit(request):
    profile, created = Profile.objects.get_or_create(user=request.user)
    
    if request.method == 'POST': 
        form = ProfileUpdateForm(request.POST, instance=profile)
        if form.is_valid(): # проверяем данные на валидность
            form.save() #сохраняем в бд
            messages.success(request, 'Ваш профиль был успешно обновлен!') # успешное сохранение, вывод сообщения
            return redirect('profiles:profile_view') # возвращаем на просмотр личного кабинета
    else: 
        # сохраненные данные профиля 
        form = ProfileUpdateForm(instance=profile)
        
    context = { 
        'form': form, # передаем объект формы 
        'page_title': 'Редактирование профиля' # заголовок вкладки страницы
    }
    # возвращаем пользователю страницу с формой редактирования 
    return render(request, 'profiles/profile_edit.html', context)
