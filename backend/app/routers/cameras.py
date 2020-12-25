from typing import List
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException
from fastapi_versioning import version
from app.db.engine import engine
from app.db.db_utils import check_qr_unique, get_last_batch, \
    get_current_workmode, set_column_yellow, set_column_red, get_packs_queue, \
    get_multipacks_queue, get_first_exited_pintset_multipack, \
    get_first_wrapping_multipack, get_all_wrapping_multipacks, \
    get_first_cube_without_qr, get_first_multipack_without_qr
from app.models.pack import Pack, PackCameraInput, PackOutput
from app.models.multipack import Multipack, MultipackOutput, \
    Status, MultipackIdentificationAuto
from app.models.cube import Cube, CubeIdentificationAuto

router = APIRouter()


@router.put('/new_pack_after_applikator',
            response_model=PackCameraInput,
            response_model_exclude={"id"})
@version(1, 0)
async def new_pack_after_applikator(pack: PackCameraInput):
    mode = await get_current_workmode()
    if mode.work_mode == 'manual':
        raise HTTPException(400,
                            detail='В данный момент используется ручной режим')

    current_datetime = (datetime.utcnow() +
                        timedelta(hours=5)).strftime("%d.%m.%Y %H:%M")

    error_msg = None
    if not pack.qr and not pack.barcode:
        error_msg = f'{current_datetime} на камере за аппликатором прошла пачка с которой не смогли считать ни одного кода!'

    elif not pack.qr:
        error_msg = f'{current_datetime} на камере за аппликатором прошла пачка с ШК={pack.barcode}, но QR не считался'

    elif not pack.barcode:
        error_msg = f'{current_datetime} на камере за аппликатором прошла пачка с QR={pack.qr}, но ШК не считался'

    # TODO: пока что нужно убрать проверку на уникальность
    # TODO: дописать код для ERD контроллера
    # TODO: tg
    # elif not await check_qr_unique(Pack, pack.qr):
    #     error_msg = f'{current_datetime} на камере за аппликатором прошла пачка с QR={pack.qr} и он не уникален в системе'

    if error_msg:
        await set_column_yellow(error_msg)
        raise HTTPException(400, detail=error_msg)

    return pack


@router.put('/new_pack_after_pintset', response_model=Pack)
@version(1, 0)
async def new_pack_after_pintset(pack: PackCameraInput):
    mode = await get_current_workmode()
    if mode.work_mode == 'manual':
        raise HTTPException(400,
                            detail='В данный момент используется ручной режим')
    current_datetime = (datetime.utcnow() +
                        timedelta(hours=5)).strftime("%d.%m.%Y %H:%M")

    error_msg = None
    if not pack.qr and not pack.barcode:
        error_msg = f'{current_datetime} на камере за пинцетом прошла пачка с которой не смогли считать ни одного кода!'

    elif not pack.qr:
        error_msg = f'{current_datetime} на камере за пинцетом прошла пачка с ШК={pack.barcode}, но QR не считался'

    elif not pack.barcode:
        error_msg = f'{current_datetime} на камере за пинцетом прошла пачка с QR={pack.qr}, но ШК не считался'

    # TODO: пока что нужно убрать проверку на уникальность
    # TODO: дописать код для ERD контроллера
    # TODO: tg
    # elif not await check_qr_unique(Pack, pack.qr):
    #     error_msg = f'{current_datetime} на камере за пинцетом прошла пачка с QR={pack.qr} и он не уникален в системе'

    if error_msg:
        await set_column_red(error_msg)
        raise HTTPException(400, detail=error_msg)

    pack = Pack(qr=pack.qr, barcode=pack.barcode)

    batch = await get_last_batch()
    pack.batch_number = batch.number
    pack.created_at = current_datetime
    await engine.save(pack)
    return pack


@router.patch('/pintset_reverse', response_model=List[PackOutput])
@version(1, 0)
async def pintset_reverse():
    mode = await get_current_workmode()
    if mode.work_mode == 'manual':
        raise HTTPException(400,
                            detail='В данный момент используется ручной режим')

    batch = await get_last_batch()
    multipacks_after_pintset = batch.params.multipacks_after_pintset

    current_datetime = (datetime.utcnow() +
                        timedelta(hours=5)).strftime("%d.%m.%Y %H:%M")

    packs_queue = await get_packs_queue()
    if len(packs_queue) < multipacks_after_pintset:
        error_msg = f'{current_datetime} пинцет положил пачку с переворотом, но пачек в очереди меньше чем {multipacks_after_pintset}'
        await set_column_red(error_msg)
        raise HTTPException(400, detail=error_msg)

    last_packs = packs_queue[-multipacks_after_pintset:]

    hiindex = multipacks_after_pintset - 1
    its = multipacks_after_pintset // 2

    for i in range(its):
        pack_i_dict = last_packs[i].dict(exclude={'id'})
        pack_hiindex_dict = last_packs[hiindex].dict(exclude={'id'})

        for name, value in pack_i_dict.items():
            setattr(last_packs[hiindex], name, value)

        for name, value in pack_hiindex_dict.items():
            setattr(last_packs[i], name, value)

        hiindex -= 1

    await engine.save_all(last_packs)
    return await get_packs_queue()


