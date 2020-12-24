from typing import List
from datetime import datetime, timedelta
from fastapi import APIRouter, Query, HTTPException
from fastapi_versioning import version
from odmantic import ObjectId
from app.db.engine import engine
from app.db.db_utils import check_qr_unique, get_multipacks_queue, \
    get_batch_by_number_or_return_last, get_by_id_or_404, get_by_qr_or_404
from app.models.pack import Pack
from app.models.multipack import Multipack, MultipackOutput, \
    MultipackPatchSchema

router = APIRouter()


@router.put('/multipacks', response_model=Multipack,
            response_model_exclude_unset=True)
@version(1, 0)
async def create_multipack(multipack: Multipack):
    batch = await get_batch_by_number_or_return_last(batch_number=multipack.batch_number)

    multipack.batch_number = batch.number
    multipack.created_at = (datetime.utcnow() + timedelta(hours=5)).strftime("%d.%m.%Y %H:%M")

    packs_to_update = []
    for id in multipack.pack_ids:
        pack = await get_by_id_or_404(Pack, id)
        pack.in_queue = False
        packs_to_update.append(pack)
    await engine.save_all(packs_to_update)

    if multipack.qr:
        if not await check_qr_unique(Multipack, multipack.qr):
            raise HTTPException(400, detail=f'Мультипак с QR-кодом {multipack.qr} уже есть в системе')
        multipack.added_qr_at = (datetime.utcnow() +
                                 timedelta(hours=5)).strftime("%d.%m.%Y %H:%M")

    await engine.save(multipack)
    return multipack


@router.get('/multipacks_queue', response_model=List[MultipackOutput])
@version(1, 0)
async def get_current_multipacks():
    multipacks_queue = await get_multipacks_queue()
    return multipacks_queue


@router.get('/multipacks/{id}', response_model=Multipack)
@version(1, 0)
async def get_multipack_by_id(id: ObjectId):
    multipack = await get_by_id_or_404(Multipack, id)
    return multipack


@router.get('/multipacks/', response_model=Multipack)
@version(1, 0)
async def get_multipack_by_qr(qr: str = Query(None)):
    multipack = await get_by_qr_or_404(Multipack, qr)
    return multipack


@router.delete('/multipacks/{id}', response_model=Multipack)
@version(1, 0)
async def delete_pack_by_id(id: ObjectId):
    multipack = await get_by_id_or_404(Multipack, id)
    await engine.delete(multipack)
    return multipack


@router.patch('/multipacks/{id}', response_model=Multipack)
@version(1, 0)
async def update_pack_by_id(id: ObjectId, patch: MultipackPatchSchema):
    multipack = await get_by_id_or_404(Multipack, id)

    if patch.qr:
        if not await check_qr_unique(Multipack, patch.qr):
            raise HTTPException(400, detail=f'Мультипак с QR-кодом {patch.qr} уже есть в системе')
        multipack.added_qr_at = (datetime.utcnow() +
                                 timedelta(hours=5)).strftime("%d.%m.%Y %H:%M")

    patch_dict = patch.dict(exclude_unset=True)
    for name, value in patch_dict.items():
        setattr(multipack, name, value)
    await engine.save(multipack)
    return multipack
