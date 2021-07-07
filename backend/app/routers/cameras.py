from typing import List

from fastapi import APIRouter, BackgroundTasks, HTTPException
from fastapi.responses import JSONResponse
from fastapi_versioning import version
from loguru import logger

from ..db.db_utils import (
    check_cube_qr,
    check_qr_unique,
    count_exited_pintset_multipacks,
    count_multipacks_entered_pitchfork,
    count_multipacks_on_packing_table,
    count_multipacks_queue,
    count_packs_on_assembly,
    count_packs_queue,
    count_wrapping_multipacks,
    form_cube_from_n_multipacks,
    form_url,
    generate_multipack,
    generate_packs,
    get_100_last_packing_records,
    get_100_last_pintset_records,
    get_all_wrapping_multipacks,
    get_current_workmode,
    get_first_exited_pintset_multipack,
    get_first_multipack_without_qr,
    get_first_wrapping_multipack,
    get_last_batch,
    get_last_cube_in_queue,
    get_last_packing_table_amount,
    get_last_pintset_amount,
    get_multipacks_entered_pitchfork,
    get_multipacks_on_packing_table,
    get_multipacks_queue,
    get_packs_on_assembly,
    get_packs_queue,
    get_packs_under_pintset,
    pintset_error,
)
from ..db.engine import engine
from ..db.system_settings import get_system_settings
from ..models.cube import Cube, CubeIdentificationAuto
from ..models.message import TGMessage
from ..models.multipack import (
    Multipack,
    MultipackIdentificationAuto,
    MultipackOutput,
    Status,
)
from ..models.pack import BadPackType, Pack, PackCameraInput, PackInReport, PackOutput
from ..models.pack import Status as PackStatus
from ..models.packing_table import (
    PackingTableRecord,
    PackingTableRecordInput,
    PackingTableRecords,
)
from ..models.pintset_record import PintsetRecord, PintsetRecordInput, PintsetRecords
from ..utils.background_tasks import (
    drop_pack,
    send_error_with_buzzer,
    send_warning_and_back_to_normal,
    turn_default_error,
    turn_packing_table_error,
    turn_pintset_withdrawal_error,
    turn_sync_error,
)
from ..utils.email import send_email
from ..utils.io import send_telegram_message
from ..utils.naive_current_datetime import get_naive_datetime
from ..utils.pintset import off_pintset
from .custom_routers import DeepLoggerRoute, LightLoggerRoute

deep_logger_router = APIRouter(route_class=DeepLoggerRoute)
light_logger_router = APIRouter(route_class=LightLoggerRoute)
wdiot_logger = logger.bind(name="wdiot")


@light_logger_router.put(
    "/new_pack_after_applikator",
    response_model=PackCameraInput,
    response_model_exclude={"id"},
)
@version(1, 0)
async def new_pack_after_applikator(
    pack: PackCameraInput, background_tasks: BackgroundTasks
):
    mode = await get_current_workmode()
    if mode.work_mode == "manual":
        raise HTTPException(400, detail="В данный момент используется ручной режим")

    current_datetime = await get_naive_datetime()

    error_msg = None
    if not pack.qr and not pack.barcode:
        error_msg = f"{current_datetime} на камере за аппликатором прошла пачка с которой не смогли считать ни одного кода!"

    elif not pack.qr:
        error_msg = f"{current_datetime} на камере за аппликатором прошла пачка с ШК={pack.barcode}, но QR не считался"

    elif not pack.barcode:
        error_msg = f"{current_datetime} на камере за аппликатором прошла пачка с QR={pack.qr}, но ШК не считался"

    elif not await check_qr_unique(Pack, pack.qr):
        error_msg = f"{current_datetime} на камере за аппликатором прошла пачка с QR={pack.qr} и он не уникален в системе"

    if error_msg:
        current_settings = await get_system_settings()

        delay = current_settings.general_settings.applikator_curtain_opening_delay.value
        background_tasks.add_task(send_warning_and_back_to_normal, delay, error_msg)
        return JSONResponse(status_code=400, content={"detail": error_msg})

    return pack


