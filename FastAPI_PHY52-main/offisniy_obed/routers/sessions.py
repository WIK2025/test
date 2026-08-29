from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from crud import create_session, get_session_by_id, get_active_sessions, update_session_status, add_menu_items
from schemas import SessionCreate, SessionRespone, SessionStatusUpdate, MenuItemCreate, MenuItemRestaurant
from typing import List
from datetime import datetime

router = APIRouter(prefix='/sessions', tags=['Управление сессиями'])

@router.post('/', response_model=SessionRespone, status_code=201)
async def start_session(session_data: SessionCreate, db: AsyncSession = Depends(get_db)):
    # созданем в БД
    session_obj = await create_session(db, session_data)
    
    # формируем чистый словарь, чтобы избежать ошибки запроса
    return {
        "id": session_obj.id,
        "creator_id": session_obj.creator_id,
        "restaurant_name": session_obj.restaurant_name,
        "status": session_obj.status,
        "created_at": datetime.now(),  
        "deadline": session_obj.deadline,
        "menu_items": []  # при создании меню пустое
    }


@router.get('/active', response_model=List[SessionRespone])
async def list_active_sessions(db: AsyncSession = Depends(get_db)):
    return await get_active_sessions(db)

@router.get('/{id}', response_model=SessionRespone)
async def get_session(id: int, db: AsyncSession = Depends(get_db)):
    return await get_session_by_id(db, id)

@router.patch('/{id}/status', response_model=SessionRespone)
async def change_status(id: int, status_data: SessionStatusUpdate, db: AsyncSession = Depends(get_db)):
    return await update_session_status(db, id, status_data.status)

# меню
@router.post('/{id}/menu', response_model=List[MenuItemRestaurant], status_code=201)
async def fill_menu(id: int, items: List[MenuItemCreate], db: AsyncSession = Depends(get_db)):
    return await add_menu_items(db, id, items)
