from datetime import datetime
from typing import List

from odmantic import Model
from pydantic import BaseModel

from .model_config import ModelConfig


class PackingTableRecordInput(BaseModel):
    multipacks_amount: int

    Config = ModelConfig


class PackingTableRecord(Model):
    multipacks_amount: int
    recorded_at: datetime

    Config = ModelConfig


class PackingTableRecords(BaseModel):
    multipacks_amount: int
    records: List[PackingTableRecord]

    Config = ModelConfig
