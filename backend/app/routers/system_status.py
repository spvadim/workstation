from datetime import datetime
from typing import List

from app.db.db_utils import (change_coded_setting, check_qr_unique,
                             delete_cube, flush_packing_table, flush_pintset,
                             flush_state, flush_withdrawal_pintset,
                             get_by_id_or_404, get_current_state,
                             get_current_status, get_current_workmode,
                             get_extended_report, get_packs_report, get_report,
                             get_report_without_mpacks, packing_table_error,
                             pintset_error, pintset_withdrawal_error,
                             set_column_red, set_column_yellow)
from app.db.engine import engine
from app.db.system_settings import get_system_settings
from app.models.cube import Cube
from app.models.message import TGMessage
from app.models.report import (ExtendedReportResponse, PackReportItem,
                               ReportRequest, ReportResponse,
                               ReportWithoutMPacksResponse)
from app.models.system_status import Mode, SystemState, SystemStatus
from app.utils.background_tasks import (flush_to_normal, send_error,
                                        send_error_with_buzzer, send_warning)
from app.utils.email import send_email
from app.utils.io import send_telegram_message
from app.utils.naive_current_datetime import get_naive_datetime
from app.utils.pintset import off_pintset, on_pintset
from fastapi import APIRouter, BackgroundTasks, File, HTTPException, UploadFile
from fastapi_versioning import version
from pydantic import parse_obj_as

from .custom_routers import DeepLoggerRoute, LightLoggerRoute

deep_logger_router = APIRouter(route_class=DeepLoggerRoute)
light_logger_router = APIRouter(route_class=LightLoggerRoute)


@deep_logger_router.patch("/set_mode", response_model=Mode)
@version(1, 0)
async def set_mode(mode: Mode):
    current_status = await get_current_status()
    current_status.mode = mode
    await engine.save(current_status)
    return mode


@light_logger_router.get("/get_mode", response_model=Mode)
@version(1, 0)
async def get_mode():
    return await get_current_workmode()


@light_logger_router.get("/get_state", response_model=SystemState)
@version(1, 0)
async def get_state():
    return await get_current_state()


@light_logger_router.get("/get_multipack_coded_setting",
                         response_model=SystemStatus,
                         response_model_exclude={"id", "mode", "system_state"})
@version(1, 0)
async def get_multipack_coded_by_qr_setting():
    return await get_current_status()


@deep_logger_router.patch(
    "/change_multipack_coded_setting",
    response_model=SystemStatus,
    response_model_exclude={"id", "mode", "system_state"})
@version(1, 0)
async def set_multipack_coded_by_qr_setting(coded: bool):
    return await change_coded_setting(coded)


@deep_logger_router.patch("/set_column_yellow", response_model=SystemState)
@version(1, 0)
async def set_warning_state(error_msg: str, background_tasks: BackgroundTasks):
    background_tasks.add_task(send_warning)
    return await set_column_yellow(error_msg)


@deep_logger_router.patch("/set_column_red", response_model=SystemState)
@version(1, 0)
async def set_error_state(error_msg: str, background_tasks: BackgroundTasks):
    background_tasks.add_task(send_error)
    return await set_column_red(error_msg)


@deep_logger_router.patch("/flush_state", response_model=SystemState)
@version(1, 0)
async def set_normal_state(background_tasks: BackgroundTasks):
    background_tasks.add_task(flush_to_normal)
    return await flush_state()


@deep_logger_router.patch("/set_pintset_error", response_model=SystemState)
@version(1, 0)
async def set_pintset_error(error_msg: str, background_tasks: BackgroundTasks):
    current_settings = await get_system_settings()
    pintset_settings = current_settings.pintset_settings

    background_tasks.add_task(off_pintset, pintset_settings)
    background_tasks.add_task(send_error_with_buzzer)
    return await pintset_error(error_msg)


@deep_logger_router.patch("/flush_pintset", response_model=SystemState)
@version(1, 0)
async def set_pinset_normal(background_tasks: BackgroundTasks):
    background_tasks.add_task(flush_to_normal)

    current_settings = await get_system_settings()
    pintset_settings = current_settings.pintset_settings
    background_tasks.add_task(on_pintset, pintset_settings)
    return await flush_pintset()


@deep_logger_router.patch("/set_pintset_withdrawal_error",
                          response_model=SystemState)
@version(1, 0)
async def set_pintset_withdrawal_error(error_msg: str,
                                       background_tasks: BackgroundTasks):
    background_tasks.add_task(send_error_with_buzzer)
    return await pintset_withdrawal_error(error_msg)


@deep_logger_router.patch("/flush_pintset_withdrawal",
                          response_model=SystemState)
