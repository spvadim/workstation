from abc import ABC
from enum import Enum

from odmantic import EmbeddedModel


class Precision(str, Enum):
    LOW = 'low'
    MEDIUM = 'medium'
    HIGH = 'high'


class PintsetDeviceParams(EmbeddedModel, ABC):
    precision: Precision


class PintsetClientParams(EmbeddedModel, ABC):
    local_device_ip: str
    device_id: str
    device_params: PintsetDeviceParams
