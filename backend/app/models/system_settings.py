from typing import List, Optional

from odmantic import Model

from .system_devices import PintsetClientParams


class SystemSettings(Model):
    daysToDelete: int
    packSettings: List[List[int]]
    placeName: str
    timeZone: int
    telegram_token: str
    telegram_chat: str
    telegram_message: str
    pintset_client_params: Optional[PintsetClientParams]


class SystemSettingsResponse(SystemSettings):
    # url для оперативной корректировки настроек системы,
    # кроме настроек PintsetClientParams, их менять только через /set_settings
    setupUrl: str
