import hashlib
import json
import os
import sys
import tempfile
import unittest
from unittest.mock import patch

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
import polyhaven_client as client  # noqa: E402


class FakeResponse:
    def __init__(self, body: bytes, status: int = 200):
        self._body = body
        self.status = status

    def read(self):
        return self._body

    def __enter__(self):
        return self

    def __exit__(self, *exc_info):
        return False


class SearchAndInfoTests(unittest.TestCase):
    @patch("polyhaven_client.urllib.request.urlopen")
    def test_search_textures_parses_json(self, mock_urlopen):
        payload = json.dumps({"rusty_metal_04": {"name": "Rusty Metal 04"}}).encode()
        mock_urlopen.return_value = FakeResponse(payload)

        result = client.search_textures("metal")

        self.assertIn("rusty_metal_04", result)
        called_url = mock_urlopen.call_args[0][0].full_url
        self.assertEqual(called_url, "https://api.polyhaven.com/assets?t=textures&c=metal")

    @patch("polyhaven_client.urllib.request.urlopen")
    def test_non_200_status_raises_polyhaven_error(self, mock_urlopen):
        mock_urlopen.return_value = FakeResponse(b"{}", status=500)
        with self.assertRaises(client.PolyHavenError):
            client.asset_info("rusty_metal_04")

    @patch("polyhaven_client.urllib.request.urlopen")
    def test_every_request_sends_the_required_user_agent(self, mock_urlopen):
        mock_urlopen.return_value = FakeResponse(b"{}")
        client.asset_info("rusty_metal_04")
        request = mock_urlopen.call_args[0][0]
        self.assertEqual(request.get_header("User-agent"), client.USER_AGENT)


class DownloadMapTests(unittest.TestCase):
    def setUp(self):
        self.payload = b"fake-jpeg-bytes"
        self.md5 = hashlib.md5(self.payload).hexdigest()
        self.files_response = {
            "Diffuse": {
                "2k": {"jpg": {"url": "https://dl.polyhaven.org/x/Diffuse_2k.jpg", "md5": self.md5}}
            }
        }

    @patch("polyhaven_client.urllib.request.urlopen")
    def test_downloads_and_verifies_checksum(self, mock_urlopen):
        mock_urlopen.return_value = FakeResponse(self.payload)
        with tempfile.TemporaryDirectory() as tmp:
            result = client.download_map(
                "rusty_metal_04", "Diffuse", "2k", tmp,
                file_format="jpg", files=self.files_response,
            )
            self.assertEqual(result.md5, self.md5)
            self.assertTrue(os.path.exists(result.local_path))
            with open(result.local_path, "rb") as handle:
                self.assertEqual(handle.read(), self.payload)

    @patch("polyhaven_client.urllib.request.urlopen")
    def test_checksum_mismatch_raises(self, mock_urlopen):
        mock_urlopen.return_value = FakeResponse(b"different-bytes")
        with tempfile.TemporaryDirectory() as tmp:
            with self.assertRaises(client.PolyHavenError):
                client.download_map(
                    "rusty_metal_04", "Diffuse", "2k", tmp,
                    file_format="jpg", files=self.files_response,
                )

    def test_missing_map_or_resolution_raises(self):
        with tempfile.TemporaryDirectory() as tmp:
            with self.assertRaises(client.PolyHavenError):
                client.download_map(
                    "rusty_metal_04", "Roughness", "8k", tmp,
                    file_format="jpg", files=self.files_response,
                )


if __name__ == "__main__":
    unittest.main()
