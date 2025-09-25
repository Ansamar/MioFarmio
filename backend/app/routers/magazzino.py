#
##  magazzino.py
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

@router.post("/", response_model=schemas.Magazzino)
async def create_magazzino(mag_in: schemas.MagazzinoCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_magazzino(db, mag_in)

@router.get("/", response_model=List[schemas.Magazzino])
async def list_magazzino(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    return await crud.get_magazzino_items(db, skip, limit)

@router.get("/user/{user_id}", response_model=List[schemas.Magazzino])
async def get_magazzino_by_user(user_id: int, db: AsyncSession = Depends(get_db)):
    return await crud.get_magazzino_by_user(db, user_id)

@router.get("/{item_id}", response_model=schemas.Magazzino)
async def get_magazzino_item(item_id: int, db: AsyncSession = Depends(get_db)):
    item = await crud.get_magazzino(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Voce magazzino non trovata")
    return item

@router.put("/{item_id}", response_model=schemas.Magazzino)
async def update_magazzino(item_id: int, mag_in: schemas.MagazzinoUpdate, db: AsyncSession = Depends(get_db)):
    item = await crud.get_magazzino(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Voce magazzino non trovata")
    return await crud.update_magazzino(db, item, mag_in)

@router.delete("/{item_id}", status_code=204)
async def delete_magazzino(item_id: int, db: AsyncSession = Depends(get_db)):
    item = await crud.get_magazzino(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Voce magazzino non trovata")
    await crud.delete_magazzino(db, item)
    return

