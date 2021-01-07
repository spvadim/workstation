from typing import Optional

from odmantic import Model, ObjectId, Reference


class ProductionBatchParams(Model):
    multipacks: int
    packs: int
    multipacks_after_pintset: int


class ProductionBatchInput(Model):
    number: int
    params_id: ObjectId


class ProductionBatch(Model):
    number: int
    params: ProductionBatchParams = Reference()
    created_at: Optional[str]
    closed_at: Optional[str]



