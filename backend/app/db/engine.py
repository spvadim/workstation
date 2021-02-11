import os

from app.models.cube import Cube
from app.models.multipack import Multipack
from app.models.pack import Pack
from motor.motor_asyncio import AsyncIOMotorClient
from odmantic import AIOEngine

username = os.environ['DB_USER']
password = os.environ['DB_PASSWORD']
db = os.environ['DB_NAME']

client = AsyncIOMotorClient(
    f"mongodb://{username}:{password}@mongo:27017/{db}")
engine = AIOEngine(motor_client=client, database=db)


async def models_startup():
    await engine.get_collection(Pack).create_index('qr')
    await engine.get_collection(Pack).create_index(
        'in_queue', partialFilterExpression={'in_queue': True})
    await engine.get_collection(Pack).create_index('created_at')
    await engine.get_collection(Multipack).create_index('status')
    await engine.get_collection(Multipack).create_index('qr')
    await engine.get_collection(Multipack).create_index('created_at')
    await engine.get_collection(Cube).create_index('batch_number')
    await engine.get_collection(Cube).create_index('qr')
    await engine.get_collection(Cube).create_index('created_at')
