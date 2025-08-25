# routes/images.py

from starlette.responses import JSONResponse, FileResponse
from services import storage

async def fetch_image(request):
    uid = request.path_params["uid"]
    filepath = storage.fetch_output_path(uid)
    if not filepath:
        return JSONResponse({"error": "not found"}, status_code=404)
    return FileResponse(filepath)

async def fetch_upload(request):
    uid = request.path_params["uid"]
    filepath = storage.fetch_upload_path(uid)
    if not filepath:
        return JSONResponse({"error": "not found"}, status_code=404)
    return FileResponse(filepath)

async def upload_image(request):
    form = await request.form()
    if "file" not in form:
        return JSONResponse({"error": "Missing 'file' in upload"}, status_code=400)

    file = form["file"]
    uid, _ = storage.save_upload_bytes(await file.read())
    return JSONResponse({"id": uid, "message": "Image uploaded successfully"})
