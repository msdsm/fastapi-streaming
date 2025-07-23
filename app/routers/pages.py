from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

router = APIRouter()
templates = Jinja2Templates(directory="templates")

@router.get("/test-sse", response_class=HTMLResponse)
async def test_sse(request: Request):
    return templates.TemplateResponse("sse_test.html", {"request": request})

@router.get("/test-json", response_class=HTMLResponse)
async def test_json(request: Request):
    return templates.TemplateResponse("json_test.html", {"request": request})

@router.get("/test-llm", response_class=HTMLResponse)
async def test_llm(request: Request):
    return templates.TemplateResponse("llm_test.html", {"request": request})
