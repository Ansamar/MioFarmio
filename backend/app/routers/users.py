#
##  users.py
##  
##
##  Created by Mario Ansaldi on 10/09/25.
##
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from .. import schemas, models, crud
from ..database import AsyncSessionLocal
from ..dependencies import get_db

router = APIRouter()

@router.post("/", response_model=schemas.User)
async def create_user(user_in: schemas.UserCreate, db: AsyncSession = Depends(get_db)):
    existing = await crud.get_user_by_cf(db, user_in.codice_fiscale)
    if existing:
        raise HTTPException(status_code=400, detail="Utente già esistente")
    return await crud.create_user(db, user_in)

@router.get("/", response_model=List[schemas.User])
async def list_users(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    return await crud.get_users(db, skip, limit)

@router.get("/{user_id}", response_model=schemas.User)
async def get_user(user_id: int, db: AsyncSession = Depends(get_db)):
    user = await crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Utente non trovato")
    return user

@router.put("/{user_id}", response_model=schemas.User)
async def update_user(user_id: int, user_in: schemas.UserUpdate, db: AsyncSession = Depends(get_db)):
    user = await crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Utente non trovato")
    return await crud.update_user(db, user, user_in)

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: int, db: AsyncSession = Depends(get_db)):
    user = await crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Utente non trovato")
    await crud.delete_user(db, user)
    return
