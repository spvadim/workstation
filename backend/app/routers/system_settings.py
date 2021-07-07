from fastapi import APIRouter

from ..db.engine import engine
from ..db.system_settings import get_system_settings
from ..models.system_settings.system_settings import (
    SystemSettings,
    SystemSettingsPatchScheme,
)
from .custom_routers import DeepLoggerRoute, LightLoggerRoute

deep_logger_router = APIRouter(route_class=DeepLoggerRoute)
light_logger_router = APIRouter(route_class=LightLoggerRoute)


@light_logger_router.get("/settings", response_model=SystemSettings)
async def get_current_settings() -> SystemSettings:
    return await get_system_settings()


@deep_logger_router.patch("/settings", response_model=SystemSettings)
async def edit_settings(patch: SystemSettingsPatchScheme) -> SystemSettings:
    current_settings = await get_system_settings()
    patch_dict = patch.dict(exclude_unset=True)
    for name, value in patch_dict.items():
        setattr(current_settings, name, value)
    await engine.save(current_settings)
    return current_settings
