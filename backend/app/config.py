import json
import os

from app.models.system_devices import Precision
from app.models.system_settings import SystemSettings, SystemSettingsResponse
from app.utils.io import msg_templates_by_subject

CURRENT_API_VERSION = '1_0'

initial_pintset_device_params = {
    'precision': Precision.LOW
}

initial_pintset_client_params = {
    'local_device_ip': '172.15.0.1',
    'device_id': 'dd0c40db-2229-4ec4-b1d8-2a50ee83d6ff',
    'device_params': {'precision': Precision.LOW}
}

packing_sizes = json.loads(os.environ['DEFAULT_PACKING_SIZES'])

initial_system_settings = {
    'daysToDelete': os.environ['DROP_DATA_INTERVAL_DAYS'],
    'packSettings': packing_sizes,
    'placeName': os.environ['DEFAULT_PLACE'],
    'timeZone': os.environ['TZ'],
    'telegram_token': os.environ['TLG_TOKEN'],
    'telegram_chat': os.environ['TLG_CHAT'],
    'telegram_message': msg_templates_by_subject['special'],
    'pintset_client_params': initial_pintset_client_params
}


def get_settings_as_url_params(settings: dict):
    # настройки клиента либы по работе с пинцетами редактируем только через .env
    settings.pop('pintset_client_params')
    config_as_url_params = '?' + '&'.join(
        [f'{k}={str(v) if type(v) == str else str(v).replace(" ", "")}' for k, v in settings.items()]
    )
    return config_as_url_params


def get_apply_settings_url(system_settings: SystemSettings) -> str:
    settings = system_settings.dict()
    settings.pop('id')
    protocol = os.environ["SITE_PROTOCOL"]
    host = os.environ["SITE_HOST_WITH_DOMAIN"]
    port = os.environ.get("SITE_PORT", 80)

    apply_settings_url = f'{protocol}://{host}:{port}/api/v{CURRENT_API_VERSION}/apply_settings/{get_settings_as_url_params(settings)}'
    return apply_settings_url


default_settings = SystemSettings(**initial_system_settings)

default_settings_response = SystemSettingsResponse(**default_settings.dict(),
                                                   setupUrl=get_apply_settings_url(default_settings))


def is_settings_default(settings: SystemSettings, default: SystemSettings = default_settings) -> bool:
    default_as_dict = default.dict().copy()
    settings_as_dict = settings.dict().copy()

    del default_as_dict['id']
    del settings_as_dict['id']

    return settings_as_dict == default_as_dict
