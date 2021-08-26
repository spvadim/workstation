from typing import Optional

from odmantic import EmbeddedModel


class ERDIp(EmbeddedModel):
    title: str = "IP ERD контроллера"
    desc: str = "Введите IP ERD контроллера"
    value: Optional[str]
    value_type: str = "string"


class ERDSNMPPort(EmbeddedModel):
    title: str = "SNMP порт ERD контроллера"
    desc: str = "Введите порт SNMP ERD контроллера"
    value: Optional[int]
    value_type: str = "integer"


class ERDCommunityString(EmbeddedModel):
    title: str = "Строка авторизации ERD контроллера"
    desc: str = "Введите строку авторизации ERD контроллера"
    value: Optional[str]
    value_type: str = "string"


class ERDRedOID(EmbeddedModel):
    title: str = "ID красного цвета в ERD контроллере"
    desc: str = "Введите ID красного цвета"
    value: str
    value_type: str = "string"


class ERDYellowOID(EmbeddedModel):
    title: str = "ID желтого цвета в ERD контроллере"
    desc: str = "Введите ID желтого цвета"
    value: str
    value_type: str = "string"


class ERDGreenOID(EmbeddedModel):
    title: str = "ID зеленого цвета в ERD контроллере"
    desc: str = "Введите ID зеленого цвета"
    value: str
    value_type: str = "string"


class ERDBuzzerOID(EmbeddedModel):
    title: str = "ID зуммера в ERD контроллере"
    desc: str = "Введите ID зуммера"
    value: str
    value_type: str = "string"


class ERDFirstOID(EmbeddedModel):
    title: str = "ID первого порта в ERD контроллере"
    desc: str = "Введите ID порта в ерд контроллере"
    value: Optional[str]
    value_type: str = "string"


class ERDSecondOID(EmbeddedModel):
    title: str = "ID второго в ERD контроллере"
    desc: str = "Введите ID порта в ерд контроллере"
    value: Optional[str]
    value_type: str = "string"


class ERDThirdOID(EmbeddedModel):
    title: str = "ID третьего порта в ERD контроллере"
    desc: str = "Введите ID порта в ерд контроллере"
    value: Optional[str]
    value_type: str = "string"


class ERDFourthOID(EmbeddedModel):
    title: str = "ID четвертого порта в ERD контроллере"
    desc: str = "Введите ID порта в ерд контроллере"
    value: Optional[str]
    value_type: str = "string"


class ERDFifthOID(EmbeddedModel):
    title: str = "ID пятого порта в ERD контроллере"
    desc: str = "Введите ID порта в ерд контроллере"
    value: Optional[str]
    value_type: str = "string"


class DelayBeforeDamper(EmbeddedModel):
    title: str = "Задержка перед поднятием шторки"
    desc: str = "Введите задержку в секундах перед открытием шторки"
    value: float = 1.0
    value_type: str = "float"


class DelayBeforeEjector(EmbeddedModel):
    title: str = "Задержка перед поднятием сбрасывателя"
    desc: str = "Введите задержку в секундах перед поднятием сбрасывателя"
    value: float = 0.3
    value_type: str = "float"


class DelayAfterEjector(EmbeddedModel):
    title: str = "Задержка после поднятия сбрасывателя"
    desc: str = "Введите задержку в секундах после поднятия сбрасывателя"
    value: float = 2
    value_type: str = "float"


class ERDSettings(EmbeddedModel):
    title: str = "Настройки ERD контроллера"
    advanced: bool = True
    erd_ip: ERDIp
    erd_snmp_port: ERDSNMPPort
    erd_community_string: ERDCommunityString
    erd_red_oid: ERDRedOID
    erd_yellow_oid: ERDYellowOID
    erd_green_oid: ERDGreenOID
    erd_buzzer_oid: ERDBuzzerOID
    erd_fifth_oid: ERDFifthOID


class SecondERDSettings(EmbeddedModel):
    title: str = "Настройки второго ERD контроллера"
    advanced: bool = True
    erd_ip: ERDIp
    erd_snmp_port: ERDSNMPPort
    erd_community_string: ERDCommunityString
    erd_first_oid: ERDFirstOID
    erd_second_oid: ERDSecondOID
    erd_third_oid: ERDThirdOID
    erd_fourth_oid: ERDFourthOID
    erd_fifth_oid: ERDFifthOID
    delay_before_damper: DelayBeforeDamper = DelayBeforeDamper()
    delay_before_ejector: DelayBeforeEjector = DelayBeforeEjector()
    delay_after_ejector: DelayAfterEjector = DelayAfterEjector()


class ThirdERDSettings(EmbeddedModel):
    title: str = "Настройки третьего ERD контроллера"
    advanced: bool = True
    erd_ip: ERDIp = ERDIp()
    erd_snmp_port: ERDSNMPPort = ERDSNMPPort()
    erd_community_string: ERDCommunityString = ERDCommunityString()
    erd_first_oid: ERDFirstOID = ERDFirstOID()
    erd_second_oid: ERDSecondOID = ERDSecondOID()
    erd_third_oid: ERDThirdOID = ERDThirdOID()
    erd_fourth_oid: ERDFourthOID = ERDFourthOID()
    erd_fifth_oid: ERDFifthOID = ERDFifthOID()
