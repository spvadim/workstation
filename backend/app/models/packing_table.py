from odmantic import Model


class PackingTableRecordInput(Model):
    packs_amount: int


class PackingTableRecord(Model):
    packs_amount: int
    recorded_at: str

