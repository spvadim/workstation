from typing import List, Optional, Dict
from pydantic import BaseModel
from odmantic import Model, ObjectId


class Cube(Model):
    qr: Optional[str]
    barcode: Optional[str]
    multipack_ids_with_pack_ids: Dict[str, List[ObjectId]]
    batch_number: int
    created_at: str
    added_qr_at: Optional[str]
    packs_in_multipacks: int
    multipacks_in_cubes: int


class CubeInput(Model):
    qr: Optional[str]
    barcode: Optional[str]
    batch_number: Optional[int]
    multipack_ids: List[ObjectId]


class CubeOutput(Model):
    created_at: str
    qr: Optional[str]


class CubePatchSchema(BaseModel):
    qr: Optional[str]
    barcode: Optional[str]
    multipack_ids_with_pack_ids: Dict[str, List[ObjectId]]
