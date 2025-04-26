
import json
from contextlib import asynccontextmanager
from datetime import datetime
from typing import List, Dict, Any, Optional, Union

from fastapi import FastAPI, HTTPException, Depends, Request, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from sqlalchemy import Column, Integer, String, Text, DateTime, Float,ForeignKey, UniqueConstraint
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from sqlalchemy.future import select
from sqlalchemy.sql import func
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# Инициализация SQLAlchemy
Base = declarative_base()

# Модели SQLAlchemy
class Variant(Base):
    __tablename__ = "variants"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    time_limit = Column(Integer, nullable=False)  # время в минутах
    task_count = Column(Integer, nullable=False)
    
    tasks = relationship("Task", back_populates="variant")

class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    variant_id = Column(Integer, ForeignKey("variants.id"), nullable=False)
    task_number = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    template_code = Column(Text, default="")
    tests = Column(Text, default="[]")
    answer = Column(Integer, nullable=False)
    
    variant = relationship("Variant", back_populates="tasks")

class CompletedVariant(Base):
    __tablename__ = "completed_variants"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, nullable=False)  # Telegram user ID
    variant_id = Column(Integer, ForeignKey("variants.id"), nullable=False)
    completed_at = Column(DateTime, nullable=False, server_default=func.now())
    
    # Создаем уникальный индекс для пары user_id и variant_id
    __table_args__ = (
        UniqueConstraint('user_id', 'variant_id', name='uq_user_variant'),
    )

class UserStatistics(Base):
    __tablename__ = "statistics"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, nullable=False)
    variant_id = Column(Integer, ForeignKey("variants.id"), nullable=False)
    start_time = Column(DateTime, nullable=False, server_default=func.now())
    end_time = Column(DateTime)
    total_time = Column(Float)
    completed_tasks = Column(Integer, default=0)
    correct_tasks = Column(Integer, default=0)
    task_results = Column(Text, default="{}")

# Модели Pydantic
class TaskModel(BaseModel):
    id: int
    variant_id: int
    task_number: int
    title: str
    description: str
    template_code: str = ""
    tests: Union[List[Dict[str, Any]], str]  # Добавляем Union для обработки строки
    
    # @validator('tests', pre=True)
    # def parse_tests(cls, v):
    #     if isinstance(v, str):
    #         try:
    #             return json.loads(v)
    #         except json.JSONDecodeError:
    #             return []
    #     return v
    
    class Config:
        orm_mode = True

class VariantModel(BaseModel):
    id: int
    title: str
    description: str
    time_limit: int  # время в минутах
    task_count: int
    
    class Config:
        orm_mode = True

class CodeExecutionRequest(BaseModel):
    code: str
    task_id: int
    user_id: str
    
class CodeExecutionResponse(BaseModel):
    stdout: str
    stderr: str
    result: str
    execution_time: float
    passed: bool = False
    error: Optional[str] = None

class AnswerCheckRequest(BaseModel):
    variant_id: int
    # user_id: int  # ID пользователя для сохранения результатов
    answers: Dict[str, str]  # task_id: answer

class UserStatisticsModel(BaseModel):
    user_id: str
    variant_id: int
    start_time: datetime
    end_time: Optional[datetime] = None
    total_time: Optional[float] = None
    completed_tasks: int = 0
    correct_tasks: int = 0
    task_results: Dict[int, bool] = {}
    
    class Config:
        orm_mode = True

