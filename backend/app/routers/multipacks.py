from typing import List, Optional
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException
from fastapi import Depends, Header
from fastapi_versioning import version
from odmantic import ObjectId
from app.db.engine import engine
from app.db.db_utils import get_qr_list, get_multipacks_queue, get_last_batch
from app.models.production_batch import ProductionBatch
from app.models.pack import Pack
from app.models.multipack import Multipack, MultipackOutput, MultipackPatchSchema, Status

router = APIRouter()


@router.put('/multipacks', response_model=Multipack, response_model_exclude_unset=True)
@version(1, 0)
async def create_multipack(multipack: Multipack):
    qr_list = await get_qr_list()
    if multipack.qr:
        if multipack.qr in qr_list.list:
            raise HTTPException(409)
        else:
            qr_list.list += [multipack.qr]
            await engine.save(qr_list)

    if multipack.batch_number:
        batch = await engine.find_one(ProductionBatch, ProductionBatch.number == multipack.batch_number)
        if not batch:
            raise HTTPException(404)
    else:
        batch = await get_last_batch()
        if not batch:
            raise HTTPException(404)

    multipack.batch_number = batch.number
    multipack.created_at = (datetime.utcnow() + timedelta(hours=5)).strftime("%d.%m.%Y %H:%M")
    for id in multipack.pack_ids:
        pack = await engine.find_one(Pack, Pack.id == id)
        if not pack:
            raise HTTPException(404)
        pack.in_queue = False
        await engine.save(pack)
    await engine.save(multipack)
    return multipack


@router.get('/multipacks_queue', response_model=List[MultipackOutput])
@version(1, 0)
async def get_current_multipacks():
    multipacks_queue = await get_multipacks_queue()
    return multipacks_queue


@router.delete('/multipacks/{id}', response_model=Multipack)
@version(1, 0)
async def delete_pack_by_id(id: ObjectId):
    multipack = await engine.find_one(Multipack, Multipack.id == id)
    if multipack is None:
        raise HTTPException(404)
    await engine.delete(multipack)
    return multipack


@router.patch('/multipacks/{id}', response_model=Multipack)
@version(1, 0)
async def update_pack_by_id(id: ObjectId, patch: MultipackPatchSchema):
    multipack = await engine.find_one(Multipack, Multipack.id == id)
    if multipack is None:
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
        setattr(multipack, name, value)
    await engine.save(multipack)
    return multipack