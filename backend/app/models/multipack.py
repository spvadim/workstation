from enum import Enum
from typing import List, Optional

from odmantic import Model, ObjectId
from pydantic import BaseModel

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
    created_at: Optional[str]
    added_qr_at: Optional[str]


class MultipackOutput(Model):
    created_at: str
    qr: Optional[str]
    status: Status


class MultipackIdentificationAuto(Model):
    qr: Optional[str]
    barcode: Optional[str]


class MultipackPatchSchema(BaseModel):
    qr: Optional[str]
    barcode: Optional[str]
    status: Optional[Status]
    comments: Optional[List[str]]
    to_process: Optional[bool]


