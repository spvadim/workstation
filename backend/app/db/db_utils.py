from odmantic import query, ObjectId
from .engine import engine
from app.models.production_batch import ProductionBatch


async def get_last_batch() -> ProductionBatch:
    last_batch = await engine.find_one(ProductionBatch, sort=query.desc(ProductionBatch.id))
    return last_batch