@version(1, 0)
async def set_pintset_withdrawal_normal(background_tasks: BackgroundTasks):
    background_tasks.add_task(flush_to_normal)

    return await flush_withdrawal_pintset()


@deep_logger_router.patch("/set_packing_table_error",
                          response_model=SystemState)
@version(1, 0)
async def set_packing_table_error(error_msg: str, multipacks_on_error: int,
                                  background_tasks: BackgroundTasks):
    background_tasks.add_task(send_error)
    return await packing_table_error(error_msg, multipacks_on_error)


@deep_logger_router.patch("/flush_packing_table", response_model=SystemState)
@version(1, 0)
async def set_packing_table_normal(background_tasks: BackgroundTasks):
    background_tasks.add_task(flush_to_normal)
    return await flush_packing_table()


@deep_logger_router.patch("/flush_packing_table_with_remove",
                          response_model=SystemState)
@version(1, 0)
async def set_packing_table_normal_with_remove(
        background_tasks: BackgroundTasks):
    state = await get_current_state()
    wrong_cube_id = state.wrong_cube_id

    await delete_cube(wrong_cube_id)

    background_tasks.add_task(flush_to_normal)
    return await flush_packing_table()


@deep_logger_router.patch("/flush_packing_table_with_identify",
                          response_model=SystemState)
@version(1, 0)
async def set_packing_table_normal_with_identify(
        qr: str, background_tasks: BackgroundTasks):
    if not await check_qr_unique(Cube, qr):
        raise HTTPException(400, detail=f'Куб с QR {qr} уже существует')

    state = await get_current_state()
    wrong_cube_id = state.wrong_cube_id

    cube_to_update = await get_by_id_or_404(Cube, wrong_cube_id)
    cube_to_update.qr = qr
    cube_to_update.added_qr_at = await get_naive_datetime()
    await engine.save(cube_to_update)

    background_tasks.add_task(flush_to_normal)
    return await flush_packing_table()


@light_logger_router.get("/get_packs_report/",
                         response_model=List[PackReportItem])
async def get_plain_packs_report_with_query(
        report_begin: str = "01.01.1970 00:00",
        report_end: str = "01.01.2050 00:00") -> ReportResponse:
    report_begin = datetime.strptime(report_begin, "%d.%m.%Y %H:%M")
    report_end = datetime.strptime(report_end, "%d.%m.%Y %H:%M")
    report_query = parse_obj_as(ReportRequest, {
        "report_begin": report_begin,
        "report_end": report_end
    })
    return await get_packs_report(report_query)


@light_logger_router.get("/get_report/", response_model=ReportResponse)
async def get_system_report_with_query(
        report_begin: str = "01.01.1970 00:00",
        report_end: str = "01.01.2050 00:00") -> ReportResponse:
    report_begin = datetime.strptime(report_begin, "%d.%m.%Y %H:%M")
    report_end = datetime.strptime(report_end, "%d.%m.%Y %H:%M")
    report_query = parse_obj_as(ReportRequest, {
        "report_begin": report_begin,
        "report_end": report_end
    })
    return await get_report(report_query)


@light_logger_router.get("/get_extended_report/",
                         response_model=ExtendedReportResponse)
async def get_extended_system_report_with_query(
        report_begin: str = "01.01.1970 00:00",
        report_end: str = "01.01.2050 00:00") -> ExtendedReportResponse:
    report_begin = datetime.strptime(report_begin, "%d.%m.%Y %H:%M")
    report_end = datetime.strptime(report_end, "%d.%m.%Y %H:%M")
    report_query = parse_obj_as(ReportRequest, {
        "report_begin": report_begin,
        "report_end": report_end
    })
    return await get_extended_report(report_query)


@light_logger_router.get("/report/",
                         response_model=ReportWithoutMPacksResponse)
async def get_report_with_query(
        report_begin: str = "01.01.1970 00:00",
        report_end: str = "01.01.2050 00:00") -> ReportWithoutMPacksResponse:
    report_begin = datetime.strptime(report_begin, "%d.%m.%Y %H:%M")
    report_end = datetime.strptime(report_end, "%d.%m.%Y %H:%M")
    report_query = parse_obj_as(ReportRequest, {
        "report_begin": report_begin,
        "report_end": report_end
    })
    return await get_report_without_mpacks(report_query)


@light_logger_router.post("/send_message", response_model=bool)
async def send_tg_message(text: str,
                          timestamp: bool = False,
                          img: UploadFile = File(None)) -> bool:
    return await send_telegram_message(
        TGMessage(text=text, timestamp=timestamp), img)


@light_logger_router.post("/send_email", response_model=bool)
async def send_email_message(subject: str, body: str) -> bool:
    return await send_email(subject, body)
