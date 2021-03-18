from typing import List

from app.db.db_utils import (
    check_qr_unique, delete_cube, get_batch_by_number_or_return_last,
    get_by_id_or_404, get_by_qr_or_404, get_cubes_queue,
    get_first_cube_without_qr, get_last_batch, get_last_cube_in_queue,
    get_last_cube_without_qr, get_multipacks_queue, get_packs_queue)
from app.db.engine import engine
from app.models.cube import (Cube, CubeEditSchema, CubeInput, CubeOutput,
                             CubePatchSchema, CubeWithNewContent)
from app.models.multipack import Multipack, Status
from app.models.pack import Pack
from app.models.production_batch import ProductionBatch, ProductionBatchParams
from app.utils.naive_current_datetime import get_naive_datetime
from fastapi import APIRouter, HTTPException, Query
from fastapi_versioning import version
from odmantic import ObjectId

from .custom_routers import DeepLoggerRoute, LightLoggerRoute

deep_logger_router = APIRouter(route_class=DeepLoggerRoute)
light_logger_router = APIRouter(route_class=LightLoggerRoute)


@deep_logger_router.put('/cubes', response_model=Cube)
@version(1, 0)
async def create_cube(cube_input: CubeInput):
    batch = await get_batch_by_number_or_return_last(
        batch_number=cube_input.batch_number)

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
    created_at = await get_naive_datetime()
    cube = Cube(multipack_ids_with_pack_ids=multipack_ids_with_pack_ids,
                batch_number=batch_number,
                multipacks_in_cubes=multipacks_in_cubes,
                packs_in_multipacks=packs_in_multipacks,
                created_at=created_at)

    if cube_input.qr:
        if not await check_qr_unique(Cube, cube_input.qr):
            raise HTTPException(
                400,
                detail=f'Куб с QR-кодом {cube_input.qr} уже есть в системе')
        cube.qr = cube_input.qr
        cube.added_qr_at = await get_naive_datetime()

    if cube_input.barcode:
        cube.barcode = cube_input.barcode

    await engine.save(cube)
    return cube


@deep_logger_router.put('/cube_with_new_content', response_model=Cube)
@version(1, 0)
async def create_cube_with_new_content(cube_input: CubeWithNewContent):
    batch_number = cube_input.batch_number
    batch = await engine.find_one(
        ProductionBatch, ProductionBatch.number.batch_number == batch_number)
    if not batch:
        raise HTTPException(404, detail='Такой партии не существует!')
    batch_number = batch.number

    params = await get_by_id_or_404(ProductionBatchParams,
                                    cube_input.params_id)
    packs_in_multipacks = params.packs
    multipacks_in_cubes = params.multipacks
    barcode = cube_input.barcode_for_packs
    current_time = await get_naive_datetime()
    # проверка на уникальность qr-ов, переполнение и пустоту
    if await check_qr_unique(Cube, cube_input.qr):

        if not cube_input.content:
            raise HTTPException(400, 'Пустой куб')

        if len(cube_input.content) > multipacks_in_cubes:
            raise HTTPException(
                400,
                f'Мультипаков должно быть не больше {multipacks_in_cubes}')

        for multipack in cube_input.content:

            if len(multipack) > packs_in_multipacks:
                raise HTTPException(
                    400,
                    f'Пачек в мультипаке должно быть не больше {packs_in_multipacks}'
                )

            for pack in multipack:
                if not await check_qr_unique(Pack, pack['qr']):
                    raise HTTPException(
                        400,
                        f'Пачка с QR-кодом {pack["qr"]} уже есть в системе')
    else:
        raise HTTPException(
            400, f'Куб с QR-кодом {cube_input.qr} уже есть в системе')

    multipack_ids_with_pack_ids = {}

    for multipack in cube_input.content:
        pack_ids = []
        for pack in multipack:
            new_pack = Pack(qr=pack['qr'],
                            barcode=barcode,
                            batch_number=batch_number,
                            in_queue=False,
                            created_at=current_time)
            await engine.save(new_pack)
            pack_ids.append(new_pack.id)

        new_multipack = Multipack(pack_ids=pack_ids,
                                  batch_number=batch_number,
                                  created_at=current_time,
                                  status=Status.IN_CUBE)
        await engine.save(new_multipack)
        multipack_ids_with_pack_ids[str(new_multipack.id)] = pack_ids

    cube = Cube(multipack_ids_with_pack_ids=multipack_ids_with_pack_ids,
                qr=cube_input.qr,
                batch_number=batch_number,
                created_at=current_time,
                packs_in_multipacks=packs_in_multipacks,
                multipacks_in_cubes=multipacks_in_cubes)

    await engine.save(cube)
    return cube


