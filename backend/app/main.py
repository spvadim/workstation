from fastapi import FastAPI
from fastapi_versioning import VersionedFastAPI
from .routers import production_batches, packs, multipacks, workmode
from .db.db_utils import create_mode_if_not_exists, create_qr_list_if_not_exists

from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(docs_url="/docs", redoc_url=None, openapi_url="/openapi.json")

app.include_router(production_batches.router)
app.include_router(packs.router)
app.include_router(multipacks.router)
app.include_router(workmode.router)

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
    await create_mode_if_not_exists()
    await create_qr_list_if_not_exists()
