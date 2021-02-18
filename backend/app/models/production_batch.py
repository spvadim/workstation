from datetime import datetime
from typing import Optional

from odmantic import EmbeddedModel, Model, ObjectId, Reference
from pydantic import BaseModel

from .model_config import ModelConfig


class ProductionBatchNumber(EmbeddedModel):
    batch_number: int
    batch_date: datetime

    class Config(ModelConfig):
        schema_extra = {
            "example": {
                "batch_number": 100,
                "batch_date": '2021-01-20 00:00'
            }
        }


class ProductionBatchParams(Model):
    multipacks: int
    packs: int
    multipacks_after_pintset: int
    visible: bool = True

    Config = ModelConfig


class PatchParamsScheme(BaseModel):
    number: Optional[ProductionBatchNumber]
    packs: Optional[int]
    multipacks_after_pintset: Optional[int]
    visible: Optional[bool]

    Config = ModelConfig


class ProductionBatchInput(Model):
    number: ProductionBatchNumber
    params_id: ObjectId

    Config = ModelConfig


class ProductionBatch(Model):
    number: ProductionBatchNumber
    params: ProductionBatchParams = Reference()
    created_at: Optional[datetime]
    closed_at: Optional[datetime]

    Config = ModelConfig
