# # routes/images.py

from starlette.responses import JSONResponse, FileResponse, RedirectResponse
from services import storage

def _maybe_inline(url: str) -> str:
    # rust-buck3t defaults to attachment; force inline so browsers display it
    return url + ("&download=0" if "?" in url else "?download=0")

async def fetch_image(request):
    uid = request.path_params["uid"]
    path_or_url = storage.fetch_output_path(uid)
    if not path_or_url:
        return JSONResponse({"error": "not found"}, status_code=404)

    # If buck3t mode, storage returns an http(s) URL → send from the bucket
    if path_or_url.startswith("http://") or path_or_url.startswith("https://"):
        return RedirectResponse(_maybe_inline(path_or_url), status_code=307)

    # Local mode: serve file from disk
    return FileResponse(path_or_url)

async def fetch_upload(request):
    uid = request.path_params["uid"]
    path_or_url = storage.fetch_upload_path(uid)
    if not path_or_url:
        return JSONResponse({"error": "not found"}, status_code=404)

    if path_or_url.startswith("http://") or path_or_url.startswith("https://"):
        return RedirectResponse(_maybe_inline(path_or_url), status_code=307)

    return FileResponse(path_or_url)

async def upload_image(request):
    form = await request.form()
    if "file" not in form:
        return JSONResponse({"error": "Missing 'file' in upload"}, status_code=400)
    file = form["file"]
    uid, _ = storage.save_upload_bytes(await file.read())
    return JSONResponse({"id": uid, "message": "Image uploaded successfully"})
