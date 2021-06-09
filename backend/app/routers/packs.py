from typing import List

from app.db.db_utils import (check_qr_unique, find_not_shipped_pack_by_qr,
                             get_batch_by_number_or_return_last,
                             get_by_id_or_404, get_by_qr_or_404,
                             get_packs_queue)
from app.db.engine import engine
from app.models.pack import Pack, PackOutput, PackPatchSchema
from app.utils.naive_current_datetime import get_naive_datetime
from fastapi import APIRouter, HTTPException, Query
from fastapi_versioning import version
from odmantic import ObjectId

from .custom_routers import DeepLoggerRoute, LightLoggerRoute

deep_logger_router = APIRouter(route_class=DeepLoggerRoute)
light_logger_router = APIRouter(route_class=LightLoggerRoute)


@light_logger_router.get('/packs_queue', response_model=List[PackOutput])
@version(1, 0)
async def get_current_packs():
    packs_queue = await get_packs_queue()
    return packs_queue


@light_logger_router.get('/packs/{id}', response_model=Pack)
@version(1, 0)
async def get_pack_by_id(id: ObjectId):
    pack = await get_by_id_or_404(Pack, id)
    return pack


@light_logger_router.get('/packs/', response_model=Pack)
@version(1, 0)
async def get_pack_by_qr(qr: str = Query(None)):
    pack = await get_by_qr_or_404(Pack, qr)
    return pack


@light_logger_router.get('/not_shipped_pack/', response_model=Pack)
@version(1, 0)
async def get_not_shipped_pack_by_qr(qr: str = Query(None)):
    pack = await find_not_shipped_pack_by_qr(qr)
    return pack


@deep_logger_router.put('/packs', response_model=Pack)
@version(1, 0)
async def create_pack(pack: Pack):
    batch = await get_batch_by_number_or_return_last(
        batch_number=pack.batch_number)

    if not await check_qr_unique(Pack, pack.qr):
        raise HTTPException(
            400, detail=f'Пачка с QR-кодом {pack.qr} уже есть в системе')

    pack.batch_number = batch.number
    pack.created_at = await get_naive_datetime()
    await engine.save(pack)
    return pack


@deep_logger_router.delete('/packs/{id}', response_model=Pack)
@version(1, 0)
async def delete_pack_by_id(id: ObjectId):
    pack = await get_by_id_or_404(Pack, id)
    await engine.delete(pack)
    return pack


@deep_logger_router.patch('/packs/{id}', response_model=Pack)
@version(1, 0)
async def update_pack_by_id(id: ObjectId, patch: PackPatchSchema):
    pack = await get_by_id_or_404(Pack, id)

    if patch.qr:
        if not await check_qr_unique(Pack, patch.qr):
            raise HTTPException(
                400, detail=f'Пачка с QR-кодом {patch.qr} уже есть в системе')

        if patch.to_process is not False:
            patch.to_process = True

        pack.comments.append(f'QR был изменен с {pack.qr}')
    patch_dict = patch.dict(exclude_unset=True)
    for name, value in patch_dict.items():
        setattr(pack, name, value)
    await engine.save(pack)
    return pack
