from typing import Dict, List, Optional

from odmantic import Model, ObjectId
from pydantic import BaseModel

from .production_batch import ProductionBatchNumber


class Cube(Model):
    qr: Optional[str]
    barcode: Optional[str]
    multipack_ids_with_pack_ids: Dict[str, List[ObjectId]]
    batch_number: ProductionBatchNumber
    created_at: str
    added_qr_at: Optional[str]
    packs_in_multipacks: int
    multipacks_in_cubes: int
    to_process: bool = False
    comments: List[str] = []


class CubeInput(Model):
    qr: Optional[str]
    barcode: Optional[str]
    batch_number: Optional[ProductionBatchNumber]
    multipack_ids: List[ObjectId]


class CubeWithNewContent(Model):
    params_id: ObjectId
    batch_number: int
    barcode_for_packs: str
    qr: str
    content: List[List[Dict[str, str]]]


class CubeOutput(Model):
    created_at: str
    qr: Optional[str]


class CubeIdentificationAuto(Model):
    qr: Optional[str]
    barcode: Optional[str]


class CubePatchSchema(BaseModel):
    qr: Optional[str]
    barcode: Optional[str]
    to_process: Optional[bool]
    comments: Optional[List[str]]


class CubeEditSchema(Model):
    pack_ids_to_delete: List[ObjectId]
    packs_barcode: str
    pack_qrs: List[str]