@deep_logger_router.put('/cube_finish_manual', response_model=Cube)
@version(1, 0)
async def finish_cube(qr: str):
    batch = await get_last_batch()
    current_time = await get_naive_datetime()

    multipacks_queue = await get_multipacks_queue()
    packs_queue = await get_packs_queue()

    if not (multipacks_queue or packs_queue):
        raise HTTPException(400, detail='Невозможно сформировать неполный куб')

    if not await check_qr_unique(Cube, qr):
        raise HTTPException(400,
                            detail='Куб с QR-кодом {qr} уже есть в системе')
    batch_number = batch.number
    needed_multipacks = batch.params.multipacks
    needed_packs = batch.params.packs

    delta = needed_multipacks - len(multipacks_queue)

    if delta > 0:
        chunked_packs = [
            packs_queue[i:i + needed_packs]
            for i in range(0, len(packs_queue), needed_packs)
        ]

        for chunk in chunked_packs:

            if delta <= 0:
                break

            pack_ids = []
            for i in range(len(chunk)):
                chunk[i].in_queue = False
                pack_ids.append(chunk[i].id)
            await engine.save_all(chunk)

            multipack = Multipack(batch_number=batch.number,
                                  pack_ids=pack_ids,
                                  created_at=current_time)
            await engine.save(multipack)
            multipacks_queue.append(multipack)

            delta -= 1

    multipacks_for_cube = multipacks_queue[:needed_multipacks]
    multipack_ids_with_pack_ids = {}

    for i in range(len(multipacks_for_cube)):
        multipacks_for_cube[i].status = Status.IN_CUBE
        multipack_ids_with_pack_ids[str(
            multipacks_for_cube[i].id)] = multipacks_for_cube[i].pack_ids
    await engine.save_all(multipacks_for_cube)

    cube = Cube(qr=qr,
                multipack_ids_with_pack_ids=multipack_ids_with_pack_ids,
                batch_number=batch_number,
                multipacks_in_cubes=needed_multipacks,
                packs_in_multipacks=needed_packs,
                created_at=current_time,
                added_qr_at=current_time)

    await engine.save(cube)
    return cube


@light_logger_router.get('/cubes_queue', response_model=List[CubeOutput])
@version(1, 0)
async def get_current_cubes():
    cubes_queue = await get_cubes_queue()
    return cubes_queue


@light_logger_router.get('/cubes/{id}', response_model=Cube)
@version(1, 0)
async def get_cube_by_id(id: ObjectId):
    cube = await get_by_id_or_404(Cube, id)
    return cube


@light_logger_router.get('/cubes/', response_model=Cube)
@version(1, 0)
async def get_cube_by_qr(qr: str = Query(None)):
    cube = await get_by_qr_or_404(Cube, qr)
    return cube


@deep_logger_router.patch('/add_qr_to_first_unidentified_cube/',
                          response_model=Cube)
@version(1, 0)
async def add_qr_to_first_unidentified_cube(qr: str):
    if not await check_qr_unique(Cube, qr):
        raise HTTPException(400, detail=f'В системе есть куб с QR={qr}')
    cube = await get_first_cube_without_qr()
    if not cube:
        raise HTTPException(400, detail='В очереди нет кубов без QR')
    cube.qr = qr
    await engine.save(cube)
    return cube


@deep_logger_router.patch('/add_qr_to_last_unidentified_cube/',
                          response_model=Cube)
@version(1, 0)
async def add_qr_to_last_unidentified_cube(qr: str):
    if not await check_qr_unique(Cube, qr):
        raise HTTPException(400, detail=f'В системе есть куб с QR={qr}')
    cube = await get_last_cube_without_qr()
    if not cube:
        raise HTTPException(400, detail='В очереди нет кубов без QR')
    cube.qr = qr
    await engine.save(cube)
    return cube


