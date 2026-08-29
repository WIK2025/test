from fastapi import APIRouter, Depends, Response
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from crud import add_order_item, delete_order_item
from schemas import OrderItemCreate, OrderItemResponse

router = APIRouter(prefix='/orders', tags=['Корзина заказов'])

@router.post('/', response_model=OrderItemResponse, status_code=201)
async def create_order(data: OrderItemCreate, db: AsyncSession = Depends(get_db)):
    # базовое создание в БД
    order_obj = await add_order_item(db, data)
    
    # возвращаем ответ для Swagger
    return {
        "id": order_obj.id,
        "user_id": order_obj.user_id,
        "menu_item_id": order_obj.menu_item_id,
        "quantity": order_obj.quantity,
        "name": order_obj.menu_item.name,   #  название блюда
        "price": float(order_obj.menu_item.price) #  цена блюда
    }

# корзина заказа delete
@router.delete('/{id}', status_code=204)
async def cancel_order_item(id: int, db: AsyncSession = Depends(get_db)):
    await delete_order_item(db, id)
    return Response(status_code=204)
