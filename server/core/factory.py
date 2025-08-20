# core/factory.py

from starlette.applications import Starlette
from starlette.routing import Route
from diffusers import AutoModel, DiffusionPipeline

from config import (
    MODEL_ID, LORA_PATH, TORCH_DTYPE, QUANT_CONFIG
)
from routes import health_check, generate, fetch_image


def create_app():
    app = Starlette(debug=True, routes=[
        Route("/healthz", health_check),
        Route("/generate", generate, methods=["POST"]),
        Route("/image/{uid}", fetch_image, methods=["GET"]),
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
