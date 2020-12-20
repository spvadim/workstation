from abc import ABC
from enum import Enum
from typing import List, Optional, Union
from pydantic import BaseModel


class TGMessage(BaseModel):
    """
    :param msg: текст сообщения.
    :param timestamp: Флаг. Если True то в конце сообщения будет добавлена временная метка отправки.
    """
    text: str = 'Текст сообщения'
    timestamp: bool = False