@deep_logger_router.patch('/add_qr_to_last_cube/', response_model=Cube)
@version(1, 0)
async def add_qr_to_last_cube(qr: str):
    if not await check_qr_unique(Cube, qr):
        raise HTTPException(400, detail=f'В системе есть куб с QR={qr}')
    cube = await get_last_cube_in_queue()
    if not cube:
        raise HTTPException(400, detail='В очереди нет кубов')
    if cube.qr:
        raise HTTPException(400, detail='У последнего куба в очереди есть QR')
    cube.qr = qr
    await engine.save(cube)
    return cube


@light_logger_router.get('/find_cube_by_included_qr/', response_model=Cube)
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
            if not cube.qr:
                return cube
        else:
            for pack_ids in list_of_pack_ids:
                if id in pack_ids:
                    return cube

    raise HTTPException(404)


@deep_logger_router.delete('/cubes/{id}', response_model=Cube)
@version(1, 0)
async def delete_pack_by_id(id: ObjectId):
    return await delete_cube(id)


@deep_logger_router.patch('/cubes/{id}', response_model=Cube)
@version(1, 0)
async def update_pack_by_id(id: ObjectId, patch: CubePatchSchema):
    cube = await get_by_id_or_404(Cube, id)

    if patch.qr:
        if not await check_qr_unique(Cube, patch.qr):
            raise HTTPException(
                400,
                detail=f'Куб с QR-кодом {patch.qr} уже существует в системе')
        cube.added_qr_at = await get_naive_datetime()

    patch_dict = patch.dict(exclude_unset=True)
    for name, value in patch_dict.items():
        setattr(cube, name, value)
    await engine.save(cube)
    return cube


@deep_logger_router.patch('/edit_cube/{id}', response_model=Cube)
@version(1, 0)
async def edit_cube_by_id(id: ObjectId, edit_schema: CubeEditSchema):
    cube = await get_by_id_or_404(Cube, id)
    batch_number = cube.batch_number

    packs_in_multipacks = cube.packs_in_multipacks
    multipacks_in_cubes = cube.multipacks_in_cubes
    max_packs_amount = packs_in_multipacks * multipacks_in_cubes
    pack_ids_to_delete = set(edit_schema.pack_ids_to_delete)
    pack_qrs = edit_schema.pack_qrs
    packs_barcode = edit_schema.packs_barcode
    multipack_ids_with_pack_ids = cube.multipack_ids_with_pack_ids
    current_time = await get_naive_datetime()

    removing_pack_ids = []
    current_packs_amount = 0
    for k, v in multipack_ids_with_pack_ids.items():
        deliting_packs = set(v).intersection(pack_ids_to_delete)
        updated_multipack = list(set(v) - deliting_packs)
        current_packs_amount += len(updated_multipack)
        multipack_ids_with_pack_ids[k] = updated_multipack
        pack_ids_to_delete -= deliting_packs
        removing_pack_ids += list(deliting_packs)
    packs_to_delete = await engine.find(Pack, Pack.id.in_(removing_pack_ids))

    if pack_ids_to_delete:
        raise HTTPException(
            404,
            f'В данном кубе не обнаружено пачек с такими id: {pack_ids_to_delete}'
        )

    if current_packs_amount + len(pack_qrs) > max_packs_amount:
        raise HTTPException(
            400, f'Переполнение куба: пачек более чем {max_packs_amount}')

    packs_to_add = []
    multipacks_to_update = []
    for k, v in multipack_ids_with_pack_ids.items():
        free_space = packs_in_multipacks - len(v)
        qrs = pack_qrs[:free_space]
        for qr in qrs:
            if not await check_qr_unique(Pack, qr):
                raise HTTPException(
                    400, f'В системе уже существует пачка с QR={qr}')
            pack = Pack(qr=qr,
                        barcode=packs_barcode,
                        batch_number=batch_number,
                        in_queue=False,
                        created_at=current_time)
            packs_to_add.append(pack)
            multipack_ids_with_pack_ids[k].append(pack.id)

        multipack_id = ObjectId(k)
        multipack_to_update = await get_by_id_or_404(Multipack, multipack_id)
        multipack_to_update.pack_ids = multipack_ids_with_pack_ids[k]
        multipacks_to_update.append(multipack_to_update)
        pack_qrs = pack_qrs[free_space:]

    cube.multipack_ids_with_pack_ids = multipack_ids_with_pack_ids
    if edit_schema.to_process:
        cube.to_process = edit_schema.to_process
    await engine.save_all(packs_to_add)
    await engine.save_all(multipacks_to_update)
    for pack in packs_to_delete:
        await engine.delete(pack)
    await engine.save(cube)

    return cube
