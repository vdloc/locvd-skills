import os
import unittest

import yaml  # only used by this test file, not by shared/ production code

_SHARED = os.path.join(os.path.dirname(__file__), "..")


class ReferenceFileTests(unittest.TestCase):
    def test_budgets_yaml_has_the_keys_verify_depends_on(self):
        with open(os.path.join(_SHARED, "budgets.yaml"), encoding="utf-8") as handle:
            budgets = yaml.safe_load(handle)
        self.assertIn("draw_calls", budgets)
        self.assertIn("warn", budgets["draw_calls"])
        self.assertIn("gpu_texture_mb", budgets)
        self.assertIn("warn", budgets["gpu_texture_mb"])
        self.assertIn("max", budgets["gpu_texture_mb"])
        self.assertIn("metalness_tolerance", budgets)
        self.assertIn("value", budgets["metalness_tolerance"])
        self.assertEqual(budgets["metalness_tolerance"]["value"], 0.05)

    def test_pbr_physics_and_lessons_are_non_empty_markdown(self):
        for filename in ("pbr-physics.md", "lessons.md"):
            path = os.path.join(_SHARED, filename)
            with open(path, encoding="utf-8") as handle:
                content = handle.read()
            self.assertTrue(content.startswith("# "), f"{filename} should start with a heading")
            self.assertGreater(len(content), 200, f"{filename} looks empty")


if __name__ == "__main__":
    unittest.main()
