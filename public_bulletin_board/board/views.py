from django.shortcuts import render, redirect, get_object_or_404
from .models import Notice
from .forms import NoticeForm
from django.views.decorators.http import require_POST

# Главная страница доски,
# GET: Выводит форму и список всех объявлений
# POST: орабатывает отправку формы
def index(request):
    
    if request.method == 'POST':
        form = NoticeForm(request.POST)
        if form.is_valid():
            # cохраняем объявление в бд
            form.save()
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

# страница просмотра конкретного объявления.
def notice_detail(request, pk):
    
    
    # если pk не существует,то вернет ошибку 404.
   
    notice = get_object_or_404(Notice, pk=pk)
    return render(request, 'board/notice_detail.html', {'notice': notice})

# принимаем POST-запрос, находим объявление по pk,
# удаляем его из бд и возвращает на главную.
@require_POST
def delete_notice(request, pk):
    
    notice = get_object_or_404(Notice, pk=pk)
    notice.delete()
    return redirect('board:index')