from fastapi import FastAPI
from odmantic import AIOEngine
import uvicorn


app = FastAPI(docs_url="/api/docs", redoc_url=None, openapi_url="/api/openapi.json")

engine = AIOEngine()


@app.get('/api/ping')
async def read_ping():
    return {'ping': 'pong'}


if __name__ == "__main__":
    uvicorn.run("main:app", port=8000, reload=True)