#
##  prescrizioni.py
##  
##
##  Created by Mario Ansaldi on 10/09/25.
##
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from .. import schemas, models, crud
from ..dependencies import get_db

router = APIRouter()

@router.post("/", response_model=schemas.Prescrizione)
async def create_prescrizione(presc_in: schemas.PrescrizioneCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_prescrizione(db, presc_in)

@router.get("/", response_model=List[schemas.Prescrizione])
async def list_prescrizioni(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    return await crud.get_prescrizioni(db, skip, limit)

@router.get("/user/{user_id}", response_model=List[schemas.Prescrizione])
async def get_prescrizioni_by_user(user_id: int, db: AsyncSession = Depends(get_db)):
    return await crud.get_prescrizioni_by_user(db, user_id)

@router.get("/{presc_id}", response_model=schemas.Prescrizione)
async def get_prescrizione(presc_id: int, db: AsyncSession = Depends(get_db)):
    presc = await crud.get_prescrizione(db, presc_id)
    if not presc:
        raise HTTPException(status_code=404, detail="Prescrizione non trovata")
    return presc

@router.put("/{presc_id}", response_model=schemas.Prescrizione)
async def update_prescrizione(presc_id: int, presc_in: schemas.PrescrizioneUpdate, db: AsyncSession = Depends(get_db)):
    presc = await crud.get_prescrizione(db, presc_id)
    if not presc:
        raise HTTPException(status_code=404, detail="Prescrizione non trovata")
    return await crud.update_prescrizione(db, presc, presc_in)

@router.delete("/{presc_id}", status_code=204)
async def delete_prescrizione(presc_id: int, db: AsyncSession = Depends(get_db)):
    presc = await crud.get_prescrizione(db, presc_id)
    if not presc:
        raise HTTPException(status_code=404, detail="Prescrizione non trovata")
    await crud.delete_prescrizione(db, presc)
    return

