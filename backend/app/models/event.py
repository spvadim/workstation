from datetime import datetime
from enum import Enum
from typing import Optional

from odmantic import Model, ObjectId
from pydantic import BaseModel

from .model_config import ReportModelConfig


class EventType(str, Enum):
    DESYNC = 'desync'
    MANUAL_INTERVENTION = 'manual_intervention'
    ERROR = 'error'


class Event(Model):
    time: datetime
    time_on_video: Optional[datetime]
    camera_number: Optional[int]
    message: str
    event_type: EventType
    processed: Optional[bool] = False

    Config = ReportModelConfig


class EventOutput(BaseModel):
    id: ObjectId
    time: datetime
    time_on_video: Optional[datetime]
    camera_number: Optional[int]
    message: str
    event_type: EventType
    processed: Optional[bool] = False

    Config = ReportModelConfig


class EventFilters(BaseModel):
    event_type: Optional[EventType] = None
    processed: Optional[bool] = None

    Config = ReportModelConfig


class InterventionEventInput(BaseModel):
    message: str
    camera_number: int

    Config = ReportModelConfig
