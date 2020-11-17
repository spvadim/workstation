from odmantic import Model, Reference, ObjectId
from typing import Optional
from .production_batch import ProductionBatch


class Pack(Model):
    qr: str
    batch: ProductionBatch = Reference()
    is_referenced: bool = False


class PackInput(Model):
    qr: str
    batch_id: Optional[ObjectId]


class PackOutput(Model):
    qr: str
