from app.db.engine import engine
from app.db.system_settings import get_system_settings
from app.models.system_settings.system_settings import (
    SystemSettings, SystemSettingsPatchScheme)
from fastapi import APIRouter

router = APIRouter()


@router.get('/settings', response_model=SystemSettings)
async def get_current_settings() -> SystemSettings:
    return await get_system_settings()


@router.patch('/settings', response_model=SystemSettings)
async def edit_settings(patch: SystemSettingsPatchScheme) -> SystemSettings:
    current_settings = await get_system_settings()
    patch_dict = patch.dict(exclude_unset=True)
    for name, value in patch_dict.items():
        setattr(current_settings, name, value)
    await engine.save(current_settings)
    return current_settings
