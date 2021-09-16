import os

import snap7
from celery import Celery

app = Celery("celery_app")
app.conf.broker_url = os.environ.get("CELERY_BROKER_URL", "redis://localhost:6379")
app.conf.result_backend = os.environ.get(
    "CELERY_RESULT_BACKEND", "redis://localhost:6379"
)


@app.task(
    name="read_bytes",
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 5},
    retry_backoff=True,
    retry_backoff_max=3,
    retry_jitter=False,
)
def read_bytes(params: dict, settings: dict):

    plc = snap7.client.Client()
    ip = settings["pintset_ip"]["value"]
    rack = settings["pintset_rack"]["value"]
    slot = settings["pintset_slot"]["value"]
    plc.connect(ip, rack, slot)

    db_name = params["db_name"]
    starting_byte = params["starting_byte"]
    length = params["length"]

    reading = plc.db_read(db_name, starting_byte, length)

    plc.disconnect()
    plc.destroy()

    return reading.decode()


@app.task(
    name="write_bytes",
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 5},
    retry_backoff=True,
    retry_backoff_max=3,
    retry_jitter=False,
)
def write_bytes(params: dict, settings: dict):

    plc = snap7.client.Client()
    ip = settings["pintset_ip"]["value"]
    rack = settings["pintset_rack"]["value"]
    slot = settings["pintset_slot"]["value"]
    plc.connect(ip, rack, slot)

    db_name = params["db_name"]
    starting_byte = params["starting_byte"]
    reading = bytearray(params["reading"], encode="utf-8")

    plc.db_write(db_name, starting_byte, reading)

    plc.disconnect()
    plc.destroy()

    return "OK"
