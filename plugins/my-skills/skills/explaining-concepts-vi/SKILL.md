---
name: explaining-concepts-vi
description: Use when asked to explain an abstract, confusing, or ambiguous concept in Vietnamese for someone with no technical/domain background — "giải thích ... cho người không rành", "làm sao để hình dung được...", or any request to make a hard idea click for a lay Vietnamese reader. Not for translating existing English text (translate-en-vi) or engineering/product documentation (vietnamese-tech-writing).
---

# Explaining Concepts in Vietnamese

## Overview

Teaches a concept from scratch, in natural spoken-register Vietnamese, anchored to a
concrete everyday analogy the reader already has a mental picture of — then reinforces
that mental picture with a real diagram, not decoration. The goal is the reader can
*picture* the mechanism (hình dung được), not just recite a definition.

## When to Use

- "Giải thích [khái niệm] cho người không biết gì về kỹ thuật/tài chính/khoa học"
- A concept is abstract enough that a plain dictionary-style definition won't make it click
  (compound interest, inflation, how vaccines work, how blockchain works, statistical bias...)
- The request explicitly wants it easy to imagine/visualize, or asks for a diagram alongside

**Not for:** translating existing English prose (`translate-en-vi`), or Vietnamese
engineering/product docs aimed at practitioners (`vietnamese-tech-writing`) — both assume
the reader already has domain vocabulary; this skill assumes they have none.

## Core Approach

1. **Find the anchor before writing anything.** One concrete, everyday Vietnamese-relatable
   situation that shares the concept's actual mechanism (not just a vague vibe). Compound
   interest → a snowball rolling downhill picking up more snow per turn, not "lãi mẹ đẻ lãi
   con" repeated with no mechanism attached. If no anchor is obvious, the concept probably
   needs decomposing into a smaller piece first — don't skip straight to jargon.
2. **Structure, in this order:**
   - Mở đầu bằng chính cái ẩn dụ/tình huống quen thuộc — chưa nhắc thuật ngữ.
   - Nối ẩn dụ đó với khái niệm thật: "Đây chính là cách [X] hoạt động."
   - Chỉ ra đúng chỗ hay gây nhầm lẫn (the ambiguous part the reader actually asked about) —
     đây là phần quan trọng nhất, đừng lướt qua.
   - Vì sao điều này quan trọng / áp dụng ở đâu trong đời thực.
   - Một sơ đồ minh hoạ đúng cơ chế (see Visualizing below).
   - Một câu chốt ngắn để tự kiểm tra đã hiểu chưa ("Nếu X tăng gấp đôi, bạn nghĩ Y sẽ...?").
3. **Register:** giọng tự nhiên như đang giải thích trực tiếp cho một người bạn — câu ngắn,
   xưng "bạn", không dùng văn viết trang trọng, không giữ nguyên thuật ngữ tiếng Anh trừ khi
   không thể tránh (thì giải nghĩa ngay trong ngoặc bằng tiếng Việt thường ngày, không phải
   bằng một thuật ngữ khác khó hơn). Tránh dịch sát nghĩa đen — nếu một cụm nghe gượng khi
   đọc thành tiếng, viết lại.

## Visualizing

The diagram must show the *mechanism* the anchor described, not decorate the page — a
static bar chart of "before vs after" numbers is usually not enough for a mechanism the
reader needs to picture unfolding over time or across a comparison.

**REQUIRED:** publish the explanation as an Artifact. Load `artifact-design` first, and
`artifact-diagramming` for the diagram itself. If the concept has a parameter the reader
could tweak to build intuition (interest rate, sample size, mutation rate...), an
interactive control (slider, toggle, step-through) that redraws the diagram live earns its
place — load `artifact-capabilities` only if that needs saved/shared state, which it
usually doesn't; a local `useState`-style redraw is enough.

Numbers shown on the diagram must come from a real calculation in the page's own script —
compute them, don't estimate or eyeball them. A reader trusting a wrong number is worse than
the diagram not existing. Pick whatever diagram form actually matches the concept's
mechanism (a growth curve, a before/after bar comparison, a flow between roles, a
timeline) — don't default to a bar chart when the mechanism isn't fundamentally about
comparing two bars.

## Common Mistakes

| Mistake | Fix |
|---|---|
| Defining the term before the anchor lands | Anchor first, name the concept second |
| Anchor shares a vibe but not the actual mechanism | Re-pick one where the mechanics map 1:1 |
| English jargon left unexplained, or explained with harder jargon | Explain in plain everyday Vietnamese words |
| Formal/written register (văn viết, "quý vị", passive constructions) | Conversational, second-person "bạn" |
| Diagram is a generic icon or decorative chart | Diagram must show the mechanism the anchor described |
| Skimming past the exact ambiguous/confusing part | That part is the point — give it the most space |
| Wall of text with no self-check | End with a short question the reader can answer if it landed |
| Stacking 2-3 separate mini-explanations with no single unifying anchor | One concrete situation the whole explanation hangs off, start to finish |
| Diagram numbers eyeballed/approximated | Compute them for real in the page's own script |
| Forcing a bar chart on a mechanism that isn't a bar comparison | Match diagram form to the actual mechanism (curve, flow, timeline...) |
