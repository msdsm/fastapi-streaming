# FastAPI Streaming Tutorial

A simple demo project to learn FastAPI streaming functionality.

## Learning Topics

This project covers 3 streaming techniques:

### 1. Basic Streaming
- Basic data delivery using `StreamingResponse`
- Real-time text data transmission

### 2. JSON Streaming
- Efficient delivery of large datasets
- Sequential processing on the frontend

### 3. Server-Sent Events (SSE)
- Real-time communication
- Persistent connection between browser and server
- ChatGPT-style typing effects

## Quick Start

```bash
# Install dependencies
uv sync

# Start server
uv run uvicorn main:app --reload
```

## Demo Pages

After starting the server, visit these URLs:

- **SSE Test**: http://localhost:8000/test-sse
- **JSON Streaming**: http://localhost:8000/test-json  
- **LLM-like Streaming**: http://localhost:8000/test-llm
- **API Documentation**: http://localhost:8000/docs

## Key Learning Points

### StreamingResponse Basics
```python
@app.get("/stream-basic")
async def stream_basic():
    return StreamingResponse(generate_data(), media_type="text/plain")
```

### Server-Sent Events
```python
@app.get("/stream-sse")
async def stream_sse():
    return StreamingResponse(
        generate_sse_data(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache"}
    )
```

### Frontend Implementation
```javascript
const eventSource = new EventSource('/stream-sse');
eventSource.onmessage = function(event) {
    const data = JSON.parse(event.data);
    // Process data
};
```