from django.contrib import admin
from .models import Ingredient, Recipe, RecipeIngredient, MealPlan # Импортируем наши 4 сущности

#  Inline форма для состава рецепта

class RecipeIngredientInline(admin.TabularInline):
    model = RecipeIngredient # указываем модель 
    extra = 1 # количество строк, при создании нового рецепта

# отображение рецептов
@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    list_display = ('title', 'cooking_time') # какие колонки показываем в общем списке рецептов
    search_fields = ('title', 'description') # по каким полям будет работать строка поиска сверху
    inlines = [RecipeIngredientInline] # подключаем Inline форму состава прямо внутрь рецепта.

# отображение ингредиентов
@admin.register(Ingredient)
class IngredientAdmin(admin.ModelAdmin):
    list_display = ('name', 'unit') # показываем название продукта и единицы измерения
    search_fields = ('name',) # поиск по названию ингредиента
    list_filter = ('unit',) # фильтр для сортировки по граммам, штукам и т.д.

# отображение плана питания 
@admin.register(MealPlan)
class MealPlanAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'meal_type', 'recipe') # полная информация о приеме пищи
    list_filter = ('date', 'meal_type', 'user') # фильтр для поиска дня недели
    search_fields = ('user__username', 'recipe__title') # поиск по имени пользователя или названию блюда
