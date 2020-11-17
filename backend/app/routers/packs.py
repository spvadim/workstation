from typing import List, Optional
from fastapi import APIRouter, HTTPException
from fastapi import Depends, Header
from fastapi_versioning import version
from odmantic import ObjectId
from app.db.engine import engine
from app.db.db_utils import get_last_batch
from app.models.pack import Pack, PackInput, PackOutput
from app.models.production_batch import ProductionBatch

router = APIRouter()


@router.get('/packs/', response_model=List[Pack])
@version(1, 0)
async def get_packs(batch_id: Optional[ObjectId] = None):
    packs = await engine.find(Pack)
    if batch_id:
        return [pack for pack in packs if pack.batch.id == batch_id]
    return packs


@router.get('/current-packs', response_model=List[PackOutput])
@version(1, 0)
async def get_current_packs():
    last_batch = await get_last_batch()
    packs = await engine.find(Pack)
    return [pack for pack in packs if pack.batch == last_batch and not pack.is_referenced]


@router.put('/packs', response_model=Pack)
@version(1, 0)
async def create_pack(pack: PackInput):
    if pack.batch_id is None:
        last_batch = await get_last_batch()
        if last_batch is None:
            raise HTTPException(404)
        pack = Pack(qr=pack.qr, batch=last_batch)
    else:
        batch = await engine.find_one(ProductionBatch, ProductionBatch.id == pack.batch_id)
        if batch is None:
            raise HTTPException(404)
        pack = Pack(qr=pack.qr, batch=batch)
    await engine.save(pack)
    return pack
