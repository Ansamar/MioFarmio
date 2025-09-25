#
##  farmaci.py
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

@router.post("/", response_model=schemas.Farmaco)
async def create_farmaco(farmaco_in: schemas.FarmacoCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_farmaco(db, farmaco_in)

@router.get("/", response_model=List[schemas.Farmaco])
async def list_farmaci(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    return await crud.get_farmaci(db, skip, limit)

@router.get("/{farmaco_id}", response_model=schemas.Farmaco)
async def get_farmaco(farmaco_id: int, db: AsyncSession = Depends(get_db)):
    farmaco = await crud.get_farmaco(db, farmaco_id)
    if not farmaco:
        raise HTTPException(status_code=404, detail="Farmaco non trovato")
    return farmaco

@router.put("/{farmaco_id}", response_model=schemas.Farmaco)
async def update_farmaco(farmaco_id: int, farmaco_in: schemas.FarmacoUpdate, db: AsyncSession = Depends(get_db)):
    farmaco = await crud.get_farmaco(db, farmaco_id)
    if not farmaco:
        raise HTTPException(status_code=404, detail="Farmaco non trovato")
    return await crud.update_farmaco(db, farmaco, farmaco_in)

@router.delete("/{farmaco_id}", status_code=204)
async def delete_farmaco(farmaco_id: int, db: AsyncSession = Depends(get_db)):
    farmaco = await crud.get_farmaco(db, farmaco_id)
    if not farmaco:
        raise HTTPException(status_code=404, detail="Farmaco non trovato")
    await crud.delete_farmaco(db, farmaco)
    return

