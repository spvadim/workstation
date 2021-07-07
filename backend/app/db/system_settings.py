from ..config import default_settings
from ..models.system_settings.system_settings import SystemSettings
from .engine import engine


async def get_system_settings() -> SystemSettings:
    return await engine.find_one(SystemSettings)


async def create_system_settings_if_not_exists():
    system_settings = await get_system_settings()
    if not system_settings:
        await engine.save(default_settings)
