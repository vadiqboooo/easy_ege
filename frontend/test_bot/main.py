import os
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command

URL = "https://894f-154-47-24-154.ngrok-free.app"

bot = Bot(token="7085382465:AAFe02KAW_VF0CNZ-dJKTzWWhSg9aczS0Gw")
dp = Dispatcher()

@dp.message(Command("start"))
async def start(message: types.Message):
    keyboard = types.ReplyKeyboardMarkup(
        keyboard=[
            [types.KeyboardButton(text="Открыть WebApp", 
                                  web_app=types.WebAppInfo(url=URL))]
        ],
        resize_keyboard=True
    )
    await message.answer("Нажмите кнопку ниже", reply_markup=keyboard)

@dp.message()
async def web_app_data(message: types.Message):
    if message.web_app_data:
        data = message.web_app_data.data
        await message.answer(f"Получены данные: {data}")

async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())