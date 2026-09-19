import json
import os
import unittest

_EVALS_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "evals")


class EvalFileTests(unittest.TestCase):
    def test_every_skill_has_an_eval_file_with_at_least_two_cases(self):
        skill_dirs = sorted(
            name for name in os.listdir(
                os.path.join(os.path.dirname(__file__), "..", "..", "skills")
            )
        )
        for skill in skill_dirs:
            with self.subTest(skill=skill):
                path = os.path.join(_EVALS_DIR, f"{skill}.eval.json")
                self.assertTrue(os.path.exists(path), f"missing {path}")
                with open(path, encoding="utf-8") as handle:
                    data = json.load(handle)
                self.assertEqual(data["skill"], skill)
                self.assertGreaterEqual(len(data["cases"]), 2)
                for case in data["cases"]:
                    self.assertIn("id", case)
                    self.assertIn("prompt", case)
                    self.assertIn("expect", case)


if __name__ == "__main__":
    unittest.main()
