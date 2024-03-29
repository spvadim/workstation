import asyncio
import inspect
from datetime import datetime
from time import sleep

from loguru import logger

from ..db.db_utils import (
    delete_packs_under_pintset,
    flush_packing_table,
    flush_pintset,
    flush_state,
    get_current_state,
    packing_table_error,
    pintset_error,
    pintset_withdrawal_error,
    set_column_red,
    set_column_yellow,
    sync_error,
)
from ..db.engine import pymongo_db as db
from ..db.events import add_events
from ..db.system_settings import get_system_settings
from ..models.event import Event
from ..models.system_settings.pintset_settings import PintsetSettings
from .email import send_email
from .erd import (
    snmp_finish_damper,
    snmp_finish_ejector,
    snmp_raise_damper,
    snmp_raise_ejector,
    snmp_set_buzzer_off,
    snmp_set_buzzer_on,
    snmp_set_green_off,
    snmp_set_green_on,
    snmp_set_red_off,
    snmp_set_red_on,
    snmp_set_yellow_off,
    snmp_set_yellow_on,
    snmp_third_erd_first_oid_off,
    snmp_third_erd_first_oid_on,
)
from .pintset import off_pintset, on_pintset

wdiot_logger = logger.bind(name="wdiot")


async def send_error():
    tasks = []

    tasks.append(snmp_set_green_off())
    tasks.append(snmp_set_red_on())

    await asyncio.gather(*tasks)


async def send_error_with_buzzer():
    tasks = []

    tasks.append(send_error())
    tasks.append(snmp_set_buzzer_on())

    await asyncio.gather(*tasks)


async def send_warning():
    tasks = []

    tasks.append(snmp_set_green_off())
    tasks.append(snmp_set_yellow_on())

    await asyncio.gather(*tasks)


async def flush_to_normal():
    tasks = []

    tasks.append(snmp_set_buzzer_off())
    tasks.append(snmp_set_yellow_off())
    tasks.append(snmp_set_red_off())
    tasks.append(snmp_set_green_on())

    await asyncio.gather(*tasks)


async def send_warning_and_back_to_normal(delay: int, message: str):
    tasks_before_sleep = []
    tasks_before_sleep.append(send_warning())
    tasks_before_sleep.append(set_column_yellow(message))

    await asyncio.gather(*tasks_before_sleep)
    await asyncio.sleep(delay)

    state = await get_current_state()
    if state.error_msg == message:
        tasks_after_sleep = []
        tasks_after_sleep.append(flush_state())
        tasks_after_sleep.append(flush_to_normal())
        await asyncio.gather(*tasks_after_sleep)


async def drop_pack(message: str):
    current_settings = await get_system_settings()
    delay_before_damper = current_settings.second_erd_settings.delay_before_damper.value
    delay_before_ejector = (
        current_settings.second_erd_settings.delay_before_ejector.value
    )
    delay_after_ejector = current_settings.second_erd_settings.delay_after_ejector.value

    await asyncio.sleep(delay_before_damper)
    await snmp_raise_damper()

    await asyncio.sleep(delay_before_ejector)
    await snmp_raise_ejector()

    await asyncio.sleep(delay_after_ejector)
    tasks_after_ejector = [
        snmp_finish_ejector(),
        snmp_finish_damper(),
        add_events("error", message),
    ]
    await asyncio.gather(*tasks_after_ejector)


def drop_pack_after_pintset(
    error_msg: str,
    pintset_settings: PintsetSettings,
    current_datetime: datetime,
    use_additional_event: bool,
):
    wdiot_logger.info("Заморозил пинцет")
    off_pintset(pintset_settings)

    wdiot_logger.info("Взвел ошибку на пинцете")
    db.system_status.find_one_and_update(
        {},
        {
            "$set": {
                "system_state.pintset_state": "error",
                "system_state.pintset_error_msg": error_msg,
            }
        },
    )
    event = Event(time=current_datetime, message=error_msg, event_type="error")
    db.event.insert_one(event.dict())
    if not use_additional_event:
        wdiot_logger.info("Удалил пачки под пинцетом")
        db.pack.delete_many({"status": "под пинцетом"})
    delay = pintset_settings.pintset_curtain_opening_duration.value
    sleep(delay)

    if db.system_status.find_one({})["system_state"]["pintset_error_msg"] == error_msg:
        wdiot_logger.info("Убираю ошибку на пинцете")
        db.system_status.find_one_and_update(
            {},
            {
                "$set": {
                    "system_state.pintset_state": "normal",
                    "system_state.pintset_error_msg": None,
                }
            },
        )
        if delay > 0:
            wdiot_logger.info("Разморозил пинцет")
            on_pintset(pintset_settings)


