from typing import List
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, Query
from fastapi_versioning import version
from odmantic import ObjectId
from app.db.engine import engine
from app.db.db_utils import check_qr_unique, get_last_batch, get_batch_by_number_or_return_last, get_by_id_or_404, \
    get_by_qr_or_404, get_cubes_queue, get_packs_queue, get_multipacks_queue
from app.models.pack import Pack
from app.models.multipack import Status, Multipack
from app.models.cube import Cube, CubeInput, CubeOutput, CubePatchSchema

router = APIRouter()


@router.put('/cubes', response_model=Cube)
@version(1, 0)
async def create_cube(cube_input: CubeInput):
    batch = await get_batch_by_number_or_return_last(batch_number=cube_input.batch_number)

    multipack_ids_with_pack_ids = {}
    multipacks_to_update = []
    for id in cube_input.multipack_ids:
        multipack = await get_by_id_or_404(Multipack, id)
        multipack.status = Status.IN_CUBE
        multipack_ids_with_pack_ids[str(id)] = multipack.pack_ids
        multipacks_to_update.append(multipack)
    await engine.save_all(multipacks_to_update)

    batch_number = batch.number
    packs_in_multipacks = batch.params.packs
    multipacks_in_cubes = batch.params.multipacks
    created_at = (datetime.utcnow() + timedelta(hours=5)).strftime("%d.%m.%Y %H:%M")
    cube = Cube(multipack_ids_with_pack_ids=multipack_ids_with_pack_ids, batch_number=batch_number,
                multipacks_in_cubes=multipacks_in_cubes, packs_in_multipacks=packs_in_multipacks, created_at=created_at)

    if cube_input.qr:
        await check_qr_unique(cube_input.qr)
        cube.qr = cube_input.qr
        cube.added_qr_at = (datetime.utcnow() + timedelta(hours=5)).strftime("%d.%m.%Y %H:%M")

    if cube_input.barcode:
        cube.barcode = cube_input.barcode

    await engine.save(cube)
    return cube


@router.put('/cube_finish_manual', response_model=Cube)
@version(1, 0)
async def finish_cube():
    batch = await get_last_batch()
    current_time = (datetime.utcnow() + timedelta(hours=5)).strftime("%d.%m.%Y %H:%M")

    multipacks_queue = await get_multipacks_queue()
    packs_queue = await get_packs_queue()

    batch_number = batch.number
    needed_multipacks = batch.params.multipacks
    needed_packs = batch.params.packs

    delta = needed_multipacks - len(multipacks_queue)

    if delta > 0:
        chunked_packs = [packs_queue[i:i + needed_packs] for i in range(0, len(packs_queue), needed_packs)]

        for chunk in chunked_packs:

            if delta <= 0:
                break

            pack_ids = []
            for i in range(len(chunk)):
                chunk[i].in_queue = False
                pack_ids.append(chunk[i].id)
            await engine.save_all(chunk)

            multipack = Multipack(batch_number=batch.number, pack_ids=pack_ids, created_at=current_time)
            await engine.save(multipack)
            multipacks_queue.append(multipack)

            delta -= 1

    multipacks_for_cube = multipacks_queue[:needed_multipacks]
    multipack_ids_with_pack_ids = {}

    for i in range(len(multipacks_for_cube)):
        multipacks_for_cube[i].status = Status.IN_CUBE
        multipack_ids_with_pack_ids[str(multipacks_for_cube[i].id)] = multipacks_for_cube[i].pack_ids
    await engine.save_all(multipacks_for_cube)

    cube = Cube(multipack_ids_with_pack_ids=multipack_ids_with_pack_ids, batch_number=batch_number,
                multipacks_in_cubes=needed_multipacks, packs_in_multipacks=needed_packs, created_at=current_time)

    await engine.save(cube)
    return cube


@router.get('/cubes_queue', response_model=List[CubeOutput])
@version(1, 0)
async def get_current_cubes():
    cubes_queue = await get_cubes_queue()
    return cubes_queue


@router.get('/cubes/{id}', response_model=Cube)
@version(1, 0)
async def get_cube_by_id(id: ObjectId):
    cube = await get_by_id_or_404(Cube, id)
    return cube


@router.get('/cubes/', response_model=Cube)
@version(1, 0)
async def get_cube_by_qr(qr: str = Query(None)):
    cube = await get_by_qr_or_404(Cube, qr)
    return cube


@router.get('/find_cube_by_included_qr/', response_model=Cube)
@version(1, 0)
async def get_cube_by_included_qr(qr: str = Query(None)):
    multipack_or_pack = await engine.find_one(Multipack, Multipack.qr == qr)
    if not multipack_or_pack:
        multipack_or_pack = await get_by_qr_or_404(Pack, qr)
    id = multipack_or_pack.id

    cubes_queue = await get_cubes_queue()

    for cube in cubes_queue:
        multipack_ids = cube.multipack_ids_with_pack_ids.keys()
        list_of_pack_ids = cube.multipack_ids_with_pack_ids.values()
        if str(id) in multipack_ids:
            return cube
        else:
            for pack_ids in list_of_pack_ids:
                if id in pack_ids:
                    return cube

    raise HTTPException(404)


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