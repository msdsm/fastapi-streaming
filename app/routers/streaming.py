import asyncio
import json
import time
from typing import Generator

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

router = APIRouter()

# Basic streaming
def generate_data():
    for i in range(10):
        time.sleep(1)
        yield f"Data {i + 1}: {time.strftime('%Y-%m-%d %H:%M:%S')}\n"

@router.get("/stream-basic")
async def stream_basic():
    return StreamingResponse(generate_data(), media_type="text/plain")

# JSON streaming
def generate_json_data() -> Generator[str, None, None]:
    for i in range(5):
        data = {
            "id": i + 1,
            "message": f"Message {i + 1}",
            "timestamp": time.time()
        }
        time.sleep(0.5)
        yield f"{json.dumps(data)}\n"

@router.get("/stream-json")
async def stream_json():
    return StreamingResponse(generate_json_data(), media_type="application/json")

# SSE
async def generate_sse_data():
    count = 0
    while count < 20:
        data = {
            "count": count,
            "message": f"Real-time message {count}",
            "timestamp": time.strftime('%H:%M:%S')
        }
        yield f"data: {json.dumps(data)}\n\n"
        count += 1
        await asyncio.sleep(1)

@router.get("/stream-sse")
async def stream_sse():
    return StreamingResponse(
        generate_sse_data(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"}
    )

# LLM-like streaming
async def generate_llm_like_response(prompt: str):
    # Simulate LLM-like responses
    responses = {
        "FastAPI": """FastAPI is a high-performance web framework for building APIs with Python.

Key Features:
• High Speed: Very high performance (comparable to NodeJS and Go)
• Easy to Use: Intuitive and easy-to-learn design
• Automatic Documentation: Auto-generates Swagger UI and ReDoc
• Type Hints: Leverages Python type hints for better development experience
• Async Support: Built-in support for async/await

With FastAPI, you can efficiently develop high-quality APIs.""",
        
        "Python": """Python is a programming language with simple and readable syntax.

Features:
• Easy-to-learn syntax
• Rich library ecosystem
• Cross-platform support
• Open source
• Versatile applications (Web development, Data Science, AI/ML, automation, etc.)

Python is beginner-friendly while providing powerful capabilities.""",
        
        "default": f"""Let me explain about "{prompt}".

This is a detailed explanation about {prompt}. I'll cover various aspects.

Key Points:
• Basic concepts and definitions
• Practical use cases
• Advantages and disadvantages
• Comparison with related technologies

{prompt} plays an important role in modern technology."""
    }
    
    response_text = responses.get(prompt, responses["default"])
    
    # Stream character by character
    accumulated_text = ""
    for i, char in enumerate(response_text):
        accumulated_text += char
        data = {
            "content": accumulated_text,
            "complete": False,
            "chunk_index": i
        }
        yield f"data: {json.dumps(data, ensure_ascii=False)}\n\n"
        await asyncio.sleep(0.05)  # 50ms delay for character display
    
    # Completion notification
    final_data = {
        "content": accumulated_text,
        "complete": True,
        "chunk_index": len(response_text)
    }
    yield f"data: {json.dumps(final_data, ensure_ascii=False)}\n\n"

@router.get("/stream-llm-like")
async def stream_llm_like(prompt: str = "FastAPI"):
    return StreamingResponse(
        generate_llm_like_response(prompt),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"}
    )
