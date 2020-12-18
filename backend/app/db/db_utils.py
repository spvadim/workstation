from typing import List, Optional, Union
from fastapi import HTTPException
from odmantic import query, ObjectId, Model
from pydantic.tools import parse_obj_as

from .engine import engine

from app.models.pack import Pack
from app.models.multipack import Multipack, Status
from app.models.cube import Cube
from app.models.production_batch import ProductionBatch
from app.models.qr_list import QrList
from app.models.system_status import SystemStatus, Mode, SystemState, State
from app.models.system_settings import SystemSettings, SystemSettingsResponse
from app.models.report import ReportRequest, ReportResponse, \
    CubeReportItem, MPackReportItem, PackReportItem

from app.config import default_settings, get_apply_settings_url


async def get_by_id_or_404(model, id: ObjectId) -> Model:
    instance = await engine.find_one(model, model.id == id)
    if instance is None:
        raise HTTPException(404)
    return instance


async def get_by_qr_or_404(model, qr: str) -> Model:
    instance = await engine.find_one(model, model.qr == qr)
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


async def change_coded_setting(coded: bool) -> SystemStatus:
    system_status = await get_current_status()
    system_status.multipack_coded_by_qr = coded
    await engine.save(system_status)
    return system_status


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


async def get_cubes_queue() -> List[Cube]:
    last_batch = await get_last_batch()
    return await engine.find(Cube, Cube.batch_number == last_batch.number)


async def get_current_system_settings() -> Union[SystemSettings, None]:
    current_settings = await engine.find_one(SystemSettings, sort=query.desc(SystemSettings.id))
    return current_settings


async def get_system_settings_with_apply_url() -> Union[SystemSettingsResponse, None]:
    current_settings = await get_current_system_settings()
    if current_settings is None:
        return None
    setup_url = get_apply_settings_url(current_settings)
    return SystemSettingsResponse(**current_settings.dict(), setupUrl=setup_url)


async def create_system_settings_if_not_exists():
    system_settings = await get_system_settings_with_apply_url()
    if system_settings is None:
        system_settings = default_settings
        await engine.save(system_settings)


async def get_report(q: ReportRequest) -> ReportResponse:
    last_batch = await get_last_batch()

    cubes = await engine.find(Cube, query.and_(Cube.batch_number != last_batch.number,
                                               Cube.created_at >= q.report_begin,
                                               Cube.created_at <= q.report_end),
                              sort=query.asc(Cube.created_at))
    cubes_report = [parse_obj_as(CubeReportItem, cube.dict()) for cube in cubes]

    for i, cube in enumerate(cubes):
        list_of_ids = [ObjectId(i) for i in cube.multipack_ids_with_pack_ids]
        multipacks = await engine.find(Multipack, Multipack.id.in_(list_of_ids))
        mpacks_report = [parse_obj_as(MPackReportItem, mpack.dict()) for mpack in multipacks]
        cubes_report[i].multipacks = mpacks_report

        for j, multipack in enumerate(multipacks):
            packs = await engine.find(Pack, Pack.id.in_(multipack.pack_ids))
            packs_report = [parse_obj_as(PackReportItem, pack.dict()) for pack in packs]
            mpacks_report[j].packs = packs_report

    report = ReportResponse(**q.dict(), cubes=cubes_report)

    return report
