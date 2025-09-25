# backend/app/main.py
#
# Created by Mario Ansaldi on 10/09/25.
#

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import users, farmaci, prescrizioni

app = FastAPI(title="MioFarmo API")

# Configurazione middleware CORS per permettere richieste da frontend in localhost:3000
origins = [
    "http://localhost:3000",
    # aggiungi altri origini se serve
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # domini autorizzati
    allow_credentials=True,
    allow_methods=["*"],    # metodi HTTP consentiti
    allow_headers=["*"],    # headers consentiti
)

# Creazione tabelle al startup
@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# Registrazione routers
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(farmaci.router, prefix="/farmaci", tags=["farmaci"])
app.include_router(prescrizioni.router, prefix="/prescrizioni", tags=["prescrizioni"])
