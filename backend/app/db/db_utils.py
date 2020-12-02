from typing import List, Optional
from fastapi import HTTPException
from odmantic import query, ObjectId, Model
from .engine import engine
from app.models.pack import Pack
from app.models.multipack import Multipack, Status
from app.models.production_batch import ProductionBatch
from app.models.qr_list import QrList
from app.models.system_status import SystemStatus, Mode, SystemState, State


async def get_by_id_or_404(model, id: ObjectId) -> Model:
    instance = await engine.find_one(model, model.id == id)
    if instance is None:
        raise HTTPException(404)
    return instance


async def get_current_status() -> SystemStatus:
    return await engine.find_one(SystemStatus)


async def create_status_if_not_exists():
    system_status = await get_current_status()
    if system_status is None:
        mode = Mode()
        state = SystemState()
        system_status = SystemStatus(mode=mode, system_state=state)
        await engine.save(system_status)


async def get_current_workmode() -> Mode:
    system_status = await get_current_status()
    return system_status.mode


async def get_current_state() -> SystemState:
    system_status = await get_current_status()
    return system_status.system_state


async def set_column_yellow(error_msg: str) -> SystemState:
    current_status = await get_current_status()
    current_status.system_state = SystemState(state=State.WARNING, error_msg=error_msg)
    await engine.save(current_status)
    return current_status.system_state


async def set_column_red(error_msg: str) -> SystemState:
    current_status = await get_current_status()
    current_status.system_state = SystemState(state=State.ERROR, error_msg=error_msg)
    await engine.save(current_status)
    return current_status.system_state


async def flush_state() -> SystemState:
    current_status = await get_current_status()
    current_status.system_state = SystemState()
    await engine.save(current_status)
    return current_status.system_state


async def get_qr_list() -> QrList:
    return await engine.find_one(QrList)


async def create_qr_list_if_not_exists():
    qr_list = await get_qr_list()
    if qr_list is None:
        qr_list = QrList()
        await engine.save(qr_list)


async def check_qr_unique(qr: str):
    qr_list = await get_qr_list()
    if qr in qr_list.list:
        raise HTTPException(400, detail='qr не уникален!')
    else:
        qr_list.list += [qr]
        await engine.save(qr_list)


async def check_qr_unique_or_set_state_warning(qr: str):
    qr_list = await get_qr_list()
    if qr in qr_list.list:
        error_msg = 'qr не уникален!'
        await set_column_yellow(error_msg)
        raise HTTPException(400, detail=error_msg)


async def check_qr_unique_or_set_state_error(qr: str):
    qr_list = await get_qr_list()
    if qr in qr_list.list:
        error_msg = 'qr не уникален!'
        await set_column_red(error_msg)
        raise HTTPException(400, detail=error_msg)
    else:
        qr_list.list += [qr]
        await engine.save(qr_list)


async def get_last_batch() -> ProductionBatch:
    last_batch = await engine.find_one(ProductionBatch, sort=query.desc(ProductionBatch.id))
    return last_batch


async def get_batch_by_number_or_return_last(batch_number: Optional[int]) -> ProductionBatch:
    if batch_number:
        batch = await engine.find_one(ProductionBatch, ProductionBatch.number == batch_number)
        if not batch:
            raise HTTPException(404)
    else:
        batch = await get_last_batch()
        if not batch:
            raise HTTPException(404)
    return batch


async def get_packs_queue() -> List[Pack]:
    last_batch = await get_last_batch()
    packs = await engine.find(Pack, sort=query.asc(Pack.id))
    return [pack for pack in packs if pack.batch_number == last_batch.number and pack.in_queue]


async def get_multipacks_queue() -> List[Multipack]:
    last_batch = await get_last_batch()
    multipacks = await engine.find(Multipack, sort=query.asc(Multipack.id))
    return [multipack for multipack in multipacks if multipack.batch_number == last_batch.number
            and multipack.status != Status.IN_CUBE]