@deep_logger_router.get("/drop_pack_after_applikator/{bad_type}")
@version(1, 0)
async def drop_pack_after_applikator(
    bad_type: BadPackType, background_tasks: BackgroundTasks
):
    mode = await get_current_workmode()
    if mode.work_mode == "manual":
        raise HTTPException(400, detail="В данный момент используется ручной режим")

    current_settings = await get_system_settings()
    general_settings = current_settings.general_settings
    delay_dict = {
        BadPackType.BAD_HEIGHT: general_settings.applikator_curtain_opening_delay_bad_height.value,
        BadPackType.BAD_LABEL: general_settings.applikator_curtain_opening_delay_bad_label.value,
        BadPackType.BAD_PACKING: general_settings.applikator_curtain_opening_delay_bad_packing.value,
    }

    delay = delay_dict[bad_type]
    background_tasks.add_task(send_warning_and_back_to_normal, delay, bad_type)

    return {"reason": bad_type, "curtain_opening_delay": delay}


@deep_logger_router.put(
    "/new_pack_before_ejector",
    response_model=PackCameraInput,
    response_model_exclude={"id"},
)
@version(1, 0)
async def new_pack_before_ejector(
    pack: PackCameraInput, background_tasks: BackgroundTasks
):
    mode = await get_current_workmode()
    if mode.work_mode == "manual":
        raise HTTPException(400, detail="В данный момент используется ручной режим")

    current_datetime = await get_naive_datetime()

    error_msg = None
    # TODO: return back "and" check
    if not pack.qr:
        error_msg = f"{current_datetime} на камере перед сбрасывателем прошла пачка с которой не смогли считать ни одного кода!"
    # TODO: return back when fix nn
    # elif not pack.qr:
    #     error_msg = f'{current_datetime} на камере за аппликатором прошла пачка с ШК={pack.barcode}, но QR не считался'

    # elif not pack.barcode:
    #     error_msg = f'{current_datetime} на камере за аппликатором прошла пачка с QR={pack.qr}, но ШК не считался'

    elif not await check_qr_unique(Pack, pack.qr):
        error_msg = f"{current_datetime} на камере перед сбрасывателем прошла пачка с QR={pack.qr} и он не уникален в системе"

    if error_msg:
        background_tasks.add_task(drop_pack, error_msg)
        return JSONResponse(status_code=400, content={"detail": error_msg})

    return pack


@deep_logger_router.put("/new_pack_after_pintset", response_model=Pack)
@version(1, 0)
async def new_pack_after_pintset(
    pack: PackCameraInput, background_tasks: BackgroundTasks
):
    mode = await get_current_workmode()
    if mode.work_mode == "manual":
        raise HTTPException(400, detail="В данный момент используется ручной режим")
    current_datetime = await get_naive_datetime()

    error_msg = None
    if not pack.qr and not pack.barcode:
        error_msg = f"{current_datetime} на камере за пинцетом прошла пачка с которой не смогли считать ни одного кода!"

    elif not pack.qr:
        error_msg = f"{current_datetime} на камере за пинцетом прошла пачка с ШК={pack.barcode}, но QR не считался"

    elif not pack.barcode:
        error_msg = f"{current_datetime} на камере за пинцетом прошла пачка с QR={pack.qr}, но ШК не считался"

    # elif not await check_qr_unique(Pack, pack.qr):
    #     error_msg = f'{current_datetime} на камере за пинцетом прошла пачка с QR={pack.qr} и он не уникален в системе'

    current_settings = await get_system_settings()

    if error_msg:
        background_tasks.add_task(send_telegram_message, TGMessage(text=error_msg))
        if current_settings.general_settings.pintset_stop.value:
            background_tasks.add_task(off_pintset, current_settings.pintset_settings)
            background_tasks.add_task(pintset_error, error_msg)
            background_tasks.add_task(send_error_with_buzzer)
        return JSONResponse(status_code=400, content={"detail": error_msg})

    pack = Pack(qr=pack.qr, barcode=pack.barcode)

    batch = await get_last_batch()
    pack.batch_number = batch.number
    pack.created_at = current_datetime
    ftp_url = None
    if "empty" in pack.qr:
        ftp_url = await form_url(pack.qr)
    await engine.save(PackInReport(**pack.dict(), ftp_url=ftp_url))
    await engine.save(pack)

    multiplier = current_settings.desync_settings.max_packs_multiplier.value

    max_packs = multiplier * batch.params.multipacks_after_pintset
    if await count_packs_queue() > max_packs:
        background_tasks.add_task(
            turn_sync_error, f"В очереди больше {max_packs} пачек"
        )
    return pack


