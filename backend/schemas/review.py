from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

class ReviewCreate(BaseModel):
    # оценка фильма
    rating: int = Field(..., ge=1, le=10, description="Оценка фильма от 1 до 10")
    content: str = Field(..., min_length=10, description="Текст рецензии минимум 10 символов")

# ответ сервера клиенту
class ReviewRead(BaseModel):
    id: int
    tmdb_movie_id: int
    rating: int
    content: str
    created_at: datetime
    author_username: str 

    model_config = ConfigDict(from_attributes=True)
