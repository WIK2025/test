from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .forms import UserUpdateForm, ProfileForm
from .models import Profile
from django.core.exceptions import PermissionDenied
from django.contrib.auth.models import User
from django.utils import timezone  

@login_required
def profile(request):
    profile, created = Profile.objects.get_or_create(user=request.user)
    context = {
        'profile': profile,
        'page_title': f'Профиль {request.user.username}'
    }
    return render(request, 'userProfile/profile.html', context)

@login_required
def profile_edit(request):
    profile, created = Profile.objects.get_or_create(user=request.user)
    
    if request.method == 'POST':
        u_form = UserUpdateForm(request.POST, instance=request.user)
        p_form = ProfileForm(request.POST, request.FILES, instance=profile)

        
        if u_form.is_valid() and p_form.is_valid():
            u_form.save()
            p_form.save()
            messages.success(request, 'Профиль обновлен')
            return redirect('userProfile:profile')
        else:
            messages.error(request, 'Ошибки в форме')
    else:
        u_form = UserUpdateForm(instance=request.user)
        p_form = ProfileForm(instance=profile)
        
    context = {
        'u_form': u_form, 
        'p_form': p_form, 
        'page_title': 'Редактирование профиля'
    }
    
    return render(request, 'userProfile/profile_edit.html', context)

@login_required
def user_profile_view(request, user_id):
    
    if not (hasattr(request.user, 'profile') and request.user.profile.is_moderator):
        raise PermissionDenied('Только модераторы имеют доступ')
        
    user = get_object_or_404(User, pk=user_id)
    profile = get_object_or_404(Profile, user=user)
    
    context = {
        'profile': profile,
        'view_user': user,
        'page_title': f'Профиль {user.username}',
        'is_moderator_view': True,
    }
    return render(request, 'userProfile/user_profile_view.html', context)

@login_required
def toggle_block_user(request, user_id):
   
    if not (hasattr(request.user, 'profile') and request.user.profile.is_moderator):
        raise PermissionDenied('Только модераторы имеют доступ')
        
    
    if request.user.id == user_id:
        messages.error(request, 'Вы не можете заблокировать себя')
        return redirect('userProfile:profile') 

    
    user = get_object_or_404(User, pk=user_id)
    profile = get_object_or_404(Profile, user=user)

    if request.method == 'POST':
        action = request.POST.get('action')
        days = request.POST.get('days')

        if action == 'BLOCK':
            profile.is_blocked = True
           
            if days and days.isdigit():
                days_int = int(days)
                if days_int > 0:
                    profile.blocked_until = timezone.now() + timezone.timedelta(days=days_int)
                else:
                    profile.blocked_until = None
            else:
                profile.blocked_until = timezone.now() + timezone.timedelta(days=7)   

            profile.save()
            messages.success(request, 'Пользователь заблокирован')

        elif action == 'unblock':
            profile.is_blocked = False
            profile.blocked_until = None
            profile.save()
            messages.success(request, 'Пользователь разблокирован')
            
        return redirect('userProfile:user_profile_view', user_id=user.id)

    context = {
        'block_user': user,
        'profile': profile,
        'page_title': f'Блокировка пользователя {user.username}'
    }
    return render(request, 'userProfile/block_user.html', context)