async def initialize_db():
    import os
    """Инициализирует базу данных"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print(f"✅ Database created at {os.path.abspath('app.db')}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Код при запуске
    await initialize_db()
    print("Database initialized")
    yield 
    await engine.dispose()

# Инициализация приложения FastAPI
app = FastAPI(title="Python Code Executor API", lifespan=lifespan)

# Подключаем папку со статикой
app.mount("/img", StaticFiles(directory="/img"), name="img")

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене нужно ограничить конкретными доменами
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Настройка базы данных
DATABASE_URL = "sqlite+aiosqlite:///app.db"
engine = create_async_engine(DATABASE_URL, echo=True)
async_session = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

async def get_db():
    """Получает сессию базы данных"""
    async with async_session() as session:
        yield session


    
        
@app.get("/img/{filename}")
async def get_image(filename: str):
    return FileResponse(f"backend/img/{filename}")        

# Роуты API
@app.get("/variants", response_model=List[VariantModel])
async def get_variants(db: AsyncSession = Depends(get_db)):
    """Получает список всех вариантов"""
    result = await db.execute(select(Variant))
    variants = result.scalars().all()
    return variants

@app.get("/variants/{variant_id}", response_model=VariantModel)
async def get_variant(variant_id: int, db: AsyncSession = Depends(get_db)):
    """Получает информацию о конкретном варианте"""
    result = await db.execute(select(Variant).where(Variant.id == variant_id))
    variant = result.scalar()
    
    if not variant:
        raise HTTPException(status_code=404, detail="Вариант не найден")
    
    return variant

@app.get("/user/{user_id}/variants", response_model=List[VariantModel])
async def get_user_variants(user_id: str, db: AsyncSession = Depends(get_db)):
    """Получает список вариантов, которые пользователь еще не решил"""
    
    # Получаем список всех вариантов
    all_variants = await db.execute(select(Variant))
    all_variants = all_variants.scalars().all()
    
    # Получаем ID вариантов, которые пользователь уже решил
    completed = await db.execute(
        select(CompletedVariant.variant_id)
        .where(CompletedVariant.user_id == user_id)
    )
    completed_variants_ids = [row[0] for row in completed]
    
    # Фильтруем только нерешенные варианты
    variants = [v for v in all_variants if v.id not in completed_variants_ids]
    return variants

@app.post("/check-answers")
async def chcheck_answers(request: AnswerCheckRequest, db: AsyncSession = Depends(get_db)):
    tasks = await db.execute(select(Task).where(Task.variant_id == request.variant_id))

    result = []

    for task in tasks:
        # print(task[0].id)
        task_id_str = str(task[0].id)
        user_answer = request.answers.get(task_id_str, "")
        if len(user_answer) > 0: user_answer = int(user_answer)
        is_correct = user_answer == task[0].answer
        result.append(is_correct)
    
    return result


@app.get("/variants/{variant_id}/tasks", response_model=List[TaskModel])
async def get_tasks(variant_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Task)
        .where(Task.variant_id == variant_id)
        .order_by(Task.task_number)
    )
    tasks = result.scalars().all()
    
    if not tasks:
        raise HTTPException(status_code=404, detail="Задачи для этого варианта не найдены")
    
    # Явное преобразование для дебага
    task_list = []
    for task in tasks:
        task_dict = {
            "id": task.id,
            "variant_id": task.variant_id,
            "task_number": task.task_number,
            "title": task.title,
            "description": task.description,
            "template_code": task.template_code,
            "tests": task.tests  # Pydantic сам обработает через validator
        }
        task_list.append(task_dict)
    
    return task_list

@app.get("/tasks/{task_id}", response_model=TaskModel)
async def get_task(task_id: int, db: AsyncSession = Depends(get_db)):
    """Получает информацию о конкретной задаче"""
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar()
    
    if not task:
        raise HTTPException(status_code=404, detail="Задача не найдена")
    
    return task


@app.post("/start_variant", response_model=UserStatisticsModel)
async def start_variant(user_id: str = Body(...), variant_id: int = Body(...), db: AsyncSession = Depends(get_db)):
    """Начинает новый вариант для пользователя"""
    # Проверяем, существует ли вариант
    result = await db.execute(select(Variant).where(Variant.id == variant_id))
    variant = result.scalar()
    
    if not variant:
        raise HTTPException(status_code=404, detail="Вариант не найден")
    
@app.post("/user/{user_id}/results")
async def save_user_results(
    user_id: str, 
    variant_id: int = Body(...), 
    task_results: Dict[str, bool] = Body(...),
    db: AsyncSession = Depends(get_db)
):
    """Сохраняет результаты пользователя и помечает вариант как решенный"""
    
    # Находим или создаем статистику пользователя
    result = await db.execute(
        select(UserStatistics)
        .where(
            UserStatistics.user_id == user_id,
            UserStatistics.variant_id == variant_id
        )
    )
    stats = result.scalar()
    
    if not stats:
        # Если статистики нет, создаем новую
        stats = UserStatistics(
            user_id=user_id,
            variant_id=variant_id,
            start_time=datetime.now(),
            end_time=datetime.now(),
            task_results=json.dumps(task_results)
        )
        db.add(stats)
    else:
        # Обновляем существующую статистику
        stats.task_results = json.dumps(task_results)
        stats.end_time = datetime.now()
    
    # Помечаем вариант как завершенный
    completed = CompletedVariant(
        user_id=user_id,
        variant_id=variant_id
    )
    db.add(completed)
    
    # Сохраняем изменения
    await db.commit()
    
    return {"status": "success"}
    
    # # Создаем запись в статистике
    # stats = UserStatistics(
    #     user_id=user_id,
    #     variant_id=variant_id,
    #     start_time=datetime.now()
    # )
    # db.add(stats)
    # await db.commit()
    # await db.refresh(stats)
    
    # return stats

# @app.post("/finish_variant", response_model=UserStatisticsModel)
# async def finish_variant(user_id: str = Body(...), variant_id: int = Body(...), db: AsyncSession = Depends(get_db)):
#     """Завершает вариант для пользователя"""
#     # Получаем текущую статистику
#     result = await db.execute(
#         select(UserStatistics)
#         .where(
#             UserStatistics.user_id == user_id,
#             UserStatistics.variant_id == variant_id,
#             UserStatistics.end_time.is_(None)
#         )
#     )
#     stats = result.scalar()
    
#     if not stats:
#         raise HTTPException(status_code=404, detail="Активный вариант не найден")
    
#     # Обновляем статистику
#     now = datetime.now()
#     stats.end_time = now
#     stats.total_time = (now - stats.start_time).total_seconds()
#     await db.commit()
#     await db.refresh(stats)
    
    # return stats

# @app.get("/statistics/{user_id}/{variant_id}", response_model=UserStatisticsModel)
# async def get_statistics(user_id: str, variant_id: int, db: AsyncSession = Depends(get_db)):
#     """Получает статистику пользователя по варианту"""
#     result = await db.execute(
#         select(UserStatistics)
#         .where(
#             UserStatistics.user_id == user_id,
#             UserStatistics.variant_id == variant_id
#         )
#         .order_by(UserStatistics.start_time.desc())
#         .limit(1)
#     )
#     stats = result.scalar()
    
#     if not stats:
#         raise HTTPException(status_code=404, detail="Статистика не найдена")
    
#     return stats

# Вспомогательные функции

# async def update_statistics(db: AsyncSession, user_id: str, variant_id: int, task_id: int, passed: bool):
#     """Обновляет статистику пользователя"""
#     # Получаем текущую статистику
#     result = await db.execute(
#         select(UserStatistics)
#         .where(
#             UserStatistics.user_id == user_id,
#             UserStatistics.variant_id == variant_id,
#             UserStatistics.end_time.is_(None)
#         )
#     )
#     stats = result.scalar()
    
#     if not stats:
#         # Создаем новую запись, если нет активной
#         stats = UserStatistics(
#             user_id=user_id,
#             variant_id=variant_id,
#             start_time=datetime.now()
#         )
#         db.add(stats)
#         await db.flush()
    
#     # Обновляем статистику
#     task_results = json.loads(stats.task_results) if stats.task_results else {}
#     task_id_str = str(task_id)
    
#     if task_id_str not in task_results:
#         stats.completed_tasks += 1
    
#     if passed and (task_id_str not in task_results or not task_results[task_id_str]):
#         stats.correct_tasks += 1
    
#     task_results[task_id_str] = passed
#     stats.task_results = json.dumps(task_results)
    
#     await db.commit()



if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)