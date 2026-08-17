from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from db.session import get_db
from models.user import User
from schemas.user import UserCreate, UserLogin, UserRead
from core.security import get_password_hash, verify_password
from api.deps import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Auth"])

#  регистрация пользователя
@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register_user(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
  
    # проверяем существует ли  пользователь 
    query = select(User).where((User.username == user_data.username) | (User.email == user_data.email))
    result = await db.execute(query)
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Пользователь с таким именем или email уже зарегистрирован"
        )
    
    hashed_pwd = get_password_hash(user_data.password)
    
    # создаем объект user
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_pwd
    )
    
    db.add(new_user)
    await db.flush()       
    await db.commit()      
    await db.refresh(new_user)
    
    return new_user

# авторизация проверяем логин и пароль
@router.post("/login")
async def login_user(login_data: UserLogin, response: Response, db: AsyncSession = Depends(get_db)):
    
    query = select(User).where(User.username == login_data.username)
    result = await db.execute(query)
    user = result.scalar_one_or_none()
    
    # если пользователя нет или пароль не совпал  то ошибка 401
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверное имя пользователя или пароль"
        )
    
    response.set_signed_cookie(
        key="session_id",
        value=str(user.id),
        httponly=True,
        samesite="lax",
        max_age=14 * 24 * 60 * 60  
    )
    
    return {"status": "ok", "message": "Вы успешно вошли в систему"}

# выход, удаление сессии
@router.post("/logout")
async def logout_user(response: Response):
    
    response.delete_cookie(key="session_id")
    return {"status": "ok", "message": "Вы  вышли из системы"}

# профиль пользователя
@router.get("/me", response_model=UserRead)
async def get_me(current_user: User = Depends(get_current_user)):
    
    return current_user
