from datetime import datetime
from typing import List

from odmantic import Model
from pydantic import BaseModel

from .model_config import ModelConfig


class PintsetRecordInput(BaseModel):
    packs_amount: int

    Config = ModelConfig


class PintsetRecord(Model):
    packs_amount: int
    recorded_at: datetime

    Config = ModelConfig


class PintsetRecords(BaseModel):
    packs_amount: int
    records: List[PintsetRecord]

    Config = ModelConfig
