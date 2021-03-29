import asyncio

from app.db.db_utils import (flush_state, get_current_state, set_column_red,
                             set_column_yellow)
from app.db.system_settings import get_system_settings

from .erd import (snmp_finish_damper, snmp_finish_ejector, snmp_raise_damper,
                  snmp_raise_ejector, snmp_set_buzzer_off, snmp_set_buzzer_on,
                  snmp_set_green_off, snmp_set_green_on, snmp_set_red_off,
                  snmp_set_red_on, snmp_set_yellow_off, snmp_set_yellow_on)


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


async def drop_pack():
    current_settings = await get_system_settings()
    delay_before_damper = current_settings.second_erd_settings.delay_before_damper.value
    delay_before_ejector = current_settings.second_erd_settings.delay_before_ejector.value
    delay_after_ejector = current_settings.second_erd_settings.delay_after_ejector.value

    await asyncio.sleep(delay_before_damper)
    await snmp_raise_damper()

    await asyncio.sleep(delay_before_ejector)
    await snmp_raise_ejector()

    await asyncio.sleep(delay_after_ejector)
    tasks_after_ejector = [snmp_finish_ejector(), snmp_finish_damper()]
    await asyncio.gather(*tasks_after_ejector)
