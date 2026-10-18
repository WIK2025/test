import datetime  # Импортируем встроенный модуль Python для работы с системными датами и временем
from collections import Counter  # Импортируем класс Counter для быстрого подсчета повторяющихся элементов в списках
from rest_framework import status  # Импортируем стандартный справочник кодов ответов HTTP (200, 400, 404)
from rest_framework.decorators import api_view  # Импортируем декоратор DRF для создания функциональных API-представлений
from rest_framework.response import Response  # Импортируем класс Response для отправки структурированного JSON клиенту
from rest_framework.views import APIView  # Импортируем класс APIView для создания объектных контроллеров

# эмодзи настроения 
MOOD_EMOJIS = {
    "great": "😊",
    "good": "🙂",
    "neutral": "😐",
    "bad": "🙁",
    "awful": "😫"
}

def calculate_streak(entries):
    """Вычисление количества дней подряд (streak) по дат-ключам"""
    if not entries:  # если словарь записей сессии пустой 
        return 0  # Возвращаем 0
    sorted_dates = sorted(
        [datetime.datetime.strptime(d, "%Y-%m-%d").date() for d in entries.keys()],  # конвертируем строки дат в объекты date
        reverse=True  # сортируем даты в обратном порядке
    )  
    today = datetime.date.today()  # фиксируем сегодняшнюю дату 
    yesterday = today - datetime.timedelta(days=1)  # вычисляем вчерашнюю дату для проверки 
    
    if today not in sorted_dates and yesterday not in sorted_dates:  # если пользователь пропустил 
        return 0  # если серия дней подряд прервана, возвращаем ноль
        
    streak = 1  # инициализиациябазовый счетчика
    for i in range(len(sorted_dates) - 1):  # осортировка дат истории
        if (sorted_dates[i] - sorted_dates[i+1]).days == 1:  # если разница между датами ровно один день
            streak += 1  # увеличиваем на один день
        elif (sorted_dates[i] - sorted_dates[i+1]).days > 1:  # если разрыв в днях 
            break  # выходим из цикла, фиксируем текущее значение 
    return streak  # вВозвращаем итоговое количество дней подряд

# ListAPIView - автомат. запрос ко всем моделям объекта
class PointOfSaleAPIView(APIView):
    
    def get(self, request):
        # Если сессия новая или пустая, принудительно создаем 
        if "entries" not in request.session or not isinstance(request.session["entries"], dict):
            request.session["entries"] = {}  # создаем пустой словарь для записи
            request.session.modified = True  
            
        entries = request.session["entries"]  # считываем словарь записей из сессии
        
        # расчет статистики для вывода 
        total_entries = len(entries)  # общее количество сохраненных дней
        streak = calculate_streak(entries)  # функция вычисления дней подряд
        
        moods_list = [item["mood"] for item in entries.values()]  # собираем все строки настроений в список
        
        if moods_list:
            raw_dominant = Counter(moods_list).most_common(1)  # находим самое часто настроение
            dominant_mood = raw_dominant[0][0] if raw_dominant else "neutral"  # забираем ключ из кортежа
        else:
            dominant_mood = "neutral"  #если истории нет, ставим дефолт
        
        return Response({
            "entries": entries,  # массив истории на 7 дней
            "stats": {
                "total_count": total_entries,  # счетчик всех записей
                "streak": streak,  # вычисленный стрик дней подряд
                "dominant_mood_emoji": MOOD_EMOJIS.get(dominant_mood, "😐"),  # эмодзи для настроения
                "prediction": "Завтра отличный день!"  #текстовое предсказание 
            }
        }, status=status.HTTP_200_OK)  # ответ со статусом 200 ОК


@api_view(['POST'])
def calculate_shipping(request):
    
    mood = request.data.get('mood') # получаем настроение
    note = request.data.get('note') or "" # получаем заметку 
    
    # валидация
    if mood is None:
        return Response(
            {"error": "Обязательные поля для заполнения"},
            status=status.HTTP_400_BAD_REQUEST
        )  # ошибка 400, если поле настроения пустое
        
    if mood not in MOOD_EMOJIS:
        return Response({"error": "Неверный тип настроения"}, status=status.HTTP_400_BAD_REQUEST)  #защита от отправки неверных строк

    if "entries" not in request.session or not isinstance(request.session["entries"], dict):
        request.session["entries"] = {}  # инициализация словаря в сессии
        
    custom_date = request.data.get('custom_date')  
    if custom_date:
        today_str = str(custom_date)  
    else:
        today_str = datetime.date.today().strftime("%Y-%m-%d")  # берем текущий день
    
    # забираем копию словаря сессии
    current_entries = dict(request.session["entries"])
    
    # сохраняем запись за сегодняшний день 
    current_entries[today_str] = {
        "mood": mood,
        "mood_emoji": MOOD_EMOJIS[mood],
        "note": str(note)[:140]  # обрезаем текст до 140 символов 
    }
    
    # ограничиваем историю, хранить только 7 дней 
    if len(current_entries) > 7:
        sorted_keys = sorted(current_entries.keys(), reverse=True)  
        request.session["entries"] = {k: current_entries[k] for k in sorted_keys[:7]}  # Удерживаем только 7 дней
    else:
        request.session["entries"] = current_entries  # сохраняем массив 
        
    # записать данных в бд
    request.session.modified = True  
    request.session.save()  
    
    return Response({"success": "Настроение успешно сохранено"}, status=status.HTTP_200_OK)  # успешное сохранение


@api_view(['POST'])
def reset_diary(request):
    
    request.session["entries"] = {}  # зачищаем словарь записей сессии
    request.session.modified = True  
    request.session.save()  # сохраняем в базу данных
    return Response({"success": "История успешно очищена"}, status=status.HTTP_200_OK)  # успешный JSON ответ
