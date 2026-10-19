---
type: llm
---
Judge only the findings report in the final message.
PASS if all of these hold:
1. Nearly every finding names a concrete location in the page (a selector, element, class, or quoted label/text) rather than a general claim such as "high cognitive load" with no element named.
2. Each finding states a severity, and the report gives some reason for each Critical or High rating (who is blocked, how often, or which requirement fails), not just a label.
3. The empty alt on the decorative divider image (`img.divider`, `alt=""`) is NOT reported as a defect (mentioning it as correct is fine).
4. The report distinguishes what was measured or read from the source from anything it could not observe (for example behaviour after pressing "Pay now"), or simply makes no claims about unobservable behaviour.
FAIL if any of the four is clearly violated.