@deep_logger_router.patch("/pintset_receive", response_model=List[Pack])
@version(1, 0)
async def pintset_receive(background_tasks: BackgroundTasks):
    mode = await get_current_workmode()
    if mode.work_mode == "manual":
        raise HTTPException(400, detail="В данный момент используется ручной режим")
    sync_error_msg = None
    batch = await get_last_batch()
    multipacks_after_pintset = batch.params.multipacks_after_pintset
    packs_under_pintset = await get_packs_under_pintset()
    delta = len(packs_under_pintset) - multipacks_after_pintset
    to_process = False
    packs_on_assembly_amount = await count_packs_on_assembly()
    packs_on_assembly_irl = await get_last_pintset_amount()
    if packs_on_assembly_irl != packs_on_assembly_amount:
        sync_error_msg = f"Рассинхрон физической ({packs_on_assembly_irl}) и логической ({packs_on_assembly_amount}) очереди пачек на сборке"

    if delta < 0:
        to_process = True
        wdiot_logger.error("Расхождение, нужно проверить пачки")
        packs_under_pintset, email_body = await generate_packs(
            abs(delta),
            batch.number,
            await get_naive_datetime(),
            wdiot_logger,
            result=packs_under_pintset,
        )
        background_tasks.add_task(send_email, "Сгенерированы пачки", email_body)

    if delta > 0:
        to_process = True
        email_body = ""
        wdiot_logger.error("Расхождение, нужно проверить пачки")

        packs_to_delete = []

        for pack in packs_under_pintset:
            if "empty" in pack.qr and delta > 0:
                packs_to_delete.append(pack)
                delta -= 1

        packs_under_pintset = [
            pack for pack in packs_under_pintset if pack not in packs_to_delete
        ]

        if delta > 0:
            packs_under_pintset, packs_to_delete2 = (
                packs_under_pintset[:-delta],
                packs_under_pintset[-delta:],
            )

        for pack in packs_to_delete + packs_to_delete2:

            await engine.delete(pack)

            msg = (
                f"Удалил пачку с QR={pack.qr}, "
                f"id={pack.id}, "
                f"status={pack.status}"
            )
            wdiot_logger.info(msg)
            email_body += f"<br> {msg}"
        background_tasks.add_task(send_email, "Удалены пачки", email_body)

    for pack in packs_under_pintset:
        pack.to_process = to_process
        pack.status = PackStatus.ON_ASSEMBLY

    current_settings = await get_system_settings()
    multiplier = current_settings.desync_settings.max_packs_on_assembly_multiplier.value
    max_packs_on_assembly = multiplier * multipacks_after_pintset
    if packs_on_assembly_amount + multipacks_after_pintset > max_packs_on_assembly:
        sync_error_msg = f"В сборке более {max_packs_on_assembly} пачек"

    if sync_error_msg:
        background_tasks.add_task(turn_sync_error, sync_error_msg)
    return await engine.save_all(packs_under_pintset)


