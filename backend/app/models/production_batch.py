from bson import ObjectId
from odmantic import Model, Reference


class ProductionBatchParams(Model):
    multipacks: int
    packs: int


class ProductionBatchInput(Model):
    number: int
    params_id: ObjectId


class ProductionBatch(Model):
    number: int
    params: ProductionBatchParams = Reference()