import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from db.session import engine, Base                 
from db.base import *                                 
from api.endpoints import auth_router, movies_router, user_router  

@asynccontextmanager
async def lifespan(app: FastAPI):
    
    print("БАЗА ДАННЫХ: Запуск инициализации таблиц SQL")
    async with engine.begin() as conn:
        
        await conn.run_sync(Base.metadata.create_all)
    print("БАЗА ДАННЫХ: Инициализация  Таблицы завершена.")
    yield



app = FastAPI(title="Movies API", lifespan=lifespan)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,    
    allow_methods=["*"],        
    allow_headers=["*"],        
)

app.include_router(auth_router)
app.include_router(movies_router)
app.include_router(user_router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
