from datetime import datetime
from typing import List, Optional

from odmantic import Model
from odmantic.bson import BSON_TYPES_ENCODERS, ObjectId
from pydantic import BaseModel

from .production_batch import ProductionBatchNumber


class Pack(Model):
    qr: str
    barcode: str
    batch_number: Optional[ProductionBatchNumber]
    comments: List[str] = []
    to_process: bool = False
    in_queue: bool = True
    created_at: Optional[datetime]


class PackOutput(BaseModel):
    id: ObjectId
    qr: str
    created_at: datetime
    to_process: bool
    comments: List[str]

    class Config:
        json_encoders = {
            **BSON_TYPES_ENCODERS, datetime:
            lambda v: v.strftime("%d.%m.%Y %H:%M")
        }


class PackPatchSchema(BaseModel):
    qr: Optional[str]
    barcode: Optional[str]
    comments: Optional[List[str]]
    to_process: Optional[bool]


class PackCameraInput(BaseModel):
    qr: Optional[str]
    barcode: Optional[str]
