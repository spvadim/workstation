from typing import List

from odmantic import Model


class PackingTableRecordInput(Model):
    multipacks_amount: int


class PackingTableRecord(Model):
    multipacks_amount: int
    recorded_at: str


class PackingTableRecords(Model):
    multipacks_amount: int
    records: List[PackingTableRecord]
