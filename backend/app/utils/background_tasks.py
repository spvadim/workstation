import asyncio

from app.db.db_utils import (count_multipacks_queue, count_packs_queue,
                             flush_state, get_current_state, set_column_red,
                             set_column_yellow)
from app.db.system_settings import get_system_settings
from app.models.message import TGMessage

from .erd import (snmp_set_buzzer_off, snmp_set_buzzer_on, snmp_set_green_off,
                  snmp_set_green_on, snmp_set_red_off, snmp_set_red_on,
                  snmp_set_yellow_off, snmp_set_yellow_on)
from .io import send_telegram_message


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


async def check_packs_max_amount(max_amount: int):
    packs_amount = await count_packs_queue()

    if packs_amount > max_amount:
        error_msg = f'В системе {packs_amount} пачек, сейчас должно быть <= {max_amount}'

        tasks = []
        tasks.append(set_column_red(error_msg))
        tasks.append(send_telegram_message(TGMessage(text=error_msg)))
        await asyncio.gather(*tasks)


async def check_multipacks_max_amount(max_amount: int):
    multipacks_amount = await count_multipacks_queue()

    if multipacks_amount > max_amount:
        error_msg = f'В системе {multipacks_amount} паллет, сейчас должно быть <= {max_amount}'

        tasks = []
        tasks.append(set_column_red(error_msg))
        tasks.append(send_telegram_message(TGMessage(text=error_msg)))


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
