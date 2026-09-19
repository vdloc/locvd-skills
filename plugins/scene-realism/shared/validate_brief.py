"""Validates a scene brief against scene-brief.schema.json without a
third-party JSON Schema library — shared/ stays standard-library-only.

Supports exactly the subset of JSON Schema the brief schema uses: object
`required`/`properties`, string `enum`, numeric `minimum`/
`exclusiveMinimum`, and `type` checks for object/string/boolean/integer/
number. If the schema grows past that subset, extend `_check_node`, not the
schema file alone.
"""

from __future__ import annotations

import json
import os

_SCHEMA_PATH = os.path.join(os.path.dirname(__file__), "scene-brief.schema.json")


def _load_schema() -> dict:
    with open(_SCHEMA_PATH, encoding="utf-8") as handle:
        return json.load(handle)


def _check_type(value, expected: str, path: str, errors: list[str]) -> bool:
    checks = {
        "object": lambda v: isinstance(v, dict),
        "string": lambda v: isinstance(v, str),
        "boolean": lambda v: isinstance(v, bool),
        "integer": lambda v: isinstance(v, int) and not isinstance(v, bool),
        "number": lambda v: isinstance(v, (int, float)) and not isinstance(v, bool),
    }
    ok = checks.get(expected, lambda v: True)(value)
    if not ok:
        errors.append(f"{path}: expected type {expected}, got {type(value).__name__}")
    return ok


def _check_node(value, node_schema: dict, path: str, errors: list[str]) -> None:
    expected_type = node_schema.get("type")
    if expected_type and not _check_type(value, expected_type, path, errors):
        return

    if expected_type == "object":
        for key in node_schema.get("required", []):
            if key not in value:
                errors.append(f"{path}: missing required key {key!r}")
        for key, child_schema in node_schema.get("properties", {}).items():
            if key in value:
                _check_node(value[key], child_schema, f"{path}.{key}", errors)

    if "enum" in node_schema and value not in node_schema["enum"]:
        errors.append(f"{path}: {value!r} is not one of {node_schema['enum']}")

    if expected_type in ("integer", "number"):
        if "minimum" in node_schema and value < node_schema["minimum"]:
            errors.append(f"{path}: {value} is below minimum {node_schema['minimum']}")
        if "exclusiveMinimum" in node_schema and value <= node_schema["exclusiveMinimum"]:
            errors.append(f"{path}: {value} must be greater than {node_schema['exclusiveMinimum']}")


def validate_brief(brief: dict) -> list[str]:
    """Returns a list of human-readable error strings; empty means valid."""
    schema = _load_schema()
    errors: list[str] = []
    _check_node(brief, schema, "brief", errors)
    return errors
