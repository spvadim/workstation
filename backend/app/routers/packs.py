from typing import List
from fastapi import APIRouter, Query, HTTPException
from datetime import datetime, timedelta
from fastapi_versioning import version
from odmantic import ObjectId
from app.db.engine import engine
from app.db.db_utils import get_batch_by_number_or_return_last, \
    check_qr_unique, get_packs_queue, get_by_id_or_404, get_by_qr_or_404
from app.models.pack import Pack, PackOutput, PackPatchSchema


router = APIRouter()


@router.get('/packs_queue', response_model=List[PackOutput])
@version(1, 0)
async def get_current_packs():
    packs_queue = await get_packs_queue()
    return packs_queue


@router.get('/packs/{id}', response_model=Pack)
@version(1, 0)
async def get_pack_by_id(id: ObjectId):
    pack = await get_by_id_or_404(Pack, id)
    return pack


@router.get('/packs/', response_model=Pack)
@version(1, 0)
async def get_pack_by_qr(qr: str = Query(None)):
    pack = await get_by_qr_or_404(Pack, qr)
    return pack


@router.put('/packs', response_model=Pack)
@version(1, 0)
async def create_pack(pack: Pack):
    batch = await get_batch_by_number_or_return_last(batch_number=pack.batch_number)

    if not await check_qr_unique(Pack, pack.qr):
        raise HTTPException(400, detail=f'Пачка с QR-кодом {pack.qr} уже есть в системе')

    pack.batch_number = batch.number
    pack.created_at = (datetime.utcnow() +
                       timedelta(hours=5)).strftime("%d.%m.%Y %H:%M")
    await engine.save(pack)
    return pack


@router.delete('/packs/{id}', response_model=Pack)
@version(1, 0)
async def delete_pack_by_id(id: ObjectId):
    pack = await get_by_id_or_404(Pack, id)
    await engine.delete(pack)
    return pack


@router.patch('/packs/{id}', response_model=Pack)
@version(1, 0)
async def update_pack_by_id(id: ObjectId, patch: PackPatchSchema):
    pack = await get_by_id_or_404(Pack, id)

    if patch.qr:
        if not await check_qr_unique(Pack, patch.qr):
            raise HTTPException(400, detail=f'Пачка с QR-кодом {patch.qr} уже есть в системе')
    patch_dict = patch.dict(exclude_unset=True)
    for name, value in patch_dict.items():
        setattr(pack, name, value)
    await engine.save(pack)
    return pack
