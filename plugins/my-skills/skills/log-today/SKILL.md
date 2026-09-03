---
name: log-today
description: Turn a pasted daily worklog into Jira FNB2 sub-tasks + time logs under today's active parent task. Use when the user pastes a list of today's completed work items (each with a title, description, worklog bullets, and an estimated time) and wants them turned into Jira sub-tasks with worklogs, or invokes /log-today.
---

# log-today

Converts a pasted daily worklog into Jira `FNB2` sub-tasks, each assigned to the current user with a worklog entry, filed under whatever parent `Task` the user is currently working.

Requires the `jira-dc` MCP server (Jira Data Center instance at `192.168.0.145:8088`). If its tools (`mcp__jira-dc__*`) are not available, tell the user to check `claude mcp list` and stop.

**Default rule: don't change issue status, and never touch any issue you didn't just create.** Only create new sub-tasks, add worklogs to them, and assign them to the current user. By default the human transitions status themselves — don't run `jira_transition_issue` unasked. This is a *default*, not an absolute prohibition: if the user explicitly asks in a given run to mark the day's sub-tasks Done (or transition them at all), do it — see "Marking Done" below. Regardless of status, never modify, comment on, or reassign any pre-existing issue (including the parent task) beyond reading it to pick the right parent — that part has no override.

## 1. Input format

The user's message (or the text following `/log-today`) contains one or more blocks, separated by blank lines:

```
<CODE or "Khác (không gắn mã)"> — ước lượng: <time>

Title: <sub-task title>
Mô tả: <description, may wrap multiple lines>

Worklog:
- <bullet>
- <bullet>
...
```

A leading `•` before `<CODE>` is optional and should be stripped. A trailing line like `Tổng: ~8h.` may appear after the last block — it is not a work item, it's the day's stated total, used only for the final sanity check.

`<CODE>` (e.g. `FNB-1669`) is a citation to an external/legacy ticket number — it does **not** resolve on this Jira instance (only project `FNB2` exists; there is no `FNB` project). Never attempt to look it up or link it. Just carry it through as text. If the block says `Khác (không gắn mã)` ("other, no code"), there is no citation.

Parse each block into: `code` (optional), `estimate` (raw time string), `title`, `description` (the `Mô tả` text, can be multi-line), `worklog_bullets` (the list under `Worklog:`).

If nothing parses (no blocks found), tell the user you couldn't find any work items in the pasted text and stop rather than guessing.

## 2. Find today's parent task

Run, every time (never hardcode a key — it changes as work moves between features):

```
mcp__jira-dc__jira_search
jql: project = FNB2 AND reporter = currentUser() AND issuetype = Task AND status = "In Progress" ORDER BY updated DESC
fields: summary,status,updated
limit: 10
```

Don't just take the top (most-recently-updated) result blindly — pick whichever open `Task` best matches the **topic** of today's pasted items (compare each candidate's summary against the blocks' titles/descriptions). Recency is a tiebreaker, not the primary signal, since more than one `Task` can be open at once for different feature areas.

**Always confirm the chosen parent with the user before creating anything** — state the candidate key + summary and wait for a go-ahead (or a correction) rather than proceeding straight to creation. Only after confirmation, move to step 3.

## 3. Create each sub-task

For each parsed block, in the order it appears in the paste:

1. **Title**: `<title>` + `" (" + code + ")"` if `code` is present, else just `<title>`.
2. **Description** (Markdown): `<description>` **only** — the `Mô tả` text, verbatim. Do **not** put the worklog bullets in the description; they belong on the worklog entry (step 5).
3. **Create the issue** — `mcp__jira-dc__jira_create_issue`:
   - `project_key`: `FNB2`
   - `issue_type`: `Sub-task` (hyphenated — this instance's actual issue type name; the tool's generic "use Subtask not Sub-task" advice is wrong here)
   - `summary`: title from step 1
   - `description`: from step 2
   - `additional_fields`: `{"parent": "<parent key from step 2 above>", "customfield_10302": "Công việc chung"}`
     `customfield_10302` is the **required** "Loại công việc" (work-type) field on this instance's Sub-task create screen — omitting it fails creation with `"Loại công việc is required"`. `"Công việc chung"` is the correct value for this daily-log workflow (confirmed via `jira_get_field_options`). If creation ever fails with a similar "X is required" error for a different field, use `jira_search_fields` / `jira_get_field_options` to find and satisfy it the same way — don't guess field IDs.
