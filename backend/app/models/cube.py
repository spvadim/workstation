from datetime import datetime
from typing import Dict, List, Optional

from odmantic import Model
from odmantic.bson import ObjectId
from pydantic import BaseModel

from .model_config import ModelConfig
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

    Config = ModelConfig


class CubeInput(Model):
    qr: Optional[str]
    barcode: Optional[str]
    batch_number: Optional[ProductionBatchNumber]
    multipack_ids: List[ObjectId]

    Config = ModelConfig


class CubeWithNewContent(Model):
    params_id: ObjectId
    batch_number: int
    barcode_for_packs: str
    qr: str
    content: List[List[Dict[str, str]]]

    Config = ModelConfig


class CubeOutput(BaseModel):
    id: ObjectId
    created_at: datetime
    qr: Optional[str]
    to_process: bool
    comments: List[str]

    Config = ModelConfig


class CubeIdentificationAuto(BaseModel):
    qr: Optional[str]
    barcode: Optional[str]

    Config = ModelConfig


class CubePatchSchema(BaseModel):
    qr: Optional[str]
    barcode: Optional[str]
    to_process: Optional[bool]
    comments: Optional[List[str]]

    Config = ModelConfig


class CubeEditSchema(Model):
    pack_ids_to_delete: List[ObjectId]
    packs_barcode: str
    pack_qrs: List[str]
    to_process: Optional[bool]

    Config = ModelConfig


class CubeQr(Model):
    qr: ObjectId
    used: bool = False
