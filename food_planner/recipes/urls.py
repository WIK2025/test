from django.urls import path
from . import views

app_name = 'recipes'

urlpatterns = [
    path('', views.recipe_list, name='recipe_list'), # каталог рецептов
    path('recipe/<int:pk>/', views.recipe_detail, name='recipe_detail'), # детали рецепта
    path('recipe/<int:recipe_id>/add-to-plan/', views.add_to_plan, name='add_to_plan'), # добавление в план
    path('my-meal-plan/', views.meal_plan_view, name='meal_plan_view'), # план питания
    path('shopping-list/', views.shopping_list_view, name='shopping_list_view'), # список покупок
    path('register/', views.register, name='register'),
    path('recipe/<int:pk>/delete/', views.delete_recipe, name='delete_recipe'), # удаление рецепта

]
