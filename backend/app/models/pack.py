from odmantic import Model
from typing import Optional
from pydantic import BaseModel


class Pack(Model):
    qr: str
    barcode: str
    batch_number: Optional[int]
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
