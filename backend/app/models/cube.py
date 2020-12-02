from typing import List, Optional
from pydantic import BaseModel
from odmantic import Model, ObjectId


class Cube(Model):
    qr: Optional[str]
    barcode: Optional[str]
    multipack_ids: List[ObjectId]
    batch_number: Optional[int]
    created_at: Optional[str]
    added_qr_at: Optional[str]
    packs_in_multipacks: Optional[int]
    multipack_in_cubes: Optional[int]


class CubeOutput(Model):
    created_at: str
    qr: Optional[str]


class CubePatchSchema(BaseModel):
    qr: Optional[str]
    barcode: Optional[str]
    multipack_ids: Optional[List[ObjectId]]
