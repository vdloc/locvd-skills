"""Minimal client for the Poly Haven public API (CC0 texture/HDRI library).

No API key required. Every request carries a descriptive User-Agent naming
the calling software, per the Poly Haven API Terms of Service:
https://github.com/Poly-Haven/Public-API/blob/master/ToS.md (section 2.4).
A visible credit is required only when the *live* API's content is served
directly to end users (ToS section 2.5) — not for a self-hosted, build-time
download like this one.
"""

from __future__ import annotations

import hashlib
import json
import os
import urllib.error
import urllib.request
from dataclasses import dataclass
from typing import Any

API_ROOT = "https://api.polyhaven.com"
FILES_ROOT = "https://api.polyhaven.com/files"
USER_AGENT = "scene-realism-plugin/0.1 (+https://github.com/vdloc/locvd-skills)"


class PolyHavenError(RuntimeError):
    """Any network, HTTP, or data-shape failure talking to Poly Haven."""


def _get_json(url: str) -> Any:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            if response.status != 200:
                raise PolyHavenError(f"{url} -> HTTP {response.status}")
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.URLError as error:
        raise PolyHavenError(f"{url} -> {error}") from error


def search_textures(category: str) -> dict[str, Any]:
    """All texture assets in one category (see GET /categories/textures for names)."""
    assets = _get_json(f"{API_ROOT}/assets?t=textures&c={category}")
    if not isinstance(assets, dict):
        raise PolyHavenError(f"unexpected /assets shape for category={category!r}")
    return assets


def asset_info(asset_id: str) -> dict[str, Any]:
    return _get_json(f"{API_ROOT}/info/{asset_id}")


def asset_files(asset_id: str) -> dict[str, Any]:
    return _get_json(f"{FILES_ROOT}/{asset_id}")


@dataclass
class DownloadedMap:
    map_name: str
    resolution: str
    url: str
    md5: str
    local_path: str
    size_bytes: int


def download_map(
    asset_id: str,
    map_name: str,
    resolution: str,
    dest_dir: str,
    file_format: str = "jpg",
    files: dict[str, Any] | None = None,
) -> DownloadedMap:
    """Download exactly one map (e.g. map_name='Diffuse') at one resolution.

    `files` may be a pre-fetched result of `asset_files(asset_id)`, to avoid
    a second network call when downloading several maps for one asset.
    """
    files = files if files is not None else asset_files(asset_id)
    try:
        entry = files[map_name][resolution][file_format]
    except KeyError as error:
        raise PolyHavenError(
            f"{asset_id}: no {map_name}/{resolution}/{file_format} in /files response"
        ) from error

    url = entry["url"]
    expected_md5 = entry["md5"]
    os.makedirs(dest_dir, exist_ok=True)
    local_path = os.path.join(dest_dir, f"{asset_id}_{map_name}_{resolution}.{file_format}")

    # The cache is shared across projects: a file already on disk whose MD5
    # matches Poly Haven's is reused with no network call. A mismatch (partial
    # or corrupt earlier download) falls through to a fresh download.
    if os.path.isfile(local_path):
        with open(local_path, "rb") as handle:
            cached = handle.read()
        if hashlib.md5(cached).hexdigest() == expected_md5:
            return DownloadedMap(
                map_name=map_name,
                resolution=resolution,
                url=url,
                md5=expected_md5,
                local_path=local_path,
                size_bytes=len(cached),
            )

    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=60) as response:
        payload = response.read()

    actual_md5 = hashlib.md5(payload).hexdigest()
    if actual_md5 != expected_md5:
        raise PolyHavenError(
            f"{asset_id}/{map_name}/{resolution}: MD5 mismatch "
            f"(expected {expected_md5}, got {actual_md5})"
        )

    with open(local_path, "wb") as handle:
        handle.write(payload)

    return DownloadedMap(
        map_name=map_name,
        resolution=resolution,
        url=url,
        md5=actual_md5,
        local_path=local_path,
        size_bytes=len(payload),
    )
