from odmantic import Model
from typing import Optional
from pydantic import BaseModel



class Pack(Model):
    qr: str
    barcode: str
    batch_number: int
    in_queue: bool = True
    created_at: str


class PackInput(Model):
    qr: str
    barcode: str
    batch_number: Optional[int]


class PackOutput(Model):
    qr: str
    created_at: str


class PackPatchSchema(BaseModel):
    qr: Optional[str]
    barcode: Optional[str]



