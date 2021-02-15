from odmantic import EmbeddedModel


class ERDIp(EmbeddedModel):
    title: str = 'IP ERD контроллера'
    desc: str = 'Введите IP ERD контроллера'
    value: str
    value_type: str = 'string'


class ERDSNMPPort(EmbeddedModel):
    title: str = 'SNMP порт ERD контроллера'
    desc: str = 'Введите порт SNMP ERD контроллера'
    value: int
    value_type: str = 'integer'


class ERDCommunityString(EmbeddedModel):
    title: str = 'Строка авторизации ERD контроллера'
    desc: str = 'Введите строку авторизации ERD контроллера'
    value: str
    value_type: str = 'string'


class ERDRedOID(EmbeddedModel):
    title: str = 'ID красного цвета в ERD контроллере'
    desc: str = 'Введите ID красного цвета'
    value: str
    value_type: str = 'string'


class ERDYellowOID(EmbeddedModel):
    title: str = 'ID желтого цвета в ERD контроллере'
    desc: str = 'Введите ID желтого цвета'
    value: str
    value_type: str = 'string'


class ERDGreenOID(EmbeddedModel):
    title: str = 'ID зеленого цвета в ERD контроллере'
    desc: str = 'Введите ID зеленого цвета'
    value: str
    value_type: str = 'string'


class ERDBuzzerOID(EmbeddedModel):
    title: str = 'ID зуммера в ERD контроллере'
    desc: str = 'Введите ID зуммера'
    value: str
    value_type: str = 'string'


class ERDSettings(EmbeddedModel):
    title: str = 'Настройки ERD контроллера'
    advanced: bool = True
    erd_ip: ERDIp
    erd_snmp_port: ERDSNMPPort
    erd_community_string: ERDCommunityString
    erd_red_oid: ERDRedOID
    erd_yellow_oid: ERDYellowOID
    erd_green_oid: ERDGreenOID
    erd_buzzer_oid: ERDBuzzerOID