from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required 
from django.contrib import messages
from django.db.models import Sum # ORM для суммирования чисел в базе
from .models import Recipe, MealPlan, RecipeIngredient
from .forms import SignUpForm
from django.core.exceptions import PermissionDenied

# каталог рецептов 
def recipe_list(request):
    recipes = Recipe.objects.all() # извлекаем все рецепты из бд
    context = {
        'recipes': recipes,
        'page_title': 'Каталог кулинарных рецептов'
    }
    return render(request, 'recipes/recipe_list.html', context)


# страница рецепта 
def recipe_detail(request, pk):
    recipe = get_object_or_404(Recipe, pk=pk) # ищем рецепт по ID, если нет, то ошибка 404
    # извлекаем все ингредиенты, рецепта 
    ingredients = RecipeIngredient.objects.filter(recipe=recipe)
    context = {
        'recipe': recipe,
        'ingredients': ingredients,
        'page_title': f'Рецепт — {recipe.title}'
    }
    return render(request, 'recipes/recipe_detail.html', context)


# добавление блюда в план питания на неделю 
@login_required
def add_to_plan(request, recipe_id):
    recipe = get_object_or_404(Recipe, id=recipe_id)
    
    if request.method == 'POST':
        date = request.POST.get('date') # считываем дату из формы
        meal_type = request.POST.get('meal_type') #считываем тип (Завтрак/Обед/Ужин)
        
        if not date or not meal_type:
            messages.error(request, 'Пожалуйста, выберите корректную дату и прием пищи.')
            return redirect('recipes:recipe_detail', pk=recipe.id)
            
        # создаем запись в плане питания пользователя
        MealPlan.objects.create(
            user=request.user, # привязываем к текущему пользователю
            date=date,
            meal_type=meal_type,
            recipe=recipe
        )
        messages.success(request, f'Блюдо "{recipe.title}" успешно добавлено в ваш план питания!')
        return redirect('recipes:meal_plan_view')
        
    return redirect('recipes:recipe_list')


# просмотр личного плана питания (Только для авторизованных)
def meal_plan_view(request):
    # извлекаем план питания пользователя, по датам
    plans = MealPlan.objects.filter(user=request.user).order_by('date')
    context = {
        'plans': plans,
        'page_title': 'Мой план питания на неделю'
    }
    return render(request, 'recipes/meal_plan.html', context)


# персональный список покупок 
@login_required
def shopping_list_view(request):
    # все планы питания пользователя
    user_meals = MealPlan.objects.filter(user=request.user)
    
    # извлекаем ID всех рецептов, которые пользователь запланировал
    recipe_ids = user_meals.values_list('recipe_id', flat=True)
    
    # группируем ингредиенты для рецептов по ID продукта и названию, а затем суммируем
    aggregated_ingredients = RecipeIngredient.objects.filter(
        recipe_id__in=recipe_ids
    ).values(
        'ingredient__name', 'ingredient__unit' # группируем по имени и единице измерения
    ).annotate(
        total_amount=Sum('amount') # суммируем количество продуктов
    ).order_by('ingredient__name') # сортируем список покупок 

    context = {
        'shopping_list': aggregated_ingredients,
        'page_title': 'Мой автоматический список покупок'
    }
    return render(request, 'recipes/shopping_list.html', context)


# регистрации аккаунта 
def register(request):
    if request.user.is_authenticated:
        return redirect('recipes:recipe_list')
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Аккаунт успешно создан! Теперь вы можете войти в систему.')
            return redirect('login')
    else:
        form = SignUpForm()
    return render(request, 'recipes/register.html', {'form': form, 'page_title': 'Регистрация'})


# удаление рецепта 
@login_required
def delete_recipe(request, pk):
    # находим рецепт по ID или ошибка 404
    recipe = get_object_or_404(Recipe, pk=pk)
    
    # проверяем права: удалять рецепты может только админ
    if not request.user.is_superuser:
        messages.error(request, 'У вас нет прав для удаления рецептов из базы!')
        return redirect('recipes:recipe_detail', pk=pk)
        
    if request.method == 'POST':
        title = recipe.title
        recipe.delete() # удаление из бд
        messages.success(request, f'Рецепт "{title}" успешно удален из каталога.')
        return redirect('recipes:recipe_list')
        
    # страница подтверждения удаления
    context = {
        'recipe': recipe,
        'page_title': f'Удаление рецепта — {recipe.title}'
    }
    return render(request, 'recipes/recipe_confirm_delete.html', context)
