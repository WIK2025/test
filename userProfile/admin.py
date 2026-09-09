from django.contrib import admin
from .models import Profile
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin

# встраиваемая модель профиля
class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    fields = ('is_moderator', 'is_blocked', 'blocked_until', 'bio', 'avatar')

# кастомизация админки пользователя
class CastomUserAdmin(UserAdmin):
    inlines = [ProfileInline]
    
    list_display = (
        'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_moderator', 'is_blocked'
    )

    @admin.display(boolean=True, description='Модератор')
    def is_moderator(self, obj):
        if hasattr(obj, 'profile'):
            return obj.profile.is_moderator
        return False

    @admin.display(boolean=True, description='Заблокирован')
    def is_blocked(self, obj):
        if hasattr(obj, 'profile'):
            return obj.profile.is_blocked
        return False


admin.site.unregister(User)
admin.site.register(User, CastomUserAdmin)


# git commit -m "feat: register Profile and CustomUserAdmin"