@deep_logger_router.patch("/pintset_reverse", response_model=List[PackOutput])
@version(1, 0)
async def pintset_reverse(background_tasks: BackgroundTasks):
    mode = await get_current_workmode()
    if mode.work_mode == "manual":
        raise HTTPException(400, detail="В данный момент используется ручной режим")

    batch = await get_last_batch()
    multipacks_after_pintset = batch.params.multipacks_after_pintset

    current_datetime = await get_naive_datetime()

    packs_queue = await get_packs_queue()
    if len(packs_queue) < multipacks_after_pintset:
        error_msg = f"{current_datetime} пинцет положил пачку с переворотом, но пачек в очереди меньше чем {multipacks_after_pintset}"
        background_tasks.add_task(turn_default_error, error_msg)
        return JSONResponse(status_code=400, content={"detail": error_msg})

    last_packs = packs_queue[-multipacks_after_pintset:]

    hiindex = multipacks_after_pintset - 1
    its = multipacks_after_pintset // 2

    for i in range(its):
        pack_i_dict = last_packs[i].dict(exclude={"id"})
        pack_hiindex_dict = last_packs[hiindex].dict(exclude={"id"})

        for name, value in pack_i_dict.items():
            setattr(last_packs[hiindex], name, value)

        for name, value in pack_hiindex_dict.items():
            setattr(last_packs[i], name, value)

        hiindex -= 1

    await engine.save_all(last_packs)
    return await get_packs_queue()


@deep_logger_router.put("/pintset_withdrawal", response_model=bool)
@version(1, 0)
async def pintset_withdrawal(background_tasks: BackgroundTasks):
    mode = await get_current_workmode()
    if mode.work_mode == "manual":
        raise HTTPException(400, detail="В данный момент используется ручной режим")
    background_tasks.add_task(
        turn_pintset_withdrawal_error, "Происходит выемка из-под пинцета"
    )

    return True


@deep_logger_router.put("/pintset_finish", response_model=List[MultipackOutput])
@version(1, 0)
async def pintset_finish(background_tasks: BackgroundTasks):
    mode = await get_current_workmode()
    if mode.work_mode == "manual":
        raise HTTPException(400, detail="В данный момент используется ручной режим")

    batch = await get_last_batch()
    multipacks_after_pintset = batch.params.multipacks_after_pintset
    needed_packs = batch.params.packs * multipacks_after_pintset
    number = batch.number

    packs_on_assembly = await get_packs_on_assembly()
    delta = len(packs_on_assembly) - needed_packs
    current_time = await get_naive_datetime()
    to_process = False
    email_body = ""

    if delta < 0:
        packs_under_pintset = await get_packs_under_pintset()

        while len(packs_under_pintset) >= multipacks_after_pintset and delta < 0:

            for pack in packs_under_pintset[:multipacks_after_pintset]:
                log_message = f"Перевел пачку {pack.json()} в сборку"
                email_body += f"<br> {log_message}"
                wdiot_logger.info(log_message)
                pack.status = PackStatus.ON_ASSEMBLY
                packs_on_assembly.append(pack)

            packs_under_pintset = packs_under_pintset[multipacks_after_pintset:]

            delta = len(packs_on_assembly) - needed_packs

        if delta < 0:
            error_msg = "Недостаточно пачек для формирования паллет"
            background_tasks.add_task(turn_sync_error, error_msg)
            return JSONResponse(status_code=400, content={"detail": error_msg})

    all_pack_ids = [[] for i in range(multipacks_after_pintset)]

    for i in range(needed_packs):
        if not to_process:
            to_process = packs_on_assembly[i].to_process
        packs_on_assembly[i].in_queue = False
        all_pack_ids[i % multipacks_after_pintset].append(packs_on_assembly[i].id)

    await engine.save_all(packs_on_assembly)

    if email_body:
        background_tasks.add_task(send_email, "Перевел пачки в сборку", email_body)

    new_multipacks = []
    for pack_ids in all_pack_ids:
        multipack = Multipack(pack_ids=pack_ids)
        multipack.batch_number = number
        multipack.created_at = current_time
        multipack.to_process = to_process
        new_multipacks.append(multipack)
    await engine.save_all(new_multipacks)

    current_settings = await get_system_settings()

    multiplier = (
        current_settings.desync_settings.max_multipacks_exited_pintset_multiplier.value
    )
    max_multipacks_exited_pintset = (multiplier * multipacks_after_pintset) + 1
    multipacks_exited_pintset_amount = await count_exited_pintset_multipacks()

    if multipacks_exited_pintset_amount > max_multipacks_exited_pintset:
        background_tasks.add_task(
            turn_sync_error,
            (
                f"Паллет, вышедших из пинцета, больше чем "
                f"{max_multipacks_exited_pintset}: "
                f"их {multipacks_exited_pintset_amount}"
            ),
        )

    return new_multipacks


