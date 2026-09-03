# locvd-skills

Personal Claude Code skills, packaged as an installable/updatable plugin marketplace.

## Structure

```
.claude-plugin/marketplace.json   # marketplace manifest (lists plugins)
plugins/my-skills/
  .claude-plugin/plugin.json      # plugin manifest
  skills/                         # one dir per skill
    log-today/
    translate-en-vi/
    vietnamese-tech-writing/
```

## Add a new skill

1. `mkdir plugins/my-skills/skills/<name>` and add its `SKILL.md` (+ files).
2. Commit + push.
3. Run `/plugin marketplace update locvd-skills` on any machine, then `/plugin install my-skills@locvd-skills` (or it auto-updates if already installed).

## Install on a new machine

```
/plugin marketplace add <your-github-user>/locvd-skills
/plugin install my-skills@locvd-skills
```

## Update

```
/plugin marketplace update locvd-skills
```
