from fastapi import Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from db.session import get_db
from models.user import User
from sqlalchemy import select
# проверяем авторизацию пользователя
async def get_current_user(request: Request, db: AsyncSession = Depends(get_db)) -> User:
  
    user_id_str = request.cookies.get_signed_value("session_id", default=None)
    
    # делаем исключение HTTP 401 
    if not user_id_str:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Пользователь не авторизован или сессия истекла"
        )
    
    try:
        user_id = int(user_id_str)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Невалидный идентификатор сессии"
        )

    # запрашиваем пользователя из бд
    query = select(User).where(User.id == user_id)
    result = await db.execute(query)
    user = result.scalar_one_or_none()

    # Если пользователя нет в БД то ошибка 401
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Текущий пользователь не найден в системе"
        )

    # возвращаем объект user
    return user
