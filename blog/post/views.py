from django.shortcuts import render, get_object_or_404, redirect # авторизация пользователя, декоратор
# get_object_or_404 - получаем модель или ошибку 404
# Create your views here.
from django.contrib.auth.decorators import login_required # декоратор логин
from django.contrib import messages
from .models import Post, Comment
from .forms import PostCreateForm, CommentForm # список и добавление комментариев

def post_list(request):
    posts = Post.objects.all().order_by('-created_at')
    context = {
        'post': posts,# ключ к котррому будем обращаться в шаблоне
        'page_title': 'Все посты блога'
    }
    return render(request, 'post/post_list.html', context)
# получение поста
def post_detail(request, post_id):
    post = get_object_or_404(Post, pk=post_id)
    comments = post.comments.all().order_by('created_at')
    if request.method == 'POST':
        # проверка на аавторизацию свойсто is_authenticated
        if not request.user.is_authenticated:
            messages.warning(request, 'Авторизуйтесь, чтобы оставить комментарии')
            return redirect('login')
        # Сначаало проверяем на валидность потом только сохраняем
        form = CommentForm(request.POST)
        if form.is_valid():
            comment = form.save(commit=False)# после кооммита сразу отправляет в бд(сохраняет в бд)
            comment.post = post
            comment.author = request.user #здесь хранится авторизованный пользователь
            comment.save() # сохраяем
            messages.success(request, 'Комментарии добавлен')
            return redirect('post:post_detail', post_id=post.id) # пишем эндпоинт
        else:
            messages.error(request, 'Ошибка при добавлении комментария')
    else: 
        form = CommentForm()
    context = {
        'post': post,
        'page_title': post.title,
        'form':form,
        'comments':comments,
    }
    return render(request, 'post/post_details.html', context)

@login_required

def create_post(request):
    if request.method == 'POST':
        form = PostCreateForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)   
            post.author = request.user
            post.save()
            messages.success(request,'Пост СОЗДАН')
            return redirect(request, 'post/post_details', post_id=post.id)
        else:
            messages.error(request, 'Ошибка в форме')
    else:
            form - PostCreateForm()
            context = {
                'form':form,
                'page_title': 'Создание нового поста',
        }
            return render(request, 'post/post_скуфеу.html', context)   
@login_required
def edit_post(request, post_id):
    post = get_object_or_404(Post, pk=post_id, author=request.user)
    if request.method == 'POST':
        # instance - передача значение свойств объекта
        form = PostCreateForm(request.POST, instance=post) # привязываем объект, связь с объектом
        if form.is_valid()
            form.save()
                messages.success(request, 'Пост обновлен')
                return redirect('post:post_detail', post_id=post.id)
           else: 
            messages.error(request, 'Ошибка в форме')
        else:
            form = PostCreateForm(instance=post)
            context = {
            'form': form,
            'post':post
            'page_title': f'Редактирование {post.title}'
            }
        return render(request, 'post/post_edit.html', context)

@login_required
def delete_post(request, post_id):  
        post = get_object_or_404(Post, pk=post_id, author=request.user)
        if request.method == 'POST':
            if 'confirm_delete' in request.POST:
                post.delete()
                messages.success(request, 'Пост удален')
                return redirect('post:post_lists')
            else:
                return redirect('post:post_detail', post_id=post.id)
        comments = post.comments.all().order_by('-created_at')
        form = CommentForm()
        context = {
            'post': post,
            'comments': comments,
            'form': form,
            'delete_confirm': True, #флаг для отображения кнопки подтверждения
            'page_title': f'Удаление {post.title}',
        }
        return render(request, 'post/post_detail.html', context)
                
       


