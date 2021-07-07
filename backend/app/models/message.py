from pydantic import BaseModel
from .model_config import ModelConfig


class TGMessage(BaseModel):
    """
    :param msg: текст сообщения.
    :param timestamp: Флаг. Если True то в конце сообщения будет добавлена временная метка отправки.
    """

    text: str = "Текст сообщения"
    timestamp: bool = False

    Config = ModelConfig
