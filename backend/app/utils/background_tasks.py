import asyncio

from app.db.db_utils import flush_state, get_current_state, set_column_yellow
from app.models.message import TGMessage

from .erd import (snmp_set_buzzer_off, snmp_set_buzzer_on, snmp_set_green_off,
                  snmp_set_green_on, snmp_set_red_off, snmp_set_red_on,
                  snmp_set_yellow_off, snmp_set_yellow_on)
from .io import send_telegram_message


async def send_error():
    tasks = []

    tasks.append(snmp_set_green_off())
    tasks.append(snmp_set_buzzer_on())
    tasks.append(snmp_set_red_on())

    await asyncio.gather(*tasks)


async def send_error_and_send_tg_message(message: str):
    tasks = []

    tasks.append(send_error())
    tasks.append(send_telegram_message(TGMessage(text=message,
                                       timestamp=False)))
    await asyncio.gather(*tasks)


async def send_warning():
    tasks = []

    tasks.append(snmp_set_green_off())
    tasks.append(snmp_set_buzzer_on())
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

    tasks_before_sleep.append(
        send_telegram_message(TGMessage(text=message, timestamp=False)))
    await asyncio.gather(*tasks_before_sleep)
    await asyncio.sleep(15)

    state = await get_current_state()
    if state.error_msg == message:
        tasks_after_sleep = []
        tasks_after_sleep.append(flush_state())
        tasks_after_sleep.append(flush_to_normal())
        await asyncio.gather(*tasks_after_sleep)
