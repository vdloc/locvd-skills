import os
import sys
import unittest

import yaml

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from validate_brief import validate_brief  # noqa: E402

_EXAMPLE_DIR = os.path.join(
    os.path.dirname(__file__), "..", "..", "examples", "courtier-console-v2"
)


class ExampleBriefTests(unittest.TestCase):
    def test_example_brief_is_schema_valid(self):
        with open(os.path.join(_EXAMPLE_DIR, "brief.yaml"), encoding="utf-8") as handle:
            brief = yaml.safe_load(handle)
        errors = validate_brief(brief)
        self.assertEqual(errors, [], f"example brief.yaml has schema errors: {errors}")

    def test_example_config_has_the_shape_classify_expects(self):
        with open(os.path.join(_EXAMPLE_DIR, "config.yaml"), encoding="utf-8") as handle:
            config = yaml.safe_load(handle)
        self.assertIn("classification_rules", config)
        for rule in config["classification_rules"]:
            self.assertIn("match", rule)
            self.assertIn("kind", rule)
            self.assertIn("substance", rule)


if __name__ == "__main__":
    unittest.main()
