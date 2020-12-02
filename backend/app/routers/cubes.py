from typing import List
from datetime import datetime, timedelta
from fastapi import APIRouter
from fastapi_versioning import version
from odmantic import ObjectId
from app.db.engine import engine
from app.db.db_utils import check_qr_unique, get_last_batch, get_batch_by_number_or_return_last, get_by_id_or_404
from app.models.multipack import Status, Multipack
from app.models.cube import Cube, CubeOutput, CubePatchSchema

router = APIRouter()


@router.put('/cubes', response_model=Cube)
@version(1, 0)
async def create_cube(cube: Cube):
    batch = await get_batch_by_number_or_return_last(batch_number=cube.batch_number)

    cube.batch_number = batch.number
    cube.packs_in_multipacks = batch.params.packs
    cube.multipack_in_cubes = batch.params.multipacks
    cube.created_at = (datetime.utcnow() + timedelta(hours=5)).strftime("%d.%m.%Y %H:%M")

    multipacks_to_update = []
    for id in cube.multipack_ids:
        multipack = await get_by_id_or_404(Multipack, id)
        multipack.status = Status.IN_CUBE
        multipacks_to_update.append(multipack)
    await engine.save_all(multipacks_to_update)

    if cube.qr:
        await check_qr_unique(cube.qr)
        cube.added_qr_at = (datetime.utcnow() + timedelta(hours=5)).strftime("%d.%m.%Y %H:%M")

    await engine.save(cube)
    return cube


@router.get('/cubes_queue', response_model=List[CubeOutput])
@version(1, 0)
async def get_current_cubes():
    batch = await get_last_batch()
    cubes_queue = await engine.find(Cube, Cube.batch_number == batch.number)
    return cubes_queue


@router.get('/cubes/{id}', response_model=Cube)
@version(1, 0)
async def get_cube_by_id(id: ObjectId):
    cube = await get_by_id_or_404(Cube, id)
    return cube


@router.delete('/cubes/{id}', response_model=Cube)
@version(1, 0)
async def delete_pack_by_id(id: ObjectId):
    cube = await get_by_id_or_404(Cube, id)
    await engine.delete(cube)
    return cube


@router.patch('/cubes/{id}', response_model=Cube)
@version(1, 0)
async def update_pack_by_id(id: ObjectId, patch: CubePatchSchema):
    cube = await get_by_id_or_404(Cube, id)

    if patch.qr:
        await check_qr_unique(patch.qr)
        cube.added_qr_at = (datetime.utcnow() + timedelta(hours=5)).strftime("%d.%m.%Y %H:%M")

    patch_dict = patch.dict(exclude_unset=True)
    for name, value in patch_dict.items():
        setattr(cube, name, value)
    await engine.save(cube)
    return cube