# services/lora_manager.py

from pathlib import Path
from typing import Optional
from pprint import pprint
from config import LORA_PATH as _LORA_PATH, LORA_SELECT as _LORA_SELECT


def list_available(root: str) -> list[str]:
    p = Path(root)
    if p.is_file():
        return [p.name]
    if p.is_dir():
        return sorted(f.name for f in p.glob("*.safetensors"))
    return []

def list_available_loras() -> list[str]:
    return list_available(_LORA_PATH)


def validate_selection(root: str, selected_name: Optional[str]) -> Optional[Path]:
    if not selected_name:
        return None

    root_path = Path(root)
    if not root_path.exists():
        raise FileNotFoundError(f"[LoRA] root path not found: {root}")

    if root_path.is_file():
        if selected_name == root_path.name:
            return root_path
        raise FileNotFoundError(
            f"[LoRA] selection '{selected_name}' does not match single file '{root_path.name}'"
        )

    fp = root_path / selected_name
    if not fp.exists():
        raise FileNotFoundError(
            f"[LoRA] '{selected_name}' not found in {root}. Available: {list_available(root)}"
        )
    return fp


def load_from_spec(pipe, root: str, selected_name: Optional[str]) -> None:
    path = validate_selection(root, selected_name)
    if path is None:
        return
    print("[LoRA] loading:")
    pprint(str(path))
    pipe.load_lora_weights(str(path))


def load_lora(pipe) -> None:
    """
    Load selected LoRA(s) into `pipe` using values from config.
    """
    print("[LoRA] config values:")
    pprint({"LORA_PATH": _LORA_PATH, "LORA_SELECT": _LORA_SELECT})

    if not _LORA_SELECT:
        return

    # split by commas and trim whitespace
    selections = [s.strip() for s in _LORA_SELECT.split(",") if s.strip()]
    for sel in selections:
        path = validate_selection(_LORA_PATH, sel)
        print("[LoRA] loading:")
        pprint(str(path))
        pipe.load_lora_weights(str(path))
