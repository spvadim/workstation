import os

from app.models.system_settings.general_settings import (
    DaysToDelete, GeneralSettings, PintsetStop, SendApplikatorTgMessage)
from app.models.system_settings.location_settings import (LocationSettings,
                                                          PlaceName, TimeZone)

default_place_name = PlaceName(value=os.getenv('DEFAULT_PLACE'))
default_time_zone = TimeZone(value=os.getenv('TZ'))
default_location_settings = LocationSettings(place_name=default_place_name,
                                             time_zone=default_time_zone)

default_days_to_delete = DaysToDelete(
    value=os.getenv('DROP_DATA_INTERVAL_DAYS'))
default_send_applikator_tg_message = SendApplikatorTgMessage(
    value=os.getenv('SEND_TG_MESSAGE_AFTER_APPLIKATOR'))
default_pintset_stop = PintsetStop(value=os.getenv('PINTSET_STOP'))
default_general_settings = GeneralSettings(
    days_to_delete=default_days_to_delete,
    send_applikator_tg_message=default_send_applikator_tg_message,
    pintset_stop=default_pintset_stop)
