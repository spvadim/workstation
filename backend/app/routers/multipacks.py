from typing import List

from fastapi import APIRouter, HTTPException, Query
from fastapi_versioning import version
from odmantic import ObjectId

from ..db.db_utils import (
    check_qr_unique,
    delete_multipack_by_id,
    get_batch_by_number_or_return_last,
    get_by_id_or_404,
    get_by_qr_or_404,
    get_last_batch,
    get_last_packing_table_amount,
    get_multipacks_queue,
)
from ..db.engine import engine
from ..models.multipack import Multipack, MultipackOutput, MultipackPatchSchema
from ..models.pack import Pack
from ..utils.naive_current_datetime import get_naive_datetime
from .custom_routers import DeepLoggerRoute, LightLoggerRoute

deep_logger_router = APIRouter(route_class=DeepLoggerRoute)
light_logger_router = APIRouter(route_class=LightLoggerRoute)


@deep_logger_router.put("/multipacks", response_model=Multipack)
@version(1, 0)
async def create_multipack(multipack: Multipack):
    batch = await get_batch_by_number_or_return_last(
        batch_number=multipack.batch_number
    )

    multipack.batch_number = batch.number
    multipack.created_at = await get_naive_datetime()

    packs_to_update = []
    for id in multipack.pack_ids:
        pack = await get_by_id_or_404(Pack, id)
        pack.in_queue = False
        packs_to_update.append(pack)
    await engine.save_all(packs_to_update)

    if multipack.qr:
        if not await check_qr_unique(Multipack, multipack.qr):
            raise HTTPException(
                400, detail=f"Мультипак с QR-кодом {multipack.qr} уже есть в системе"
            )
        multipack.added_qr_at = await get_naive_datetime()

    await engine.save(multipack)
    return multipack


@light_logger_router.get("/multipacks_queue", response_model=List[MultipackOutput])
@version(1, 0)
async def get_current_multipacks():
    multipacks_queue = await get_multipacks_queue()
    return multipacks_queue


@light_logger_router.get("/multipacks/{id}", response_model=Multipack)
@version(1, 0)
async def get_multipack_by_id(id: ObjectId):
    multipack = await get_by_id_or_404(Multipack, id)
    return multipack


@light_logger_router.get("/multipacks/", response_model=Multipack)
@version(1, 0)
async def get_multipack_by_qr(qr: str = Query(None)):
    multipack = await get_by_qr_or_404(Multipack, qr)
    return multipack


@deep_logger_router.delete("/multipacks/{id}", response_model=Multipack)
@version(1, 0)
async def remove_multipack_by_id(id: ObjectId):
    return await delete_multipack_by_id(id)


@deep_logger_router.delete(
    "/remove_multipacks_to_refresh_wrapper", response_model=List[Multipack]
)
@version(1, 0)
async def remove_multipacks_to_refresh_wrapper():
    multipacks_amount = await get_last_packing_table_amount()
    current_batch = await get_last_batch()
    multipacks_to_delete_amount = current_batch.params.multipacks_after_pintset
    multipacks_to_delete = await get_multipacks_queue()
    multipacks_to_delete = multipacks_to_delete[
        multipacks_amount : multipacks_amount + multipacks_to_delete_amount
    ]

    if len(multipacks_to_delete) != multipacks_to_delete_amount:
        error_msg = "Недостаточно паллет для перезагрузки обмотчика"
        raise HTTPException(status_code=400, detail=error_msg)

    for multipack in multipacks_to_delete:
        await delete_multipack_by_id(multipack.id)

    return multipacks_to_delete


@deep_logger_router.patch("/multipacks/{id}", response_model=Multipack)
@version(1, 0)
async def update_multipack_by_id(id: ObjectId, patch: MultipackPatchSchema):
    multipack = await get_by_id_or_404(Multipack, id)

    if patch.qr:
        if not await check_qr_unique(Multipack, patch.qr):
            raise HTTPException(
                400, detail=f"Мультипак с QR-кодом {patch.qr} уже есть в системе"
            )
        multipack.added_qr_at = await get_naive_datetime()

    patch_dict = patch.dict(exclude_unset=True)
    for name, value in patch_dict.items():
        setattr(multipack, name, value)
    await engine.save(multipack)
    return multipack
