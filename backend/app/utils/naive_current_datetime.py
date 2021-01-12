from datetime import datetime, timedelta
from app.db.db_utils import get_current_system_settings


async def get_current_tz() -> int:
    current_settings = await get_current_system_settings()
    return current_settings.timeZone


async def get_string_datetime() -> str:
    tz = await get_current_tz()
    current_datetime = (datetime.utcnow() +
                        timedelta(hours=tz)).strftime("%d.%m.%Y %H:%M")
    return current_datetime
