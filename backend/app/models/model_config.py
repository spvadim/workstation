from datetime import datetime

import orjson
from odmantic.bson import BSON_TYPES_ENCODERS


def orjson_dumps(v, *, default):
    # orjson.dumps returns bytes, we need to decode
    return orjson.dumps(v, default=default).decode()


class ModelConfig:
    json_encoders = {
        **BSON_TYPES_ENCODERS, datetime: lambda v: v.strftime("%d.%m.%Y %H:%M")
    }
    json_loads = orjson.loads
    json_dumps = orjson_dumps
