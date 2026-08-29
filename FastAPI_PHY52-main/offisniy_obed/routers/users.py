from fastapi import APIRouter,Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from crud import create_user, get_all_users
from schemas import UserCreate, UserResponse
from typing import List

router = APIRouter(prefix='/users', tags=['Управление пользователями'])

@router.post('/', response_model=UserResponse, status_code=201)
async def register_user(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    user_obj = await create_user(db, user_data)
    return {
        "id": user_obj.id,
        "username": user_obj.username,
        "email": user_obj.email
    }


@router.get('/', response_model=List[UserResponse])
async def list_users(db: AsyncSession = Depends(get_db)):
    users = await get_all_users(db)
    return users

