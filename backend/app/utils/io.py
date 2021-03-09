from datetime import datetime as dt

import httpx
from app.db.system_settings import get_system_settings
from app.models.message import TGMessage
from loguru import logger


async def send_telegram_message(msg: TGMessage, img=None) -> bool:
    """
    функция отправки сообщения в телеграмм канал
    """

    logger.info('Отправка сообщения в телеграмм')

    # TODO: add new setting for tg (to send or not to send: that's the question)
    # cs = await get_system_settings()

    # tg_token = cs.telegram_settings.tg_token.value
    # tg_channel_id = cs.telegram_settings.tg_chat.value

    # message = msg.text
    # if msg.timestamp:
    #     timestamp = dt.now().strftime('%c')
    #     message += f' Время на сервере: {timestamp}.'

    # async with httpx.AsyncClient() as client:
    #     if img:
    #         files = {'photo': (img.filename, img.file)}
    #         r = await client.post(
    #             'https://api.telegram.org/bot{}/sendPhoto'.format(tg_token),
    #             data=dict(chat_id=tg_channel_id, caption=message),
    #             files=files)
    #     else:
    #         r = await client.get(
    #             'https://api.telegram.org/bot{}/sendMessage'.format(tg_token),
    #             params=dict(chat_id=tg_channel_id, text=message))
    # if r.status_code != 200:
    #     return False

    return True
