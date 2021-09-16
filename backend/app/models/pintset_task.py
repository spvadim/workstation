from typing import Optional

from pydantic import BaseModel


class ReadBytesInput(BaseModel):
    db_name: int
    starting_byte: int
    length: int


class WriteBytesInput(BaseModel):
    db_name: int
    starting_byte: int
    reading: str


class PintsetTask(BaseModel):
    task_id: str
    task_status: str
    task_result: Optional[bytes]
