from fastapi import APIRouter
from fastapi_versioning import version
from app.models.mode import Mode
from app.db.db_utils import get_current_mode
from app.db.engine import engine

router = APIRouter()


@router.patch("/set_mode", response_model=Mode)
@version(1, 0)
async def set_mode(mode: Mode):
    current_mode = await get_current_mode()
    current_mode.work_mode = mode.work_mode
    await engine.save(current_mode)
    return current_mode


@router.get("/get_mode", response_model=Mode)
@version(1, 0)
async def get_mode():
    return await get_current_mode()


