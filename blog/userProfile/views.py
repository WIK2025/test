from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth.models import User
from .forms import UserUpdateForm, ProfileUpdateForm
from .models import Profile 

@login_required
# отображение личного профиля текущего пользователя
def profile_view(request):
    
    profile, created = Profile.objects.get_or_create(user=request.user)
    
    context = {
        'profile': profile,
        'user': request.user,
        'page_title': f'Профиль — {request.user.username}'
    }
    return render(request, 'userProfile/profile.html', context)

@login_required
#  параллельное редактирование данных User и Profile 
def profile_edit(request):
   
    profile, created = Profile.objects.get_or_create(user=request.user)
    
    if request.method == 'POST':
        u_form = UserUpdateForm(request.POST, instance=request.user)
        p_form = ProfileUpdateForm(request.POST, request.FILES, instance=profile)
        
        if u_form.is_valid() and p_form.is_valid():
            u_form.save()
            p_form.save()
            messages.success(request, 'Ваш профиль был успешно обновлен!')
            return redirect('userProfile:profile')
    else:
        u_form = UserUpdateForm(instance=request.user)
        p_form = ProfileUpdateForm(instance=profile)

    context = {
        'u_form': u_form,
        'p_form': p_form,
        'page_title': 'Редактирование профиля'
    }
    return render(request, 'userProfile/profile_edit.html', context)
# просмотр профиля для модераторов в списке 
def user_profile_view(request, user_id):
    
    user_obj = get_object_or_404(User, pk=user_id)
    profile, created = Profile.objects.get_or_create(user=user_obj)
    
    context = {
        'profile': profile,
        'user': user_obj,
        'page_title': f'Профиль пользователя {user_obj.username}'
    }
    return render(request, 'userProfile/profile.html', context)
