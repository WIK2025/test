from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from models import User, Session, MenuItem, OrderItem
from schemas import UserCreate, SessionCreate, MenuItemCreate, OrderItemCreate, SessionStatus
from fastapi import HTTPException 
from datetime import datetime

# регистрация нового пользователя

async def create_user(db: AsyncSession, user_data: UserCreate) -> User:
   
    new_user = User(username=user_data.username, email=user_data.email)
    db.add(new_user)
    await db.flush() 
    return new_user
# получение списка всех зарегистрированных пользователей
async def get_all_users(db: AsyncSession) -> list[User]:
    
    result = await db.execute(select(User))
    return result.scalars().all()
# поиск пользователя по его ID с проверкой
async def get_user_by_id(db: AsyncSession, user_id: int) -> User:
   
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail=f'Пользователь с id {user_id} не найден')
    return user 

# создание новой сессии совместного заказа еды

async def create_session(db: AsyncSession, session_data: SessionCreate) -> Session:
    
    if session_data.deadline <= datetime.now():
        raise HTTPException(status_code=400, detail='Дедлайн должен быть в будущем')
    
    # проверка существования пользователя 
    result = await db.execute(select(User).where(User.id == session_data.creator_id))
    creator = result.scalar_one_or_none()
    if not creator:
        raise HTTPException(status_code=404, detail=f'Пользователь с id {session_data.creator_id} не найден')
        
    new_session = Session(
        creator_id=session_data.creator_id,
        restaurant_name=session_data.restaurant_name,
        deadline=session_data.deadline,
        status=SessionStatus.active,
    )
    db.add(new_session)
    await db.flush()  # синхронизация с базой данных
    return new_session
# получение списка всех открытых сессий заказа
async def get_active_sessions(db: AsyncSession) -> list[Session]:
    
    result = await db.execute(select(Session).where(Session.status == SessionStatus.active))
    return result.scalars().all()
# поиск сессии по ID
async def get_session_by_id(db: AsyncSession, session_id: int) -> Session:
   
    result = await db.execute(select(Session).where(Session.id == session_id))
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail=f'Сессия с id {session_id} не найдена')
    return session
# изменение статуса сессии
async def update_session_status(db: AsyncSession, session_id: int, new_status: SessionStatus) -> Session:
   
    session = await get_session_by_id(db, session_id)
    if new_status == SessionStatus.ordered:
        result = await db.execute(
            select(func.count(OrderItem.id))
            .join(MenuItem, OrderItem.menu_item_id == MenuItem.id)
            .where(MenuItem.session_id == session_id)
        )
        orders_count = result.scalar()
        if orders_count == 0:
            raise HTTPException(status_code=400, detail='В заказе нет ни одной позиции')
    session.status = new_status
    await db.flush()
    return session

# наполнение меню блюдами 

async def add_menu_items(db: AsyncSession, session_id: int, items: list[MenuItemCreate]) -> list[MenuItem]:
  
    session = await get_session_by_id(db, session_id)
    if session.status != SessionStatus.active:
        raise HTTPException(status_code=400, detail='Нельзя добавлять меню в неактивную сессию')
    if datetime.now() >= session.deadline:
        raise HTTPException(status_code=400, detail='Дедлайн сессии уже истек')
    
    created_items = []
    for item in items:
        new_item = MenuItem(
            session_id=session.id,
            name=item.name,
            price=item.price
        )
        db.add(new_item)
        created_items.append(new_item)
        
    await db.flush()
    return created_items

# упраление корзиной заказов

async def add_order_item(db: AsyncSession, data: OrderItemCreate) -> OrderItem:
    
    await get_user_by_id(db, data.user_id)
    result = await db.execute(select(MenuItem).where(MenuItem.id == data.menu_item_id))
    menu_item = result.scalar_one_or_none()
    if not menu_item:
        raise HTTPException(status_code=404, detail='Позиция меню не найдена')
        
    session = await get_session_by_id(db, menu_item.session_id)
    if session.status != SessionStatus.active:
        raise HTTPException(status_code=400, detail='Нельзя делать заказ в закрытую сессию')
    if datetime.now() >= session.deadline:
        raise HTTPException(status_code=400, detail='Время заказа истекло')
        
    query = select(OrderItem).where(
        OrderItem.user_id == data.user_id,
        OrderItem.menu_item_id == data.menu_item_id
    )
    res = await db.execute(query)
    existing_item = res.scalar_one_or_none()
    
    if existing_item:
        existing_item.quantity += data.quantity
        await db.flush()
        # связи таблицы menu_items
        await db.refresh(existing_item, ["menu_item"])
        return existing_item
        
    new_order = OrderItem(
        user_id=data.user_id,
        menu_item_id=data.menu_item_id,
        quantity=data.quantity
    )
    db.add(new_order)
    await db.flush()
    # таблицы menu_items
    await db.refresh(new_order, ["menu_item"])
    return new_order

# отмена/удаление закааза

async def delete_order_item(db: AsyncSession, order_item_id: int) -> dict:
    
    result = await db.execute(select(OrderItem).where(OrderItem.id == order_item_id))
    order_item = result.scalar_one_or_none()
    if not order_item:
        raise HTTPException(status_code=404, detail=f'Позиция с ID {order_item_id} не найдена в корзине')
        
    menu_item = await db.execute(select(MenuItem).where(MenuItem.id == order_item.menu_item_id))
    m_item = menu_item.scalar_one()
    
    session = await get_session_by_id(db, m_item.session_id)
    if datetime.now() >= session.deadline:
        raise HTTPException(status_code=400, detail='Нельзя изменить заказ, дедлайн сессии истек')
        
    await db.delete(order_item)
    await db.flush()
    return {"detail": "Позиция успешно удалена"}
