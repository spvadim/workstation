import snap7
from loguru import logger
from app.models.system_settings.pintset_settings import PintsetSettings
plc = snap7.client.Client()


def off_pintset(settings: PintsetSettings) -> bool:
    logger.info('Выключение пинцета')
    try:
        ip = settings.pintset_ip.value
        rack = settings.pintset_rack.value
        slot = settings.pintset_slot.value
        plc.connect(ip, rack, slot)

        db_name = settings.pintset_db_name.value
        starting_byte = settings.pintset_starting_byte.value
        length = settings.pintset_reading_length.value
        reading = plc.db_read(db_name, starting_byte,
                              length)

        byte_number = settings.pintset_byte_number.value
        bit_number = settings.pintset_bit_number.value
        pintset_turning_off_value = settings.pintset_turning_off_value.value
        snap7.util.set_bool(reading, byte_number, bit_number,
                            pintset_turning_off_value)

        plc.db_write(db_name, starting_byte, reading)
        plc.disconnect()
        plc.destroy()

    except snap7.snap7exceptions.Snap7Exception:
        logger.info('Ошибка во время выключения пинцета!')
        return False
    logger.info('Пинцет выключен')
    return True


def on_pintset(settings: PintsetSettings) -> bool:
    logger.info('Включение пинцета')
    try:
        ip = settings.pintset_ip.value
        rack = settings.pintset_rack.value
        slot = settings.pintset_slot.value
        plc.connect(ip, rack, slot)

        db_name = settings.pintset_db_name.value
        starting_byte = settings.pintset_starting_byte.value
        length = settings.pintset_reading_length.value
        reading = plc.db_read(db_name, starting_byte,
                              length)

        byte_number = settings.pintset_byte_number.value
        bit_number = settings.pintset_bit_number.value
        pintset_turning_on_value = settings.pintset_turning_on_value.value
        snap7.util.set_bool(reading, byte_number, bit_number,
                            pintset_turning_on_value)
        plc.db_write(db_name, starting_byte, reading)
        plc.disconnect()
        plc.destroy()

    except snap7.snap7exceptions.Snap7Exception:
        logger.info('Ошибка во время включения пинцета!')
        return False
    logger.info('Пинцет включен')
    return True
