from datetime import datetime
from pydantic import BaseModel, Field, EmailStr, ConfigDict

class UserCreate(BaseModel):
    # регистраця пользователя
    username: str = Field(..., min_length=3, max_length=50, description="Имя пользователя")
    email: EmailStr = Field(..., description="Электронная почта")
    password: str = Field(..., min_length=6, description="Пароль пользователя")

class UserLogin(BaseModel):
    username: str = Field(..., min_length=1)
    password: str = Field(..., min_length=1)

class UserRead(BaseModel):
    id: int
    username: str
    email: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
