# routes/generate.py

import os
from starlette.responses import JSONResponse
from services.storage import persist_image
from services.inference import run_inference
from config import ASPECT_RATIOS

async def generate(request):
    data = await request.json()
    try:
        image = run_inference(
            pipe=request.app.state.pipe,
            prompt=data.get("prompt", "No prompt provided"),
            negative_prompt=data.get("negative_prompt", ""),
            seed=int(data.get("seed", 42)),
            aspect_ratio=str(data.get("aspect_ratio", "1:1")).strip(),
            cfg=float(data.get("cfg", 1.0)),
        )
        uid, _ = persist_image(image)
    except ValueError as e:
        return JSONResponse({"error": str(e), "allowed": list(ASPECT_RATIOS.keys())}, status_code=400)
    except Exception as e:
        return JSONResponse({"error": f"inference failed: {e}"}, status_code=500)

    return JSONResponse({
        "id": uid,
        "message": f"Generated image for prompt: {data.get('prompt', '')}"
    })
