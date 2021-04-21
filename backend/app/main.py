from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_versioning import VersionedFastAPI

from .db.engine import models_startup
from .db.db_utils import create_status_if_not_exists
from .db.system_settings import create_system_settings_if_not_exists
from .logger import init_logging
from .routers import (cameras, cubes, multipacks, packs, production_batches,
                      system_settings, system_status, events)

app = FastAPI(docs_url="/docs",
              redoc_url=None,
              openapi_url="/openapi.json",
              debug=True)
app.include_router(production_batches.deep_logger_router,
                   tags=['batches_frontend'])
app.include_router(production_batches.light_logger_router,
                   tags=['batches_frontend'])
app.include_router(packs.deep_logger_router, tags=['packs_frontend'])
app.include_router(packs.light_logger_router, tags=['packs_frontend'])
app.include_router(multipacks.deep_logger_router, tags=['multipacks_frontend'])
app.include_router(multipacks.light_logger_router,
                   tags=['multipacks_frontend'])
app.include_router(cubes.deep_logger_router, tags=['cubes_frontend'])
app.include_router(cubes.light_logger_router, tags=['cubes_frontend'])
app.include_router(system_status.deep_logger_router, tags=['state_and_mode'])
app.include_router(system_status.light_logger_router, tags=['state_and_mode'])
app.include_router(cameras.deep_logger_router, tags=['camera'])
app.include_router(cameras.light_logger_router, tags=['camera'])
app.include_router(system_settings.deep_logger_router,
                   tags=['system_settings'])
app.include_router(system_settings.light_logger_router,
                   tags=['system_settings'])
app.include_router(events.deep_logger_router, tags=['events'])
app.include_router(events.light_logger_router, tags=['events'])

app = VersionedFastAPI(app, prefix_format='/api/v{major}_{minor}')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    init_logging()
    await create_status_if_not_exists()
    await create_system_settings_if_not_exists()
    await models_startup()
