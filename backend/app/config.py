import os

from app.models.system_settings.location_settings import (LocationSettings,
                                                          PlaceName, TimeZone)

default_place_name = PlaceName(value=os.getenv('DEFAULT_PLACE'))
default_time_zone = TimeZone(value=os.getenv('TZ'))
default_location_settings = LocationSettings(place_name=default_place_name,
                                             time_zone=default_time_zone)
