from typing import List
from odmantic import Model


class QrList(Model):
    list: List[str] = []

