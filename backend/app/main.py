from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_versioning import VersionedFastAPI

from .db.db_utils import (create_status_if_not_exists,
                          create_system_settings_if_not_exists)
from .logger import init_logging
from .routers import (cameras, cubes, multipacks, packs, production_batches,
                      system_settings, system_status)

app = FastAPI(docs_url="/docs", redoc_url=None, openapi_url="/openapi.json",
              debug=True)
app.include_router(production_batches.router, tags=['batches_frontend'])
app.include_router(packs.router, tags=['packs_frontend'])
app.include_router(multipacks.router, tags=['multipacks_frontend'])
app.include_router(cubes.router, tags=['cubes_frontend'])
app.include_router(system_status.router, tags=['state_and_mode'])
app.include_router(cameras.router, tags=['camera'])
app.include_router(system_settings.router, tags=['system_settings'])

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
