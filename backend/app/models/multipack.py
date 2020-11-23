from enum import Enum
from typing import List, Optional
from pydantic import BaseModel
from odmantic import Model, ObjectId, Field
from datetime import datetime


class Status(str, Enum):
    EXIT_PINTSET = 'вышел из пинцета'
    WRAPPED = 'вышел из обмотки'
    ADDED_QR = 'нанесен QR'
    ENTER_PITCHFORK = 'зашел на вилы'
    IN_UNFINISHED_CUBE = 'в незавершенном кубе'
    IN_CUBE = 'в кубе'


class Multipack(Model):
    qr: Optional[str]
    barcode: Optional[str]
    status: Optional[Status]
    pack_ids: List[ObjectId]
    batch_number: Optional[int]
    created_at: Optional[str]


class MultipackOutput(Model):
    created_at: str
    qr: Optional[str]
    status: Optional[Status]


class MultipackPatchSchema(BaseModel):
    qr: Optional[str]
    barcode: Optional[str]
    status: Optional[Status]
    pack_ids: Optional[List[ObjectId]]


