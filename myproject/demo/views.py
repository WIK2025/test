from django.shortcuts import render, redirect
from .models import Article
from .forms import ArtcleForm
# Create your views here.
from .models import Article
# request - обязательный параметр(объект запроса) функции
def home(request):
    articles = Article.objects.all() # получение объектов
    # каждый обработчик обязательно заканчивается return и каждая ветка
    return render(request, 'demo/home.html', {'articles': articles, })
def home(request):
    if request.metod == 'POST':
        form = ArtcleForm(request.POST)
        if form. is_valid():
            form.save()# сохраняем в БД
            # в redirect указываем имя url
            return redirect('home') # redirect всегда для избежания повторной отправки формы
        else:
            form = ArticleForm()# пустая форма для GET - запроса
            artticles = Article.objects.all().order_by('-id')
            return render(request, 'demo/home.html',{
                'articles':artticles,
                'form': form,
            })