from pysnmp.hlapi.asyncio import *
from loguru import logger

community_string = 'public'
ip_address_host = '192.168.20.200'
port_snmp = 161
on = Integer(1)
off = Integer(0)

#словарь можно заменить на переменные
OID = {
    'red': '.1.3.6.1.4.1.40418.2.6.2.2.1.3.1.4',
    'yellow': '.1.3.6.1.4.1.40418.2.6.2.2.1.3.1.3',
    'green': '.1.3.6.1.4.1.40418.2.6.2.2.1.3.1.2',
    'buzzer': '.1.3.6.1.4.1.40418.2.6.2.2.1.3.1.5'
}


async def set_cmd(key,
                  value,
                  port=161,
                  engine=SnmpEngine(),
                  context=ContextData()):
    return await setCmd(engine, CommunityData(community_string),
                        UdpTransportTarget((ip_address_host, port_snmp)),
                        context, ObjectType(ObjectIdentity(key), value))


#изменение состояния
async def snmp_set(key, value):
    errorIndication, errorStatus, errorIndex, varBinds = await set_cmd(
        key, value)
    for name, val in varBinds:
        return (val.prettyPrint())


async def get_cmd(key, port=161, engine=SnmpEngine(), context=ContextData()):
    return await getCmd(engine, CommunityData(community_string),
                        UdpTransportTarget((ip_address_host, port_snmp)),
                        context, ObjectType(ObjectIdentity(key)))


#получение состояния
async def snmp_get(key):
    errorIndication, errorStatus, errorIndex, varBinds = await get_cmd(key)
    for name, val in varBinds:
        return (val.prettyPrint())


async def snmp_set_yellow_on():
    logger.info('Включение желтого цвета на колонне')
    await snmp_set(OID['yellow'], on)


async def snmp_set_yellow_off():
    logger.info('Выключение желтого цвета на колонне')
    await snmp_set(OID['yellow'], off)


async def snmp_set_red_on():
    logger.info('Включение красного цвета на колонне')
    await snmp_set(OID['red'], on)


async def snmp_set_red_off():
    logger.info('Выключение красного цвета на колонне')
    await snmp_set(OID['red'], off)


async def snmp_set_green_on():
    logger.info('Включение зеленого цвета на колонне')
    await snmp_set(OID['green'], on)


async def snmp_set_green_off():
    logger.info('Выключение зеленого цвета на колонне')
    await snmp_set(OID['green'], off)


async def snmp_set_buzzer_on():
    logger.info('Включение зуммера')
    await snmp_set(OID['buzzer'], on)


async def snmp_set_buzzer_off():
    logger.info('Выключение зуммера')
    await snmp_set(OID['buzzer'], off)
