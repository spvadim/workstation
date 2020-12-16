import os
import requests
from datetime import datetime as dt


msg_templates_by_subject = {
    'special': 'operation X was done.',
    'settings was set': 'Настройки системы были успешно изменены.',
    'default settings was set': 'Дефолтные настройки системы были успешно установлены.'
}


def send_telegram_message(subject: str, filling: list = [], with_timestamp: bool = True):
    """
    :param subject: тема сообщения, по которой будет выбран шаблон.
    :param filling: Питон-список данных для заполнения шаблона. Элемент должен уметь __str__()
    :param with_timestamp: Флаг. Если True то в конце сообщения будет добавлена временная метка отправки.
    :return: отсутствует
    """
    tg_token = os.environ['TLG_TOKEN']
    tg_channel_id = os.environ['TLG_CHAT']
    tg_message = msg_templates_by_subject.get(subject, "Шаблон отсутствует")

    timestamp = dt.now().strftime('%c')

    if filling:
        try:
            tg_message = tg_message.format(*filling)
        except:
            raise Exception('problem with tg message formatting')

    if with_timestamp:
        tg_message += f' Время на сервере: {timestamp}.'

    r = requests.get('https://api.telegram.org/bot{}/sendMessage'.format(tg_token),
                     params=dict(chat_id=tg_channel_id, text=tg_message)
                     )

    if r.status_code != 200:
        raise Exception('problem with sending tg message')
