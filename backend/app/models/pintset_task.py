from typing import List, Optional, Union

from pydantic import BaseModel


class ReadBytesInput(BaseModel):
    db_name: int
    starting_byte: int
    length: int


class WriteBytesInput(BaseModel):
    db_name: int
    starting_byte: int
    reading: List[int]


class PintsetTask(BaseModel):
    task_id: str
    task_status: str
    task_result: Optional[Union[List[int], str]]
