"""Budget and physical-plausibility gates run against a built GLB.

Every function here operates on an already-parsed glTF JSON `dict` and a
`bytes` binary chunk — never on a filesystem path — so each gate is
testable with a small synthetic GLB built in a unit test, and so the same
functions work whether the GLB came from disk, a network response, or a
build step's in-memory buffer.
"""

from __future__ import annotations

import json
import struct
from dataclasses import dataclass, field

GLB_MAGIC = b"glTF"
DEFAULT_METALLIC_FACTOR = 1.0  # glTF 2.0 spec default when the property is absent
METALNESS_CLUSTER_TOLERANCE = 0.05


class GlbParseError(ValueError):
    """The given bytes are not a well-formed glTF 2.0 Binary (.glb) file."""


def parse_glb(data: bytes) -> tuple[dict, bytes]:
    if len(data) < 12 or data[0:4] != GLB_MAGIC:
        raise GlbParseError("missing glTF magic in the first 4 bytes")
    _, version, total_length = struct.unpack_from("<4sII", data, 0)
    if version != 2:
        raise GlbParseError(f"unsupported glTF Binary version {version}, expected 2")
    if total_length != len(data):
        raise GlbParseError(
            f"header declares {total_length} bytes, file is {len(data)} bytes"
        )

    offset = 12
    json_chunk: dict | None = None
    bin_chunk = b""
    while offset < len(data):
        if offset + 8 > len(data):
            raise GlbParseError("truncated chunk header")
        chunk_length, chunk_type = struct.unpack_from("<I4s", data, offset)
        chunk_data = data[offset + 8: offset + 8 + chunk_length]
        if chunk_type == b"JSON":
            json_chunk = json.loads(chunk_data.decode("utf-8"))
        elif chunk_type == b"BIN\x00":
            bin_chunk = chunk_data
        offset += 8 + chunk_length

    if json_chunk is None:
        raise GlbParseError("no JSON chunk found")
    return json_chunk, bin_chunk


def count_draw_calls(gltf: dict) -> int:
    """One draw call per node that references a mesh — R3F's budget metric."""
    return sum(1 for node in gltf.get("nodes", []) if "mesh" in node)


def metalness_factors(gltf: dict) -> dict[str, float]:
    return {
        material.get("name", f"material[{index}]"):
            material.get("pbrMetallicRoughness", {}).get(
                "metallicFactor", DEFAULT_METALLIC_FACTOR
            )
        for index, material in enumerate(gltf.get("materials", []))
    }


def metalness_report(gltf: dict, tolerance: float = METALNESS_CLUSTER_TOLERANCE) -> dict[str, bool]:
    """Material name -> True if its metallicFactor clusters near 0.0 or 1.0."""
    return {
        name: (value <= tolerance or value >= 1.0 - tolerance)
        for name, value in metalness_factors(gltf).items()
    }


def _png_dimensions(data: bytes) -> tuple[int, int]:
    if data[:8] != b"\x89PNG\r\n\x1a\n" or data[12:16] != b"IHDR":
        raise GlbParseError("not a well-formed PNG (missing IHDR)")
    width, height = struct.unpack_from(">II", data, 16)
    return width, height


def _jpeg_dimensions(data: bytes) -> tuple[int, int]:
    if data[0:2] != b"\xff\xd8":
        raise GlbParseError("not a well-formed JPEG (missing SOI marker)")
    offset = 2
    # SOF markers carry width/height; DHT (0xC4), JPG (0xC8), DAC (0xCC) are
    # excluded even though they fall in the 0xC0-0xCF range.
    sof_markers = {0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7,
                   0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF}
    while offset + 4 <= len(data):
        if data[offset] != 0xFF:
            offset += 1
            continue
        marker = data[offset + 1]
        if marker in sof_markers:
            height, width = struct.unpack_from(">HH", data, offset + 5)
            return width, height
        segment_length = struct.unpack_from(">H", data, offset + 2)[0]
        offset += 2 + segment_length
    raise GlbParseError("no SOF marker found in JPEG")


@dataclass
class TextureMemoryReport:
    estimated_bytes: int
    counted_images: int
    unsupported_images: int
    unsupported_mime_types: set[str] = field(default_factory=set)


def estimate_gpu_texture_bytes(gltf: dict, bin_chunk: bytes) -> TextureMemoryReport:
    """Decompressed GPU memory estimate: width * height * 4 bytes, per image.

    Every image ships fully decompressed to the GPU regardless of its file
    encoding — JPEG, PNG, and WebP all decode to raw RGBA before upload —
    which is why file size alone understates the real cost (see
    RESEARCH-REALISTIC-PIPELINE.md §C.2). WebP images are not decoded by
    this function (no WebP header parser is implemented here yet — see
    lessons.md's "report don't silently skip"); they are counted as
    unsupported so the total is a documented lower bound, never a silent
    undercount.
    """
    buffer_views = gltf.get("bufferViews", [])
    total_bytes = 0
    counted = 0
    unsupported = 0
    unsupported_mimes: set[str] = set()

    for image in gltf.get("images", []):
        buffer_view_index = image.get("bufferView")
        mime = image.get("mimeType", "")
        if buffer_view_index is None:
            unsupported += 1
            unsupported_mimes.add(mime or "external-uri")
            continue

        view = buffer_views[buffer_view_index]
        start = view.get("byteOffset", 0)
        length = view["byteLength"]
        blob = bin_chunk[start:start + length]

        if mime == "image/png":
            width, height = _png_dimensions(blob)
        elif mime == "image/jpeg":
            width, height = _jpeg_dimensions(blob)
        else:
            unsupported += 1
            unsupported_mimes.add(mime or "unknown")
            continue

        total_bytes += width * height * 4
        counted += 1

    return TextureMemoryReport(
        estimated_bytes=total_bytes,
        counted_images=counted,
        unsupported_images=unsupported,
        unsupported_mime_types=unsupported_mimes,
    )
