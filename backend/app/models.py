# backend/app/models.py
from sqlalchemy import Column, Integer, String, Date, Boolean, Enum, ForeignKey, DECIMAL, Text
from sqlalchemy.orm import relationship
from .database import Base
import enum

class StatoPrescrizione(enum.Enum):
    emessa = "emessa"
    ritirata = "ritirata"
    scaduta = "scaduta"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    cognome = Column(String, nullable=False)
    codice_fiscale = Column(String(16), unique=True)
    tessera_sanitaria = Column(String(20))
    medico_famiglia_id = Column(Integer)

    piani = relationship("PianoTerapeutico", back_populates="utente")
    prescrizioni = relationship("Prescrizione", back_populates="utente")

class Farmaco(Base):
    __tablename__ = "farmaci"
    id = Column(Integer, primary_key=True, index=True)
    nome_commerciale = Column(String, nullable=False)
    principio_attivo = Column(String)
    aic_code = Column(String(20), unique=True)
    regime_dispensazione = Column(String)
    rimborsabilita_ssn = Column(Boolean, default=False)
    prezzo_al_pubblico = Column(DECIMAL(10,2))

class Prescrizione(Base):
    __tablename__ = "prescrizioni"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    medico_famiglia = Column(String)
    numero_ricetta = Column(String)
    data_emissione = Column(Date)
    data_scadenza = Column(Date)
    stato = Column(Enum(StatoPrescrizione))
    esenzione_ticket = Column(String(10))

    utente = relationship("User", back_populates="prescrizioni")
