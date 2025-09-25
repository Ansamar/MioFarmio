#
##  crud.py
##  
##
##  Created by Mario Ansaldi on 10/09/25.
##
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from . import models, schemas

# ----------- USERS -----------

async def get_user(db: AsyncSession, user_id: int):
    result = await db.execute(select(models.User).filter(models.User.id == user_id))
    return result.scalars().first()

async def get_user_by_cf(db: AsyncSession, codice_fiscale: str):
    result = await db.execute(select(models.User).filter(models.User.codice_fiscale == codice_fiscale))
    return result.scalars().first()

async def get_users(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(select(models.User).offset(skip).limit(limit))
    return result.scalars().all()

async def create_user(db: AsyncSession, user_in: schemas.UserCreate):
    db_user = models.User(
        nome=user_in.nome,
        cognome=user_in.cognome,
        codice_fiscale=user_in.codice_fiscale,
        tessera_sanitaria=user_in.tessera_sanitaria,
        medico_famiglia_id=user_in.medico_famiglia_id
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

async def update_user(db: AsyncSession, db_user: models.User, user_in: schemas.UserUpdate):
    for var, value in vars(user_in).items():
        if value is not None:
            setattr(db_user, var, value)
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

async def delete_user(db: AsyncSession, db_user: models.User):
    await db.delete(db_user)
    await db.commit()


# ----------- FARMACI -----------

async def get_farmaco(db: AsyncSession, farmaco_id: int):
    result = await db.execute(select(models.Farmaco).filter(models.Farmaco.id == farmaco_id))
    return result.scalars().first()

async def get_farmaci(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(select(models.Farmaco).offset(skip).limit(limit))
    return result.scalars().all()

async def create_farmaco(db: AsyncSession, farmaco_in: schemas.FarmacoCreate):
    db_farmaco = models.Farmaco(**farmaco_in.dict())
    db.add(db_farmaco)
    await db.commit()
    await db.refresh(db_farmaco)
    return db_farmaco

async def update_farmaco(db: AsyncSession, db_farmaco: models.Farmaco, farmaco_in: schemas.FarmacoUpdate):
    for var, value in vars(farmaco_in).items():
        if value is not None:
            setattr(db_farmaco, var, value)
    db.add(db_farmaco)
    await db.commit()
    await db.refresh(db_farmaco)
    return db_farmaco

async def delete_farmaco(db: AsyncSession, db_farmaco: models.Farmaco):
    await db.delete(db_farmaco)
    await db.commit()


# ----------- PRESCRIZIONI -----------

async def get_prescrizione(db: AsyncSession, presc_id: int):
    result = await db.execute(select(models.Prescrizione).filter(models.Prescrizione.id == presc_id))
    return result.scalars().first()

async def get_prescrizioni(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(select(models.Prescrizione).offset(skip).limit(limit))
    return result.scalars().all()

async def get_prescrizioni_by_user(db: AsyncSession, user_id: int):
    result = await db.execute(select(models.Prescrizione).filter(models.Prescrizione.user_id == user_id))
    return result.scalars().all()

async def create_prescrizione(db: AsyncSession, presc_in: schemas.PrescrizioneCreate):
    db_presc = models.Prescrizione(**presc_in.dict())
    db.add(db_presc)
    await db.commit()
    await db.refresh(db_presc)
    return db_presc

async def update_prescrizione(db: AsyncSession, db_presc: models.Prescrizione, presc_in: schemas.PrescrizioneUpdate):
    for var, value in vars(presc_in).items():
        if value is not None:
            setattr(db_presc, var, value)
    db.add(db_presc)
    await db.commit()
    await db.refresh(db_presc)
    return db_presc

async def delete_prescrizione(db: AsyncSession, db_presc: models.Prescrizione):
    await db.delete(db_presc)
    await db.commit()


# ----------- MAGAZZINO -----------

async def get_magazzino(db: AsyncSession, item_id: int):
    result = await db.execute(select(models.Magazzino).filter(models.Magazzino.id == item_id))
    return result.scalars().first()

async def get_magazzino_items(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(select(models.Magazzino).offset(skip).limit(limit))
    return result.scalars().all()

async def get_magazzino_by_user(db: AsyncSession, user_id: int):
    result = await db.execute(select(models.Magazzino).filter(models.Magazzino.user_id == user_id))
    return result.scalars().all()

async def create_magazzino(db: AsyncSession, mag_in: schemas.MagazzinoCreate):
    db_item = models.Magazzino(**mag_in.dict())
    db.add(db_item)
    await db.commit()
    await db.refresh(db_item)
    return db_item

async def update_magazzino(db: AsyncSession, db_item: models.Magazzino, mag_in: schemas.MagazzinoUpdate):
    for var, value in vars(mag_in).items():
        if value is not None:
            setattr(db_item, var, value)
    db.add(db_item)
    await db.commit()
    await db.refresh(db_item)
    return db_item

async def delete_magazzino(db: AsyncSession, db_item: models.Magazzino):
    await db.delete(db_item)
    await db.commit()
