# core/factory.py

from starlette.applications import Starlette
from starlette.routing import Route
from diffusers import AutoModel, DiffusionPipeline

from config import (
    MODEL_ID, LORA_PATH, TORCH_DTYPE, QUANT_CONFIG
)
from routes import health_check
from routes.generate import generate_image, generate_edit
from routes.images import fetch_image, upload_image, fetch_upload


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
        transformer = AutoModel.from_pretrained(
            MODEL_ID,
            subfolder="transformer",
            quantization_config=QUANT_CONFIG,
            torch_dtype=TORCH_DTYPE,
        )
        pipe = DiffusionPipeline.from_pretrained(
            MODEL_ID,
            transformer=transformer,
            torch_dtype=TORCH_DTYPE,
        )
        pipe.load_lora_weights(LORA_PATH)
        pipe.enable_model_cpu_offload()
        app.state.pipe = pipe

    return app
