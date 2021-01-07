import json

from app.config import default_settings, default_settings_response
from app.db.db_utils import (get_current_system_settings,
                             get_system_settings_with_apply_url)
from app.db.engine import engine
from app.models.system_settings import SystemSettings, SystemSettingsResponse
from fastapi import APIRouter, Request
from fastapi_versioning import version
from pydantic import parse_obj_as

router = APIRouter()


@router.get("/get_settings", response_model=SystemSettingsResponse)
@version(1, 0)
async def get_sys_settings(default: bool = False):
    if default:
        return default_settings_response
    return await get_system_settings_with_apply_url()


@router.post("/set_settings", response_model=SystemSettings)
@version(1, 0)
async def set_sys_settings(incoming_settings: SystemSettings, transit=False):
    current_system_settings: SystemSettings = await get_current_system_settings()
    current_system_settings = SystemSettings(**incoming_settings.dict(
        exclude={'id'}),
                                             id=current_system_settings.id)
    await engine.save(current_system_settings)
    if transit:
        return current_system_settings.dict(exclude={'id'})
    return await get_system_settings_with_apply_url()


@router.get("/apply_settings/", response_model=dict)
@version(1, 0)
async def apply_system_settings(request: Request) -> dict:
    try:
        python_params = dict(request.query_params)
        # десериализация сложных типов
        python_params['packSettings'] = json.loads(
            request.query_params['packSettings'])
        # настройки клиента либы по работе с пинцетом правим только через .env - соотв. берем их только оттуда.
        python_params['pintset_client_params'] = default_settings.dict(
        )['pintset_client_params']
        system_settings = parse_obj_as(SystemSettings, python_params)
    except:
        return {"result": "wrong settings was passed"}
    settings_response = await set_sys_settings(system_settings, transit=True)
    return {"result": "success", "current_settings": settings_response}
