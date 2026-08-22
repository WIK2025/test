from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Optional, List
# схема для регистрации нового пользователя
class UserCreate(BaseModel):
    
    username: str = Field(..., min_length=1, max_length=50, description="Имя пользователя")
# схема ответа сервера
class UserRead(BaseModel):
    
    id: int
    username: str   
    model_config = ConfigDict(from_attributes=True)
# добавления нового подарка в список
class ItemCreate(BaseModel):
    
    title: str = Field(..., min_length=1, max_length=100, description="Название подарка")
    price: Optional[int] = Field(None, description="Цена в рублях")
# проверка цены, что больше 0, если нет, то ошибка 422
    @field_validator('price')
    @classmethod
    def validate_price(cls, v: Optional[int]):
       
        if v is not None and v <= 0:
            raise ValueError('Цена подарка должна быть больше 0')
        return v
# информация о подарке 
class ItemRead(BaseModel):
    
    id: int
    wishlist_id: int
    title: str
    price: Optional[int]
    is_booked: bool
    booked_by_user_id: Optional[int]
    model_config = ConfigDict(from_attributes=True)
# ID пользователя, который бронирует подарок
class ItemBook(BaseModel):
    
    user_id: int = Field(..., description="ID пользователя, который бронирует подарок")
# создание нового списка желаний
class WishlistCreate(BaseModel):
    
    user_id: int = Field(..., description="ID владельца создаваемого  вишлиста")
    title: str = Field(..., min_length=1, max_length=100, description="Название  вишлиста")
# ответ сервера, выводящий wishlist вместе с подарками
class WishlistRead(BaseModel):
    
    id: int
    user_id: int
    title: str
    # возвращаем пустой массив [], если подарков еще нет.
    items: List[ItemRead] = []
    model_config = ConfigDict(from_attributes=True)
