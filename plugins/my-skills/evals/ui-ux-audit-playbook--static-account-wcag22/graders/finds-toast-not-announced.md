---
type: regex
target: last_message
pattern: 'toast[^\n]{0,200}(live region|aria-live|role=.?status|role=.?alert|announc|screen reader)|(live region|aria-live|announc)[^\n]{0,200}toast'
flags: i
---
