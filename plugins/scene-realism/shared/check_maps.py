"""Physical-plausibility checks for a downloaded PBR map set.

Every function except `load_rgb_pixels` takes already-decoded numeric data
— no image library needed — so the checks are testable without Pillow.
`load_rgb_pixels` needs Pillow only because decoding JPEG/PNG pixel data
from scratch is out of scope here; it fails with a clear message if Pillow
isn't installed, rather than an unrelated import error somewhere else.

Numeric ranges are sourced in pbr-physics.md, which ships alongside this
file.
"""

from __future__ import annotations

from dataclasses import dataclass
from statistics import fmean

METALNESS_TOLERANCE = 0.05
ALBEDO_MIN = 0.03
ALBEDO_MAX = 0.90


@dataclass
class ChannelStats:
    mean: float
    minimum: float
    maximum: float


def channel_stats(values: list[float]) -> ChannelStats:
    if not values:
        raise ValueError("channel_stats: no values given")
    return ChannelStats(mean=fmean(values), minimum=min(values), maximum=max(values))


def metalness_is_plausible(blue_channel: list[float], tolerance: float = METALNESS_TOLERANCE) -> bool:
    """True if an ARM/ORM map's blue (metalness) channel clusters near 0 or 1.

    A real material's metalness map should read almost-pure dielectric
    (near 0) or almost-pure metal (near 1) on average; a mid-grey mean
    signals either a wrongly-blended bake or the wrong channel was read.
    """
    stats = channel_stats(blue_channel)
    return stats.mean <= tolerance or stats.mean >= 1.0 - tolerance


def albedo_is_plausible(rgb_means: tuple[float, float, float]) -> bool:
    """True if every channel of a linear-light albedo mean sits in a real-world range."""
    return all(ALBEDO_MIN <= channel <= ALBEDO_MAX for channel in rgb_means)


def normal_map_is_gl_convention(green_channel_mean: float, blue_channel_mean: float) -> bool:
    """True if a normal map's channel means look like a normal map at all.

    A mostly-flat surface's normal map should average near mid-grey (~0.5)
    on green, with blue trending clearly higher (surfaces mostly face the
    viewer). This is a sanity check, not a GL-vs-DX discriminator — DX
    differs from GL only in the green channel's per-pixel *sign*, which a
    mean cannot see. Combine this with the source asset's declared
    convention (a "nor_gl" vs "nor_dx" filename) to decide whether to flip.
    """
    return blue_channel_mean > green_channel_mean


def load_rgb_pixels(path: str, sample_stride: int = 37) -> list[tuple[float, float, float]]:
    """Sparse-sampled RGB pixels from an image file, normalized to 0..1.

    Requires Pillow (`pip install pillow`). Raises ImportError with an
    actionable message if it isn't installed.
    """
    try:
        from PIL import Image
    except ImportError as error:
        raise ImportError(
            "check_maps.load_rgb_pixels needs Pillow: pip install pillow"
        ) from error

    with Image.open(path) as image:
        rgb = image.convert("RGB")
        width, height = rgb.size
        pixels = rgb.load()
        return [
            tuple(channel / 255.0 for channel in pixels[x, y])
            for y in range(0, height, sample_stride)
            for x in range(0, width, sample_stride)
        ]
