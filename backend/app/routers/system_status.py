from fastapi import APIRouter
from fastapi_versioning import version
from app.models.system_status import Mode, SystemState, SystemStatus
from app.db.db_utils import get_current_status, get_current_workmode, get_current_state, set_column_yellow, \
    set_column_red, flush_state, change_coded_setting
from app.db.engine import engine

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


@router.get("/get_multipack_coded_setting", response_model=SystemStatus,
            response_model_exclude={"id", "mode", "system_state"})
@version(1, 0)
async def get_multipack_coded_by_qr_setting():
    return await get_current_status()


@router.patch("/change_multipack_coded_setting", response_model=SystemStatus,
              response_model_exclude={"id", "mode", "system_state"})
@version(1, 0)
async def get_multipack_coded_by_qr_setting(coded: bool):
    return await change_coded_setting(coded)


@router.patch("/set_column_yellow", response_model=SystemState)
@version(1, 0)
async def set_warning_state(error_msg: str):
    return await set_column_yellow(error_msg)


@router.patch("/set_column_red", response_model=SystemState)
@version(1, 0)
async def set_error_state(error_msg: str):
    return await set_column_red(error_msg)


@router.patch("/flush_state", response_model=SystemState)
@version(1, 0)
async def set_normal_state():
    return await flush_state()
