import asyncio
from .io import send_telegram_message
from .erd import snmp_set_yellow_on, snmp_set_yellow_off, \
    snmp_set_red_on, snmp_set_red_off, \
    snmp_set_green_on, snmp_set_green_off, \
    snmp_set_buzzer_on, snmp_set_buzzer_off
from app.models.message import TGMessage
from app.db.db_utils import set_column_red, set_column_yellow, \
    flush_state, get_current_state


async def send_error_and_back_to_normal(color: str, message: str):
    tasks_before_sleep = []
    tasks_before_sleep.append(snmp_set_green_off())

    tasks_before_sleep.append(snmp_set_buzzer_on())

    if color == 'yellow':
        tasks_before_sleep.append(set_column_yellow(message))
        tasks_before_sleep.append(snmp_set_yellow_on())

    tasks_before_sleep.append(
        send_telegram_message(TGMessage(text=message, timestamp=False)))
    results_before_sleep = await asyncio.gather(*tasks_before_sleep)
    await asyncio.sleep(15)

    state = await get_current_state()
    if state.error_msg == message:
        tasks_after_sleep = []
        tasks_after_sleep.append(flush_state())
        tasks_after_sleep.append(snmp_set_buzzer_off())
        tasks_after_sleep.append(snmp_set_yellow_off())
        tasks_after_sleep.append(snmp_set_green_on())
        results_after_sleep = await asyncio.gather(*tasks_after_sleep)


async def send_error():
    tasks = []

    tasks.append(snmp_set_green_off())
    tasks.append(snmp_set_buzzer_on())
    tasks.append(snmp_set_red_on())

    results = await asyncio.gather(*tasks)


async def send_warning():
    tasks = []

    tasks.append(snmp_set_green_off())
    tasks.append(snmp_set_buzzer_on())
    tasks.append(snmp_set_yellow_on())

    results = await asyncio.gather(*tasks)


async def flush_to_normal():
    tasks = []

    tasks.append(snmp_set_buzzer_off())
    tasks.append(snmp_set_yellow_off())
    tasks.append(snmp_set_red_off())
    tasks.append(snmp_set_green_on())

    results = await asyncio.gather(*tasks)
