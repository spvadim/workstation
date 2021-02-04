from typing import List

from app.db.db_utils import get_by_id_or_404, get_last_batch
from app.db.engine import engine
from app.models.production_batch import (PatchParamsScheme, ProductionBatch,
                                         ProductionBatchInput,
                                         ProductionBatchParams)
from app.utils.naive_current_datetime import get_string_datetime
from fastapi import APIRouter
from fastapi_versioning import version
from odmantic import ObjectId

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


@router.patch("/batches_params/{id}", response_model=ProductionBatchParams)
@version(1, 0)
async def update_params_by_id(id: ObjectId, patch: PatchParamsScheme):
    params = await get_by_id_or_404(ProductionBatchParams, id)

    patch_dict = patch.dict(exclude_unset=True)
    for name, value in patch_dict.items():
        setattr(params, name, value)
    await engine.save(params)
    return params


@router.put("/batches", response_model=ProductionBatch)
@version(1, 0)
async def create_batch(batch: ProductionBatchInput):
    params = await get_by_id_or_404(ProductionBatchParams, batch.params_id)
    batch = ProductionBatch(number=batch.number, params=params)
    batch.created_at = await get_string_datetime()

    last_batch = await get_last_batch()
    if last_batch:
        last_batch.closed_at = await get_string_datetime()
        await engine.save(last_batch)

    await engine.save(batch)
    return batch


@router.get("/batches", response_model=List[ProductionBatch])
@version(1, 0)
async def get_all_batches():
    all_batches = await engine.find(ProductionBatch)
    return all_batches


@router.get('/batches/{id}', response_model=ProductionBatch)
@version(1, 0)
async def get_batch_by_id(id: ObjectId):
    batch = await get_by_id_or_404(ProductionBatch, id)
    return batch


@router.get("/current_batch", response_model=ProductionBatch)
@version(1, 0)
async def get_current_batch():
    batch = await get_last_batch()
    return batch
