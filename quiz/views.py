from django.shortcuts import render, redirect
from .questions import QUESTIONS  # подгружаем вопросы из модуля

# старт
def start_page(request):
    if request.method == 'POST':
        request.session['score'] = 0  # сбрасываем счетчик баллов в 0
        request.session['current_question_index'] = 0  # сбрасываем индекс на первый вопрос
        request.session.modified = True  # фиксируем изменения 
        return redirect('quiz:quiz_question')  # возвращаем на первый вопрос
    return render(request, 'quiz/start.html', {'page_title': 'Старт квиза'})

# вопросы
def quiz_question(request):
    # проверка авторизации 
    if 'current_question_index' not in request.session:
        return redirect('quiz:start_page')

    current_idx = request.session['current_question_index']

    # проверка завершения вопросов 
    if current_idx >= len(QUESTIONS):
        return redirect('quiz:quiz_result')

    current_question_data = QUESTIONS[current_idx]

    if request.method == 'POST':
        selected_option = request.POST.get('user_answer')
        
        # если пользователь забыл нажать радиокнопку
        if not selected_option:
            return render(request, 'quiz/question.html', {
                'question_data': current_question_data,
                'error_message': 'Пожалуйста, выберите один из вариантов ответа!',
                'page_title': 'Вопрос викторины'
            })

        # проверка ответа 
        if selected_option == current_question_data['answer']:
            request.session['score'] += 1  # начисляем балл

        request.session['current_question_index'] += 1  
        request.session.modified = True  # сохраняем сессию

        return redirect('quiz:quiz_question')  # возврвщаем на следующий вопрос

    context = {'question_data': current_question_data, 'page_title': 'Вопрос викторины'}
    return render(request, 'quiz/question.html', context)

# результаты
def quiz_result(request):
    if 'score' not in request.session or 'current_question_index' not in request.session:
        return redirect('quiz:start_page')

    if request.method == 'POST':
        # очищаем сессию 
        if 'score' in request.session: del request.session['score']
        if 'current_question_index' in request.session: del request.session['current_question_index']
        request.session.modified = True
        return redirect('quiz:start_page')

    context = {
        'score': request.session['score'],
        'total': len(QUESTIONS),
        'page_title': 'Результаты'
    }
    return render(request, 'quiz/result.html', context)
