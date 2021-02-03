from typing import List, Optional

from odmantic import Model
from pydantic import BaseModel

from .production_batch import ProductionBatchNumber


class Pack(Model):
    qr: str
    barcode: str
    batch_number: Optional[ProductionBatchNumber]
    comments: List[str] = []
    to_process: bool = False
    in_queue: bool = True
    created_at: Optional[str]


class PackOutput(Model):
    qr: str
    created_at: str
    to_process: bool
    comments: List[str]


class PackPatchSchema(BaseModel):
    qr: Optional[str]
    barcode: Optional[str]
    comments: Optional[List[str]]
    to_process: Optional[bool]


class PackCameraInput(BaseModel):
    qr: Optional[str]
    barcode: Optional[str]
