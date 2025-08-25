import os, uuid
from config import OUTPUT_DIR, UPLOADS_DIR
from PIL import Image

def _make_path(base_dir: str, uid: str) -> str:
    return os.path.join(base_dir, f"{uid}.png")

# --- Output (generated images) ---

def persist_output_image(image: Image.Image):
    """Save a generated image into OUTPUT_DIR and return its uid + path."""
    uid = uuid.uuid4().hex
    filepath = _make_path(OUTPUT_DIR, uid)
    image.save(filepath)
    return uid, filepath

def fetch_output_path(uid: str):
    """Return path of a generated image if it exists, else None."""
    filepath = _make_path(OUTPUT_DIR, uid)
    return filepath if os.path.exists(filepath) else None

# --- Uploads (user uploads) ---

def save_upload_bytes(data: bytes):
    """Save uploaded raw bytes into UPLOADS_DIR and return uid + path."""
    uid = uuid.uuid4().hex
    filepath = _make_path(UPLOADS_DIR, uid)
    with open(filepath, "wb") as f:
        f.write(data)
    return uid, filepath

def fetch_upload_path(uid: str):
    """Return path of an uploaded image if it exists, else None."""
    filepath = _make_path(UPLOADS_DIR, uid)
    return filepath if os.path.exists(filepath) else None

def load_upload_image(uid: str):
    """Open an uploaded image as PIL.Image, or None if missing."""
    filepath = fetch_upload_path(uid)
    if not filepath:
        return None
    with Image.open(filepath) as im:
        return im.convert("RGB")
