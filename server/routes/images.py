# routes/images.py

import os
import uuid
from starlette.responses import JSONResponse, FileResponse
from config import OUTPUT_DIR, UPLOADS_DIR


async def fetch_image(request):
    uid = request.path_params["uid"]
    filepath = os.path.join(OUTPUT_DIR, f"{uid}.png")
    if not os.path.exists(filepath):
        return JSONResponse({"error": "not found"}, status_code=404)
    return FileResponse(filepath)


async def fetch_upload(request):
    """
    Fetch an uploaded image by UID from UPLOADS_DIR.
    """
    uid = request.path_params["uid"]
    filepath = os.path.join(UPLOADS_DIR, f"{uid}.png")
    if not os.path.exists(filepath):
        return JSONResponse({"error": "not found"}, status_code=404)
    return FileResponse(filepath)


async def upload_image(request):
    """
    Handle image uploads. Accepts multipart/form-data with a file field.
    Stores the image in UPLOADS_DIR and returns a UID.
    """
    form = await request.form()
    if "file" not in form:
        return JSONResponse({"error": "Missing 'file' in upload"}, status_code=400)

    file = form["file"]
    uid = str(uuid.uuid4())
    filepath = os.path.join(UPLOADS_DIR, f"{uid}.png")

    # Save file to disk
    with open(filepath, "wb") as f:
        f.write(await file.read())

    return JSONResponse({
        "id": uid,
        "message": "Image uploaded successfully"
    })
