from typing import List, Optional
from pydantic import BaseModel

class MovieShort(BaseModel):
    id: int
    title: str
    poster_path: Optional[str] = None
    release_date: Optional[str] = None
    vote_average: float

class CastMember(BaseModel):
    id: int
    name: str
    character: str
    profile_path: Optional[str] = None

class MovieDetail(BaseModel):
    id: int
    title: str
    overview: str
    poster_path: Optional[str] = None
    release_date: Optional[str] = None
    vote_average: float
    cast: List[CastMember] = []
