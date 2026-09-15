from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import Notice
from .forms import NoticeForm, SignUpForm
# главная страница доски объявлений.
def index(request):
      
# POST привязывает автора и сохраняет запись
    if request.method == 'POST':
        
        if not request.user.is_authenticated:
            return redirect('board:login')
        form = NoticeForm(request.POST)
        # валидность автора
        if form.is_valid():
            notice = form.save(commit=False)
            notice.author = request.user
            notice.save()
            messages.success(request, 'Объявление успешно опубликовано!')
            return redirect('board:index')
    else:
        form = NoticeForm()

    notices = Notice.objects.all()
    context = {
        'notices': notices,
        'form': form
    }
    return render(request, 'board/index.html', context)

# регистрация нового пользователя
def register(request):
    
    if request.user.is_authenticated:
        return redirect('board:index')
        
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Регистрация прошла успешно!')
            return redirect('board:login')
    else:
        form = SignUpForm()
    return render(request, 'board/register.html', {'form': form})
# страница объявления
def notice_detail(request, pk):
    
    notice = get_object_or_404(Notice, pk=pk)
    return render(request, 'board/notice_detail.html', {'notice': notice})

# редактирование объявления автором
@login_required
def edit_notice(request, pk):
   
    notice = get_object_or_404(Notice, pk=pk)
    
    # если юзер не автор этой записи то блокируем
    if notice.author != request.user:
        messages.error(request, 'У вас нет прав на редактирование этого объявления!')
        return redirect('board:notice_detail', pk=pk)

    if request.method == 'POST':
        form = NoticeForm(request.POST, instance=notice)
        if form.is_valid():
            form.save()
            messages.success(request, 'Объявление успешно обновлено!')
            return redirect('board:notice_detail', pk=pk)
    else:
        form = NoticeForm(instance=notice)
    return render(request, 'board/edit_notice.html', {'form': form, 'notice': notice})

# удаление объявления через форму подтверждения
@login_required
def delete_notice(request, pk):
    
    notice = get_object_or_404(Notice, pk=pk)
       
    if notice.author != request.user:
        messages.error(request, 'У вас нет прав на удаление этого объявления!')
        return redirect('board:notice_detail', pk=pk)
        
    if request.method == 'POST':
        notice.delete()
        messages.success(request, 'Объявление успешно удалено.')
        return redirect('board:index')
    
    return render(request, 'board/delete_confirm.html', {'notice': notice})
