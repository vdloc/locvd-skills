import json
import os
import sys
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from validate_brief import validate_brief  # noqa: E402

VALID_BRIEF = {
    "project": {"name": "demo", "units": "meters", "up_axis": "+Y"},
    "input": {"kind": "glb", "path": "public/structure_demo.glb"},
    "style": {"mode": "realistic-industrial"},
    "targets": {"web": True},
    "interaction": {"parts_individually_selectable": True},
    "delivery": {"license_policy": "cc0-only"},
}


class ValidateBriefTests(unittest.TestCase):
    def test_valid_brief_has_no_errors(self):
        self.assertEqual(validate_brief(VALID_BRIEF), [])

    def test_missing_required_top_level_key_is_reported(self):
        brief = dict(VALID_BRIEF)
        del brief["targets"]
        errors = validate_brief(brief)
        self.assertTrue(any("targets" in e for e in errors))

    def test_bad_enum_value_is_reported(self):
        brief = json.loads(json.dumps(VALID_BRIEF))  # deep copy
        brief["style"]["mode"] = "photoreal-anime-cyberpunk"
        errors = validate_brief(brief)
        self.assertTrue(any("style" in e or "mode" in e for e in errors))

    def test_empty_required_strings_are_reported(self):
        brief = json.loads(json.dumps(VALID_BRIEF))
        brief["project"]["name"] = ""
        brief["input"]["path"] = ""
        errors = validate_brief(brief)
        self.assertTrue(any("project.name" in e for e in errors), errors)
        self.assertTrue(any("input.path" in e for e in errors), errors)

    def test_missing_nested_required_key_is_reported(self):
        brief = json.loads(json.dumps(VALID_BRIEF))
        del brief["project"]["units"]
        errors = validate_brief(brief)
        self.assertTrue(any("units" in e for e in errors))


if __name__ == "__main__":
    unittest.main()
