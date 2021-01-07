from app.db.db_utils import (change_coded_setting, flush_packing_table,
                             flush_pintset, flush_state, get_current_state,
                             get_current_status, get_current_workmode,
                             get_report, packing_table_error, pintset_error,
                             set_column_red, set_column_yellow)
from app.db.engine import engine
from app.models.message import TGMessage
from app.models.report import ReportRequest, ReportResponse
from app.models.system_status import Mode, SystemState, SystemStatus
from app.utils.background_tasks import (flush_to_normal, send_error,
                                        send_warning)
from app.utils.io import send_telegram_message
from fastapi import APIRouter, BackgroundTasks
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
    background_tasks.add_task(send_error)
    return await pintset_error(error_msg)


@router.patch("/flush_pintset", response_model=SystemState)
@version(1, 0)
async def set_pinset_normal(background_tasks: BackgroundTasks):
    background_tasks.add_task(flush_to_normal)
    return await flush_pintset()


@router.patch("/set_packing_table_error", response_model=SystemState)
@version(1, 0)
async def set_packing_table_error(error_msg: str,
                                  background_tasks: BackgroundTasks):
    background_tasks.add_task(send_error)
    return await packing_table_error(error_msg)


@router.patch("/flush_packing_table", response_model=SystemState)
@version(1, 0)
async def set_packing_table_normal(background_tasks: BackgroundTasks):
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
