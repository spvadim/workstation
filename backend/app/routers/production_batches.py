from typing import List
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException
from fastapi import Depends, Header
from fastapi_versioning import version
from app.db.engine import engine
from app.db.db_utils import get_last_batch
from app.models.production_batch import ProductionBatchParams, ProductionBatchInput, ProductionBatch

router = APIRouter()


@router.get("/batches_params", response_model=List[ProductionBatchParams])
@version(1, 0)
async def get_all_params():
    all_params = await engine.find(ProductionBatchParams)
    return all_params


@router.put("/batches_params", response_model=ProductionBatchParams)
@version(1, 0)
async def create_params(params: ProductionBatchParams):
    await engine.save(params)
    return params


@router.put("/batches", response_model=ProductionBatch, response_model_exclude_unset=True)
@version(1, 0)
async def create_batch(batch: ProductionBatchInput):
    params = await engine.find_one(ProductionBatchParams, ProductionBatchParams.id == batch.params_id)
    if params is None:
        raise HTTPException(404)
    batch = ProductionBatch(number=batch.number, params=params)
    batch.created_at = (datetime.utcnow() + timedelta(hours=5)).strftime("%d.%m.%Y %H:%M")
    last_batch = await get_last_batch()
    if last_batch:
        last_batch.closed_at = (datetime.utcnow() + timedelta(hours=5)).strftime("%d.%m.%Y %H:%M")
        await engine.save(last_batch)
    await engine.save(batch)
    return batch


@router.get("/batches", response_model=List[ProductionBatch])
@version(1, 0)
async def get_all_batches():
    all_batches = await engine.find(ProductionBatch)
    return all_batches