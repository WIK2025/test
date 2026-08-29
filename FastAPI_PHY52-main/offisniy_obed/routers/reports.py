from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from database import get_db
from crud import get_session_by_id
from models import User, MenuItem, OrderItem
from schemas import SessionSummary, SummaryMenuItem, UserSplit, OrderItemResponse

router = APIRouter(prefix='/reports', tags=['Агрегации и Сплит-чеки'])

# отчеты
@router.get('/summary/{session_id}', response_model=SessionSummary)
async def get_session_summary(session_id: int, db: AsyncSession = Depends(get_db)):
    session = await get_session_by_id(db, session_id)
    
    # заказ для ресторана 
    restaurant_query = (
        select(
            MenuItem.name,
            MenuItem.price,
            func.sum(OrderItem.quantity).label('total_quantity'),
            func.sum(OrderItem.quantity * MenuItem.price).label('total_price')
        )
        .join(OrderItem, OrderItem.menu_item_id == MenuItem.id)
        .where(MenuItem.session_id == session_id)
        .group_by(MenuItem.id, MenuItem.name, MenuItem.price)
        .order_by(MenuItem.name)
    )
    restaurant_result = await db.execute(restaurant_query)
    restaurant_orders = [
        SummaryMenuItem(
            name=row.name,
            total_quantity=row.total_quantity,
            price=float(row.price),
            total_price=float(row.total_price)
        ) for row in restaurant_result.all()
    ]
    
    #  итоговая сумма 
    grand_total = sum(item.total_price for item in restaurant_orders)
    
    # расчёт сплит по именам работников
    split_query = (
        select(
            User.id.label('user_id'),
            User.username,
            OrderItem.id.label('order_item_id'),
            OrderItem.quantity,
            MenuItem.id.label('menu_item_id'),
            MenuItem.name.label('item_name'),
            MenuItem.price.label('item_price')
        )
        .join(OrderItem, OrderItem.user_id == User.id)
        .join(MenuItem, OrderItem.menu_item_id == MenuItem.id)
        .where(MenuItem.session_id == session_id)
    )
    split_result = await db.execute(split_query)
    split_rows = split_result.all()
    
    user_dict = {}
    for row in split_rows:
        uid = row.user_id
        if uid not in user_dict:
            user_dict[uid] = {
                'user_id': uid,
                'username': row.username,
                'items': [],
                'total': 0.0
            }
        
        item_total = row.quantity * float(row.item_price)
        user_dict[uid]['items'].append(
            OrderItemResponse(
                id=row.order_item_id,
                user_id=uid,
                menu_item_id=row.menu_item_id,
                quantity=row.quantity,
                name=row.item_name,
                price=float(row.item_price)
            )
        )
        user_dict[uid]['total'] += item_total
        
    split_check = [
        UserSplit(
            user_id=data['user_id'],
            username=data['username'],
            items=data['items'],
            total=data['total']
        ) for data in user_dict.values()
    ]
    
    return SessionSummary(
        session_id=session.id,
        restaurant_name=session.restaurant_name,
        status=session.status,
        grand_total=grand_total,
        restaurant_order=restaurant_orders,
        split_check=split_check
    )
