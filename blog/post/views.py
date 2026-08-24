from django.shortcuts import render, get_object_or_404
# get_object_or_404 - получаем модель или ошибку 404
# Create your views here.
from .models import Post

def post_list(request):
    posts = Post.objects.all().order_by('-created_at')
    context = {
        'post': posts,# ключ к котррому будем обращаться в шаблоне
        'page_title': 'Все посты блога'
    }
    return render(request, 'post/post_list.html', context)

def post_detail(request, post_id):
    post = get_object_or_404(Post, pk=post_id)
    context = {
        'post': post,
        'page_title': post.title

    }
    return render(request, 'post/post_details.html', context)

