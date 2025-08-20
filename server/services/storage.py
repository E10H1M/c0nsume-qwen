# services/storage.py
import os, uuid
from config import OUTPUT_DIR

def persist_image(image):
    """
    Save a PIL image and return (uid, filepath).
    Currently uses local filesystem as storage.
    """
    uid = uuid.uuid4().hex
    filename = f"{uid}.png"
    filepath = os.path.join(OUTPUT_DIR, filename)
    image.save(filepath)
    return uid, filepath
