from enum import Enum
from datetime import datetime
from typing import List, Optional
from .model_config import ModelConfig
from odmantic import Model
from odmantic.bson import ObjectId
from pydantic import BaseModel

from .production_batch import ProductionBatchNumber


class Status(str, Enum):
    UNDER_PINTSET = 'под пинцетом'
    ON_ASSEMBLY = 'на сборке'


class Pack(Model):
    qr: str
    barcode: str
    batch_number: Optional[ProductionBatchNumber]
    status: Status = Status.UNDER_PINTSET
    comments: List[str] = []
    to_process: bool = False
    in_queue: bool = True
    created_at: Optional[datetime]

    Config = ModelConfig


class PackInReport(Model):
    qr: str
    barcode: str
    created_at: datetime
    ftp_url: Optional[str]

    Config = ModelConfig


class PackOutput(BaseModel):
    id: ObjectId
    qr: str
    created_at: datetime
    to_process: bool
    comments: List[str]
    status: Status
    Config = ModelConfig


class PackPatchSchema(BaseModel):
    qr: Optional[str]
    barcode: Optional[str]
    to_process: Optional[bool]

    Config = ModelConfig


class PackCameraInput(BaseModel):
    qr: Optional[str]
    barcode: Optional[str]

    Config = ModelConfig
