# routes/generate.py

from starlette.responses import JSONResponse
from services.storage import persist_output_image, load_upload_image
from services.inference import run_inference_image, run_inference_edit
from services.models import ensure_mode
from config import ASPECT_RATIOS

async def generate_image(request):
    data = await request.json()
    try:
        ensure_mode(request.app, "image")
        image = run_inference_image(
            pipe=request.app.state.pipe,
            prompt=data.get("prompt", "No prompt provided"),
            negative_prompt=data.get("negative_prompt", ""),
            seed=int(data.get("seed", 42)),
            aspect_ratio=str(data.get("aspect_ratio", "1:1")).strip(),
            cfg=float(data.get("cfg", 1.0)),
            steps=int(data.get("steps", 4)),
        )
        uid, _ = persist_output_image(image)
    except ValueError as e:
        return JSONResponse({"error": str(e), "allowed": list(ASPECT_RATIOS.keys())}, status_code=400)
    except Exception as e:
        return JSONResponse({"error": f"inference failed: {e}"}, status_code=500)

    return JSONResponse({
        "id": uid,
        "message": f"Generated image for prompt: {data.get('prompt', '')}"
    })


async def generate_edit(request):
    data = await request.json()
    try:
        if "input_id" not in data:
            return JSONResponse({"error": "Missing required field: input_id"}, status_code=400)

        input_image = load_upload_image(data["input_id"])
        if not input_image:
            return JSONResponse({"error": "Input image not found"}, status_code=404)

        ensure_mode(request.app, "edit")
        image = run_inference_edit(
            pipe=request.app.state.pipe,
            prompt=data.get("prompt", "No prompt provided"),
            seed=int(data.get("seed", 42)),
            input_image=input_image,
            steps=int(data.get("steps", 4)),
        )
        uid, _ = persist_output_image(image)

    except Exception as e:
        return JSONResponse({"error": f"inference failed: {e}"}, status_code=500)

    return JSONResponse({
        "id": uid,
        "message": f"Edited image for prompt: {data.get('prompt', '')}"
    })
