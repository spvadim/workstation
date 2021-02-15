from typing import Optional

from odmantic import Model
from pydantic import BaseModel

from ..model_config import ModelConfig
from .erd_settings import ERDSettings
from .general_settings import GeneralSettings
from .location_settings import LocationSettings
from .pintset_settings import PintsetSettings
from .telegram_settings import TGSettings


class SystemSettings(Model):
    general_settings: GeneralSettings
    location_settings: LocationSettings
    erd_settings: ERDSettings
    pintset_settings: PintsetSettings
    telegram_settings: TGSettings

    Config = ModelConfig


class SystemSettingsPatchScheme(BaseModel):
    general_settings: Optional[GeneralSettings]
    location_settings: Optional[LocationSettings]
    erd_settings: Optional[ERDSettings]
    pintset_settings: Optional[PintsetSettings]
    telegram_settings: Optional[TGSettings]

    Config = ModelConfig
