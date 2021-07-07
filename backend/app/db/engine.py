import os

from motor.motor_asyncio import AsyncIOMotorClient
from odmantic import AIOEngine
from pymongo import MongoClient

from ..models.cube import Cube
from ..models.event import Event
from ..models.multipack import Multipack
from ..models.pack import Pack

username = os.environ["DB_USER"]
password = os.environ["DB_PASSWORD"]
db = os.environ["DB_NAME"]

uri = f"mongodb://{username}:{password}@mongo:27017/{db}"
client = AsyncIOMotorClient(uri)
engine = AIOEngine(motor_client=client, database=db)

pymongo_client = MongoClient(uri)
pymongo_db = pymongo_client[db]


async def models_startup():
    await engine.get_collection(Pack).create_index("qr")
    await engine.get_collection(Pack).create_index(
        "in_queue", partialFilterExpression={"in_queue": True}
    )
    await engine.get_collection(Pack).create_index("created_at")
    await engine.get_collection(Multipack).create_index("status")
    await engine.get_collection(Multipack).create_index("qr")
    await engine.get_collection(Multipack).create_index("created_at")
    await engine.get_collection(Cube).create_index("batch_number")
    await engine.get_collection(Cube).create_index("qr")
    await engine.get_collection(Cube).create_index("created_at")
    await engine.get_collection(Event).create_index("event_type")
    await engine.get_collection(Event).create_index(
        "processed", partialFilterExpression={"processed": False}
    )
    await engine.get_collection(Event).create_index("time")
