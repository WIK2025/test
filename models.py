from database import Base
from sqlalchemy import Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
# таблицы пользователей
class User(Base):
    
    __tablename__ = 'users'

    # первичный id ключ 
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    # уникальное имя пользователя
    username: Mapped[str] = mapped_column(String, unique=True, nullable=False, index=True)

    # ORM связь «один ко многим» с таблицей списков желаний.
    # удаление всех вишлистов пользователя, если удалили самого пользователя.
    wishlists: Mapped[list['Wishlist']] = relationship('Wishlist', back_populates='owner', cascade='all, delete-orphan')
    
    # ORM связь со списками подарков, забронированных пользователем.
    # несколько ключей на таблицу пользователей.
    booked_items: Mapped[list['Item']] = relationship('Item', back_populates='booked_by', foreign_keys='Item.booked_by_user_id')
# таблица списков желаний
class Wishlist(Base):
    
    __tablename__ = 'wishlists'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    # внешний ключ, связывающий список с пользователем
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    # название списка желаний 
    title: Mapped[str] = mapped_column(String, nullable=False)

    # Обратная связь с User
    owner: Mapped['User'] = relationship('User', back_populates='wishlists')
    items: Mapped[list['Item']] = relationship('Item', back_populates='wishlist', cascade='all, delete-orphan', lazy='selectin')
# таблица подарков
class Item(Base):
    
    __tablename__ = 'items'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)

    # внешний ключ на вишлист, к которому привязан подарок
    wishlist_id: Mapped[int] = mapped_column(Integer, ForeignKey('wishlists.id', ondelete='CASCADE'), nullable=False)

    # название самого подарка
    title: Mapped[str] = mapped_column(String, nullable=False)

    # цена подарка
    price: Mapped[int] = mapped_column(Integer, nullable=True)

    # бронирования
    is_booked: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # внешний ключ на пользователя, забронировавшего подарок.
    booked_by_user_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id', ondelete='SET NULL'), nullable=True)

    # ORM связь с вишлистом, содержащим подарок
    wishlist: Mapped['Wishlist'] = relationship('Wishlist', back_populates='items')

    #  ORM связь с пользователем, сделавшим бронь
    booked_by: Mapped['User'] = relationship('User', back_populates='booked_items', foreign_keys=[booked_by_user_id])