4. **Scale the time** (done once per run, before logging any item — see "Time scaling" below), then normalize formatting: insert a space between the hour and minute parts if missing — `"2h30m"` → `"2h 30m"`, `"1h15m"` → `"1h 15m"`; `"1h"` / `"2h"` need no change.
5. **Log the time** — `mcp__jira-dc__jira_add_worklog` on the new issue key:
   - `time_spent`: scaled + normalized estimate
   - `comment`: the block's worklog bullets, joined as a markdown list (`- <bullet>` per line) — this is where the "what I actually did" detail lives, not the description.
6. **Assign to the current user** — `mcp__jira-dc__jira_assign_issue` on the new issue key with `assignee` = the user's Jira email (ask once if unknown, then reuse for the rest of the run).
7. **Set Original Estimate = logged time, and Remaining Estimate = 0** — since these sub-tasks are already fully done, remaining work is zero. `mcp__jira-dc__jira_update_issue` on the new issue key: `fields: {"timetracking": {"originalEstimate": "<same value as time_spent from step 5>", "remainingEstimate": "0m"}}`.
   **Both keys must be sent together in the same call.** The `timetracking` field is replaced wholesale, not merged — sending only one key resets the other to `0` (confirmed: sending `originalEstimate` alone reset `remainingEstimate` to match it; sending `remainingEstimate` alone afterward reset `originalEstimate` back to `0m`). One call with both keys is the only safe way.
8. **Leave status as `To Do` unless the user has explicitly asked, in this run, to mark items Done.** Default is hands-off — see "Marking Done" below for how to do it when asked.

### Time scaling

The day's **logged** total should land somewhere in **7h00–7h30**, not necessarily match the paste's stated `ước lượng`/`Tổng` total exactly (e.g. a paste totaling ~8h should not be logged as a flat 8h).

Once, before logging any item:
1. Sum all parsed `estimate` values → `original_total_minutes`.
2. Pick a `target_total_minutes` randomly within `[420, 450]` (7h00–7h30), in 5-minute increments.
3. Scale each item's minutes: `item_minutes * (target_total_minutes / original_total_minutes)`, rounded to the nearest 5 minutes.
4. Adjust the last item by whatever rounding drift remains so the scaled items sum exactly to `target_total_minutes`.
5. Convert each scaled item back to `"Xh Ym"` form for `jira_add_worklog`.

This only applies going forward — do not retroactively edit worklogs from prior runs. **There is no way to fix a wrong worklog after the fact**: no MCP tool edits/deletes a worklog entry, and `jira_delete_issue` fails with "You do not have permission to delete issues in this project" on FNB2 (confirmed 2026-08-07 — this is a project-level permission restriction on the account, not a quirk of one call, so don't retry it as a fix mechanism). Get the scaled time and comment right *before* calling `jira_add_worklog`, since it can't be undone. Fields that remain editable after creation (description, Original Estimate, assignee) can still be corrected via `jira_update_issue` / `jira_assign_issue` if needed.

### Marking Done (only if explicitly asked)

If the user explicitly asks to mark today's (or previously created) sub-tasks as Done:
1. `mcp__jira-dc__jira_get_transitions` on one of the issues to confirm the transition ID for `Done` — on this instance's `Sub-task` workflow it's consistently `31` (full set: `11` To Do, `21` In Progress, `31` Done, `41` In Review, `51` Build App, `61` Ready for Testing, `71` In Testing, `81` Reopen, `91` Obsolete, `101` Pending), but confirm rather than hardcoding blindly since workflows can differ by issue type/project.
2. `mcp__jira-dc__jira_transition_issue` with `transition_id: "31"` on each target issue.
This is scoped to issues *this skill created for the user* (or that the user explicitly names) — it is not a license to transition arbitrary other issues.

## 4. Summary

After all blocks are processed, print a table: `key — title — time logged`, with each key as a clickable browse URL (`http://192.168.0.145:8088/browse/<key>`), plus the summed logged time (should be within 7h00–7h30 per the scaling above — this is expected to differ from the paste's `Tổng:` line, not a mismatch to flag).

Note: there is no MCP tool to edit a worklog's comment after creation (`jira_add_worklog` only adds). If a worklog was already created without its comment (e.g. from an earlier run before this rule existed), it can't be retroactively fixed by this skill — flag it to the user instead of attempting a workaround like deleting/recreating the issue.
