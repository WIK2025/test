from django.shortcuts import render, redirect, get_object_or_404 #импортируем render, edirect, get_object_or_404
from django.contrib.auth.decorators import login_required # импортируем Декоратор защиты страниц 
from django.views.decorators.http import require_POST # импортируем Декоратор ограничения отправки POST
from django.contrib import messages #импортируем Модуль всплывающих уведомлений 
from .models import Notice # Импортируем модель объявления
from .forms import NoticeForm # импортируем форму объявления
from public_bulletin_board.profiles.forms import SignUpForm # импортируем форму регистрации пользователя

#главная страница 
# GET: Выводит форму и список всех объявлений
# POST: обрабатывает отправку формы
def index(request):
    if request.method == 'POST':
        
        if not request.user.is_authenticated:
            return redirect('login')
            
        form = NoticeForm(request.POST)
        if form.is_valid():
            
            notice = form.save(commit=False)
            notice.author_name = request.user.username  
            notice.save() # сохраняем в бд
            messages.success(request, 'Объявление успешно опубликовано!')
            # возвращаем обратно на главную страницу 
            return redirect('board:index')
    else:
        # если запрос GET создаем пустую форму
        form = NoticeForm()

    # извлекаем все объявления 
    notices = Notice.objects.all()
    
    context = {
        'notices': notices,
        'form': form
    }
    return render(request, 'board/index.html', context)

# регистрациия нового профиля
def register(request):
    # если пользователь авторизован, не даем ему повторно регистрироваться
    if request.user.is_authenticated:
        return redirect('board:index')
        
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            form.save() # сохраняем пользователя в бд
            messages.success(request, 'Регистрация прошла успешно! Теперь можете войти.')
            return redirect('login')
    else:
        form = SignUpForm()
    return render(request, 'board/register.html', {'form': form})

# страница просмотра конкретного объявления.
def notice_detail(request, pk):
    # если pk не существует,то вернет ошибку 404.
    notice = get_object_or_404(Notice, pk=pk)
    return render(request, 'board/notice_detail.html', {'notice': notice})

# редактирование объявлени. защита прав автора
@login_required
def edit_notice(request, pk):
    notice = get_object_or_404(Notice, pk=pk)
     
    # если имя автора объявления не совпадает, блокируем доступ
    if notice.author_name != request.user.username:
        messages.error(request, 'У вас нет прав на изменение этого объявления!')
        return redirect('board:notice_detail', pk=pk)

    if request.method == 'POST':
        form = NoticeForm(request.POST, instance=notice)
        if form.is_valid():# проверяем валидность формы
            form.save() # перезаписываем изменения в БД
            messages.success(request, 'Объявление успешно отредактировано!')
            return redirect('board:notice_detail', pk=pk)
    else:
        form = NoticeForm(instance=notice)
    return render(request, 'board/edit_notice.html', {'form': form, 'notice': notice})

# принимаем POST-запрос, находим объявление по pk,
# удаляем его из бд и возвращает на главную.
@require_POST
@login_required
def delete_notice(request, pk):
    notice = get_object_or_404(Notice, pk=pk)
    
    # проверка по полю author_name перед удалением
    if notice.author_name != request.user.username:
        messages.error(request, 'У вас нет прав на удаление этого объявления!')
        return redirect('board:notice_detail', pk=pk)
        
    notice.delete() # полностью стираем из БД
    messages.success(request, 'Объявление успешно удалено.')
    return redirect('board:index')
