from typing import List

from odmantic import Model


class PackingTableRecordInput(Model):
    packs_amount: int


class PackingTableRecord(Model):
    packs_amount: int
    recorded_at: str


class PackingTableRecords(Model):
    multipacks_amount: int
    records: List[PackingTableRecord]
