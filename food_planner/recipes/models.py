from django.db import models
from django.contrib.auth.models import User # импортируем модель пользователя 

# ингредиенты, например: мука, куриное филе, молоко и т.д.
class Ingredient(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="Название продукта") # название должно быть уникальным
    unit = models.CharField(max_length=20, verbose_name="Единица измерения") 

    class Meta:
        verbose_name = "Ингредиент"
        verbose_name_plural = "Ингредиенты"
        ordering = ['name'] # сортировка продуктов 

    def __str__(self):
        return f"{self.name} ({self.unit})" # отображение в админ


# рецепт 
class Recipe(models.Model):
    title = models.CharField(max_length=200, verbose_name="Название блюда") #  название блюда
    description = models.TextField(verbose_name="Шаги приготовления") # шаги приготовления рецепта
    cooking_time = models.PositiveIntegerField(verbose_name="Время готовки (мин)") # время приготовления рецепта в минутах
    image = models.ImageField(upload_to='recipes/', blank=True, null=True, verbose_name="Обложка рецепта") # загрузка обложки рецепта
    
    # связь многие-ко-многим с ингредиентами через модель RecipeIngredient
    ingredients = models.ManyToManyField(Ingredient, through='RecipeIngredient', related_name='recipes', verbose_name="Ингредиенты")

    class Meta:
        verbose_name = "Рецепт"
        verbose_name_plural = "Рецепты"
        ordering = ['title']

    def __str__(self):
        return self.title


# состав рецепта 
class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, verbose_name="Рецепт") # при удалении рецепта удалится его состав
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE, verbose_name="Ингредиент") # при удалении продукта он удалится из состава
    amount = models.PositiveIntegerField(verbose_name="Количество") # количество продукта в блюде

    class Meta:
        verbose_name = "Компонент состава"
        verbose_name_plural = "Составы рецептов"
        unique_together = ('recipe', 'ingredient') #нельзя добавить один и тот же продукт в один рецепт дважды

    def __str__(self):
        return f"{self.recipe.title} -> {self.ingredient.name}: {self.amount} {self.ingredient.unit}"


# план питания на неделю
class MealPlan(models.Model):
    # варианты для выбора типа приема пищи 
    MEAL_TYPES = [
        ('Breakfast', 'Завтрак'),
        ('Lunch', 'Обед'),
        ('Dinner', 'Ужин'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='meal_plans', verbose_name="Пользователь") # пользователь
    date = models.DateField(verbose_name="Дата приема пищи") # конкретный день недели
    meal_type = models.CharField(max_length=20, choices=MEAL_TYPES, verbose_name="Прием пищи") # выбор времени приема пищи
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='scheduled_meals', verbose_name="Выбранное блюдо") # рецепт

    class Meta:
        verbose_name = "План питания"
        verbose_name_plural = "Планы питания"
        ordering = ['-date', 'meal_type'] # сортировка дат 

    def __str__(self):
        return f"{self.user.username} | {self.date} | {self.get_meal_type_display()} — {self.recipe.title}"
