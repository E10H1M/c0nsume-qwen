# config.py
import os
import torch
from diffusers import TorchAoConfig

# Model paths
MODEL_ID = "/path/to/Qwen/weights/Qwen-Image"
LORA_PATH = "/path/to/Qwen/Lora/weights/Qwen-Image-Lightning-4steps-V1.0.safetensors"

# Output directory (fake S3 bucket for now)
OUTPUT_DIR = "outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)

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
