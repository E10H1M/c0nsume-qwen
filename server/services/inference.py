# /services/inference.py

import torch
from config import ASPECT_RATIOS, DEVICE


def run_inference_image(pipe, prompt, negative_prompt, seed, aspect_ratio, cfg, steps=4):
    """
    Run inference for Qwen-Image (text-to-image).
    """
    if aspect_ratio not in ASPECT_RATIOS:
        raise ValueError(f"invalid aspect_ratio '{aspect_ratio}'")

    width, height = ASPECT_RATIOS[aspect_ratio]
    generator = torch.Generator(device=DEVICE).manual_seed(seed)

    image = pipe(
        prompt=prompt,
        negative_prompt=negative_prompt,
        width=width,
        height=height,
        num_inference_steps=steps,
        true_cfg_scale=cfg,
        generator=generator,
    ).images[0]

    return image


def run_inference_edit(pipe, prompt, seed, input_image, steps=4):
    """
    Run inference for Qwen-Image-Edit (image-to-image).
    """
    generator = torch.Generator(device=DEVICE).manual_seed(seed)

    image = pipe(
        image=input_image,
        prompt=prompt,
        num_inference_steps=steps,
        generator=generator,
    ).images[0]

    return image
