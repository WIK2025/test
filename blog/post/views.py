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
        if not request.user.is_authenticated: 
            messages.warning(request, 'Авторизуйтесь, чтобы оставить комментарий')
            return redirect('login')
        
        form = CommentForm(request.POST)
        if form.is_valid():
            comment = form.save(commit=False)
            comment.post = post
            comment.author = request.user
            comment.save()
            messages.success(request, 'Комментарий добавлен!')
            return redirect('post:post_detail', post_id=post.id)
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
            post.author = request.user
            post.save()
            messages.success(request, 'Пост создан!')
            return redirect('post:post_detail', post_id=post.id)
    else:
        form = PostCreateForm()
    return render(request, 'post/post_create.html', {'form': form, 'page_title': 'Создание поста'})

@login_required
def edit_post(request, post_id):
    # фильтр по автору.
    if request.user.profile.is_moderator:
        post = get_object_or_404(Post, pk=post_id)
    else:
        post = get_object_or_404(Post, pk=post_id, author=request.user)
        
    if request.method == 'POST':
        form = PostCreateForm(request.POST, instance=post)
        if form.is_valid():
            form.save()
            messages.success(request, 'Пост обновлен!')
            return redirect('post:post_detail', post_id=post.id) 
    else:
        form = PostCreateForm(instance=post)
    return render(request, 'post/post_edit.html', {'form': form, 'post': post, 'page_title': 'Редактирование поста'})

@login_required
def delete_post(request, post_id):
    # фильтр по автору для защиты 
    if request.user.profile.is_moderator:
        post = get_object_or_404(Post, pk=post_id)
    else:
        post = get_object_or_404(Post, pk=post_id, author=request.user)
    
    if request.method == 'POST':
        if 'confirm_delete' in request.POST:
            post.delete()
            messages.success(request, 'Пост успешно удален.')
            return redirect('post:post_list')
        return redirect('post:post_detail', post_id=post.id) 
           
    comments = post.comments.all().order_by('-created_at')
    form = CommentForm()
    context = {
        'post': post,
        'comments': comments,
        'form': form,
        'delete_confirm': True, 
        'page_title': f'Удаление {post.title}',
    }
    return render(request, 'post/post_details.html', context)
