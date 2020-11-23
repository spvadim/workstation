from typing import List
from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta
from fastapi import Depends, Header
from fastapi_versioning import version
from odmantic import ObjectId
from app.db.engine import engine
from app.db.db_utils import get_last_batch, get_packs_queue, get_qr_list
from app.models.pack import Pack, PackInput, PackOutput, PackPatchSchema
from app.models.production_batch import ProductionBatch

router = APIRouter()


@router.get('/packs_queue', response_model=List[PackOutput])
@version(1, 0)
async def get_current_packs():
    packs_queue = await get_packs_queue()
    return packs_queue


@router.put('/packs', response_model=Pack)
@version(1, 0)
async def create_pack(pack: PackInput):
    qr_list = await get_qr_list()
    if pack.qr in qr_list.list:
        raise HTTPException(409)
    else:
        qr_list.list += [pack.qr]
        await engine.save(qr_list)

    if pack.batch_number is None:
        last_batch = await get_last_batch()
        if last_batch is None:
            raise HTTPException(404)
        pack = Pack(qr=pack.qr, barcode=pack.barcode, batch_number=last_batch.number,
                    created_at=(datetime.utcnow() + timedelta(hours=5)).strftime("%d.%m.%Y %H:%M"))

    else:
        batch = await engine.find_one(ProductionBatch, ProductionBatch.number == pack.batch_number)
        if batch is None:
            raise HTTPException(404)
        pack = Pack(qr=pack.qr, barcode=pack.barcode, batch_number=batch.number,
                    created_at=(datetime.utcnow() + timedelta(hours=5)).strftime("%d.%m.%Y %H:%M"))

    await engine.save(pack)
    return pack


@router.delete('/packs/{id}', response_model=Pack)
@version(1, 0)
async def delete_pack_by_id(id: ObjectId):
    pack = await engine.find_one(Pack, Pack.id == id)
    if pack is None:
        raise HTTPException(404)
    await engine.delete(pack)
    return pack


@router.patch('/packs/{id}', response_model=Pack)
@version(1, 0)
async def update_pack_by_id(id: ObjectId, patch: PackPatchSchema):
    pack = await engine.find_one(Pack, Pack.id == id)
    if pack is None:
        raise HTTPException(404)

    qr_list = await get_qr_list()
    if patch.qr:
        if patch.qr in qr_list.list:
            raise HTTPException(409)
        else:
            qr_list.list += [patch.qr]
            await engine.save(qr_list)

    patch_dict = patch.dict(exclude_unset=True)
    for name, value in patch_dict.items():
        setattr(pack, name, value)
    await engine.save(pack)
    return pack
