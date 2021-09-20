import snap7
from loguru import logger

from ..models.system_settings.pintset_settings import PintsetSettings


wdiot_logger = logger.bind(name="wdiot")


def off_pintset(settings: PintsetSettings) -> bool:
    wdiot_logger.info("Выключение пинцета")
    try:
        plc = snap7.client.Client()
        ip = settings.pintset_ip.value
        wdiot_logger.info(f"Ip: {ip}")
        rack = settings.pintset_rack.value
        wdiot_logger.info(f"Rack: {rack}")
        slot = settings.pintset_slot.value
        wdiot_logger.info(f"Slot: {slot}")
        wdiot_logger.info("Пытаюсь подключится к plc")
        plc.connect(ip, rack, slot)
        wdiot_logger.info("Подключился к plc")

        db_name = settings.pintset_db_name.value
        wdiot_logger.info(f"db_name: {db_name}")
        starting_byte = settings.pintset_starting_byte.value
        wdiot_logger.info(f"starting_byte: {starting_byte}")
        length = settings.pintset_reading_length.value
        wdiot_logger.info(f"length: {length}")
        reading = plc.db_read(db_name, starting_byte, length)
        wdiot_logger.info(f"reading: {reading}")

        byte_number = settings.pintset_byte_number.value
        wdiot_logger.info(f"Byte_number: {byte_number}")
        bit_number = settings.pintset_bit_number.value
        wdiot_logger.info(f"Bit_number: {bit_number}")
        pintset_turning_off_value = settings.pintset_turning_off_value.value
        wdiot_logger.info(f"Pintset_turning_off_value: {pintset_turning_off_value}")
        wdiot_logger.info("Пытаюсь выполнить set_bool")
        snap7.util.set_bool(reading, byte_number, bit_number, pintset_turning_off_value)
        wdiot_logger.info("Выполнил set_bool")

        wdiot_logger.info("Пытаюсь выполнить db_write")
        plc.db_write(db_name, starting_byte, reading)
        wdiot_logger.info("Выполнил db_write")
        wdiot_logger.info("Пытаюсь отключится от plc")
        plc.disconnect()
        wdiot_logger.info("Отключился от plc")
        plc.destroy()

    except snap7.exceptions.Snap7Exception as e:
        wdiot_logger.info(f"Ошибка во время выключения пинцета: {e}")
        return False
    wdiot_logger.info("Пинцет выключен")
    return True


def on_pintset(settings: PintsetSettings) -> bool:
    wdiot_logger.info("Включение пинцета")
    try:
        plc = snap7.client.Client()
        ip = settings.pintset_ip.value
        wdiot_logger.info(f"Ip: {ip}")
        rack = settings.pintset_rack.value
        wdiot_logger.info(f"Rack: {rack}")
        slot = settings.pintset_slot.value
        wdiot_logger.info(f"Slot: {slot}")
        wdiot_logger.info("Пытаюсь подключится к plc")
        plc.connect(ip, rack, slot)
        wdiot_logger.info("Подключился к plc")

        db_name = settings.pintset_db_name.value
        wdiot_logger.info(f"db_name: {db_name}")
        starting_byte = settings.pintset_starting_byte.value
        wdiot_logger.info(f"starting_byte: {starting_byte}")
        length = settings.pintset_reading_length.value
        wdiot_logger.info(f"length: {length}")
        reading = plc.db_read(db_name, starting_byte, length)
        wdiot_logger.info(f"reading: {reading}")

        byte_number = settings.pintset_byte_number.value
        wdiot_logger.info(f"Byte_number: {byte_number}")
        bit_number = settings.pintset_bit_number.value
        wdiot_logger.info(f"Bit_number: {bit_number}")
        pintset_turning_on_value = settings.pintset_turning_on_value.value
        wdiot_logger.info(f"Pintset_turning_on_value: {pintset_turning_on_value}")
        wdiot_logger.info("Пытаюсь выполнить set_bool")
        snap7.util.set_bool(reading, byte_number, bit_number, pintset_turning_on_value)
        wdiot_logger.info("Выполнил set_bool")

        wdiot_logger.info("Пытаюсь выполнить db_write")
        plc.db_write(db_name, starting_byte, reading)
        wdiot_logger.info("Выполнил db_write")
        wdiot_logger.info("Пытаюсь отключится от plc")
        plc.disconnect()
        wdiot_logger.info("Отключился от plc")
        plc.destroy()

    except snap7.exceptions.Snap7Exception as e:
        wdiot_logger.info(f"Ошибка во время включения пинцета: {e}")
        return False
    wdiot_logger.info("Пинцет включен")
    return True
