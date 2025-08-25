# config.py
import os
import torch
from diffusers import TorchAoConfig
from dotenv import load_dotenv

# Load .env file so env vars are available
load_dotenv()

# if true, the user shouldn't be required to download the full transformers as the system should be bypassing them 
USE_GGUF = os.environ["USE_GGUF"]

# Available models (named for clarity)
AVAILABLE_MODELS = {
    "image": os.environ["QWEN_IMAGE_MODEL_DIR"],
    "edit": os.environ["QWEN_EDIT_MODEL_DIR"],
}


# Optional GGUF overrides
GGUF_MODELS = {
    "image": os.environ.get("QWEN_IMAGE_GGUF"),
    "edit": os.environ.get("QWEN_EDIT_GGUF"),
}


# Active model
MODE = os.environ["MODE"]  # required
MODEL_ID = AVAILABLE_MODELS[MODE]

# Shared LoRA path (works for both)
LORA_PATH = os.environ["QWEN_LORA_PATH"]

# Output directory (fake S3 bucket for now)
OUTPUT_DIR = os.environ["OUTPUT_DIR"]
os.makedirs(OUTPUT_DIR, exist_ok=True)

UPLOADS_DIR = os.environ["UPLOADS_DIR"]
os.makedirs(UPLOADS_DIR, exist_ok=True)


# --- Storage backend knobs (added) ---
STORAGE_BACKEND = os.environ["STORAGE_BACKEND"]
BUCK3T_BASE = os.environ.get("BUCK3T_BASE")

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
