import asyncio

from app.db.db_utils import (flush_packing_table, flush_state,
                             get_current_state, packing_table_error,
                             pintset_withdrawal_error, set_column_red,
                             set_column_yellow, sync_error)
from app.db.events import add_events
from app.db.system_settings import get_system_settings
from loguru import logger

from .email import send_email
from .erd import (snmp_finish_damper, snmp_finish_ejector, snmp_raise_damper,
                  snmp_raise_ejector, snmp_set_buzzer_off, snmp_set_buzzer_on,
                  snmp_set_green_off, snmp_set_green_on, snmp_set_red_off,
                  snmp_set_red_on, snmp_set_yellow_off, snmp_set_yellow_on)

wdiot_logger = logger.bind(name='wdiot')


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


async def send_warning_and_back_to_normal(message: str):
    tasks_before_sleep = []
    tasks_before_sleep.append(send_warning())
    tasks_before_sleep.append(set_column_yellow(message))
    tasks_before_sleep.append(add_events('error', message))

    current_settings = await get_system_settings()
    delay = current_settings.general_settings.applikator_curtain_opening_delay.value

    await asyncio.gather(*tasks_before_sleep)
    await asyncio.sleep(delay - 1.5)

    state = await get_current_state()
    if state.error_msg == message:
        tasks_after_sleep = []
        tasks_after_sleep.append(flush_state())
        tasks_after_sleep.append(flush_to_normal())
        await asyncio.gather(*tasks_after_sleep)


async def drop_pack(message: str):
    current_settings = await get_system_settings()
    delay_before_damper = current_settings.second_erd_settings.delay_before_damper.value
    delay_before_ejector = current_settings.second_erd_settings.delay_before_ejector.value
    delay_after_ejector = current_settings.second_erd_settings.delay_after_ejector.value

    await asyncio.sleep(delay_before_damper)
    await snmp_raise_damper()

    await asyncio.sleep(delay_before_ejector)
    await snmp_raise_ejector()

    await asyncio.sleep(delay_after_ejector)
    tasks_after_ejector = [
        snmp_finish_ejector(),
        snmp_finish_damper(),
        add_events('error', message)
    ]
    await asyncio.gather(*tasks_after_ejector)


async def turn_default_error(message: str):
    tasks = []
    tasks.append(set_column_red(message))
    tasks.append(send_error())
    tasks.append(add_events('error', message))
    results = await asyncio.gather(*tasks)
    return results[0]


async def turn_default_warning(message: str):
    tasks = []
    tasks.append(set_column_yellow(message))
    tasks.append(send_warning())
    tasks.append(add_events('error', message))
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
    email_message = f'<br> {message}.'
    tasks.append(send_email('Ошибка на упаковочном столе', email_message))
    wdiot_logger.error(message)
    results = await asyncio.gather(*tasks)
    return results[0]


async def flush_packing_table_error():
    tasks = []
    tasks.append(flush_packing_table())
    tasks.append(flush_to_normal())
    results = await asyncio.gather(*tasks)
    return results[0]


async def turn_sync_error(message: str):
    current_settings = await get_system_settings()
    tasks = []
    email_message = f'<br> {message}.'
    if current_settings.general_settings.sync_request.value:
        email_message += '<br> Перевел синхронизацию в статус ERROR.'
        tasks.append(sync_error(message))
        tasks.append(send_error_with_buzzer())
        if current_settings.general_settings.sync_raise_damper.value:
            tasks.append(snmp_raise_damper())

    tasks.append(send_email('Рассинхрон', email_message))
    tasks.append(add_events('desync', message))

    results = await asyncio.gather(*tasks)
    wdiot_logger.error(message)
    return results[0]


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
    email_message = f'<br> {message}.'
    tasks.append(send_email('Выемка из под пинцета', email_message))
    wdiot_logger.error(message)
    results = await asyncio.gather(*tasks)
    return results[0]