@deep_logger_router.patch("/multipack_wrapping_auto", response_model=Multipack)
@version(1, 0)
async def multipack_wrapping_auto(background_tasks: BackgroundTasks):
    mode = await get_current_workmode()
    if mode.work_mode == "manual":
        raise HTTPException(400, detail="В данный момент используется ручной режим")

    wrapping_multipack = await get_first_exited_pintset_multipack()
    if not wrapping_multipack:
        error_msg = "В очереди нет паллеты, вышедшей из-под пинцета!"
        background_tasks.add_task(turn_sync_error, error_msg)
        return JSONResponse(status_code=400, content={"detail": error_msg})

    wrapping_multipack.status = Status.WRAPPING

    await engine.save(wrapping_multipack)

    current_settings = await get_system_settings()
    max_wrapping_multipacks = (
        current_settings.desync_settings.max_wrapping_multipacks.value
    )
    if await count_wrapping_multipacks() > max_wrapping_multipacks:
        background_tasks.add_task(turn_sync_error, "В обмотке более одной паллеты")
    return wrapping_multipack


@deep_logger_router.patch("/multipack_enter_pitchfork_auto", response_model=Multipack)
@version(1, 0)
async def multipack_enter_pitchfork_auto(background_tasks: BackgroundTasks):
    mode = await get_current_workmode()
    if mode.work_mode == "manual":
        raise HTTPException(400, detail="В данный момент используется ручной режим")
    batch = await get_last_batch()
    multipacks_after_pintset = batch.params.multipacks_after_pintset
    entered_pitchfork_multipack = await get_first_wrapping_multipack()

    if not entered_pitchfork_multipack:
        error_msg = "В очереди нет паллет в обмотке!"
        background_tasks.add_task(turn_sync_error, error_msg)
        return JSONResponse(status_code=400, content={"detail": error_msg})

    entered_pitchfork_multipack.status = Status.ENTER_PITCHFORK

    await engine.save(entered_pitchfork_multipack)

    current_settings = await get_system_settings()
    multiplier = (
        current_settings.desync_settings.max_multipacks_entered_pitchfork_multiplier.value
    )
    multipacks_entered_pitchfork = await count_multipacks_entered_pitchfork()
    if multipacks_entered_pitchfork > multipacks_after_pintset * multiplier:
        background_tasks.add_task(
            turn_sync_error,
            (
                f"На вилах более "
                f"{multipacks_after_pintset * 2} паллет:"
                f"их {multipacks_entered_pitchfork}"
            ),
        )

    return entered_pitchfork_multipack


