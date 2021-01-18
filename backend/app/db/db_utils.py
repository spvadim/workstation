from datetime import datetime
from typing import List, Optional, Union

from app.config import default_settings, get_apply_settings_url
from app.models.cube import Cube
from app.models.multipack import Multipack, Status
from app.models.pack import Pack
from app.models.packing_table import PackingTableRecord
from app.models.production_batch import ProductionBatch
from app.models.report import (CubeReportItem, MPackReportItem, PackReportItem,
                               ReportRequest, ReportResponse)
from app.models.system_settings import SystemSettings, SystemSettingsResponse
from app.models.system_status import Mode, State, SystemState, SystemStatus
from app.utils.naive_current_datetime import get_string_datetime
from fastapi import HTTPException
from odmantic import Model, ObjectId, query
from pydantic.tools import parse_obj_as

from .engine import engine


async def get_by_id_or_404(model, id: ObjectId) -> Model:
    instance = await engine.find_one(model, model.id == id)
    if instance is None:
        raise HTTPException(404, detail=f'{model} с id={id} не найден')
    return instance


async def delete_multipack(id: ObjectId) -> Multipack:
    multipack = await get_by_id_or_404(Multipack, id=id)
    for pack_id in multipack.pack_ids:
        pack = await get_by_id_or_404(Pack, id=pack_id)
        await engine.delete(pack)
    await engine.delete(multipack)
    return multipack


async def delete_cube(id: ObjectId) -> Cube:
    cube = await get_by_id_or_404(Cube, id=id)
    for multipack_id in cube.multipack_ids_with_pack_ids.keys():
        await delete_multipack(ObjectId(multipack_id))
    await engine.delete(cube)
    return cube


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
    current_status.system_state.state = State.WARNING
    current_status.system_state.error_msg = error_msg
    await engine.save(current_status)
    return current_status.system_state


async def set_column_red(error_msg: str) -> SystemState:
    current_status = await get_current_status()
    current_status.system_state.state = State.ERROR
    current_status.system_state.error_msg = error_msg
    await engine.save(current_status)
    return current_status.system_state


async def flush_state() -> SystemState:
    current_status = await get_current_status()
    current_status.system_state.state = State.NORMAL
    current_status.system_state.error_msg = None
    await engine.save(current_status)
    return current_status.system_state


async def pintset_error(error_msg: str) -> SystemState:
    current_status = await get_current_status()
    current_status.system_state.pintset_state = State.ERROR
    current_status.system_state.pintset_error_msg = error_msg
    await engine.save(current_status)
    return current_status.system_state


async def flush_pintset() -> SystemState:
    current_status = await get_current_status()
    current_status.system_state.pintset_state = State.NORMAL
    current_status.system_state.pintset_error_msg = None
    await engine.save(current_status)
    return current_status.system_state


async def packing_table_error(error_msg: str,
                              wrong_cube_id: ObjectId) -> SystemState:
    current_status = await get_current_status()
    current_status.system_state.packing_table_state = State.ERROR
    current_status.system_state.packing_table_error_msg = error_msg
    current_status.system_state.wrong_cube_id = wrong_cube_id
    await engine.save(current_status)
    return current_status.system_state


async def flush_packing_table() -> SystemState:
    current_status = await get_current_status()
    current_status.system_state.packing_table_state = State.NORMAL
    current_status.system_state.packing_table_error_msg = None
    current_status.system_state.wrong_cube_id = None
    await engine.save(current_status)
    return current_status.system_state


async def check_qr_unique(model, qr: str) -> bool:
    return await engine.find_one(model, model.qr == qr) is None


async def get_last_batch() -> ProductionBatch:
    last_batch = await engine.find_one(ProductionBatch,
                                       sort=query.desc(ProductionBatch.id))
    return last_batch


async def get_last_packing_table_amount() -> int:
    last_record = await engine.find_one(PackingTableRecord,
                                        sort=query.desc(PackingTableRecord.id))
    if not last_record:
        return 0
    multipacks_amount = last_record.multipacks_amount
    return multipacks_amount


async def get_batch_by_number_or_return_last(
        batch_number: Optional[int]) -> ProductionBatch:
    if batch_number:
        batch = await engine.find_one(ProductionBatch,
                                      ProductionBatch.number == batch_number)
        if not batch:
            raise HTTPException(404)
    else:
        batch = await get_last_batch()
        if not batch:
            raise HTTPException(404)
    return batch


async def form_cube_from_n_multipacks(n: int) -> Cube:
    batch = await get_last_batch()
    batch_number = batch.number
    needed_multipacks = batch.params.multipacks
    needed_packs = batch.params.packs
    current_time = await get_string_datetime()

    multipacks = await get_multipacks_queue()
    multipacks_for_cube = multipacks[:n]
    multipack_ids_with_pack_ids = {}

    for i in range(len(multipacks_for_cube)):
        multipacks_for_cube[i].status = Status.IN_CUBE
        multipack_ids_with_pack_ids[str(
            multipacks_for_cube[i].id)] = multipacks_for_cube[i].pack_ids
        await engine.save_all(multipacks_for_cube)

    cube = Cube(multipack_ids_with_pack_ids=multipack_ids_with_pack_ids,
                batch_number=batch_number,
                multipacks_in_cubes=needed_multipacks,
                packs_in_multipacks=needed_packs,
                created_at=current_time,
                added_qr_at=current_time)

    await engine.save(cube)
    return cube


