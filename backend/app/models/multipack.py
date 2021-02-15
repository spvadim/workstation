from datetime import datetime
from enum import Enum
from typing import List, Optional

from odmantic import Model
from odmantic.bson import ObjectId
from pydantic import BaseModel

from .model_config import ModelConfig
from .production_batch import ProductionBatchNumber


class Status(str, Enum):
    EXIT_PINTSET = 'вышел из пинцета'
    WRAPPING = 'в обмотке'
    WRAPPED = 'обмотан'
    ADDED_QR = 'нанесен QR'
    ENTER_PITCHFORK = 'зашел на вилы'
    IN_UNFINISHED_CUBE = 'в незавершенном кубе'
    IN_CUBE = 'в кубе'


class Multipack(Model):
    qr: Optional[str]
    barcode: Optional[str]
    status: Status = Status.EXIT_PINTSET
    pack_ids: List[ObjectId]
    comments: List[str] = []
    to_process: bool = False
    batch_number: Optional[ProductionBatchNumber]
    created_at: Optional[datetime]
    added_qr_at: Optional[datetime]

    Config = ModelConfig


class MultipackOutput(BaseModel):
    id: ObjectId
    created_at: datetime
    qr: Optional[str]
    status: Status
    to_process: bool
    comments: List[str]

    Config = ModelConfig


class MultipackIdentificationAuto(BaseModel):
    qr: Optional[str]
    barcode: Optional[str]

    Config = ModelConfig


class MultipackPatchSchema(BaseModel):
    qr: Optional[str]
    barcode: Optional[str]
    status: Optional[Status]
    comments: Optional[List[str]]
    to_process: Optional[bool]

    Config = ModelConfig
