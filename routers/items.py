from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models import Wishlist, Item, User
from schemas import ItemCreate, ItemRead, ItemBook
from typing import List

# инициализация роутера 

router = APIRouter(tags=['Подарки'])
# добавление нового подарка в wishlists
@router.post('/wishlists/{wishlist_id}/items', response_model=ItemRead, status_code=201)
async def add_item_to_wishlist(wishlist_id: int, item_data: ItemCreate, db: AsyncSession = Depends(get_db)):
   
    # ищем wishlists в бд по ID
    wl_query = select(Wishlist).where(Wishlist.id == wishlist_id)
    wl_res = await db.execute(wl_query)
    if not wl_res.scalar_one_or_none():
        # если wishlists не существует  то выводим  ошибку 404 
        raise HTTPException(status_code=404, detail="wishlists с указанным ID не найден")
        
    # создаем подарок
    new_item = Item(
        wishlist_id=wishlist_id,
        title=item_data.title,
        price=item_data.price
    )
    db.add(new_item)
    await db.flush()  # синхронизируем изменения с БД 
    return new_item
# бронируем подарок
@router.patch('/items/{item_id}/book', response_model=ItemRead)
async def book_item(item_id: int, booking_data: ItemBook, db: AsyncSession = Depends(get_db)):
        
    # ищем подарок в бд по item_id
    item_query = select(Item).where(Item.id == item_id)
    item_res = await db.execute(item_query)
    item = item_res.scalar_one_or_none()
    if not item:
        # если подарка нет то возвращаем ошибку 404 
        raise HTTPException(status_code=404, detail="Подарок с указанным ID не найден")
        
    # ищем пользователя  по user_id
    user_query = select(User).where(User.id == booking_data.user_id)
    user_res = await db.execute(user_query)
    if not user_res.scalar_one_or_none():
        # если пользователь не найден то  возвращаем ошибку 404 
        raise HTTPException(status_code=404, detail="Пользователь не найден")
        
    # проверка подарка на повторное бронирование
    if item.is_booked:
        # если уже забронирован то ошибка 400 
        raise HTTPException(status_code=400, detail="Подарок уже забронирован")
        
    # обновляем свойства объекта
    item.is_booked = True
    item.booked_by_user_id = booking_data.user_id
    
    await db.flush()  # сохраняем изменения 
    return item
# удаления подарка из списка 
@router.delete('/items/{item_id}', status_code=204)
async def delete_item(item_id: int, db: AsyncSession = Depends(get_db)):
        # проверяем наличие подарка в бд
    query = select(Item).where(Item.id == item_id)
    result = await db.execute(query)
    item = result.scalar_one_or_none()
    
    if not item:
        # если подарка нет то возвращаем ошибку 404 
        raise HTTPException(status_code=404, detail="Подарок не найден")
        
    # удаляем запись из бд
    await db.delete(item)
    await db.flush()  
    
    # возвращаем ответ с кодом 204 
    return Response(status_code=204)
