import asyncio
import logging 

from aiogram import Bot, Dispatcher, types 
from aiogram.filters import CommandStart 
from aiogram.utils.keyboard import ReplyKeyboardBuilder 

#  токен бота
BOT_TOKEN = "8862401805:AAF6-sSFWqpeKHWjxtauhDjuGY6DTqUYWEQ"

# bнициализируем бот через сервера Telegram
bot = Bot(token=BOT_TOKEN)

# инициализируем главный диспетчер
dp = Dispatcher()

# словарь для учета выпитой воды 
user_water_tracker = {}

# обработчик старта 
@dp.message(CommandStart())
async def cmd_start(message: types.Message):
    # извлекаем Telegram ID пользователя
    user_id = message.from_user.id
    
    # если пользователя еще нет в бд
      
    if user_id not in user_water_tracker:
        user_water_tracker[user_id] = 0 # инициализируем  счетчик с нулевым значением
        
    # создаем кнопки для клавиатуры 
    kb_builder = ReplyKeyboardBuilder()
    
    # добавляем  кнопки управления 
    kb_builder.add(types.KeyboardButton(text="💧 Выпил стакан (250 мл)"))
    kb_builder.add(types.KeyboardButton(text="📊 Мой прогресс"))
    kb_builder.add(types.KeyboardButton(text="🔄 Сброс"))
    
    # настраиваем  клавиатуру
    kb_builder.adjust(1)
    
    # формируем клавиатуру
    main_menu_keyboard = kb_builder.as_markup(
        resize_keyboard=True, # уменьшаем кнопки под экран
        one_time_keyboard=False # клавиатура 
    )
    
    # отправляем пользователю приветствие 
    await message.answer(
        f"Привет, {message.from_user.first_name}! 👋\n"
        f"Я бот «Гидратор» и я помогу вам следить за дневной нормой воды. 🥤\n"
        f"Используйте кнопки ниже, чтобы фиксировать выпитую воду!",
        reply_markup=main_menu_keyboard # привязываем клавиатуру к сообщению
    )

# обработчик нажатия на кнопку добавления воды 
@dp.message(lambda message: message.text == "💧 Выпил стакан (250 мл)")
async def handle_drink_glass(message: types.Message):
    user_id = message.from_user.id # получаем ID пользователя
    
    # если пользователя нет в словаре, регистрируем его
    if user_id not in user_water_tracker:
        user_water_tracker[user_id] = 0
        
    # прибавляем ровно 250 мл 
    user_water_tracker[user_id] += 250
    
    # извлекаем новое значение выпитой воды для пользователя
    current_total = user_water_tracker[user_id]
    
    # отпраляемпользователю текстовое подтверждение записи 
    await message.answer(f"Записано! ✅ Итого: {current_total} мл. 💧")

# обработчик нажатия на кнопку проверки прогресса
@dp.message(lambda message: message.text == "📊 Мой прогресс")
async def handle_view_progress(message: types.Message):
    user_id = message.from_user.id # получаем ID пользователя
    
    # если пользователя нет то ставим 0
    total_drunk = user_water_tracker.get(user_id, 0)
    
    # показ прогресса за текущий день
    response_text = f"📋 За сегодня вы выпили: {total_drunk} мл воды. "
    
    # если выпито больше или равно 2000 мл, поздравляем пользователя
    if total_drunk >= 2000:
        response_text += "\n\n🎉 Поздравляю! Вы выполнили дневную норму в 2 литра! Отличный результат! 🏆🥳"
    else:
        # если норма еще не набрана, подсказываем остаток
        remains = 2000 - total_drunk
        response_text += f"\nДо нормы в 2000 мл осталось выпить еще {remains} мл.💪"
        
    # отправляем текст пользователю
    await message.answer(response_text)

# обработчик нажатия на кнопку обнуления счетчика воды
@dp.message(lambda message: message.text == "🔄 Сброс")
async def handle_reset_tracker(message: types.Message):
    user_id = message.from_user.id # получаем ID пользователя
    
    # обнуляем счетчик воды для пользователя 
    user_water_tracker[user_id] = 0
    
    # подтверждаем сброс
    await message.answer("Счетчик обнулен! 🔄 Начнем заново. Не забывай пить воду! 🥤")

# функция запуска бота  
async def main():
    #  вывод системных сообщений в консоль
    logging.basicConfig(level=logging.INFO)
    print("Бот «Гидратор» успешно запущен и готов к работе!")
    
    # запуск опроса сервера Telegram 
    await dp.start_polling(bot, skip_updates=True)

# точка входа в для запуска асинхронного процесса
if __name__ == "__main__":
    # запускаем асинхронный цикл функнией main
    asyncio.run(main())
