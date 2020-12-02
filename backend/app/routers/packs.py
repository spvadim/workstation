from typing import List
from fastapi import APIRouter
from datetime import datetime, timedelta
from fastapi_versioning import version
from odmantic import ObjectId
from app.db.engine import engine
from app.db.db_utils import get_batch_by_number_or_return_last, get_packs_queue, check_qr_unique, get_by_id_or_404
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


@router.put('/packs', response_model=Pack)
@version(1, 0)
async def create_pack(pack: Pack):
    batch = await get_batch_by_number_or_return_last(batch_number=pack.batch_number)

    await check_qr_unique(pack.qr)

    pack.batch_number = batch.number
    pack.created_at = (datetime.utcnow() + timedelta(hours=5)).strftime("%d.%m.%Y %H:%M")
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
        await check_qr_unique(patch.qr)

    patch_dict = patch.dict(exclude_unset=True)
    for name, value in patch_dict.items():
        setattr(pack, name, value)
    await engine.save(pack)
    return pack
