# routes/health.py

from starlette.responses import PlainTextResponse

async def health_check(request):
    return PlainTextResponse("✅ Backend is up (Qwen Diffusion ready)")
