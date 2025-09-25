#
##  schemas.py
##  
##
##  Created by Mario Ansaldi on 10/09/25.
##
from pydantic import BaseModel, Field, constr
from typing import Optional
from datetime import date
from enum import Enum

# --------------- ENUM ----------------
class StatoPrescrizione(str, Enum):
    emessa = "emessa"
    ritirata = "ritirata"
    scaduta = "scaduta"

# --------------- USERS ----------------
class UserBase(BaseModel):
    nome: str
    cognome: str
    codice_fiscale: constr(min_length=16, max_length=16)
    tessera_sanitaria: Optional[str]
    medico_famiglia_id: Optional[int]

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    nome: Optional[str]
    cognome: Optional[str]
    codice_fiscale: Optional[constr(min_length=16, max_length=16)]
    tessera_sanitaria: Optional[str]
    medico_famiglia_id: Optional[int]

class User(UserBase):
    id: int

    class Config:
        orm_mode = True

# --------------- FARMACI ----------------
class FarmacoBase(BaseModel):
    nome_commerciale: str
    principio_attivo: Optional[str]
    aic_code: Optional[str]
    regime_dispensazione: Optional[str]
    rimborsabilita_ssn: Optional[bool] = False
    prezzo_al_pubblico: Optional[float]

class FarmacoCreate(FarmacoBase):
    pass

class FarmacoUpdate(BaseModel):
    nome_commerciale: Optional[str]
    principio_attivo: Optional[str]
    aic_code: Optional[str]
    regime_dispensazione: Optional[str]
    rimborsabilita_ssn: Optional[bool]
    prezzo_al_pubblico: Optional[float]

class Farmaco(FarmacoBase):
    id: int

    class Config:
        orm_mode = True

# --------------- PRESCRIZIONI ----------------
class PrescrizioneBase(BaseModel):
    user_id: int
    medico_famiglia: Optional[str]
    numero_ricetta: Optional[str]
    data_emissione: Optional[date]
    data_scadenza: Optional[date]
    stato: Optional[StatoPrescrizione]
    esenzione_ticket: Optional[str]

class PrescrizioneCreate(PrescrizioneBase):
    pass

class PrescrizioneUpdate(BaseModel):
    user_id: Optional[int]
    medico_famiglia: Optional[str]
    numero_ricetta: Optional[str]
    data_emissione: Optional[date]
    data_scadenza: Optional[date]
    stato: Optional[StatoPrescrizione]
    esenzione_ticket: Optional[str]

class Prescrizione(PrescrizioneBase):
    id: int

    class Config:
        orm_mode = True

# --------------- MAGAZZINO ----------------
class MagazzinoBase(BaseModel):
    user_id: int
    farmaco_id: int
    quantita_disponibile: int
    data_scadenza: Optional[date]
    numero_lotto: Optional[str]
    luogo_acquisto: Optional[str]
    data_acquisto: Optional[date]

class MagazzinoCreate(MagazzinoBase):
    pass

class MagazzinoUpdate(BaseModel):
    user_id: Optional[int]
    farmaco_id: Optional[int]
    quantita_disponibile: Optional[int]
    data_scadenza: Optional[date]
    numero_lotto: Optional[str]
    luogo_acquisto: Optional[str]
    data_acquisto: Optional[date]

class Magazzino(MagazzinoBase):
    id: int

    class Config:
        orm_mode = True

