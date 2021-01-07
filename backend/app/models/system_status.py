from typing import Optional
from enum import Enum
from odmantic import EmbeddedModel, Model


class WorkMode(str, Enum):
    AUTO = 'auto'
    MANUAL = 'manual'


class State(str, Enum):
    NORMAL = 'normal'
    WARNING = 'warning'
    ERROR = 'error'


class Mode(EmbeddedModel):
    work_mode: WorkMode = WorkMode.AUTO


class SystemState(EmbeddedModel):
    state: State = State.NORMAL
    pintset_state: State = State.NORMAL
    packing_table_state: State = State.NORMAL
    error_msg: Optional[str]
    pintset_error_msg: Optional[str]
    packing_table_error_msg: Optional[str]


class SystemStatus(Model):
    mode: Mode
    system_state: SystemState
    multipack_coded_by_qr: bool = False
