from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

# добавление фильма в список
class WatchlistCreate(BaseModel):
    tmdb_movie_id: int = Field(..., description="ID фильма для добавления")

# чтение списка
class WatchlistRead(BaseModel):
    id: int
    user_id: int
    tmdb_movie_id: int
    added_at: datetime

    model_config = ConfigDict(from_attributes=True)
