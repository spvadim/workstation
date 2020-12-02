from fastapi import FastAPI
from fastapi_versioning import VersionedFastAPI
from .routers import production_batches, packs, multipacks, cubes, system_status, cameras
from .db.db_utils import create_status_if_not_exists, create_qr_list_if_not_exists


from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(docs_url="/docs", redoc_url=None, openapi_url="/openapi.json")


app.include_router(production_batches.router, tags=['batches_frontend'])
app.include_router(packs.router, tags=['packs_frontend'])
app.include_router(multipacks.router, tags=['multipacks_frontend'])
app.include_router(cubes.router, tags=['cubes_frontend'])
app.include_router(system_status.router, tags=['state_and_mode'])
app.include_router(cameras.router, tags=['camera'])


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
    await create_status_if_not_exists()
    await create_qr_list_if_not_exists()
