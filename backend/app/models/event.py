from datetime import datetime
from enum import Enum
from typing import List, Optional

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


class EventsOutput(BaseModel):
    amount: int
    events: List[EventOutput]

    Config = ReportModelConfig

class EventFilters(BaseModel):
    skip: Optional[int] = 0
    limit: Optional[int] = 10
    event_type: Optional[EventType] = None
    processed: Optional[bool] = None
    events_begin: Optional[datetime]
    events_end: Optional[datetime]

    Config = ReportModelConfig


class InterventionEventInput(BaseModel):
    message: str
    camera_number: int

    Config = ReportModelConfig
