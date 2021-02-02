from typing import Optional
from datetime import datetime

from odmantic import Model, ObjectId, Reference, EmbeddedModel


class ProductionBatchNumber(EmbeddedModel):
    batch_number: int
    batch_date: datetime

    class Config:
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


class ProductionBatchInput(Model):
    number: ProductionBatchNumber
    params_id: ObjectId


class ProductionBatch(Model):
    number: ProductionBatchNumber
    params: ProductionBatchParams = Reference()
    created_at: Optional[str]
    closed_at: Optional[str]
