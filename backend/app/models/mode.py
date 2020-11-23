from enum import Enum
from odmantic import Model


class WorkMode(str, Enum):
    AUTO = 'auto'
    MANUAL = 'manual'


class Mode(Model):
    work_mode: WorkMode = WorkMode.AUTO

