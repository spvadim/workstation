from typing import Tuple
import requests
from datetime import datetime as dt

from app.db.engine import engine

from app.models.system_settings import SystemSettings
from app.models.message import TGMessage

from odmantic import query



msg_templates_by_subject = {
    'special': 'operation X was done.',
    'settings was set': 'Настройки системы были успешно изменены.',
    'default settings was set': 'Дефолтные настройки системы были успешно установлены.'
}


async def send_telegram_message(msg: TGMessage) -> bool:
    """
    функция отправки сообщения в телеграмм канал
    """

    cs = await engine.find_one(SystemSettings, sort=query.desc(SystemSettings.id))

    if cs:
        tg_token = cs.telegram_token
        tg_channel_id = cs.telegram_chat
    else:
        return False

    message = msg.text
    if msg.timestamp:
        timestamp = dt.now().strftime('%c')
        message += f' Время на сервере: {timestamp}.'

    r = requests.get('https://api.telegram.org/bot{}/sendMessage'.format(tg_token),
                     params=dict(chat_id=tg_channel_id, text=message)
                     )
    if r.status_code != 200:
        return False

    return True
