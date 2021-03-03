from app.db.system_settings import get_system_settings
from loguru import logger
from pysnmp.hlapi.asyncio import *

erd_logger = logger.bind(name='erd')
on = Integer(1)
off = Integer(0)


async def set_cmd(key, value, engine=SnmpEngine(), context=ContextData()):
    current_settings = await get_system_settings()
    erd_settings = current_settings.erd_settings
    community_string = erd_settings.erd_community_string.value
    port_snmp = erd_settings.erd_snmp_port.value
    ip_address_host = erd_settings.erd_ip.value
    return await setCmd(engine, CommunityData(community_string),
                        UdpTransportTarget((ip_address_host, port_snmp)),
                        context, ObjectType(ObjectIdentity(key), value))


# изменение состояния
async def snmp_set(key, value):
    errorIndication, errorStatus, errorIndex, varBinds = await set_cmd(
        key, value)
    for name, val in varBinds:
        return (val.prettyPrint())


async def get_cmd(key, engine=SnmpEngine(), context=ContextData()):
    current_settings = await get_system_settings()
    erd_settings = current_settings.erd_settings
    community_string = erd_settings.erd_community_string.value
    port_snmp = erd_settings.erd_snmp_port.value
    ip_address_host = erd_settings.erd_ip.value
    return await getCmd(engine, CommunityData(community_string),
                        UdpTransportTarget((ip_address_host, port_snmp)),
                        context, ObjectType(ObjectIdentity(key)))


# получение состояния
async def snmp_get(key):
    errorIndication, errorStatus, errorIndex, varBinds = await get_cmd(key)
    for name, val in varBinds:
        return (val.prettyPrint())


async def snmp_set_yellow_on():
    erd_logger.info('Включение желтого цвета на колонне')

    current_settings = await get_system_settings()
    yellow_oid = current_settings.erd_settings.erd_yellow_oid.value
    await snmp_set(yellow_oid, on)


async def snmp_set_yellow_off():
    erd_logger.info('Выключение желтого цвета на колонне')

    current_settings = await get_system_settings()
    yellow_oid = current_settings.erd_settings.erd_yellow_oid.value
    await snmp_set(yellow_oid, off)


async def snmp_set_red_on():
    erd_logger.info('Включение красного цвета на колонне')

    current_settings = await get_system_settings()
    red_oid = current_settings.erd_settings.erd_red_oid.value
    await snmp_set(red_oid, on)


async def snmp_set_red_off():
    erd_logger.info('Выключение красного цвета на колонне')

    current_settings = await get_system_settings()
    red_oid = current_settings.erd_settings.erd_red_oid.value
    await snmp_set(red_oid, off)


async def snmp_set_green_on():
    erd_logger.info('Включение зеленого цвета на колонне')

    current_settings = await get_system_settings()
    green_oid = current_settings.erd_settings.erd_green_oid.value
    await snmp_set(green_oid, on)


async def snmp_set_green_off():
    erd_logger.info('Выключение зеленого цвета на колонне')

    current_settings = await get_system_settings()
    green_oid = current_settings.erd_settings.erd_green_oid.value
    await snmp_set(green_oid, off)


async def snmp_set_buzzer_on():
    erd_logger.info('Включение зуммера')

    current_settings = await get_system_settings()
    buzzer_oid = current_settings.erd_settings.erd_buzzer_oid.value
    await snmp_set(buzzer_oid, on)


async def snmp_set_buzzer_off():
    erd_logger.info('Выключение зуммера')

    current_settings = await get_system_settings()
    buzzer_oid = current_settings.erd_settings.erd_buzzer_oid.value
    await snmp_set(buzzer_oid, off)
