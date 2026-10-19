# checkout.html — seeded ground truth

Answer key for the `ui-ux-audit-playbook--*` cases that scaffold `checkout.html`.
This file is never copied into a run's workspace.

## Seeded defects (an audit should find these)

| # | Defect | Where | Playbook check |
|---|---|---|---|
| D1 | Email and phone have a placeholder but no `<label>` | `input[name=email]`, `input[name=phone]` | FM3, A4 |
| D2 | Pinch zoom blocked | `meta[name=viewport]` `maximum-scale=1, user-scalable=no` | M1, A11 |
| D3 | Focus indicator removed globally | `*:focus { outline: none }` | A2 |
| D4 | Card number error shown by red border only, no message | `input#card.error` | C3, FM11 |
| D5 | Submit disabled with no reason given | `button.btn-primary[disabled]` "Pay now" | B7 |
| D6 | Two solid primary buttons side by side | "Pay now" + "Save for later" | B1, H2 |
| D7 | Clickable `<div>` acting as a button, not keyboard reachable | `div.coupon` "Apply coupon" | B10, A3 |
| D8 | Icon-only remove button with no accessible name, 20×20 px target | `button.icon-btn` | A4, I6, B4 |
| D9 | Informative product image without `alt` | `img.product` | I8, A9 |
| D10 | "Click here" link text | `.fine a` | W6, N8 |
| D11 | Help text fails contrast: `#aaa` on `#fff` ≈ 2.3:1 at 11 px | `.help` | C1, T11 |
| D12 | Off-scale spacing: 11, 13, 19, 27 px | `header`, `main`, `.row`, `.summary` | L1 |
| D13 | Required marked by red asterisk only, no legend; `required` attribute missing | `.req` | FM4 |
| D14 | Two-column layout with mismatched widths for unrelated fields (email + phone) | second `.row` | FM2, FM18 |
| D15 | Input border `#ddd` on white ≈ 1.4:1, below 3:1 for UI components | `input` | C2, FM9 |
| D16 | 11 px body text (help text, fine print), below the 12 px floor | `.help`, `.fine` | T5 |

## Traps (correct as written — flagging these is a false positive)

| # | Element | Why it is correct |
|---|---|---|
| T1 | `img.divider` with `alt=""` | Decorative image; empty alt is the right treatment |
| T2 | `button.btn-secondary` "Back to cart" | Outline secondary, `#0b5fff` on white ≈ 5.0:1 |
| T3 | First/last name labels | Visible `<label for>` correctly associated |

## Not observable from the static file

No script ships with the page (`applyCoupon` is undefined). Claims about what happens after
"Pay now", loading states, or confirmation messages cannot be verified from this file, so a
correct audit marks them unverified rather than rating them Critical or High.

# account.html — seeded ground truth

Used by `ui-ux-audit-playbook--static-account-wcag22`. Tests the WCAG 2.2 procedures (focus-walk, text-spacing, live-regions, wcag22-inventory).

| # | Defect | Where | Check |
|---|---|---|---|
| E1 | Fixed cookie bar (~150 px) covers focused controls near the bottom of the viewport; no `scroll-padding-bottom` | `.cookie` over `#pw`, `#otp`, "Change password", "Billing history" | A18, 2.4.11 |
| E2 | Focus indicator removed on the primary button (`.btn:focus { outline: none }`, nothing else changes) | `#save` | A2, 2.4.7 |
| E3 | Card title in a fixed 24 px box with `overflow:hidden`, clipped under text-spacing overrides | `h2.card-title` | A19, 1.4.12 |
| E4 | Paste blocked on the password field (`paste` handler calls `preventDefault`) and no `autocomplete="current-password"` | `#pw` | A20, 3.3.8 |
| E5 | "Profile saved" toast is injected without a live region (the separate `#status` line is announced) | `.toast` | A23, FB4, 4.1.3 |
| E6 | Dashboard order is drag-only (`draggable=true` list items, not focusable, no buttons) | `.list li` | A21, 2.5.7 |

## Traps (correct as written)

| # | Element | Why it is correct |
|---|---|---|
| U1 | `#status` with `role="status"` | announces "Last saved just now" |
| U2 | `#otp` with `autocomplete="one-time-code"` and no paste handler | allows autofill and paste |
| U3 | `.btn--quiet:focus` outline | visible focus on the secondary buttons |
