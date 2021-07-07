from datetime import datetime, timedelta

from ..db.system_settings import get_system_settings


async def get_current_tz() -> int:
    current_settings = await get_system_settings()
    return current_settings.location_settings.time_zone.value


async def get_naive_datetime() -> datetime:
    tz = await get_current_tz()
    current_datetime = datetime.utcnow() + timedelta(hours=tz)
    return current_datetime