@deep_logger_router.patch("/pitchfork_worked", response_model=List[Multipack])
@version(1, 0)
async def pitchfork_worked(background_tasks: BackgroundTasks):
    mode = await get_current_workmode()
    if mode.work_mode == "manual":
        raise HTTPException(400, detail="В данный момент используется ручной режим")

    batch = await get_last_batch()
    multipacks_after_pintset = batch.params.multipacks_after_pintset
    sync_error_msg = None

    multipacks_on_packing_table_system = await count_multipacks_on_packing_table()
    multipacks_on_packing_table_nn = await get_last_packing_table_amount()
    if multipacks_on_packing_table_system != multipacks_on_packing_table_nn:
        sync_error_msg = (
            f"Рассинхрон логической "
            f"{multipacks_on_packing_table_system} "
            f"и физической {multipacks_on_packing_table_nn} "
            f"очереди на упаковочном столе"
        )

    entered_pitchfork_multipacks = await get_multipacks_entered_pitchfork()

    if len(entered_pitchfork_multipacks) < multipacks_after_pintset:
        error_msg = (
            f"В очереди на виллах не хватает паллет! "
            f"В очереди {len(entered_pitchfork_multipacks)}, "
            f"ожидаем {multipacks_after_pintset}"
        )
        background_tasks.add_task(turn_sync_error, error_msg)
        return JSONResponse(status_code=400, content={"detail": error_msg})

    for i in range(multipacks_after_pintset):
        entered_pitchfork_multipacks[i].status = Status.ON_PACKING_TABLE

    await engine.save_all(entered_pitchfork_multipacks)

    current_settings = await get_system_settings()
    multiplier = (
        current_settings.desync_settings.max_multipacks_on_packing_table_multiplier.value
    )
    max_multipacks_on_packing_table = multipacks_after_pintset * multiplier
    multipacks_on_packing_table = await count_multipacks_on_packing_table()

    if multipacks_on_packing_table > max_multipacks_on_packing_table:
        sync_error_msg = (
            f"На упаковочном столе "
            f"паллет более {max_multipacks_on_packing_table}:"
            f" их {multipacks_on_packing_table}"
        )

    if sync_error_msg:
        background_tasks.add_task(turn_sync_error, sync_error_msg)
    return entered_pitchfork_multipacks


@deep_logger_router.delete("/remove_multipack_from_wrapping", response_model=Multipack)
@version(1, 0)
async def remove_multipack_from_wrapping(background_tasks: BackgroundTasks):
    mode = await get_current_workmode()
    if mode.work_mode == "manual":
        raise HTTPException(400, detail="В данный момент используется ручной режим")

    current_datetime = await get_naive_datetime()
    multipack = await get_first_wrapping_multipack()
    if not multipack:
        error_msg = f"{current_datetime} при попытке изъятия мультипака из обмотки он не был обнаружен в системе"
        background_tasks.add_task(turn_default_error, error_msg)
        return JSONResponse(status_code=400, content={"detail": error_msg})

    for id in multipack.pack_ids:
        pack = await engine.find_one(Pack, Pack.id == id)
        await engine.delete(pack)

    await engine.delete(multipack)
    return multipack


@deep_logger_router.patch("/multipack_identification_auto", response_model=Multipack)
@version(1, 0)
async def multipack_identification_auto(
    identification: MultipackIdentificationAuto, background_tasks: BackgroundTasks
):
    mode = await get_current_workmode()
    if mode.work_mode == "manual":
        raise HTTPException(400, detail="В данный момент используется ручной режим")
    current_datetime = await get_naive_datetime()
    qr = identification.qr
    barcode = identification.barcode
    multipack_to_update = await get_first_multipack_without_qr()

    error_msg = None
    if not multipack_to_update:
        error_msg = f"{current_datetime} при попытке присвоения внешнего кода мультипаку в системе не обнаружено мультипаков без него"

    if not qr and not barcode:
        error_msg = f"{current_datetime} при присвоении внешнего кода мультипаку с него не смогли считать ни одного кода!"

    elif not qr:
        error_msg = f"{current_datetime} при присвоении внешнего кода мультипаку с ШК={barcode} QR не считался"

    elif not barcode:
        error_msg = f"{current_datetime} при присвоении внешнего кода мультипаку с QR={qr} ШК не считался"

    elif not await check_qr_unique(Multipack, qr):
        error_msg = f"{current_datetime} при попытке присвоения внешнего кода мультипаку использован QR={qr} и он не уникален в системе"

    if error_msg:
        background_tasks.add_task(turn_default_error, error_msg)
        return JSONResponse(status_code=400, content={"detail": error_msg})

    multipack_to_update.qr = qr
    multipack_to_update.added_qr_at = current_datetime
    multipack_to_update.barcode = barcode
    multipack_to_update.status = Status.ADDED_QR
    await engine.save(multipack_to_update)

    return multipack_to_update


