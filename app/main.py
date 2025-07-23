from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from .routers import streaming, pages

app = FastAPI(title="FastAPI Streaming Hands-on")

app.mount("/static", StaticFiles(directory="static", html=True), name="static")

# テンプレートの設定
templates = Jinja2Templates(directory="templates")

# ルーターの追加
app.include_router(streaming.router, prefix="/api")
app.include_router(pages.router)

@app.get("/")
async def root():
    return {"message": "FastAPI Streaming API", "docs": "/docs"}