async def drop_pack_after_pintset_erd(
    error_msg: str, pintset_settings: PintsetSettings, use_additional_event: bool
):
    wdiot_logger.info("Заморозил пинцет")
    await snmp_third_erd_first_oid_on()

    wdiot_logger.info("Взвел ошибку на пинцете")
    await pintset_error(error_msg)

    if not use_additional_event:
        wdiot_logger.info("Удалил пачки под пинцетом")
        await delete_packs_under_pintset()

    delay = pintset_settings.pintset_curtain_opening_duration.value
    await asyncio.sleep(delay)

    state = await get_current_state()
    if state.pintset_error_msg == error_msg:
        wdiot_logger.info("Убираю ошибку на пинцете")
        await flush_pintset()
        wdiot_logger.info("Разморозил пинцет")
        await snmp_third_erd_first_oid_off()


async def turn_default_error(message: str):
    tasks = []
    tasks.append(set_column_red(message))
    tasks.append(send_error())
    results = await asyncio.gather(*tasks)
    return results[0]


async def turn_default_warning(message: str):
    tasks = []
    tasks.append(set_column_yellow(message))
    tasks.append(send_warning())
    results = await asyncio.gather(*tasks)
    return results[0]


async def flush_default_state():
    tasks = []
    tasks.append(flush_state())
    tasks.append(flush_to_normal())
    results = await asyncio.gather(*tasks)
    return results[0]


async def turn_packing_table_error(message: str, cube_id):
    tasks = []
    tasks.append(packing_table_error(message, cube_id))
    tasks.append(send_error_with_buzzer())
    email_message = f"<br> {message}."
    tasks.append(send_email("Ошибка на упаковочном столе", email_message))
    wdiot_logger.error(message)
    results = await asyncio.gather(*tasks)
    return results[0]


async def flush_packing_table_error():
    tasks = []
    tasks.append(flush_packing_table())
    tasks.append(flush_to_normal())
    results = await asyncio.gather(*tasks)
    return results[0]


async def turn_sync_error(method_name: str, message: str):
    current_settings = await get_system_settings()
    tasks = []
    email_message = f"<br> {message}."
    if current_settings.general_settings.sync_request.value:
        email_message += "<br> Перевел синхронизацию в статус ERROR."
        tasks.append(sync_error(message))
        tasks.append(send_error_with_buzzer())
        if current_settings.general_settings.sync_raise_damper.value:
            tasks.append(snmp_raise_damper())

    tasks.append(send_email(f"Рассинхрон в {method_name}", email_message))

    results = await asyncio.gather(*tasks)
    wdiot_logger.error(message)
    return results[0]


async def add_sync_error_to_bg_tasks(background_tasks, message: str):
    method_name = inspect.stack()[1].function
    background_tasks.add_task(turn_sync_error, method_name, message)


async def add_send_email_to_bg_tasks(background_tasks, title: str, email_body: str):
    method_name = inspect.stack()[1].function
    title += f" в {method_name}"
    background_tasks.add_task(send_email, title, email_body)


async def turn_sync_fixing():
    tasks = []
    tasks.append(snmp_set_buzzer_off())
    await asyncio.gather(*tasks)


async def flush_sync_to_normal():
    tasks = []
    tasks.append(flush_to_normal())
    tasks.append(snmp_finish_damper())

    await asyncio.gather(*tasks)


async def turn_pintset_withdrawal_error(message: str):
    tasks = []
    tasks.append(pintset_withdrawal_error(message))
    tasks.append(send_error_with_buzzer())
    email_message = f"<br> {message}."
    tasks.append(send_email("Выемка из под пинцета", email_message))
    wdiot_logger.error(message)
    results = await asyncio.gather(*tasks)
    return results[0]
