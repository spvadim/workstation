from datetime import datetime, timedelta
from typing import List, Optional, Union

from app.models.cube import Cube
from app.models.multipack import Multipack, Status
from app.models.pack import Pack
from app.models.pack import Status as PackStatus
from app.models.packing_table import PackingTableRecord
from app.models.production_batch import ProductionBatch, ProductionBatchNumber
from app.models.report import (CubeReportItem, MPackReportItem, PackReportItem,
                               ReportRequest, ReportResponse)
from app.models.system_status import Mode, State, SystemState, SystemStatus
from app.utils.naive_current_datetime import get_naive_datetime
from fastapi import HTTPException
from odmantic import Model, ObjectId, query
from pydantic.tools import parse_obj_as

from .engine import engine
from .system_settings import get_system_settings


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


async def find_not_shipped_pack_by_qr(qr: str) -> Optional[Pack]:
    pack = await get_by_qr_or_404(Pack, qr)

    if pack.in_queue:
        return pack

    multipack_containing_that_pack = await get_multipack_by_included_pack_id(
        pack.id)
    if multipack_containing_that_pack.status != Status.IN_CUBE:
        return pack

    last_cube = await get_last_cube_in_queue()
    if str(multipack_containing_that_pack.id
           ) in last_cube.multipack_ids_with_pack_ids.keys():
        if not last_cube.qr:
            return pack

    raise HTTPException(404)


async def get_multipack_by_included_pack_id(id: ObjectId()
                                            ) -> Optional[Multipack]:
    multipack = await engine.find_one(Multipack, {+Multipack.pack_ids: id})
    if not multipack:
        raise HTTPException(404)
    return multipack


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


async def pintset_withdrawal_error(error_msg: str) -> SystemState:
    current_status = await get_current_status()
    current_status.system_state.pintset_withdrawal_state = State.ERROR
    current_status.system_state.pintset_withdrawal_error_msg = error_msg
    await engine.save(current_status)
    return current_status.system_state


async def flush_withdrawal_pintset() -> SystemState:
    current_status = await get_current_status()
    current_status.system_state.pintset_withdrawal_state = State.NORMAL
    current_status.system_state.pintset_withdrawal_error_msg = None
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
        batch_number: Optional[ProductionBatchNumber]) -> ProductionBatch:
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
    current_time = await get_naive_datetime()
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
                created_at=current_time)

    await engine.save(cube)
    return cube


async def generate_packs(n: int,
                         batch_number,
                         current_datetime,
                         logger,
                         status: PackStatus = PackStatus.ON_ASSEMBLY,
                         to_process: bool = False,
                         result: List[Pack] = []) -> List[Pack]:
    for i in range(n):
        new_pack = Pack(
            qr=
            f'skipped pack {current_datetime.strftime("%d.%m.%Y %H:%M")} {i}',
            barcode='0000000000000',
            status=status,
            to_process=to_process,
            batch_number=batch_number,
            created_at=current_datetime)
        result.append(new_pack)
        logger.info(f'Добавил пачку {new_pack.json()}')
    return result


async def generate_multipack(batch_number, multipacks_after_pintset,
                             current_datetime, logger,
                             to_process) -> Multipack:
    packs = await generate_packs(n=multipacks_after_pintset,
                                 batch_number=batch_number,
                                 current_datetime=current_datetime,
                                 logger=logger,
                                 to_process=to_process)
    pack_ids = []
    for pack in packs:
        pack.in_queue = False
        pack_ids.append(pack.id)
    await engine.save_all(packs)

    multipack = Multipack(pack_ids=pack_ids)
    multipack.batch_number = batch_number
    multipack.created_at = current_datetime
    multipack.to_process = to_process
    logger.info(f'Добавил мультипак {multipack.json()}')
    return multipack


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


async def count_packs_queue() -> int:
    packs_amount = await engine.count(Pack, Pack.in_queue == True)
    return packs_amount


async def get_packs_under_pintset() -> List[Pack]:
    packs_under_pintset = await engine.find(
        Pack, Pack.status == PackStatus.UNDER_PINTSET, sort=query.asc(Pack.id))
    return packs_under_pintset


async def get_packs_on_assembly() -> List[Pack]:
    packs_on_assembly = await engine.find(
        Pack,
        Pack.status == PackStatus.ON_ASSEMBLY,
        Pack.in_queue == True,
        sort=query.asc(Pack.id))
    return packs_on_assembly


async def get_multipacks_queue() -> List[Multipack]:
    multipacks = await engine.find(Multipack,
                                   Multipack.status != Status.IN_CUBE,
                                   sort=query.asc(Multipack.id))
    return multipacks


async def count_multipacks_queue() -> int:
    multipacks_amount = await engine.count(Multipack,
                                           Multipack.status != Status.IN_CUBE)
    return multipacks_amount


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


async def count_cubes_queue() -> int:
    last_batch = await get_last_batch()
    return await engine.count(Cube, Cube.batch_number == last_batch.number)


async def get_report(q: ReportRequest) -> ReportResponse:

    dt_begin = q.report_begin
    dt_end = q.report_end

    current_settings = await get_system_settings()
    general_settings = current_settings.general_settings
    report_max_days = general_settings.report_max_days.value
    report_max_cubes = general_settings.report_max_cubes.value

    if dt_end - dt_begin > timedelta(days=report_max_days):
        raise HTTPException(400, detail='Слишком большой период для отчета')

    cubes = await engine.find(Cube,
                              query.and_(Cube.created_at < dt_end,
                                         Cube.created_at >= dt_begin),
                              limit=report_max_cubes)

    cubes_report = [
        parse_obj_as(CubeReportItem, cube.dict()) for cube in cubes
    ]

    for i, cube in enumerate(cubes):
        list_of_ids = [ObjectId(i) for i in cube.multipack_ids_with_pack_ids]
        multipacks = await engine.find(Multipack,
                                       Multipack.id.in_(list_of_ids))
        mpacks_report = [
            parse_obj_as(MPackReportItem, mpack.dict()) for mpack in multipacks
        ]

        cubes_report[i].multipacks = mpacks_report

        for j, multipack in enumerate(multipacks):
            packs = await engine.find(Pack, Pack.id.in_(multipack.pack_ids))
            packs_report = [
                parse_obj_as(PackReportItem, pack.dict()) for pack in packs
            ]
            mpacks_report[j].packs = packs_report

    report = ReportResponse(**q.dict(), cubes=cubes_report)

    return report
