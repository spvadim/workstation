import snap7
from loguru import logger

plc = snap7.client.Client()


def off_pintset() -> bool:
    logger.info('Выключение пинцета')
    try:
        plc.connect('192.168.20.210', 0, 2) #ip, rack, slot
        reading = plc.db_read(60, 0, 1) # db_name, starting_byte, length
        snap7.util.set_bool(reading, 0, 0, True) # byte_number, bite_number, toggle_value_on
        plc.db_write(60, 0, reading) # db_name, starting_byte
        plc.disconnect()
        plc.destroy()

    except snap7.snap7exceptions.Snap7Exception:
        logger.info('Ошибка во время выключения пинцета!')
        return False
    logger.info('Пинцет выключен')
    return True


def on_pintset() -> bool:
    logger.info('Включение пинцета')
    try:
        plc.connect('192.168.20.210', 0, 2)
        reading = plc.db_read(60, 0, 1)
        snap7.util.set_bool(reading, 0, 0, False)
        plc.db_write(60, 0, reading)
        plc.disconnect()
        plc.destroy()

    except snap7.snap7exceptions.Snap7Exception:
        logger.info('Ошибка во время включения пинцета!')
        return False
    logger.info('Пинцет включен')
    return True
