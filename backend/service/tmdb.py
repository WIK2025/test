import httpx
from typing import Dict, Any, Optional
from core.config import settings
 
class TMDBService:
    def __init__(self):
        
        self.base_url = "https://themoviedb.org"
        # авторизация
        self.headers = {
            "Authorization": f"Bearer {settings.TMDB_API_KEY}",
            "accept": "application/json"
        }
# запрашиваем список с API TMDB
    async def get_popular_movies(self, page: int = 1) -> Dict[str, Any]:
       
        async with httpx.AsyncClient(headers=self.headers) as client:
            try:
                response = await client.get(
                    f"{self.base_url}/movie/now_playing",
                    params={"page": page, "language": "ru-RU"}  
                )
                response.raise_for_status()
                return response.json()
            except httpx.HTTPError as e:
                # в случае сбоя возвращаем пустой список 
                return {"page": page, "results": [], "total_pages": 1}

# запрашиваем информацию о фильме по его ID в TMDB.
    async def get_movie_details(self, movie_id: int) -> Optional[Dict[str, Any]]:
        
        async with httpx.AsyncClient(headers=self.headers) as client:
            try:
                response = await client.get(
                    f"{self.base_url}/movie/{movie_id}",
                    params={"language": "ru-RU"}
                )
                if response.status_code == 404:
                    return None
                response.raise_for_status()
                return response.json()
            except httpx.HTTPError:
                return None
# запрашиваем список актеров
    async def get_movie_credits(self, movie_id: int) -> Dict[str, Any]:
       
        async with httpx.AsyncClient(headers=self.headers) as client:
            try:
                response = await client.get(
                    f"{self.base_url}/movie/{movie_id}/credits",
                    params={"language": "ru-RU"}
                )
                response.raise_for_status()
                return response.json()
            except httpx.HTTPError:
                # возвращаем пустой список 
                return {"cast": []}

tmdb_service = TMDBService()
