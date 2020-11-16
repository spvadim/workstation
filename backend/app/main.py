from fastapi import FastAPI
from fastapi_versioning import VersionedFastAPI
from .routers import production_batches

app = FastAPI(docs_url="/docs", redoc_url=None, openapi_url="/openapi.json")

app.include_router(production_batches.router)


app = VersionedFastAPI(app, prefix_format='api/v{major}_{minor}')
