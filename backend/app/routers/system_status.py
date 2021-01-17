from app.db.db_utils import (
    change_coded_setting, check_qr_unique, delete_cube, delete_multipack,
    flush_packing_table, flush_pintset, flush_state, get_current_state,
    get_current_status, get_current_workmode, get_last_batch,
    get_last_cube_in_queue, get_multipacks_queue, get_report,
    packing_table_error, pintset_error, set_column_red, set_column_yellow)
from app.db.engine import engine
from app.models.cube import Cube
from app.models.message import TGMessage
from app.models.multipack import Status
from app.models.report import ReportRequest, ReportResponse
from app.models.system_status import Mode, SystemState, SystemStatus
from app.utils.background_tasks import (flush_to_normal, send_error,
                                        send_warning, send_error_with_buzzer)
from app.utils.io import send_telegram_message
from app.utils.naive_current_datetime import get_string_datetime
from app.utils.pintset import off_pintset, on_pintset
from fastapi import APIRouter, BackgroundTasks, HTTPException
from fastapi_versioning import version
from pydantic import parse_obj_as

router = APIRouter()


@router.patch("/set_mode", response_model=Mode)
@version(1, 0)
async def set_mode(mode: Mode):
    current_status = await get_current_status()
    current_status.mode = mode
    await engine.save(current_status)
    return mode


@router.get("/get_mode", response_model=Mode)
@version(1, 0)
async def get_mode():
    return await get_current_workmode()


@router.get("/get_state", response_model=SystemState)
@version(1, 0)
async def get_state():
    return await get_current_state()


@router.get("/get_multipack_coded_setting",
            response_model=SystemStatus,
            response_model_exclude={"id", "mode", "system_state"})
@version(1, 0)
async def get_multipack_coded_by_qr_setting():
    return await get_current_status()


@router.patch("/change_multipack_coded_setting",
              response_model=SystemStatus,
              response_model_exclude={"id", "mode", "system_state"})
@version(1, 0)
async def set_multipack_coded_by_qr_setting(coded: bool):
    return await change_coded_setting(coded)


@router.patch("/set_column_yellow", response_model=SystemState)
@version(1, 0)
async def set_warning_state(error_msg: str, background_tasks: BackgroundTasks):
    background_tasks.add_task(send_warning)
    return await set_column_yellow(error_msg)


@router.patch("/set_column_red", response_model=SystemState)
@version(1, 0)
async def set_error_state(error_msg: str, background_tasks: BackgroundTasks):
    background_tasks.add_task(send_error)
    return await set_column_red(error_msg)


@router.patch("/flush_state", response_model=SystemState)
@version(1, 0)
async def set_normal_state(background_tasks: BackgroundTasks):
    background_tasks.add_task(flush_to_normal)
    return await flush_state()


@router.patch("/set_pintset_error", response_model=SystemState)
@version(1, 0)
async def set_pintset_error(error_msg: str, background_tasks: BackgroundTasks):
    background_tasks.add_task(off_pintset)
    background_tasks.add_task(send_error_with_buzzer)
    return await pintset_error(error_msg)


@router.patch("/flush_pintset", response_model=SystemState)
@version(1, 0)
async def set_pinset_normal(background_tasks: BackgroundTasks):
    background_tasks.add_task(flush_to_normal)
    background_tasks.add_task(on_pintset)
    return await flush_pintset()


@router.patch("/set_packing_table_error", response_model=SystemState)
@version(1, 0)
async def set_packing_table_error(error_msg: str, multipacks_on_error: int,
                                  background_tasks: BackgroundTasks):
    background_tasks.add_task(send_error)
    return await packing_table_error(error_msg, multipacks_on_error)


@router.patch("/flush_packing_table", response_model=SystemState)
@version(1, 0)
async def set_packing_table_normal(background_tasks: BackgroundTasks):
    background_tasks.add_task(flush_to_normal)
    return await flush_packing_table()


@router.patch("/flush_packing_table_with_remove", response_model=SystemState)
@version(1, 0)
async def set_packing_table_normal_with_remove(
        background_tasks: BackgroundTasks):
    state = await get_current_state()
    error_msg = state.packing_table_error_msg

    if 'вывозимый куб' in error_msg:
        cube_to_delete = await get_last_cube_in_queue()
        await delete_cube(cube_to_delete.id)
    else:
        multipacks_on_error = state.multipacks_on_table_error
        multipacks = await get_multipacks_queue()
        multipacks_to_delete = multipacks[:multipacks_on_error]
        for multipack in multipacks_to_delete:
            await delete_multipack(multipack.id)
    background_tasks.add_task(flush_to_normal)
    return await flush_packing_table()


@router.patch("/flush_packing_table_with_identify", response_model=SystemState)
@version(1, 0)
async def set_packing_table_normal_with_identify(
        qr: str, background_tasks: BackgroundTasks):
    if not await check_qr_unique(Cube, qr):
        raise HTTPException(400, detail=f'Куб с QR {qr} уже существует')
    state = await get_current_state()
    error_msg = state.packing_table_error_msg
    current_time = await get_string_datetime()

    if 'вывозимый куб' in error_msg:
        cube_to_update = await get_last_cube_in_queue()
        cube_to_update.qr = qr
        cube_to_update.added_qr_at = current_time
        await engine.save(cube_to_update)

    else:
        batch = await get_last_batch()
        batch_number = batch.number
        needed_multipacks = batch.params.multipacks
        needed_packs = batch.params.packs

        multipacks_on_error = state.multipacks_on_table_error
        multipacks = await get_multipacks_queue()
        multipacks_for_cube = multipacks[:multipacks_on_error]
        multipack_ids_with_pack_ids = {}

        for i in range(len(multipacks_for_cube)):
            multipacks_for_cube[i].status = Status.IN_CUBE
            multipack_ids_with_pack_ids[str(
                multipacks_for_cube[i].id)] = multipacks_for_cube[i].pack_ids
            await engine.save_all(multipacks_for_cube)

        cube = Cube(qr=qr,
                    multipack_ids_with_pack_ids=multipack_ids_with_pack_ids,
                    batch_number=batch_number,
                    multipacks_in_cubes=needed_multipacks,
                    packs_in_multipacks=needed_packs,
                    created_at=current_time,
                    added_qr_at=current_time)
        await engine.save(cube)

    background_tasks.add_task(flush_to_normal)
    return await flush_packing_table()


@router.post("/get_report", response_model=ReportResponse)
@version(1, 0)
async def get_system_report(report_query: ReportRequest) -> ReportResponse:
    return await get_report(report_query)


@router.get("/get_report/", response_model=ReportResponse)
async def get_system_report_with_query(
        report_begin: str = "01.01.1970 00:00",
        report_end: str = "01.01.2050 00:00") -> ReportResponse:
    report_query = parse_obj_as(ReportRequest, {
        "report_begin": report_begin,
        "report_end": report_end
    })
    return await get_report(report_query)


@router.post("/send_message", response_model=bool)
async def send_tg_message(msg: TGMessage) -> bool:
    return await send_telegram_message(msg)
