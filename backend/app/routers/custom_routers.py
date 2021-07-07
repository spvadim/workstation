import asyncio
from typing import Callable

import orjson
from fastapi import Request, Response
from fastapi.routing import APIRoute
from loguru import logger

from ..db.db_utils import get_cubes_queue, get_multipacks_queue, get_packs_queue

deep_logger = logger.bind(name="deep")
light_logger = logger.bind(name="light")


async def retrieve_queues():
    tasks = []
    tasks.append(get_packs_queue())
    tasks.append(get_multipacks_queue())
    tasks.append(get_cubes_queue())

    result = await asyncio.gather(*tasks)
    return result


async def log_queues():
    packs_queue, multipacks_queue, cubes_queue = await retrieve_queues()

    deep_logger.info(f"\t Packs in queue: {len(packs_queue)}")
    for pack in packs_queue:
        deep_logger.info(f"\t \t Pack: {pack.json()}")

    deep_logger.info(f"\t Multipacks in queue: {len(multipacks_queue)}")
    for multipack in multipacks_queue:
        deep_logger.info(f"\t \t Multipack: {multipack.json()}")

    deep_logger.info(f"\t Cubes in queue: {len(cubes_queue)}")
    if cubes_queue:
        deep_logger.info(f"\t \t Last cube: {cubes_queue[-1].json()}")

    await deep_logger.complete()


class DeepLoggerRoute(APIRoute):
    def get_route_handler(self) -> Callable:
        original_route_handler = super().get_route_handler()

        async def custom_route_handler(request: Request) -> Response:

            deep_logger.info(
                f"{request.method} {request.url}; client: {request.client.host}"
            )
            body = await request.body()
            if body:
                body = await request.json()
            if body:
                deep_logger.info(f"request_body: {body}")
            deep_logger.info("Params:")
            for name, value in request.path_params.items():
                deep_logger.info(f"\t{name}: {value}")

            response: Response = await original_route_handler(request)
            deep_logger.info(
                f"Response {response.status_code}: {orjson.loads(response.body)}"
            )

            deep_logger.info("After request: ")
            await log_queues()
            return response

        return custom_route_handler


class LightLoggerRoute(APIRoute):
    def get_route_handler(self) -> Callable:
        original_route_handler = super().get_route_handler()

        async def custom_route_handler(request: Request) -> Response:

            light_logger.info(
                f"{request.method} {request.url}; client: {request.client.host}"
            )

            response: Response = await original_route_handler(request)
            return response

        return custom_route_handler
