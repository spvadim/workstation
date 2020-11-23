from typing import List, Optional
from odmantic import query, ObjectId
from .engine import engine
from fastapi import HTTPException
from app.models.pack import Pack
from app.models.multipack import Multipack, Status
from app.models.production_batch import ProductionBatch
from app.models.qr_list import QrList
from app.models.mode import Mode


async def get_current_mode() -> Mode:
    return await engine.find_one(Mode)


async def create_mode_if_not_exists():
    mode = await get_current_mode()
    if mode is None:
        mode = Mode()
        await engine.save(mode)


async def get_qr_list() -> QrList:
    return await engine.find_one(QrList)


async def create_qr_list_if_not_exists():
    qr_list = await get_qr_list()
    if qr_list is None:
        qr_list = QrList()
        await engine.save(qr_list)


async def get_last_batch() -> ProductionBatch:
    last_batch = await engine.find_one(ProductionBatch, sort=query.desc(ProductionBatch.id))
    return last_batch


async def get_packs_queue() -> List[Pack]:
    last_batch = await get_last_batch()
    packs = await engine.find(Pack)
    return [pack for pack in packs if pack.batch_number == last_batch.number and pack.in_queue]


async def get_multipacks_queue() -> List[Multipack]:
    last_batch = await get_last_batch()
    multipacks = await engine.find(Multipack)
    return [multipack for multipack in multipacks if multipack.batch_number == last_batch.number
            and multipack.status != Status.IN_CUBE]







