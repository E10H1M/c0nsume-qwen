# config.py
import os
import torch
from diffusers import TorchAoConfig

# Available models (named for clarity)
AVAILABLE_MODELS = {
    "image": "/path/to/Qwen/weights/Qwen-Image",
    "edit": "/path/to/Qwen/weights/Qwen-Image-Edit",
}

# Active model (default = image)
MODEL_ID = AVAILABLE_MODELS["edit"]

# Shared LoRA path (works for both)
LORA_PATH = "/path/to/Qwen-Lora/Qwen-Image-Lightning-4steps-V1.0.safetensors"

# Output directory (fake S3 bucket for now)
OUTPUT_DIR = "outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)

UPLOADS_DIR = "uploads"
os.makedirs(UPLOADS_DIR, exist_ok=True)

# Aspect ratios (width, height)
ASPECT_RATIOS = {
    "1:1": (1328, 1328),
    "16:9": (1664, 928),
    "9:16": (928, 1664),
    "4:3": (1472, 1140),
    "3:4": (1140, 1472),
    "3:2": (1584, 1056),
    "2:3": (1056, 1584),
}

# Torch / device settings
DEVICE = "cuda"
TORCH_DTYPE = torch.bfloat16
QUANT_CONFIG = TorchAoConfig("int8wo")


# --- Helpers for managing active model ---
def get_model_id() -> str:
    """Return the currently active model path."""
    return MODEL_ID


def set_model_id(name: str):
    """Update the active model by key ('image' or 'edit')."""
    global MODEL_ID
    if name not in AVAILABLE_MODELS:
        raise ValueError(f"Invalid model key '{name}'. Must be one of {list(AVAILABLE_MODELS.keys())}.")
    MODEL_ID = AVAILABLE_MODELS[name]
