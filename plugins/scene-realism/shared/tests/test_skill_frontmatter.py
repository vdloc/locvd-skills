import glob
import os
import re
import unittest

_PLUGIN_ROOT = os.path.join(os.path.dirname(__file__), "..", "..")
_NAME_RE = re.compile(r"^[a-z][a-z0-9-]{0,63}$")


class SkillFrontmatterTests(unittest.TestCase):
    def test_every_skill_has_valid_frontmatter(self):
        skill_files = sorted(glob.glob(os.path.join(_PLUGIN_ROOT, "skills", "*", "SKILL.md")))
        self.assertGreater(len(skill_files), 0, "no SKILL.md files found")

        for path in skill_files:
            with self.subTest(path=path):
                with open(path, encoding="utf-8") as handle:
                    content = handle.read()

                self.assertTrue(content.startswith("---\n"), "must start with frontmatter")
                end = content.index("\n---", 4)
                frontmatter = content[4:end]

                name_match = re.search(r'^name:\s*(\S+)\s*$', frontmatter, re.MULTILINE)
                self.assertIsNotNone(name_match, "missing name: field")
                name = name_match.group(1)
                self.assertLessEqual(len(name), 64, "name exceeds 64 chars")
                self.assertRegex(name, _NAME_RE, "name must be lowercase-and-hyphens")

                # directory name must match frontmatter name (no plugin-name repetition)
                dir_name = os.path.basename(os.path.dirname(path))
                self.assertEqual(dir_name, name, "SKILL.md name must match its directory")

                desc_match = re.search(r'^description:\s*(.+)$', frontmatter, re.MULTILINE)
                self.assertIsNotNone(desc_match, "missing description: field")
                description = desc_match.group(1)
                self.assertLessEqual(len(description), 1024, "description exceeds 1024 chars")
                self.assertIn(
                    "Use ", description,
                    "description should say when to use the skill, not just what it does",
                )


if __name__ == "__main__":
    unittest.main()
