from datetime import datetime, timedelta
from app.db.system_settings import get_system_settings


async def get_current_tz() -> int:
    current_settings = await get_system_settings()
    return current_settings.local_settings.time_zone.value


async def get_string_datetime() -> str:
    tz = await get_current_tz()
    current_datetime = (datetime.utcnow() +
                        timedelta(hours=tz)).strftime("%d.%m.%Y %H:%M")
    return current_datetime
