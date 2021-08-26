from typing import Optional

from odmantic import Model
from pydantic import BaseModel

from ..model_config import ModelConfig
from .desync_settings import DesyncConstantSettings
from .email_settings import MailSettings
from .erd_settings import ERDSettings, SecondERDSettings, ThirdERDSettings
from .general_settings import GeneralSettings
from .location_settings import LocationSettings
from .pintset_settings import PintsetSettings
from .telegram_settings import TGSettings


class SystemSettings(Model):
    general_settings: GeneralSettings
    location_settings: LocationSettings
    erd_settings: ERDSettings
    second_erd_settings: SecondERDSettings
    third_erd_settings: ThirdERDSettings = ThirdERDSettings()
    pintset_settings: PintsetSettings
    telegram_settings: TGSettings
    mail_settings: MailSettings
    desync_settings: DesyncConstantSettings = DesyncConstantSettings()

    Config = ModelConfig


class SystemSettingsPatchScheme(BaseModel):
    general_settings: Optional[GeneralSettings]
    location_settings: Optional[LocationSettings]
    erd_settings: Optional[ERDSettings]
    second_erd_settings: Optional[SecondERDSettings]
    third_erd_settings: Optional[ThirdERDSettings]
    pintset_settings: Optional[PintsetSettings]
    telegram_settings: Optional[TGSettings]
    mail_settings: Optional[MailSettings]
    desync_settings: Optional[DesyncConstantSettings]

    Config = ModelConfig
