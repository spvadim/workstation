from loguru import logger
from pysnmp.hlapi.asyncio import *

from ..db.system_settings import get_system_settings

erd_logger = logger.bind(name="erd")
on = Integer(1)
off = Integer(0)


async def first_erd_set_cmd(key, value, engine=SnmpEngine(), context=ContextData()):
    current_settings = await get_system_settings()
    erd_settings = current_settings.erd_settings
    community_string = erd_settings.erd_community_string.value
    port_snmp = erd_settings.erd_snmp_port.value
    ip_address_host = erd_settings.erd_ip.value
    return await setCmd(
        engine,
        CommunityData(community_string),
        UdpTransportTarget((ip_address_host, port_snmp)),
        context,
        ObjectType(ObjectIdentity(key), value),
    )


# изменение состояния
async def first_erd_snmp_set(key, value):
    errorIndication, errorStatus, errorIndex, varBinds = await first_erd_set_cmd(
        key, value
    )
    for name, val in varBinds:
        return val.prettyPrint()


async def first_erd_get_cmd(key, engine=SnmpEngine(), context=ContextData()):
    current_settings = await get_system_settings()
    erd_settings = current_settings.erd_settings
    community_string = erd_settings.erd_community_string.value
    port_snmp = erd_settings.erd_snmp_port.value
    ip_address_host = erd_settings.erd_ip.value
    return await getCmd(
        engine,
        CommunityData(community_string),
        UdpTransportTarget((ip_address_host, port_snmp)),
        context,
        ObjectType(ObjectIdentity(key)),
    )


# получение состояния
async def first_erd_snmp_get(key):
    errorIndication, errorStatus, errorIndex, varBinds = await first_erd_get_cmd(key)
    for name, val in varBinds:
        return val.prettyPrint()


async def second_erd_set_cmd(key, value, engine=SnmpEngine(), context=ContextData()):
    current_settings = await get_system_settings()
    erd_settings = current_settings.second_erd_settings
    community_string = erd_settings.erd_community_string.value
    port_snmp = erd_settings.erd_snmp_port.value
    ip_address_host = erd_settings.erd_ip.value
    return await setCmd(
        engine,
        CommunityData(community_string),
        UdpTransportTarget((ip_address_host, port_snmp)),
        context,
        ObjectType(ObjectIdentity(key), value),
    )


# изменение состояния
async def second_erd_snmp_set(key, value):
    errorIndication, errorStatus, errorIndex, varBinds = await second_erd_set_cmd(
        key, value
    )
    for name, val in varBinds:
        return val.prettyPrint()


async def second_erd_get_cmd(key, engine=SnmpEngine(), context=ContextData()):
    current_settings = await get_system_settings()
    erd_settings = current_settings.second_erd_settings
    community_string = erd_settings.erd_community_string.value
    port_snmp = erd_settings.erd_snmp_port.value
    ip_address_host = erd_settings.erd_ip.value
    return await getCmd(
        engine,
        CommunityData(community_string),
        UdpTransportTarget((ip_address_host, port_snmp)),
        context,
        ObjectType(ObjectIdentity(key)),
    )


# получение состояния
async def second_erd_snmp_get(key):
    errorIndication, errorStatus, errorIndex, varBinds = await second_erd_get_cmd(key)
    for name, val in varBinds:
        return val.prettyPrint()


async def third_erd_set_cmd(key, value, engine=SnmpEngine(), context=ContextData()):
    current_settings = await get_system_settings()
    erd_settings = current_settings.third_erd_settings
    community_string = erd_settings.erd_community_string.value
    port_snmp = erd_settings.erd_snmp_port.value
    ip_address_host = erd_settings.erd_ip.value
    return await setCmd(
        engine,
        CommunityData(community_string),
        UdpTransportTarget((ip_address_host, port_snmp)),
        context,
        ObjectType(ObjectIdentity(key), value),
    )


# изменение состояния
async def third_erd_snmp_set(key, value):
    errorIndication, errorStatus, errorIndex, varBinds = await third_erd_set_cmd(
        key, value
    )
    for name, val in varBinds:
        return val.prettyPrint()


