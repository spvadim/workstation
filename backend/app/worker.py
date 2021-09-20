import os
import time
import snap7
from celery import Celery
from loguru import logger


app = Celery("celery_app")
app.conf.broker_url = os.environ.get("CELERY_BROKER_URL", "redis://localhost:6379")
app.conf.result_backend = os.environ.get(
    "CELERY_RESULT_BACKEND", "redis://localhost:6379"
)

if os.environ.get("PLC_CONNECT"):
    plc = snap7.client.Client()
    tcpport = 102

    if os.environ.get("SNAP7_SERVER", "real") == "fake":
        from multiprocessing import Process

        logger.info("start fake snap7 server")
        process = Process(target=snap7.server.mainloop)
        process.start()
        logger.info("wait for server start...")
        time.sleep(2)

        ip = "127.0.0.1"
        tcpport = 1102
        rack = 1
        slot = 1

    else:
        from .db.engine import pymongo_db as db

        system_settings = db.system_settings.find_one({})
        pintset_settings = system_settings["pintset_settings"]
        ip = pintset_settings["pintset_ip"]["value"]
        rack = pintset_settings["pintset_rack"]["value"]
        slot = pintset_settings["pintset_slot"]["value"]

    logger.info(f"ip: {ip}, rack: {rack}, slot: {slot}, tcpport: {tcpport}")
    logger.info("try to connect.....")
    plc.connect(ip, rack, slot, tcpport)
    logger.info("connected")


@app.task(name="read_bytes")
def read_bytes(params: dict):
    db_name = params["db_name"]
    starting_byte = params["starting_byte"]
    length = params["length"]

    try:
        reading = plc.db_read(db_name, starting_byte, length)
        return list(reading)

    except snap7.exceptions.Snap7Exception as e:
        plc.disconnect()
        plc.destroy()
        plc.connect(ip, rack, slot, tcpport)
        self.retry(countdown=0.001, exc=e, max_retries=1)


@app.task(name="write_bytes")
def write_bytes(params: dict):

    db_name = params["db_name"]
    starting_byte = params["starting_byte"]
    reading = bytearray(params["reading"])

    try:

        plc.db_write(db_name, starting_byte, reading)
        return "OK"

    except snap7.exceptions.Snap7Exception as e:
        plc.disconnect()
        plc.destroy()
        plc.connect(ip, rack, slot, tcpport)
        self.retry(countdown=0.001, exc=e, max_retries=1)
