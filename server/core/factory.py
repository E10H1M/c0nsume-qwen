# core/factory.py

from starlette.applications import Starlette
from starlette.routing import Route
from config import MODEL_ID, AVAILABLE_MODELS
from routes import health_check
from routes.generate import generate_image, generate_edit
from routes.images import fetch_image, upload_image, fetch_upload
from services.models import build_pipe

def create_app():
    app = Starlette(debug=True, routes=[
        Route("/healthz", health_check),
        Route("/generate/image", generate_image, methods=["POST"]),
        Route("/generate/edit", generate_edit, methods=["POST"]),
        Route("/image/{uid}", fetch_image, methods=["GET"]),
        Route("/image/upload", upload_image, methods=["POST"]),
        Route("/upload/{uid}", fetch_upload, methods=["GET"]),
    ])

    @app.on_event("startup")
    async def _startup():
        app.state.pipe = build_pipe(MODEL_ID)
        app.state.active_key = next((k for k, v in AVAILABLE_MODELS.items() if v == MODEL_ID), None)

    return app
