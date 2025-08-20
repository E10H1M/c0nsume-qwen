# /services/inference.py


import torch
from config import ASPECT_RATIOS, DEVICE

def run_inference(pipe, prompt, negative_prompt, seed, aspect_ratio, cfg):
    """
    Run inference using the diffusion pipeline.
    Input: pipe + generation params
    Output: PIL image
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
        num_inference_steps=4,
        true_cfg_scale=cfg,
        generator=generator,
    ).images[0]

    return image