@deep_logger_router.patch("/cube_identification_auto", response_model=Cube)
@version(1, 0)
async def cube_identification_auto(
    identification: CubeIdentificationAuto, background_tasks: BackgroundTasks
):
    mode = await get_current_workmode()
    if mode.work_mode == "manual":
        raise HTTPException(400, detail="В данный момент используется ручной режим")

    qr = identification.qr
    barcode = identification.barcode
    cube_to_update = await get_last_cube_in_queue()
    current_datetime = await get_naive_datetime()

    error_msg = None
    if not cube_to_update:
        error_msg = f"{current_datetime} в текущей очереди нет кубов"

    if cube_to_update.qr:
        error_msg = f"{current_datetime} последний куб в очереди уже идентифицирован"

    if not qr and not barcode:
        error_msg = f"{current_datetime} при присвоении внешнего кода кубу с него не смогли считать ни одного кода!"

    elif not qr:
        error_msg = f"{current_datetime} при присвоении внешнего кода кубу с ШК={barcode} QR не считался"

    elif not barcode:
        error_msg = f"{current_datetime} при присвоении внешнего кода кубу с QR={qr} ШК не считался"

    elif not await check_cube_qr(qr):
        error_msg = f"{current_datetime} при попытке присвоения внешнего кода кубу использован QR={qr} и его нет в системе"

    if error_msg:
        background_tasks.add_task(turn_default_error, error_msg)
        return JSONResponse(status_code=400, content={"detail": error_msg})

    cube_to_update.qr = qr
    cube_to_update.added_qr_at = current_datetime
    cube_to_update.barcode = barcode
    await engine.save(cube_to_update)

    return cube_to_update


@deep_logger_router.put("/cube_finish_auto", response_model=Cube)
@version(1, 0)
async def cube_finish_auto(background_tasks: BackgroundTasks):
    mode = await get_current_workmode()
    if mode.work_mode == "manual":
        raise HTTPException(400, detail="В данный момент используется ручной режим")

    batch = await get_last_batch()
    needed_packs = batch.params.packs
    needed_multipacks = batch.params.multipacks
    number = batch.number
    to_process = False

    # TODO: вернуть обратно, когда все протестируем
    future_multipacks_on_packing_table = await get_multipacks_on_packing_table()
    if len(future_multipacks_on_packing_table) < needed_multipacks:
        log_message = f"При сборке куба на упаковочном столе меньше {needed_multipacks} паллет, пытаюсь добрать паллеты с другими статусами"
        wdiot_logger.info(log_message)
        background_tasks.add_task(
            send_email, "Недостаточно паллет на упаковочном столе", log_message
        )
    multipacks_on_packing_table = await get_multipacks_queue()

    current_time = await get_naive_datetime()
    if len(multipacks_on_packing_table) < needed_multipacks:
        error_msg = f"{current_time} попытка формирования куба, когда на упаковочном столе меньше {needed_multipacks} мультипаков"
        background_tasks.add_task(turn_sync_error, error_msg)
        return JSONResponse(status_code=400, content={"detail": error_msg})

    multipack_ids_with_pack_ids = {}
    for i in range(needed_multipacks):
        if not to_process:
            to_process = multipacks_on_packing_table[i].to_process
        multipacks_on_packing_table[i].status = Status.IN_CUBE
        multipack_ids_with_pack_ids[
            str(multipacks_on_packing_table[i].id)
        ] = multipacks_on_packing_table[i].pack_ids
    await engine.save_all(multipacks_on_packing_table)

    cube = Cube(
        multipack_ids_with_pack_ids=multipack_ids_with_pack_ids,
        batch_number=number,
        created_at=current_time,
        packs_in_multipacks=needed_packs,
        multipacks_in_cubes=needed_multipacks,
        to_process=to_process,
    )
    await engine.save(cube)

    return cube


