from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import Post, Comment
from .forms import PostCreateForm, CommentForm
from django.core.exceptions import PermissionDenied

def post_list(request):
    posts = Post.objects.all().order_by('-created_at')
    context = {
        'posts': posts,
        'page_title': 'Все посты блога'
    }
    return render(request, 'post/post_list.html', context)

def post_detail(request, post_id):
    post = get_object_or_404(Post, pk=post_id)
    comments = post.comments.all().order_by('-created_at')
    if request.method == 'POST':
        # проверка на авторизацию свойство is_authenticated
        if not request.user.is_authenticated: 
            messages.warning(request, 'Авторизуйтесь, чтобы      оставить комментарий')
            return redirect('login')
        
        form = CommentForm(request.POST)
        if form.is_valid():
            comment = form.save(commit=False) #commit-сохраняет данные в БД
            comment.post = post
            comment.author = request.user
            comment.save()
            messages.success(request, 'Комментарий добавлен')
            return redirect('post:post_detail', post_id=post.id)
        else:
            messages.error(request, 'Ошибка при добавлении комментария')
    else:
        form = CommentForm()

    context = {
        'post': post,
        'comments': comments,
        'form': form,
        'page_title': post.title
    }
    return render(request, 'post/post_details.html', context)


@login_required
def create_post(request):
    if request.method == 'POST':
        form = PostCreateForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            post.author =request.user
            post.save()
            messages.success(request, 'Пост создан')
            return redirect('post:post_detail', post_id=post.id)
        else:
            messages.error(request, 'Ошибка в форме')
    else:
        form = PostCreateForm()
    context = {
        'form': form,
        'page_title': 'Создание нового поста',
    }
    return render(request, 'post/post_create.html', context)

@login_required
def edit_post(request, post_id):
    post = get_object_or_404(Post, pk=post_id, author=request.user)
    if not post.can_edit(request.user):
        messages.error(request, 'Нет прав для редактирования')
        return redirect('post:post_detail', post_id=post_id) # отправляем обратно на пост, если нет прав
    
    if request.method == 'POST':
        # instance - передача значение свойств объекта
        form = PostCreateForm(request.POST, instance=post)
        if form.is_valid():
            form.save()
            messages.success(request, 'Пост обновлен')
            return redirect('post:post_detail', post_id=post.id) 
        else:
            messages.error(request, 'Ошибки в форме')
    else:
        form = PostCreateForm(instance=post)
    context = {
        'form': form,
        'post': post,
        'page_title': f'Редактирование {post.title}'
    }
    return render(request, 'post/post_edit.html', context)

@login_required
def delete_post(request, post_id):
    post = get_object_or_404(Post, pk=post_id, author=request.user)
    if not post.can_delete(request.user):
        raise PermissionDenied('У вас нет прав на удаление') 
    # PermissionDenied - это нет прав
    
    if request.method == 'POST':
        if 'confirm_delete' in request.POST:
            post.delete()
            messages.success(request, 'Пост удален')
            return redirect('post:post_list')
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
    return render(request, 'post/post_details.html', context)

@login_required
def delete_comment(request, comment_id):
    comment = get_object_or_404(Comment, pk=comment_id)
    post_id = comment.post.id
    if not comment.can_delete(request.user):
        raise PermissionDenied('Нет прав на удаление')
    if request.method == 'POST':
        if 'confirm_delete_comment' in request.POST:
            comment.delete()
            messages.success(request, 'Комментарий успешно удален')

        return redirect('post:post_detail', post_id=post_id) # доходим до поста и его ID
    context = {
        'comment': comment,
        'page_title': 'Удаление комментария'
    }
    return render(request, 'post/comment_delete.html', context)
    

