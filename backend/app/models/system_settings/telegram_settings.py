from odmantic import EmbeddedModel


class TGToken(EmbeddedModel):
    title: str = 'Токен телеграмм бота'
    desc: str = 'Введите токен телеграмм бота для отправки сообщений'
    value: str
    value_type: str = 'string'


class TGChat(EmbeddedModel):
    title: str = 'ID телегррамм чата, куда будут отправляться сообщения'
    desc: str = 'Введите ID телеграмм чата в формате @айди_нужнего_чата'
    value: str
    value_type: str = 'string'


class TGSettings(EmbeddedModel):
    title: str = 'Настройки телеграмма'
    advanced: bool = True
    tg_token: TGToken
    tg_chat: TGChat
