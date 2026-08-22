from fastapi import FastAPI
from contextlib import asynccontextmanager
from database import init_db
from routers import users, wishlists, items
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield
# FastAPI
app = FastAPI(
    title="Вишлист Подарков API",
    description="RESTful API для создания списков желаний и бронирования подарков друзьями",
    version="1.0.0",
    lifespan=lifespan
)
# запускаем router
app.include_router(users.router)
app.include_router(wishlists.router)
app.include_router(items.router)