@router.delete('/remove_packs_from_pintset', response_model=List[PackOutput])
@version(1, 0)
async def remove_packs_from_pintset():
    mode = await get_current_workmode()
    if mode.work_mode == 'manual':
        raise HTTPException(400,
                            detail='В данный момент используется ручной режим')

    packs = await get_packs_queue()
    for pack in packs:
        await engine.delete(pack)

    return packs


@router.put('/pintset_finish', response_model=List[MultipackOutput])
@version(1, 0)
async def pintset_finish():
    mode = await get_current_workmode()
    if mode.work_mode == 'manual':
        raise HTTPException(400,
                            detail='В данный момент используется ручной режим')

    batch = await get_last_batch()
    multipacks_after_pintset = batch.params.multipacks_after_pintset
    needed_packs = batch.params.packs * multipacks_after_pintset
    number = batch.number

    packs_queue = await get_packs_queue()
    current_time = (datetime.utcnow() +
                    timedelta(hours=5)).strftime("%d.%m.%Y %H:%M")

    if len(packs_queue) < needed_packs:
        error_msg = f'{current_time} пинцет начал формирование {multipacks_after_pintset} мультипаков, но пачек в очереди меньше чем {needed_packs}'
        await set_column_red(error_msg)
        raise HTTPException(400, detail=error_msg)

    all_pack_ids = [[] for i in range(multipacks_after_pintset)]

    for i in range(needed_packs):
        packs_queue[i].in_queue = False
        all_pack_ids[i % multipacks_after_pintset].append(packs_queue[i].id)

    await engine.save_all(packs_queue)

    new_multipacks = []
    for pack_ids in all_pack_ids:
        multipack = Multipack(pack_ids=pack_ids)
        multipack.batch_number = number
        multipack.created_at = current_time
        new_multipacks.append(multipack)
    await engine.save_all(new_multipacks)

    return new_multipacks


@router.patch('/multipack_wrapping_auto', response_model=Multipack)
@version(1, 0)
async def multipack_wrapping_auto():
    mode = await get_current_workmode()
    if mode.work_mode == 'manual':
        raise HTTPException(400,
                            detail='В данный момент используется ручной режим')

    wrapped_multipacks = await get_all_wrapping_multipacks()
    for i in range(len(wrapped_multipacks)):
        wrapped_multipacks[i].status = Status.WRAPPED

    wrapping_multipack = await get_first_exited_pintset_multipack()
    wrapping_multipack.status = Status.WRAPPING

    await engine.save_all(wrapped_multipacks)
    await engine.save(wrapping_multipack)
    return wrapping_multipack


@router.delete('/remove_multipack_from_wrapping', response_model=Multipack)
@version(1, 0)
async def remove_multipack_from_wrapping():
    mode = await get_current_workmode()
    if mode.work_mode == 'manual':
        raise HTTPException(400,
                            detail='В данный момент используется ручной режим')

    current_datetime = (datetime.utcnow() +
                        timedelta(hours=5)).strftime("%d.%m.%Y %H:%M")
    multipack = await get_first_wrapping_multipack()
    if not multipack:
        error_msg = f'{current_datetime} при попытке изъятия мультипака из обмотки он не был обнаружен в системе'
        await set_column_red(error_msg)
        raise HTTPException(400, detail=error_msg)
    for id in multipack.pack_ids:
        pack = await engine.find_one(Pack, Pack.id == id)
        await engine.delete(pack)

    await engine.delete(multipack)
    return multipack


