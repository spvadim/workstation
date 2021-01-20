from typing import Optional

from odmantic import Model
from pydantic import BaseModel

from .production_batch import ProductionBatchNumber


class Pack(Model):
    qr: str
    barcode: str
    batch_number: Optional[ProductionBatchNumber]
    in_queue: bool = True
    created_at: Optional[str]


class PackOutput(Model):
    qr: str
    created_at: str


class PackPatchSchema(BaseModel):
    qr: Optional[str]
    barcode: Optional[str]


class PackCameraInput(Model):
    qr: Optional[str]
    barcode: Optional[str]