async def third_erd_get_cmd(key, engine=SnmpEngine(), context=ContextData()):
    current_settings = await get_system_settings()
    erd_settings = current_settings.third_erd_settings
    community_string = erd_settings.erd_community_string.value
    port_snmp = erd_settings.erd_snmp_port.value
    ip_address_host = erd_settings.erd_ip.value
    return await getCmd(
        engine,
        CommunityData(community_string),
        UdpTransportTarget((ip_address_host, port_snmp)),
        context,
        ObjectType(ObjectIdentity(key)),
    )


# получение состояния
async def third_erd_snmp_get(key):
    errorIndication, errorStatus, errorIndex, varBinds = await third_erd_get_cmd(key)
    for name, val in varBinds:
        return val.prettyPrint()


async def snmp_set_yellow_on():
    erd_logger.info("Включение желтого цвета на колонне")

    current_settings = await get_system_settings()
    yellow_oid = current_settings.erd_settings.erd_yellow_oid.value
    await first_erd_snmp_set(yellow_oid, on)


async def snmp_set_yellow_off():
    erd_logger.info("Выключение желтого цвета на колонне")

    current_settings = await get_system_settings()
    yellow_oid = current_settings.erd_settings.erd_yellow_oid.value
    await first_erd_snmp_set(yellow_oid, off)


async def snmp_set_red_on():
    erd_logger.info("Включение красного цвета на колонне")

    current_settings = await get_system_settings()
    red_oid = current_settings.erd_settings.erd_red_oid.value
    await first_erd_snmp_set(red_oid, on)


async def snmp_set_red_off():
    erd_logger.info("Выключение красного цвета на колонне")

    current_settings = await get_system_settings()
    red_oid = current_settings.erd_settings.erd_red_oid.value
    await first_erd_snmp_set(red_oid, off)


async def snmp_set_green_on():
    erd_logger.info("Включение зеленого цвета на колонне")

    current_settings = await get_system_settings()
    green_oid = current_settings.erd_settings.erd_green_oid.value
    await first_erd_snmp_set(green_oid, on)


async def snmp_set_green_off():
    erd_logger.info("Выключение зеленого цвета на колонне")

    current_settings = await get_system_settings()
    green_oid = current_settings.erd_settings.erd_green_oid.value
    await first_erd_snmp_set(green_oid, off)


async def snmp_set_buzzer_on():
    erd_logger.info("Включение зуммера")

    current_settings = await get_system_settings()
    buzzer_oid = current_settings.erd_settings.erd_buzzer_oid.value
    await first_erd_snmp_set(buzzer_oid, on)


async def snmp_set_buzzer_off():
    erd_logger.info("Выключение зуммера")

    current_settings = await get_system_settings()
    buzzer_oid = current_settings.erd_settings.erd_buzzer_oid.value
    await first_erd_snmp_set(buzzer_oid, off)


async def snmp_raise_damper():
    erd_logger.info("Подъем шторки")

    current_settings = await get_system_settings()
    first_oid = current_settings.second_erd_settings.erd_first_oid.value
    if first_oid:
        await second_erd_snmp_set(first_oid, on)


async def snmp_finish_damper():
    erd_logger.info("Опускание шторки")

    current_settings = await get_system_settings()
    first_oid = current_settings.second_erd_settings.erd_first_oid.value
    if first_oid:
        await second_erd_snmp_set(first_oid, off)


async def snmp_raise_ejector():
    erd_logger.info("Подъем сбрасывателя")

    current_settings = await get_system_settings()
    second_oid = current_settings.second_erd_settings.erd_second_oid.value
    if second_oid:
        await second_erd_snmp_set(second_oid, on)


async def snmp_finish_ejector():
    erd_logger.info("Опускание сбрасывателя")

    current_settings = await get_system_settings()
    second_oid = current_settings.second_erd_settings.erd_second_oid.value
    if second_oid:
        await second_erd_snmp_set(second_oid, off)


async def snmp_third_erd_first_oid_on():
    erd_logger.info("on signal on first oid")

    current_settings = await get_system_settings()
    first_oid = current_settings.third_erd_settings.erd_first_oid.value
    if first_oid:
        await third_erd_snmp_set(first_oid, on)


async def snmp_third_erd_first_oid_off():
    erd_logger.info("off signal on first oid")

    current_settings = await get_system_settings()
    first_oid = current_settings.third_erd_settings.erd_first_oid.value
    if first_oid:
        await third_erd_snmp_set(first_oid, off)
