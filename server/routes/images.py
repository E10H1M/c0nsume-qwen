# routes/images.py

import os
from starlette.responses import JSONResponse, FileResponse
from config import OUTPUT_DIR

async def fetch_image(request):
    uid = request.path_params["uid"]
    filepath = os.path.join(OUTPUT_DIR, f"{uid}.png")
    if not os.path.exists(filepath):
        return JSONResponse({"error": "not found"}, status_code=404)
    return FileResponse(filepath)
