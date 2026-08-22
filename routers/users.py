from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models import User
from schemas import UserCreate, UserRead
from typing import List

# проверка регистрации пользователя
router = APIRouter(prefix='/users', tags=['Пользователи'])

@router.post('/', response_model=UserRead, status_code=201)
async def register_user(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    query = select(User).where(User.username == user_data.username)
    result = await db.execute(query)
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Это имя пользователя уже занято.")
        
    new_user = User(username=user_data.username)
    db.add(new_user)
    await db.flush()
    return new_user

@router.get('/', response_model=List[UserRead])
async def list_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User))
    return result.scalars().all()
