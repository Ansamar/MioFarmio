from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base

# Sostituisci con la tua connessione al database PostgreSQL
DATABASE_URL = "postgresql+asyncpg://tuo_utente:tuo_password@localhost:5432/miofarmo_db"

# Crea l'engine asincrono
engine = create_async_engine(DATABASE_URL, echo=True)

# Sessione asincrona per le operazioni DB
AsyncSessionLocal = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

# Base dichiarativa per i modelli
Base = declarative_base()

