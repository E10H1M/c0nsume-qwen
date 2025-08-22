# services/models.py
import gc, torch
import torch.nn as nn
from diffusers import AutoModel, DiffusionPipeline
from config import LORA_PATH, TORCH_DTYPE, QUANT_CONFIG, AVAILABLE_MODELS

def _gb(x):
    return f"{(x/(1024**3)):.2f} GB"

def _dispose_pipe(pipe):
    """
    Hard-offload a Diffusers pipeline:
      - remove accelerate hooks
      - move all module params to 'meta' (drops weights)
      - clear CUDA caches
      - GC + malloc_trim to return RAM to OS
    """
    if pipe is None:
        return

    print("[models] offload: begin")

    # --- BEFORE (GPU mem) ---
    if torch.cuda.is_available():
        try:
            alloc = torch.cuda.memory_allocated()
            reserv = torch.cuda.memory_reserved()
            print(f"[models] offload[BEFORE] cuda: alloc={_gb(alloc)} reserved={_gb(reserv)}")
        except Exception as e:
            print(f"[models] offload: cuda mem read failed: {e}")

    # 1) Remove offload hooks so we can freely move modules
    try:
        pipe.remove_all_hooks()
    except Exception as e:
        print(f"[models] offload: remove_all_hooks failed: {e}")

    # 2) Move all module params to 'meta' (drops tensors from RAM/VRAM)
    try:
        comps = getattr(pipe, "components", {}) or {}
        for name, comp in comps.items():
            if isinstance(comp, nn.Module):
                try:
                    comp.to("meta")
                except Exception as e:
                    print(f"[models] offload: to('meta') failed for {name}: {e}")
        print("[models] offload: components moved to meta")
    except Exception as e:
        print(f"[models] offload: component walk failed: {e}")

    # 3) Help GC by cutting strong refs inside the pipeline object
    try:
        if isinstance(getattr(pipe, "components", None), dict):
            for k in list(pipe.components.keys()):
                pipe.components[k] = None
    except Exception:
        pass

    # 4) CUDA cleanup
    try:
        if torch.cuda.is_available():
            try: torch.cuda.synchronize()
            except: pass
            torch.cuda.empty_cache()
            try: torch.cuda.ipc_collect()
            except: pass
            try: torch.cuda.reset_peak_memory_stats()
            except: pass
    except Exception as e:
        print(f"[models] offload: cuda clear failed: {e}")

    # 5) Python/OS memory cleanup
    try:
        gc.collect()
        gc.collect()
    except Exception as e:
        print(f"[models] offload: gc failed: {e}")

    try:
        import ctypes, platform  # local import to avoid global dependency
        if platform.system() == "Linux":
            try:
                libc = ctypes.CDLL("libc.so.6")
                libc.malloc_trim(0)
                print("[models] offload: malloc_trim(0) done")
            except Exception as e:
                print(f"[models] offload: malloc_trim failed: {e}")
    except Exception:
        pass

    # --- AFTER (GPU mem) ---
    if torch.cuda.is_available():
        try:
            alloc = torch.cuda.memory_allocated()
            reserv = torch.cuda.memory_reserved()
            print(f"[models] offload[AFTER] cuda: alloc={_gb(alloc)} reserved={_gb(reserv)}")
        except Exception as e:
            print(f"[models] offload: cuda mem read failed (after): {e}")

    print("[models] offload: end")

def build_pipe(model_id: str):
    print(f"[models] build_pipe: {model_id}")
    transformer = AutoModel.from_pretrained(
        model_id,
        subfolder="transformer",
        quantization_config=QUANT_CONFIG,
        torch_dtype=TORCH_DTYPE,
    )
    pipe = DiffusionPipeline.from_pretrained(
        model_id,
        transformer=transformer,
        torch_dtype=TORCH_DTYPE,
    )
    pipe.load_lora_weights(LORA_PATH)
    pipe.enable_model_cpu_offload()
    return pipe

def ensure_mode(app, needed_key: str):
    # no-op if already active & pipe exists
    if getattr(app.state, "active_key", None) == needed_key and getattr(app.state, "pipe", None) is not None:
        return

    prev = getattr(app.state, "active_key", None)
    print(f"[models] ensure_mode: {prev} -> {needed_key}")

    # offload & drop the old pipe
    old = getattr(app.state, "pipe", None)
    app.state.pipe = None
    if old is not None:
        _dispose_pipe(old)
        del old
        gc.collect()

    # build & activate the new pipe
    app.state.pipe = build_pipe(AVAILABLE_MODELS[needed_key])
    app.state.active_key = needed_key
    print(f"[models] ensure_mode: active='{needed_key}'")