async def get_100_last_packing_records() -> List[PackingTableRecord]:
    records = await engine.find(PackingTableRecord,
                                sort=query.desc(PackingTableRecord.id),
                                limit=100)
    return records


async def get_packs_queue() -> List[Pack]:
    packs = await engine.find(Pack,
                              Pack.in_queue == True,
                              sort=query.asc(Pack.id))
    return packs


async def get_multipacks_queue() -> List[Multipack]:
    multipacks = await engine.find(Multipack,
                                   Multipack.status != Status.IN_CUBE,
                                   sort=query.asc(Multipack.id))
    return multipacks


async def count_multipacks_queue() -> int:
    amount = await engine.count(Multipack, Multipack.status != Status.IN_CUBE)
    return amount


async def get_first_exited_pintset_multipack() -> Multipack:
    multipack = await engine.find_one(Multipack,
                                      Multipack.status == Status.EXIT_PINTSET,
                                      sort=query.asc(Multipack.id))

    return multipack


async def get_first_wrapping_multipack() -> Multipack:
    multipack = await engine.find_one(Multipack,
                                      Multipack.status == Status.WRAPPING,
                                      sort=query.asc(Multipack.id))

    return multipack


async def get_first_multipack_without_qr() -> Union[Multipack, None]:
    multipack = await engine.find_one(Multipack,
                                      Multipack.status != Status.IN_CUBE,
                                      Multipack.qr == None,
                                      sort=query.asc(Multipack.id))
    return multipack


async def get_first_cube_without_qr() -> Union[Cube, None]:
    last_batch = await get_last_batch()
    cube = await engine.find_one(Cube,
                                 Cube.batch_number == last_batch.number,
                                 Cube.qr == None,
                                 sort=query.asc(Cube.id))
    return cube


async def get_last_cube_in_queue() -> Cube:
    last_batch = await get_last_batch()
    cube = await engine.find_one(Cube,
                                 Cube.batch_number == last_batch.number,
                                 sort=query.desc(Cube.id))
    return cube


async def get_all_wrapping_multipacks() -> List[Multipack]:
    multipacks = await engine.find(Multipack,
                                   Multipack.status == Status.WRAPPING)
    return multipacks


async def get_cubes_queue() -> List[Cube]:
    last_batch = await get_last_batch()
    return await engine.find(Cube, Cube.batch_number == last_batch.number)


async def get_current_system_settings() -> Union[SystemSettings, None]:
    current_settings = await engine.find_one(SystemSettings,
                                             sort=query.desc(
                                                 SystemSettings.id))
    return current_settings


async def get_system_settings_with_apply_url(
) -> Union[SystemSettingsResponse, None]:
    current_settings = await get_current_system_settings()
    if current_settings is None:
        return None
    setup_url = get_apply_settings_url(current_settings)
    return SystemSettingsResponse(**current_settings.dict(),
                                  setupUrl=setup_url)


async def create_system_settings_if_not_exists():
    system_settings = await get_system_settings_with_apply_url()
    if system_settings is None:
        system_settings = default_settings
        await engine.save(system_settings)


async def get_report(q: ReportRequest) -> ReportResponse:
    last_batch = await get_last_batch()
    dtf = datetime.strptime
    tf = '%d.%m.%Y %H:%M'

    dt_begin = dtf(q.report_begin, tf)
    dt_end = dtf(q.report_end, tf)

    cubes = await engine.find(
        Cube, query.and_(Cube.batch_number != last_batch.number))

    cubes = [
        cube for cube in cubes
        if dt_begin <= dtf(cube.created_at, tf) <= dt_end
    ]

    cubes = sorted(cubes, key=lambda c: dtf(c.created_at, tf))

    cubes_report = [
        parse_obj_as(CubeReportItem, cube.dict()) for cube in cubes
    ]

    for i, cube in enumerate(cubes):
        list_of_ids = [ObjectId(i) for i in cube.multipack_ids_with_pack_ids]
        multipacks = await engine.find(Multipack,
                                       Multipack.id.in_(list_of_ids),
                                       sort=query.asc(Multipack.created_at))
        mpacks_report = [
            parse_obj_as(MPackReportItem, mpack.dict()) for mpack in multipacks
        ]

        cubes_report[i].multipacks = mpacks_report

        for j, multipack in enumerate(multipacks):
            packs = await engine.find(Pack,
                                      Pack.id.in_(multipack.pack_ids),
                                      sort=query.asc(Pack.created_at))
            packs_report = [
                parse_obj_as(PackReportItem, pack.dict()) for pack in packs
            ]
            mpacks_report[j].packs = packs_report

    report = ReportResponse(**q.dict(), cubes=cubes_report)

    return report
