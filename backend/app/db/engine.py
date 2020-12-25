import os

from motor.motor_asyncio import AsyncIOMotorClient

from odmantic import AIOEngine

username = os.environ['DB_USER']
password = os.environ['DB_PASSWORD']
db = os.environ['DB_NAME']

client = AsyncIOMotorClient(
    f"mongodb://{username}:{password}@mongo:27017/{db}")
engine = AIOEngine(motor_client=client, database=db)
