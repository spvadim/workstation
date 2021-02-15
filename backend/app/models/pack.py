from datetime import datetime
from typing import List, Optional
from .model_config import ModelConfig
from odmantic import Model
from odmantic.bson import ObjectId
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

    Config = ModelConfig


class PackOutput(BaseModel):
    id: ObjectId
    qr: str
    created_at: datetime
    to_process: bool
    comments: List[str]

    Config = ModelConfig


class PackPatchSchema(BaseModel):
    qr: Optional[str]
    barcode: Optional[str]
    comments: Optional[List[str]]
    to_process: Optional[bool]

    Config = ModelConfig


class PackCameraInput(BaseModel):
    qr: Optional[str]
    barcode: Optional[str]

    Config = ModelConfig
