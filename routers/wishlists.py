from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models import User, Wishlist
from schemas import WishlistCreate, WishlistRead
# проверка списков пользователя
router = APIRouter(prefix='/wishlists', tags=['Списки желаний'])

@router.post('/', response_model=WishlistRead, status_code=201)
async def create_wishlist(wishlist_data: WishlistCreate, db: AsyncSession = Depends(get_db)):
    user_query = select(User).where(User.id == wishlist_data.user_id)
    user_res = await db.execute(user_query)
    if not user_res.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Пользователь не найден")
        
    new_wishlist = Wishlist(user_id=wishlist_data.user_id, title=wishlist_data.title)
    db.add(new_wishlist)
    await db.flush()
    return {
        "id": new_wishlist.id,
        "user_id": new_wishlist.user_id,
        "title": new_wishlist.title,
        "items": []
    }

@router.get('/{wishlist_id}', response_model=WishlistRead)
async def get_wishlist(wishlist_id: int, db: AsyncSession = Depends(get_db)):
    query = select(Wishlist).where(Wishlist.id == wishlist_id)
    result = await db.execute(query)
    wishlist = result.scalar_one_or_none()
    
    if not wishlist:
        raise HTTPException(status_code=404, detail="Wishlist с указанным ID не найден")
    return wishlist
