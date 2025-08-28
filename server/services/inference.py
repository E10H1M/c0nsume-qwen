# /services/inference.py
import torch
import pprint
from config import ASPECT_RATIOS, DEVICE


def _log_inference_call(name: str, kwargs: dict):
    """
    Utility to pretty-print inference call metadata.
    """
    print(f"[inference] {name} called with:")
    for k, v in kwargs.items():
        if isinstance(v, torch.Tensor):
            print(f"  {k}: Tensor(shape={tuple(v.shape)}, dtype={v.dtype}, device={v.device})")
        elif hasattr(v, "size") and hasattr(v, "mode"):  # crude check for PIL.Image
            print(f"  {k}: PIL.Image(size={v.size}, mode={v.mode})")
        else:
            try:
                # safe pretty format
                print(f"  {k}: {pprint.pformat(v)}")
            except Exception:
                print(f"  {k}: {type(v)}")


def run_inference_image(pipe, prompt, negative_prompt, seed, aspect_ratio, cfg, steps=4):
    """
    Run inference for Qwen-Image (text-to-image).
    """
    if aspect_ratio not in ASPECT_RATIOS:
        raise ValueError(f"invalid aspect_ratio '{aspect_ratio}'")

    width, height = ASPECT_RATIOS[aspect_ratio]
    generator = torch.Generator(device=DEVICE).manual_seed(seed)

    args = dict(
        prompt=prompt,
        negative_prompt=negative_prompt,
        seed=seed,
        aspect_ratio=aspect_ratio,
        width=width,
        height=height,
        cfg=cfg,
        steps=steps,
        device=DEVICE,
    )
    _log_inference_call("run_inference_image", args)

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

    args = dict(
        prompt=prompt,
        seed=seed,
        steps=steps,
        device=DEVICE,
        input_image=input_image,
    )
    _log_inference_call("run_inference_edit", args)

    image = pipe(
        image=input_image,
        prompt=prompt,
        num_inference_steps=steps,
        generator=generator,
    ).images[0]

    return image
