from odmantic import EmbeddedModel


class DaysToDelete(EmbeddedModel):
    title: str = 'Период хранения данных в базе'
    desc: str = 'Введите количество дней хранения данных в базе'
    value: int
    value_type: str = 'integer'


class PintsetStop(EmbeddedModel):
    title: str = 'Остановка пинцета'
    desc: str = 'Выберите, останавливать ли пинцет в случае ошибок'
    value: bool
    value_type: str = 'bool'


class SendApplikatorTgMessage(EmbeddedModel):
    title: str = 'Отправка сообщения в тг после ошибки на аппликаторе'
    desc: str = ('Выберите, отправлять ли сообщение в тг в случае '
                 'ошибки на аппликаторе')
    value: bool
    value_type: str = 'bool'


class GeneralSettings(EmbeddedModel):
    title: str = 'Общие настройки'
    advanced: bool = False
    pintset_stop: PintsetStop
    send_applikator_tg_message: SendApplikatorTgMessage
