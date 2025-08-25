# services/storage.py
from __future__ import annotations

import io
import logging
import os
import uuid
from typing import Optional, Tuple

from PIL import Image

from config import (
    OUTPUT_DIR,
    UPLOADS_DIR,
    STORAGE_BACKEND,
    BUCK3T_BASE,
)

logger = logging.getLogger(__name__)

# ---------- helpers ----------

def _make_path(base_dir: str, uid: str) -> str:
    return os.path.join(base_dir, f"{uid}.png")

def _ensure_dir(path: str):
    os.makedirs(os.path.dirname(path), exist_ok=True)

def _safe_join_url(base: str, *parts: str) -> str:
    base = base.rstrip("/")
    tail = "/".join(p.strip("/") for p in parts if p is not None and p != "")
    return f"{base}/{tail}" if tail else base

def _normalize_base_url(url: Optional[str]) -> str:
    if not url:
        raise ValueError("BUCK3T_BASE is required for bucket mode.")
    u = url.strip()
    if not (u.startswith("http://") or u.startswith("https://")):
        u = "http://" + u
    return u.rstrip("/")

# ---------- backend interface ----------

class StorageBackend:
    # Output (generated images)
    def persist_output_image(self, image: Image.Image) -> Tuple[str, str]:
        raise NotImplementedError

    def fetch_output_path(self, uid: str) -> Optional[str]:
        raise NotImplementedError

    # Uploads (user uploads)
    def save_upload_bytes(self, data: bytes) -> Tuple[str, str]:
        raise NotImplementedError

    def fetch_upload_path(self, uid: str) -> Optional[str]:
        raise NotImplementedError

    def load_upload_image(self, uid: str) -> Optional[Image.Image]:
        # default impl assumes filesystem path
        path = self.fetch_upload_path(uid)
        if not path:
            return None
        with Image.open(path) as im:
            return im.convert("RGB")

# ---------- local filesystem backend (FS-only) ----------

class LocalStorageBackend(StorageBackend):
    def persist_output_image(self, image: Image.Image) -> Tuple[str, str]:
        uid = uuid.uuid4().hex
        path = _make_path(OUTPUT_DIR, uid)
        _ensure_dir(path)
        image.save(path)
        return uid, path

    def fetch_output_path(self, uid: str) -> Optional[str]:
        path = _make_path(OUTPUT_DIR, uid)
        return path if os.path.exists(path) else None

    def save_upload_bytes(self, data: bytes) -> Tuple[str, str]:
        uid = uuid.uuid4().hex
        path = _make_path(UPLOADS_DIR, uid)
        _ensure_dir(path)
        with open(path, "wb") as f:
            f.write(data)
        return uid, path

    def fetch_upload_path(self, uid: str) -> Optional[str]:
        path = _make_path(UPLOADS_DIR, uid)
        return path if os.path.exists(path) else None

# ---------- buck3t backend (remote-only; no local writes) ----------

class Buck3tStorageBackend(StorageBackend):
    """
    STRICT remote-only behavior:
      - No local writes, ever.
      - persist_* returns (uid, remote_url); raises on PUT failure if strict.
      - fetch_* returns remote_url if HEAD==200, else None.
      - load_upload_image streams from remote into memory (no disk).
    """
    def __init__(self, base_url: str, timeout: float = 10.0):
        try:
            import requests  # ensure available
        except Exception as e:
            raise RuntimeError("buck3t mode requires 'requests' installed") from e
        self.base_url = _normalize_base_url(base_url)
        self.timeout = timeout
        # hard-fail on PUT/GET errors when True
        self.strict = True  # per your request: fail instead of falling back

    # key helpers
    @staticmethod
    def _output_key(uid: str) -> str:
        return f"output/{uid}.png"

    @staticmethod
    def _upload_key(uid: str) -> str:
        return f"uploads/{uid}.png"

    def _objects_url(self, key: str) -> str:
        # Always use /objects
        if self.base_url.endswith("/objects"):
            return _safe_join_url(self.base_url, key)
        return _safe_join_url(self.base_url, "objects", key)

    # --- HTTP helpers ---
    def _put_bytes(self, key: str, data: bytes, content_type: str) -> None:
        import requests
        url = self._objects_url(key)
        resp = requests.put(url, data=data, headers={"Content-Type": content_type}, timeout=self.timeout)
        if resp.status_code // 100 != 2:
            msg = f"buck3t PUT failed: {url} ({resp.status_code}) {resp.text[:200]}"
            logger.error(msg)
            raise RuntimeError(msg)

    def _head_exists(self, key: str) -> bool:
        import requests
        url = self._objects_url(key)
        resp = requests.head(url, timeout=self.timeout)
        if resp.status_code == 200:
            return True
        if resp.status_code == 404:
            return False
        logger.warning("buck3t HEAD unexpected: %s (%d) %s", url, resp.status_code, getattr(resp, "text", "")[:200])
        return False

    def _get_bytes(self, key: str) -> bytes:
        import requests
        url = self._objects_url(key)
        resp = requests.get(url, stream=True, timeout=self.timeout)
        if resp.status_code // 100 != 2:
            msg = f"buck3t GET failed: {url} ({resp.status_code})"
            logger.error(msg)
            raise RuntimeError(msg)
        return resp.content

    # --- Output (generated) ---
    def persist_output_image(self, image: Image.Image) -> Tuple[str, str]:
        uid = uuid.uuid4().hex
        buf = io.BytesIO()
        image.save(buf, format="PNG")
        self._put_bytes(self._output_key(uid), buf.getvalue(), content_type="image/png")
        return uid, self._objects_url(self._output_key(uid))

    def fetch_output_path(self, uid: str) -> Optional[str]:
        key = self._output_key(uid)
        return self._objects_url(key) if self._head_exists(key) else None

    # --- Uploads (user-provided) ---
    def save_upload_bytes(self, data: bytes) -> Tuple[str, str]:
        uid = uuid.uuid4().hex
        self._put_bytes(self._upload_key(uid), data, content_type="application/octet-stream")
        return uid, self._objects_url(self._upload_key(uid))

    def fetch_upload_path(self, uid: str) -> Optional[str]:
        key = self._upload_key(uid)
        return self._objects_url(key) if self._head_exists(key) else None

    # --- Image loader from remote (no disk) ---
    def load_upload_image(self, uid: str) -> Optional[Image.Image]:
        key = self._upload_key(uid)
        if not self._head_exists(key):
            return None
        raw = self._get_bytes(key)
        with Image.open(io.BytesIO(raw)) as im:
            return im.convert("RGB")

# ---------- select active backend ----------

def _select_backend() -> StorageBackend:
    mode = (STORAGE_BACKEND or "local").strip().lower()
    if mode == "local":
        return LocalStorageBackend()
    if mode in ("buck3t", "bucket"):
        return Buck3tStorageBackend(BUCK3T_BASE)
    raise ValueError(f"Unknown STORAGE_BACKEND '{STORAGE_BACKEND}'. Use 'local' or 'buck3t'.")

_BACKEND: StorageBackend = _select_backend()

# ---------- public API (unchanged signatures) ----------

def persist_output_image(image: Image.Image):
    return _BACKEND.persist_output_image(image)

def fetch_output_path(uid: str):
    return _BACKEND.fetch_output_path(uid)

def save_upload_bytes(data: bytes):
    return _BACKEND.save_upload_bytes(data)

def fetch_upload_path(uid: str):
    return _BACKEND.fetch_upload_path(uid)

def load_upload_image(uid: str):
    return _BACKEND.load_upload_image(uid)