@router.patch('/multipack_identification_auto', response_model=Multipack)
@version(1, 0)
async def multipack_identification_auto(
        identification: MultipackIdentificationAuto):
    mode = await get_current_workmode()
    if mode.work_mode == 'manual':
        raise HTTPException(400,
                            detail='В данный момент используется ручной режим')
    current_datetime = (datetime.utcnow() +
                        timedelta(hours=5)).strftime("%d.%m.%Y %H:%M")
    qr = identification.qr
    barcode = identification.barcode
    multipack_to_update = await get_first_multipack_without_qr()

    error_msg = None
    if not multipack_to_update:
        error_msg = f'{current_datetime} при попытке присвоения внешнего кода мультипаку в системе не обнаружено мультипаков без него'

    if not qr and not barcode:
        error_msg = f'{current_datetime} при присвоении внешнего кода мультипаку с него не смогли считать ни одного кода!'

    elif not qr:
        error_msg = f'{current_datetime} при присвоении внешнего кода мультипаку с ШК={barcode} QR не считался'

    elif not barcode:
        error_msg = f'{current_datetime} при присвоении внешнего кода мультипаку с QR={qr} ШК не считался'

    # TODO: дописать код для ERD контроллера
    # TODO: tg
    elif not await check_qr_unique(Multipack, qr):
        error_msg = f'{current_datetime} при попытке присвоения внешнего кода мультипаку использован QR={qr} и он не уникален в системе'

    if error_msg:
        await set_column_red(error_msg)
        raise HTTPException(400, detail=error_msg)

    multipack_to_update.qr = qr
    multipack_to_update.added_qr_at = current_datetime
    multipack_to_update.barcode = barcode
    multipack_to_update.status = Status.ADDED_QR
    await engine.save(multipack_to_update)

    return multipack_to_update


@router.patch('/cube_identification_auto', response_model=Cube)
@version(1, 0)
async def cube_identification_auto(identification: CubeIdentificationAuto):
    mode = await get_current_workmode()
    if mode.work_mode == 'manual':
        raise HTTPException(400,
                            detail='В данный момент используется ручной режим')

    qr = identification.qr
    barcode = identification.barcode
    cube_to_update = await get_first_cube_without_qr()
    current_datetime = (datetime.utcnow() +
                        timedelta(hours=5)).strftime("%d.%m.%Y %H:%M")

    error_msg = None
    if not cube_to_update:
        error_msg = f'{current_datetime} при попытке присвоения внешнего кода кубу в системе не обнаружено мультипаков без него'

    if not qr and not barcode:
        error_msg = f'{current_datetime} при присвоении внешнего кода кубу с него не смогли считать ни одного кода!'

    elif not qr:
        error_msg = f'{current_datetime} при присвоении внешнего кода кубу с ШК={barcode} QR не считался'

    elif not barcode:
        error_msg = f'{current_datetime} при присвоении внешнего кода кубу с QR={qr} ШК не считался'

    # TODO: дописать код для ERD контроллера
    # TODO: tg
    elif not await check_qr_unique(Cube, qr):
        error_msg = f'{current_datetime} при попытке присвоения внешнего кода кубу использован QR={qr} и он не уникален в системе'

    if error_msg:
        await set_column_red(error_msg)
        raise HTTPException(400, detail=error_msg)

    cube_to_update.qr = qr
    cube_to_update.added_qr_at = current_datetime
    cube_to_update.barcode = barcode
    await engine.save(cube_to_update)

    return cube_to_update


@router.put('/cube_finish_auto', response_model=Cube)
@version(1, 0)
async def cube_finish_auto():
    mode = await get_current_workmode()
    if mode.work_mode == 'manual':
        raise HTTPException(400,
                            detail='В данный момент используется ручной режим')

    batch = await get_last_batch()
    needed_packs = batch.params.packs
    needed_multipacks = batch.params.multipacks
    number = batch.number

    multipacks_queue = await get_multipacks_queue()

    current_time = (datetime.utcnow() +
                    timedelta(hours=5)).strftime("%d.%m.%Y %H:%M")
    if len(multipacks_queue) < needed_multipacks:
        error_msg = f'{current_time} попытка формирования куба, когда в очереди меньше {needed_multipacks} мультипаков'
        await set_column_red(error_msg)
        raise HTTPException(400, detail=error_msg)

    multipack_ids_with_pack_ids = {}
    for i in range(needed_multipacks):
        multipacks_queue[i].status = Status.IN_CUBE
        multipack_ids_with_pack_ids[str(
            multipacks_queue[i].id)] = multipacks_queue[i].pack_ids
    await engine.save_all(multipacks_queue)

    cube = Cube(multipack_ids_with_pack_ids=multipack_ids_with_pack_ids,
                batch_number=number,
                created_at=current_time,
                packs_in_multipacks=needed_packs,
                multipacks_in_cubes=needed_multipacks)
    await engine.save(cube)

    return cube
