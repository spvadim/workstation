from datetime import datetime
from typing import Dict, List, Optional

from odmantic import Model
from odmantic.bson import BSON_TYPES_ENCODERS, ObjectId
from pydantic import BaseModel

from .production_batch import ProductionBatchNumber


class Cube(Model):
    qr: Optional[str]
    barcode: Optional[str]
    multipack_ids_with_pack_ids: Dict[str, List[ObjectId]]
    batch_number: ProductionBatchNumber
    created_at: datetime
    added_qr_at: Optional[datetime]
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


class CubeOutput(BaseModel):
    id: ObjectId
    created_at: datetime
    qr: Optional[str]
    to_process: bool
    comments: List[str]

    class Config:
        json_encoders = {
            **BSON_TYPES_ENCODERS, datetime:
            lambda v: v.strftime("%d.%m.%Y %H:%M")
        }


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
    to_process: Optional[bool]
