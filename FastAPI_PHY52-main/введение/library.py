from fastapi import FastAPI, HTTPException, Path, Query, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Optional, List

app = FastAPI(
    title='Каталог библиотеки',
    description='RESTFULL API для управления каталогом книг с поддержкой статистики и валидации ISBN',
    version='1.0.0'
)

# исключение InvalidISBNException 
class InvalidISBNException(Exception):
    def __init__(self, isbn_value: str):
        self.isbn_value = isbn_value
        self.message = f"Переданный ISBN '{isbn_value}' не соответствует стандарту. Разрешены только цифры и дефисы."
        super().__init__(self.message)

# перехватчик исключения 
@app.exception_handler(InvalidISBNException)
async def invalid_isbn_exception_handler(request: Request, exc: InvalidISBNException):
    
    return JSONResponse(
        status_code=400,
        content={
            "status": "error",
            "error_code": "INVALID_ISBN_FORMAT",
            "message": exc.message,
            "entered_value": exc.isbn_value
        }
    )

# функция валидации ISBN
# проверка, что ISBN состоит только из цифр и дефисов 

def validate_isbn_format(isbn: Optional[str]):
    if not isbn:
        return
    clean_isbn = isbn.replace("-", "")
    if not clean_isbn.isdigit():
        raise InvalidISBNException(isbn_value=isbn)

# базоваяя модель данных Pydantic
class Book(BaseModel):
    title: str = Field(..., min_length=1, max_length=200, description='Название книги')
    year: int = Field(..., ge=1000, le=2026, description='Год издания')
    author: str = Field(..., min_length=1, max_length=100, description='Автор книги')
    isbn: Optional[str] = Field(None, min_length=0, max_length=20, description='ISBN книги')
    pages: Optional[int] = Field(None, gt=0, description='Количество страниц')  
    # поле genre (жанр)
    genre: str = Field(..., min_length=1, max_length=50, description='Жанр книги')

class BookResponse(Book):
    id: int

class BookUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    year: Optional[int] = Field(None, ge=1000, le=2026)
    author: Optional[str] = Field(None, min_length=1, max_length=100)
    isbn: Optional[str] = Field(None, min_length=0, max_length=20)
    pages: Optional[int] = Field(None, gt=0)  
    genre: Optional[str] = Field(None, min_length=1, max_length=50)

#  дефолтные жанры для схемы Book
books_db: dict[int, Book] = {
    1: Book(title='Преступление и наказание', year=1866, author='Ф. Достоевский', pages=672, genre='Classic'),
    2: Book(title='Война и мир', year=1869, author='Л. Толстой', pages=1225, genre='Classic'),
}
next_id: int = 3

# фильтрация по жанру через Query
@app.get('/books', 
         response_model=List[BookResponse],
         summary='Получить список всех книг',
         description='Возвращает список всех книг с фильтрацией по годам, жанру и пагинацией'
         )
async def get_books(
    page: int = Query(1, ge=1, description='Номер страницы'),
    limit: int = Query(10, le=100, description='Кол-во книг на странице'),
    year_from: Optional[int] = Query(None, ge=1000, le=2026, description='Год издания (от)'),
    year_to: Optional[int] = Query(None, ge=1000, le=2026, description='Год издания (до)'),
    genre: Optional[str] = Query(None, description='Фильтрация по жанру книги')
    ):
    
    all_books = [BookResponse(id=b_id, **book.model_dump()) for b_id, book in books_db.items()]
    
    if year_from is not None:
        all_books = [b for b in all_books if b.year >= year_from]
    if year_to is not None:
        all_books = [b for b in all_books if b.year <= year_to]
    if genre is not None:
        all_books = [b for b in all_books if genre.lower() == b.genre.lower()]
    
    start = (page - 1) * limit
    end = start + limit
    return all_books[start:end]

# эндпоинт GET /books/stats
@app.get('/books/stats',
         summary='Получить статистику каталога',
         description='Возвращает общее количество книг, средний год издания и список уникальных авторов')
async def get_books_stats():
    if not books_db:
        return {"total_books": 0, "average_year": 0, "unique_authors": []}
        
    books_list = list(books_db.values())
    total_books = len(books_list)
    
    # расчет среднего года издания
    sum_years = sum(book.year for book in books_list)
    average_year = round(sum_years / total_books, 1)
    
    # уникальные авторы через set
    # чтобы убрать дубликаты
    unique_authors = list(set(book.author for book in books_list))
    
    return {
        "total_books": total_books,
        "average_year": average_year,
        "unique_authors": unique_authors
    }

@app.get('/books/search', 
         response_model=List[BookResponse],
         summary='Поиск книг по автору',
         description='Возвращает список книг, у которых автор совпадает с запросом')
async def search_books(
    author: str = Query(..., min_length=1, max_length=100, description='Автор книги')
):
    all_books = [BookResponse(id=b_id, **book.model_dump()) for b_id, book in books_db.items()]
    result = [b for b in all_books if author.lower() in b.author.lower()]
    if not result: 
        raise HTTPException(status_code=404, detail='Books not found')
    return result   

@app.get('/books/{book_id}',
         response_model=BookResponse,
         summary='Получить книгу по ID',
         description='Возвращает книгу с указанным идентификатором')

async def get_book(
    book_id: int = Path(..., ge=1, description='ID книги')
):
    if book_id not in books_db:
        raise HTTPException(status_code=404, detail=f'Book with id {book_id} not found')
    return BookResponse(id=book_id, **books_db[book_id].model_dump())

@app.post('/books',
          response_model=BookResponse,
          status_code=201,
          summary='Добавить книгу',
          description='Добавляет новый объект Book, валидирует ISBN и возвращает ее с присвоенным ID')
async def create_book(book: Book):
    # валидация ISBN 
    validate_isbn_format(book.isbn)
    global next_id
    current_id = next_id
    next_id += 1
    books_db[current_id] = book
    return BookResponse(id=current_id, **books_db[current_id].model_dump())

# эндпоинт POST /books/bulk
@app.post('/books/bulk',
          response_model=List[BookResponse],
          status_code=201,
          summary='Массовое добавление книг',
          description='Принимает список книг. Если у какой-то книги неверный ISBN — не добавится ни одна.')

async def create_books_bulk(books_list: List[Book]):
    for book in books_list:
        validate_isbn_format(book.isbn)
    global next_id
    added_books = []
    
    # сохраняем базу данных
    for book in books_list:
        current_id = next_id
        next_id += 1
        books_db[current_id] = book
        added_books.append(BookResponse(id=current_id, **book.model_dump()))
        
    return added_books

@app.delete('/books/{book_id}',
            status_code=204,
            summary='Удалить книгу',
            description='Удаляет книгу по переданному ID')
async def delete_book(
    book_id: int = Path(..., ge=1, description='ID книги')
):
    if book_id not in books_db:
        raise HTTPException(status_code=404, detail=f'Book with id {book_id} not found')
    del books_db[book_id]
    return None
