from odmantic import EmbeddedModel


class PintsetIp(EmbeddedModel):
    title: str = 'Ip контроллера пинцета'
    desc: str = 'Введите IP контролера пинцета'
    value: str
    value_type: str = 'string'


class PintsetRack(EmbeddedModel):
    title: str = 'Rack контроллера пинцета'
    desc: str = 'Введите Rack контроллера пинцета'
    value: int
    value_type: str = 'integer'


class PintsetSlot(EmbeddedModel):
    title: str = 'Slot контроллера пинцета'
    desc: str = ('Введите Slot контоллера пинцета, '
                 'нужно вводить слот основного CPU')
    value: int
    value_type: str = 'integer'


class PintsetDbName(EmbeddedModel):
    title: str = 'Область памяти контроллера пинцета'
    desc: str = 'Введите номер области памяти контроллера пинцета'
    value: int
    value_type: str = 'integer'


class PintsetStartingByte(EmbeddedModel):
    title: str = 'Начальный байт контроллера пинцета'
    desc: str = 'Введите начальный байт контроллера пинцета'
    value: int
    value_type: str = 'integer'


class PintsetReadingLength(EmbeddedModel):
    title: str = 'Сколько байтов считывает контроллер пинцета'
    desc: str = 'Введите количество считываемых байтов контроллером пинцета'
    value: int
    value_type: str = 'integer'


class PintsetByteNumber(EmbeddedModel):
    title: str = 'Номер изменяемого байта контроллера пинцета'
    desc: str = 'Введите номер изменяемого байта контроллера пинцета'
    value: int
    value_type: str = 'integer'


class PintsetBitNumber(EmbeddedModel):
    title: str = 'Номер изменяемого бита'
    desc: str = 'Введите номер изменяемого бита контроллера пинцета'
    value: int
    value_type: str = 'integer'


class PintsetTurningOffValue(EmbeddedModel):
    title: str = 'Значение, при котором контроллер останавливает пинцет'
    desc: str = ('Выберите значение, при котором контроллер '
                 'останавливает пинцет')
    value: bool
    value_type: str = 'bool'


class PintsetTurningOnValue(EmbeddedModel):
    title: str = 'Значение, при котором контроллер включает пинцет'
    desc: str = ('Выберите значение, при котором контроллер '
                 'включает пинцет')
    value: bool
    value_type: str = 'bool'


class PintsetSettings(EmbeddedModel):
    title: str = 'Настройки пинцета'
    advanced: bool = True
    pintset_ip: PintsetIp
    pintset_rack: PintsetRack
    pintset_slot: PintsetSlot
    pintset_db_name: PintsetDbName
    pintset_starting_byte: PintsetStartingByte
    pintset_reading_length: PintsetReadingLength
    pintset_byte_number: PintsetByteNumber
    pintset_bit_number: PintsetBitNumber
    pintset_turning_off_value: PintsetTurningOffValue
    pintset_turning_on_value: PintsetTurningOnValue
