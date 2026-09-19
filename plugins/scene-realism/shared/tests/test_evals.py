import glob
import os
import re
import unittest

_PLUGIN_ROOT = os.path.join(os.path.dirname(__file__), "..", "..")
_EVALS_DIR = os.path.join(_PLUGIN_ROOT, "evals")


def _frontmatter_and_body(path):
    with open(path, encoding="utf-8") as handle:
        content = handle.read()
    match = re.match(r"^---\n(.*?)\n---\n(.*)$", content, re.DOTALL)
    assert match, f"{path}: missing frontmatter"
    return match.group(1), match.group(2).strip()


class EvalLayoutTests(unittest.TestCase):
    """Checks the on-disk layout `claude plugin eval` reads:
    evals/<case>/prompt.md and evals/<case>/graders/*.md."""

    def test_every_skill_has_at_least_two_cases(self):
        skills = sorted(os.listdir(os.path.join(_PLUGIN_ROOT, "skills")))
        for skill in skills:
            with self.subTest(skill=skill):
                cases = glob.glob(os.path.join(_EVALS_DIR, f"{skill}--*", "prompt.md"))
                self.assertGreaterEqual(len(cases), 2, f"{skill} needs >= 2 eval cases")

    def test_every_case_has_a_prompt_and_an_llm_grader(self):
        prompts = glob.glob(os.path.join(_EVALS_DIR, "*", "prompt.md"))
        self.assertGreater(len(prompts), 0)
        for prompt_path in prompts:
            case_dir = os.path.dirname(prompt_path)
            with self.subTest(case=os.path.basename(case_dir)):
                _, prompt_body = _frontmatter_and_body(prompt_path)
                self.assertTrue(prompt_body, "empty prompt")
                graders = glob.glob(os.path.join(case_dir, "graders", "*.md"))
                self.assertGreaterEqual(len(graders), 1, "no grader")
                for grader_path in graders:
                    front, body = _frontmatter_and_body(grader_path)
                    self.assertIn("type: llm", front)
                    self.assertTrue(body, "empty grader criteria")
                    self.assertNotIn("TODO", body)


if __name__ == "__main__":
    unittest.main()
