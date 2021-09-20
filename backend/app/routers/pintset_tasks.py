from celery.result import AsyncResult
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from fastapi_versioning import version

from ..models.pintset_task import PintsetTask, ReadBytesInput, WriteBytesInput
from ..worker import read_bytes, write_bytes
from .custom_routers import LightLoggerRoute

light_logger_router = APIRouter(route_class=LightLoggerRoute)


@light_logger_router.post("/pintset_tasks/read_bytes")
async def plc_read_bytes(params: ReadBytesInput):
    task = read_bytes.delay(params=params.dict())
    return JSONResponse({"task_id": task.id})


@light_logger_router.post("/pintset_tasks/write_bytes")
async def plc_write_bytes(params: WriteBytesInput):
    task = write_bytes.delay(params=params.dict())
    return JSONResponse({"task_id": task.id})


@light_logger_router.get("/pintset_tasks/{task_id}", response_model=PintsetTask)
async def get_status(task_id: str):
    task = AsyncResult(task_id)
    task_status = task.status
    task_result = task.result
    if task_status != "SUCCESS" and task_status != "PENDING":
        task_result = str(task_result)
    pintset_task = PintsetTask(
        task_id=task_id, task_status=task_status, task_result=task_result
    )

    return pintset_task
