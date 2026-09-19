import io
import json
import os
import struct
import sys
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
import verify_budgets as vb  # noqa: E402


def _build_glb(gltf: dict, bin_chunk: bytes = b"") -> bytes:
    json_bytes = json.dumps(gltf).encode("utf-8")
    json_bytes += b" " * ((4 - len(json_bytes) % 4) % 4)  # glTF requires 4-byte alignment
    padded_bin = bin_chunk + b"\x00" * ((4 - len(bin_chunk) % 4) % 4)

    json_header = struct.pack("<I4s", len(json_bytes), b"JSON")
    bin_header = struct.pack("<I4s", len(padded_bin), b"BIN\x00") if padded_bin else b""

    body = json_header + json_bytes + bin_header + padded_bin
    total_length = 12 + len(body)
    header = struct.pack("<4sII", b"glTF", 2, total_length)
    return header + body


def _png_bytes(width: int, height: int) -> bytes:
    from PIL import Image

    buffer = io.BytesIO()
    Image.new("RGB", (width, height), color=(10, 20, 30)).save(buffer, format="PNG")
    return buffer.getvalue()


def _jpeg_bytes(width: int, height: int) -> bytes:
    from PIL import Image

    buffer = io.BytesIO()
    Image.new("RGB", (width, height), color=(10, 20, 30)).save(buffer, format="JPEG")
    return buffer.getvalue()


class ParseGlbTests(unittest.TestCase):
    def test_round_trips_json_and_bin_chunks(self):
        gltf = {"asset": {"version": "2.0"}, "nodes": []}
        data = _build_glb(gltf, b"binary-payload")

        parsed_json, parsed_bin = vb.parse_glb(data)

        self.assertEqual(parsed_json["asset"]["version"], "2.0")
        self.assertTrue(parsed_bin.startswith(b"binary-payload"))

    def test_bad_magic_raises(self):
        with self.assertRaises(vb.GlbParseError):
            vb.parse_glb(b"not-a-glb-file-at-all-1234")

    def test_truncated_file_raises(self):
        data = _build_glb({"asset": {"version": "2.0"}})
        with self.assertRaises(vb.GlbParseError):
            vb.parse_glb(data[:-5])


class DrawCallAndMetalnessTests(unittest.TestCase):
    def test_count_draw_calls_counts_nodes_with_a_mesh(self):
        gltf = {
            "nodes": [{"mesh": 0}, {"mesh": 1}, {"name": "empty-group"}],
            "meshes": [{"primitives": [{}]}, {"primitives": [{}]}],
        }
        self.assertEqual(vb.count_draw_calls(gltf), 2)

    def test_count_draw_calls_counts_every_primitive_of_a_mesh(self):
        # one node, one mesh, 1500 primitives = 1500 draw calls, not 1
        gltf = {
            "nodes": [{"mesh": 0}],
            "meshes": [{"primitives": [{} for _ in range(1500)]}],
        }
        self.assertEqual(vb.count_draw_calls(gltf), 1500)

    def test_count_draw_calls_counts_a_shared_mesh_once_per_node(self):
        gltf = {
            "nodes": [{"mesh": 0}, {"mesh": 0}, {"mesh": 0}],
            "meshes": [{"primitives": [{}, {}]}],
        }
        self.assertEqual(vb.count_draw_calls(gltf), 6)

    def test_count_draw_calls_falls_back_to_one_when_mesh_is_unresolvable(self):
        gltf = {"nodes": [{"mesh": 0}, {"mesh": 7}]}  # no "meshes" array at all
        self.assertEqual(vb.count_draw_calls(gltf), 2)

    def test_metalness_factors_reads_declared_values_and_glb_default(self):
        gltf = {
            "materials": [
                {"name": "Painted", "pbrMetallicRoughness": {"metallicFactor": 0.0}},
                {"name": "Undeclared"},
            ]
        }
        factors = vb.metalness_factors(gltf)
        self.assertEqual(factors["Painted"], 0.0)
        self.assertEqual(factors["Undeclared"], 1.0)  # glTF 2.0 spec default

    def test_metalness_report_flags_mid_range_values(self):
        gltf = {
            "materials": [
                {"name": "Good", "pbrMetallicRoughness": {"metallicFactor": 0.02}},
                {"name": "Bad", "pbrMetallicRoughness": {"metallicFactor": 0.5}},
            ]
        }
        report = vb.metalness_report(gltf)
        self.assertTrue(report["Good"])
        self.assertFalse(report["Bad"])


class TextureMemoryTests(unittest.TestCase):
    def test_counts_png_and_jpeg_images_and_flags_unsupported(self):
        png = _png_bytes(64, 32)
        jpeg = _jpeg_bytes(16, 16)
        bin_chunk = png + jpeg
        gltf = {
            "images": [
                {"mimeType": "image/png", "bufferView": 0},
                {"mimeType": "image/jpeg", "bufferView": 1},
                {"mimeType": "image/webp", "bufferView": 2},
            ],
            "bufferViews": [
                {"byteOffset": 0, "byteLength": len(png)},
                {"byteOffset": len(png), "byteLength": len(jpeg)},
                {"byteOffset": len(png) + len(jpeg), "byteLength": 10},
            ],
        }
        # pad bin_chunk so the fake webp bufferView has bytes to slice (content unused)
        bin_chunk += b"\x00" * 10

        report = vb.estimate_gpu_texture_bytes(gltf, bin_chunk)

        self.assertEqual(report.counted_images, 2)
        self.assertEqual(report.unsupported_images, 1)
        self.assertIn("image/webp", report.unsupported_mime_types)
        self.assertEqual(report.estimated_bytes, 64 * 32 * 4 + 16 * 16 * 4)


if __name__ == "__main__":
    unittest.main()