@deep_logger_router.put("/packing_table_records", response_model=PackingTableRecord)
@version(1, 0)
async def add_packing_table_record(
    record: PackingTableRecordInput, background_tasks: BackgroundTasks
):
    current_datetime = await get_naive_datetime()
    record = PackingTableRecord(
        **record.dict(exclude={"id"}), recorded_at=current_datetime
    )

    prev_record_amount = await get_last_packing_table_amount()
    current_amount = record.multipacks_amount

    if current_amount == prev_record_amount:
        return record

    await engine.save(record)
    error_msg = ""
    cube = await get_last_cube_in_queue()
    current_batch = await get_last_batch()
    needed_multipacks = current_batch.params.multipacks

    if current_amount == 0:

        # TODO: uncomment this line in future when we fix nn
        if not cube:
            error_msg = f"{current_datetime} нет куба в очереди для вывоза! "
            error_msg += "Чтобы собрать куб, введите его QR."
            # new_cube = await form_cube_from_n_multipacks(prev_record_amount)
            # wdiot_logger.info(f'Сформировал куб {new_cube.json()}')
            # wrong_cube_id = new_cube.id

        if prev_record_amount == needed_multipacks and not cube.qr:
            error_msg = f"{current_datetime} вывозимый куб не идентифицирован"
            wrong_cube_id = cube.id

        multipacks_in_cube = len(cube.multipack_ids_with_pack_ids.keys())

        if multipacks_in_cube == prev_record_amount and not cube.qr:
            error_msg = f"{current_datetime} вывозимый куб не идентифицирован"
            wrong_cube_id = cube.id

        if multipacks_in_cube != prev_record_amount:
            error_msg = f"{current_datetime} количество паллет на упаковочном столе и в последнем кубе не совпадают. "
            error_msg += "Чтобы собрать куб, введите его QR."
            # new_cube = await form_cube_from_n_multipacks(prev_record_amount)
            # wdiot_logger.info(f'Сформировал куб {new_cube.json()}')
            # wrong_cube_id = new_cube.id

    if error_msg:
        background_tasks.add_task(turn_packing_table_error, error_msg, wrong_cube_id)
        return JSONResponse(status_code=400, content={"detail": error_msg})

    return record


@light_logger_router.get("/packing_table_records", response_model=PackingTableRecords)
@version(1, 0)
async def get_packing_table_records():
    multipacks_amount = await get_last_packing_table_amount()
    records = await get_100_last_packing_records()
    return PackingTableRecords(multipacks_amount=multipacks_amount, records=records)


@deep_logger_router.put("/pintset_records", response_model=PintsetRecord)
@version(1, 0)
async def add_pintset_record(record: PintsetRecordInput):
    current_datetime = await get_naive_datetime()
    record = PintsetRecord(**record.dict(), recorded_at=current_datetime)

    prev_record_amount = await get_last_pintset_amount()
    current_amount = record.packs_amount

    if current_amount != prev_record_amount:
        await engine.save(record)

    return record


@light_logger_router.get("/pintset_records", response_model=PintsetRecords)
@version(1, 0)
async def get_pintset_records():
    packs_amount = await get_last_pintset_amount()
    records = await get_100_last_pintset_records()
    return PintsetRecords(packs_amount=packs_amount, records=records)
