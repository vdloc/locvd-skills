# Research: Form Layout & Page Layout Principles (Primary Sources)

**Purpose:** Grounds a future revision of `chapters/ch03-layout-spacing-grids.md` and `chapters/ch09-forms-input.md` in primary UX research — original studies, official design-system docs, first-party research orgs — specifically on (a) how form inputs should be arranged relative to each other, and (b) how supporting diagrams/illustrations should be arranged relative to form inputs and page content.

**Status:** Research only. No chapter or SKILL.md file has been edited. Each finding below states whether it CONFIRMS, EXTENDS, or CONTRADICTS the existing chapter text (quoted verbatim from the current files as of this research).

---

## 1. Label placement & field grouping — Luke Wroblewski / Penzo eye-tracking research

**Primary source retrieved directly:** Luke Wroblewski, *"Best Practices for Form Design"* slide deck, author of *Web Form Design: Filling in the Blanks* (Rosenfeld Media, 2008) — `https://static.lukew.com/webforms_lukew.pdf`. Full text extracted locally with `pdftotext` (the page itself is a scanned/vector slide deck, not indexable by ordinary fetch).

**Claim 1 — Top-aligned labels give fastest completion; the underlying eye-tracking study is Penzo's, not Wroblewski's own.**
Slide 25 ("Eye-tracking Data") states verbatim:
> "July 2006 study by Matteo Penzo / Left-aligned labels: Easily associated labels with the proper input fields; Excessive distances between labels inputs forced users to take more time / Right-aligned labels: Reduced overall number of fixations by nearly half; Form completion times were cut nearly in half / Top-aligned labels: Permitted users to capture both labels & inputs with a single eye movement; Fastest completion times."

Slide 26 ("Best Practice"): *"For reduced completion times & familiar data input: top aligned. When vertical screen space is a constraint: right aligned. For unfamiliar, or advanced data entry: left aligned."*

**Source:** Luke Wroblewski, *Web Form Design: Filling in the Blanks* (2008), presentation PDF `https://static.lukew.com/webforms_lukew.pdf`; underlying study: Matteo Penzo, *"Label Placement in Forms"*, UXmatters, July 2006, `https://www.uxmatters.com/mt/archives/2006/07/label-placement-in-forms.php`.

**Independent academic confirmation:** Bargas-Avila, J. A., Brenzikofer, O., Roth, S. P., Tuch, A. N., Orsini, S., & Opwis, K. (2010), *"Simple but Crucial User Interfaces in the World Wide Web: Introducing 20 Guidelines for Usable Web Form Design,"* in *User Interfaces*, IntechOpen — `https://cdn.intechopen.com/pdfs/10814/InTech-Simple_but_crucial_user_interfaces_in_the_world_wide_web_introducing_20_guidelines_for_usable_web_form_design.pdf`. This is a peer-reviewed literature review, not a blog restating Wroblewski. It states (§2.2, extracted verbatim):
> "Penzo (2006) examined the position of labels relative to the input field in a study using eye-tracking. He compared left-, right- and top-aligned labels and came to the conclusion that with left-aligned labels people needed nearly twice as long to complete the form as with right-aligned labels. Additionally, the number of fixations needed with right-aligned labels was halved. The fastest performance however was reached with top-aligned labels, which required only one fixation to capture both the label and the input field at the same time."

And derives **Guideline 5**: *"To enable people to fill in a form as fast as possible, place the labels above the corresponding input fields (see Penzo, 2006)."*

**Relation to existing content:** CONFIRMS ch09 §"Basics of form design" bullet *"top-aligned labels for responsive"* and §"Single-column layout" bullet *"labels stacked above inputs (not left: zig-zag, jagged, wrapping)."* The existing chapter states the top-alignment recommendation as settled fact without a named study; this research supplies the actual named primary source (Penzo 2006, popularized/operationalized by Wroblewski 2008) and the quantified mechanism (single-fixation capture vs. near-doubled completion time for left-aligned). **Gap:** ch09 doesn't currently note Wroblewski's own nuance that left-aligned labels are situationally correct — "when data required is unfamiliar... enables label scanning" (slide 23) and right-aligned when vertical space is constrained. Ch09 treats top-aligned as the default without surfacing this three-way tradeoff table explicitly sourced.

**Claim 2 — Field length should match expected answer length (affordance).**
Wroblewski slide deck, "Field Lengths" section: *"Field lengths can provide valuable affordances... Appropriate field lengths provide enough space for inputs... Random field lengths may add visual noise to a form."*
Bargas-Avila et al. (2010) **Guideline 7**: *"Match the size of the input fields to the expected length of the answer (see Christian et al., 2007; Couper et al., 2001; Wroblewski, 2008)."* — citing two further empirical studies:
- Christian, C. G., Dillman, D. A., & Smyth, J. D. (2007): in a two-box date-entry field, "participants gave more answers in the expected format (two characters for the month and four for the year) if the field for the month was half the size of the one for the year."
- Couper, M. P., et al. (2001): "people gave more incorrect answers if the size of the input field did not fit the length of the expected input."

**Relation to existing content:** CONFIRMS and EXTENDS ch09's existing check FM7 (*"Field sizing: Widths reflect expected length"*, sourced `PUI, TID`). It already states the rule; this research adds a second, independently-sourced academic citation lineage (Christian et al. 2007, Couper et al. 2001) with a concrete numeric example (half-width month field vs. year field measurably improves format compliance) that ch09 currently lacks.

**Claim 3 — Content grouping should use the *minimum* visual elements necessary.**
Wroblewski slide deck, "Content Grouping" section: *"Groupings provide a way to scan information required at a high level [and] a sense of how information within a form is related."* Best practice slide: *"Use relevant content groupings to organize forms. Use the minimum amount of visual elements necessary to communicate useful relationships."* (Slides contrast "Lots of content grouping" / "Excessive visual noise" against "Minimum amount necessary" as the recommended state.)

**Relation to existing content:** CONFIRMS ch03 L3 (*"Containers justified: Cards/boxes only where proximity/similarity/continuity isn't enough"*) and ch09's *"Group related fields under headings when you can't split"* — both already lean toward minimal containers. This is a second, independent primary source (form-specific, not general layout) for the same principle, worth citing alongside PUI in ch09's grouping guidance.

**Claim 4 — Required-field marking interacts with physical separation, not just labeling.**
Bargas-Avila et al. (2010), §2.1, citing Tullis, T. S., & Pons, A. (1997): *"Tullis and Pons (1997) found that people were fastest at filling in required fields when the required and optional fields were separated from each other."* Also citing Pauwels, S. L., et al. (2009): *"Participants were faster, made fewer errors, and were more satisfied when the required fields were highlighted in color"* (vs. asterisk alone).

**Relation to existing content:** EXTENDS and partially CONTRADICTS ch09. Existing ch09 "Required & optional" section only discusses *marking convention* (asterisk, "(required)"/"(optional)" text) and explicitly says PUI recommends *"not red"* for the asterisk. The Pauwels et al. (2009) finding is a data point in tension with that "not red" guidance — color-coding required fields measurably improved speed/errors/satisfaction versus asterisk-only in that study. ch09's Conflicts & Context section already reconciles a *marking-convention* conflict (PUI vs KUL vs TID/NN/g vs gov standards) but has never considered the *physical grouping* dimension (separating required fields from optional fields spatially, not just marking them) — this is a genuinely new axis, not just a stronger citation for an existing point.

---

## 2. Baymard Institute — form-layout usability research

**Source org:** Baymard Institute (baymard.com), large-scale e-commerce UX benchmark/usability-testing organization; first-party primary research (not a blog aggregating others' studies).

**Claim 1 — Avoid extensive multi-column form layouts.**
Baymard, *"Avoid Extensive Multicolumn Layouts,"* `https://baymard.com/blog/avoid-multi-column-forms`:
> "Extensive multicolumn forms can lead to misreading and user input errors" — "a single-column layout makes it easier to both complete and then review inputted form details." "16% of sites" use extensive multicolumn checkout forms despite the problems. "[Different] columns of empty fields draw users' attention in multiple directions, making it more difficult" to parse the form; multicolumn layouts are "more prone to errors, both from skipping overlooked required fields or spending unnecessary effort on inappropriate ones."

The article also draws the boundary case Baymard considers acceptable: fields that form *"a single coherent entity"* (day/month/year, first/last name, city/state/ZIP, card expiry/CVC) may share a row as **2–3 inputs on one line within an overall single-column layout** — this is not "multicolumn," it's grouped sub-fields of one logical answer.

**Relation to existing content:** CONFIRMS ch09's *"Single-column layout [PUI]"* framework and the *"short related fields side-by-side is fine (expiry + CVC)"* exception almost verbatim — ch09 already states this correctly, sourced only to PUI. This gives a second, first-party large-sample research citation (Baymard's usability-testing benchmark, not a book heuristic) for the same rule, plus Baymard's exact criterion for what counts as an acceptable exception ("single coherent entity," not merely "short and related").

**Claim 2 — Provide a visual aid (image/diagram) directly at a complex or hard-to-locate field.**
Baymard, *"8 Recommendations for Creating Effective Input Fields,"* `https://baymard.com/learn/input-fields`:
> "Provide either an inline thumbnail or a tooltip showing where the 'Security Code' can be found on a physical credit card." Case example: on REI's checkout, a test participant "clicked on the tooltip next to the 'Security Code' label... which loaded a credit card image with the 'Security Code' highlighted," resolving what would otherwise be a stalling point. Stat: **"38% of test participants stopped their progress through the checkout flow once they'd progressed to the 'Security Code' field"** absent this aid.

**Relation to existing content:** This is a genuine **gap** — neither ch03 nor ch09 currently contains *any* guidance on placing an image/diagram adjacent to a specific field to resolve a "where do I find this" problem. Ch09's closest existing content is the "Hints above fields" bullet (*"tell password rules before typing... critical hints visible, not in tooltips"*) — which is text-only hint guidance and explicitly steers *away* from tooltips. Baymard's finding is narrower and different in kind: for **spatially-locatable physical data** (a code printed somewhere on a card/device), a small inline image beats a text description, and a tooltip is acceptable here specifically because the content is an image showing a location, not a text rule that needs to be read before typing (which is ch09's existing objection to tooltips). This is a case where the general "no tooltips for hints" rule needs a documented exception, with a quantified cost of skipping it (38% stall rate).

**Claim 3 — Inline (on-blur) validation reduces errors and should be paired with correct timing.**
Baymard, *"Usability Testing of Inline Form Validation,"* `https://baymard.com/blog/inline-form-validation`: **32% of sites in Baymard's e-commerce benchmark fail to provide any field-level validation at all**; inline validation lets users "correct errors while the input is still fresh in mind" rather than discovering them only at submission. Baymard's guidance is that inline validation should fire **on blur** (leaving the field), not on keystroke, to avoid flagging incomplete input as wrong mid-entry (e.g., an email flagged invalid before the domain is finished).

**Relation to existing content:** Mostly CONFIRMS ch09's existing "On blur (inline)" validation approach and FM10 check (*"Inline for complex fields... no premature errors while typing"*). Notable tension worth flagging: the independent 2010 academic review above (Bargas-Avila et al., citing their own 2009 study) found the opposite in a controlled study — *"If the error messages appeared at the moment the erroneous field was left (inline validation), the participants made significantly more errors completing the form. They simply ignored... the appearing error messages without reading them"* — versus end-of-submit or pop-up error presentation, which produced fewer consecutive errors. This is a genuine unresolved conflict between two primary sources on inline validation efficacy (Baymard's large-sample field usability testing vs. Bargas-Avila's controlled lab study), not currently surfaced in ch09's Conflicts & Context section, which discusses validation *approach* (submit vs blur vs as-you-type) but treats blur-validation as safely settled.

**Claim 4 — Mobile label position: top-aligned is correct except in landscape.**
Baymard, *"Field Label UX: Place Labels Above the Field,"* `https://baymard.com/blog/mobile-form-usability-label-position`, based on "a large-scale usability study of 18 mobile e-commerce sites... more than a thousand mobile checkout form fields": labels should be **above fields on mobile, with one exception** — in landscape orientation the on-screen keyboard consumes 67–82% of the viewport, so dynamically switching to left-aligned labels in landscape preserves visible context. Left-aligned labels on portrait mobile caused truncated/unreadable input: *"Not being able to see their input caused trouble for numerous of the subjects during testing."*

**Relation to existing content:** EXTENDS ch09. The chapter's responsive guidance ("top-aligned labels for responsive" under Frameworks Introduced) states the rule but gives no orientation-specific nuance and no field-level check for it. This is a concrete, missing sub-rule: **landscape mobile is a documented exception to top-aligned labels**, not currently in ch09's Audit Checks table.

---

## 3. NN/g (Nielsen Norman Group) — form design & layout articles

**Claim 1 — Proximity/whitespace grouping in forms.**
Marieke McCloskey, *"Group Form Elements Effectively Using White Space,"* NN/g, Nov 3, 2013 — `https://www.nngroup.com/articles/form-design-white-space/`:
> "Items near each other appear related" (invoking Gestalt proximity). Labels should sit "closer to the associated text field than to other text fields." "Grouping related fields together helps users make sense of the information that they must fill in." Left-aligned labels placed too far from their fields risk users failing "to associate the correct label with its corresponding field." "Increasing the white space between form elements makes [the] form less overwhelming and therefore more likely to be completed."

**Relation to existing content:** CONFIRMS ch09's FM15 (*"Spacing: Label↔input ≪ field↔field"*, sourced RUI/PUI) and ch03's L2 (*"Group > within-group spacing"*). This is a third independently-sourced citation (an NN/g first-party usability-research org, not a book) for a rule ch09 already states — useful for strengthening the citation, not for new content.

**Claim 2 — Visual aids for complex/unfamiliar identifiers, illustrated with a real example.**
Huei-Hsin Wang, *"Few Guesses, More Success: 4 Principles to Reduce Cognitive Load in Forms,"* NN/g — `https://www.nngroup.com/articles/4-principles-reduce-cognitive-load/`:
> "Grouping related fields into sections makes long forms feel more manageable because it allows users to focus on one information category at a time." "Apply consistent, strategic spacing to form fields. Elements close together are perceived as related." For visually grouping without spacing alone, the article recommends "containers, subtle divider lines, or colored backgrounds" to reinforce which fields belong together. On complex identifiers: "When requesting complex identification strings... tell users exactly what to look for" (e.g., "16-digit code found on your receipt"), and cites Dyson's support flow, which pairs the serial-number input field with an **accompanying illustration showing where on the physical product to find the serial number**.

**Relation to existing content:** This is the second independent primary source (after Baymard's CVV example above) documenting the same pattern — **an inline diagram/illustration placed next to a field that asks for a physically-located value** — from a different research org (NN/g vs. Baymard), different domain (product serial number vs. credit-card CVV), converging on the same design pattern. This strengthens the case that ch03/ch09 have a real, well-evidenced gap: no rule exists for "when the requested value's *location* is the hard part, put an image at the field, not just text." NN/g's "containers/divider lines/colored backgrounds" guidance for section grouping also lightly EXTENDS ch03's Gestalt framework list — ch03 already names *common region* as "strongest but cluttering if overused"; NN/g's practical framing (use spacing first, containers only as reinforcement) matches ch03's existing stance and doesn't add new content here.

**Claim 3 — Gestalt Proximity, applied directly to forms.**
Aurora Harley, *"Proximity Principle in Visual Design,"* NN/g, Aug 2, 2020 — `https://www.nngroup.com/articles/gestalt-proximity/`:
> "Items close together are likely to be perceived as part of the same group." Applied to forms: "A single form with 12 fields appears more taxing than the same fields broken into three meaningful sections, demonstrating how proximity reduces cognitive load." Warning: grouping unrelated elements risks "camouflaging important functionality" — users may examine one item in a perceived group and assume the rest share its purpose, causing them to overlook items "buried within irrelevant groupings."

**Relation to existing content:** CONFIRMS ch03's Gestalt framework (*"Proximity"* is already listed) and ch09's chunking guidance for long forms (FM13, multi-step). The specific "12 fields → 3 sections" framing and the miscategorization-risk warning are not currently in either chapter and could be added as a concrete illustrative number/caution under ch09's "Group related fields under headings" guidance.

---

## 4. Official design-system documentation — form-layout specs

**Material Design 3 (m3.material.io) — Text fields.**
`https://m3.material.io/components/text-fields/specs`: for "normal" density text fields, the documented internal spacing is: **padding above the label 16dp, padding below the label 8dp, padding above and below the input line 8dp each**; a "dense" variant tightens this to 8dp above label / 4dp below label, with the input-line padding unchanged at 8dp. Labels are "aligned with the input line and always visible" — either "resting" (inactive/empty) or "floating" (active/filled), i.e., MD3's own version of a floating label, always visible rather than disappearing like a placeholder.

**Relation to existing content:** EXTENDS ch03's spacing-scale content and ch09's "Conventional field styles" / "Floating labels" discussion. Ch03 documents cross-book spacing scales (RUI/PUI/KUL) but has no citation to a shipped, first-party design system's actual field-internal spacing values — MD3's numbers (16/8/8dp) are a concrete real-world data point that could sit alongside ch03's existing scale table. Ch09 already flags "floating labels acceptable if they stay visible" [KUL] — MD3's specs *are* the canonical implementation of exactly that constraint (always-visible resting/floating states, never disappearing), worth citing as the reference implementation.

**Apple Human Interface Guidelines — Text fields.**
`https://developer.apple.com/design/human-interface-guidelines/components/selection-and-input/text-fields/` (accessed via search-result synthesis; direct fetch returned 403/404 — see Sourcing note below):
> "Stack multiple text fields vertically when possible, and use consistent widths to create a more organized layout" (e.g., first/last name may share one width, address/city another). "Evenly space multiple text fields, and leave enough space between them so people can easily see which input field belongs with each introductory label." "Ensure that tabbing between multiple fields flows as people expect" — focus should move "in a logical sequence."

**Relation to existing content:** CONFIRMS ch09's single-column stacking guidance and its "strong vertical alignment" bullet from TID. EXTENDS with two points not currently in ch09: (1) explicit guidance to standardize *widths in groups* (not just heights/spacing) — related fields sharing one width, differently-grouped fields another; ch09 discusses width as an affordance for expected input length (matches Wroblewski above) but not as a *grouping signal* via shared width across a row of related fields. (2) An explicit tab-order/focus-sequence requirement, which connects directly to the WCAG 1.3.2 finding below but isn't currently cross-referenced in ch09's checks (FM checks don't mention tab order).

**Sourcing note:** `developer.apple.com` and `m3.material.io`'s deeper pages blocked direct WebFetch/curl (403/404 in this environment); the MD3 spacing figures and HIG quotes above were obtained via search-result synthesis rather than a raw page fetch. They are consistent across repeated independent search queries and match the publicly documented values as of the last training update, but flag this for the user: if the chapters are ever updated to cite exact MD3/HIG numbers, verify current values by opening the live pages directly, since these are actively maintained specs that can change between MD3 releases.

---

## 5. Gestalt principles applied to form/diagram layout

**Primary/academic source:** Chang, D., Dooley, L., & Tuovinen, J. E. (2002), *"Gestalt Theory in Visual Screen Design — A New Look at an Old Subject,"* in *WCCE2001 Australian Topics: Selected Papers from the Seventh World Conference on Computers in Education*, Australian Computer Society, pp. 5–12 — `https://oro.open.ac.uk/11356/1/p5-chang_Dooley_Tuovinen.pdf`. This is a peer-reviewed conference paper (Open University repository copy), not a design blog. It distills Gestalt literature into eleven laws relevant to screen design: balance/symmetry, continuation, closure, figure-ground, focal point, isomorphic correspondence, prägnanz, proximity, similarity, simplicity, and unity/harmony.

**Applied source, forms-specific:** NN/g's Harley (`gestalt-proximity`, cited above §3) and Wang (`4-principles-reduce-cognitive-load`, cited above §3) are the two clearest *first-party, forms-specific* applications of proximity/common-region found in this research — both converge on: (a) proximity/spacing as the primary grouping tool for fields, (b) containers/common-region as reinforcement only when spacing alone is ambiguous, and (c) for diagrams specifically, place the illustration **immediately adjacent to the field it explains** (Dyson serial number; Baymard's REI CVV tooltip), which is itself an application of proximity — the diagram and the field it clarifies must be closer to each other than either is to any other page element, exactly matching ch03's existing "space around a group > space within it" framing.

**Relation to existing content:** ch03's Gestalt framework list (*Common region, Proximity, Similarity, Continuity, Closure, Figure–ground, Uniform connectedness*, sourced PUI/TID/WSG) is already fuller than Chang/Dooley/Tuovinen's eleven laws in the specific subset it covers (it's missing balance/symmetry, focal point, isomorphic correspondence, prägnanz, simplicity, unity/harmony — but those are mostly not what this research question is about). The **gap is not in the Gestalt taxonomy itself** — ch03 has adequate coverage there — **the gap is in application**: neither ch03 nor ch09 currently states a rule for *where a supporting diagram/illustration belongs relative to a field or group of fields*. This research surfaces that the applicable rule, per NN/g and Baymard's converging examples, is simply proximity's ordinary rule applied to a new element type: the diagram is part of the field's "group" and must sit closer to that field than to anything else, generally directly beside or below the field/label it explains, not in a separate help panel or a general FAQ section.

---

## 6. WCAG 2.2 — success criteria bearing on form/diagram layout & reading order

**SC 1.3.2 Meaningful Sequence (Level A).** Normative text, W3C Web Content Accessibility Guidelines 2.2, `https://www.w3.org/TR/WCAG22/#meaningful-sequence`:
> "When the sequence in which content is presented affects its meaning, a correct reading sequence can be programmatically determined."
Intent (per the W3C Understanding document, `https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html`): ensures that the order assistive technology (screen readers, switch/voice control) exposes content in matches the sequence a sighted user perceives visually — critical when CSS visually repositions content (e.g., a diagram placed beside a field via `float`/grid/flex `order`) such that DOM order no longer matches visual order.

**Relation to existing content:** This is a **direct, currently-missing constraint** on the diagram-placement question the user asked about. Ch03 has no accessibility cross-reference for its layout/grid guidance at all — L6 ("Macro grid consistent") and the whole "Grids" framework section discuss visual column/gutter placement with zero mention of DOM-order-vs-visual-order risk. If a future edit adds "place the diagram next to the field" guidance (per §5 above), SC 1.3.2 is the exact citation needed to also say: *the diagram's position in the DOM/reading order must match its visual adjacency to the field, or provide an equivalent text alternative in sequence, especially in CSS grid/flex layouts where `order` or grid-placement can visually move an image away from its logical position without moving it in the DOM.*

**SC 2.5.8 Target Size (Minimum) (Level AA).** Normative text, `https://www.w3.org/TR/WCAG22/#target-size-minimum`:
> "The size of the target for pointer inputs is at least 24 by 24 CSS pixels," except where the target is spaced such that a 24px circle centered on it doesn't intersect another target, the same function is available via an equivalently-sized control elsewhere on the page, the target is inline within text, sized by the user agent and not modified by the author, or a particular size is legally/essentially required.

**Relation to existing content:** ch03's L12 (*"Touch spacing: ≥8pt between adjacent targets (16pt safe)"*, sourced PUI) covers *spacing between* targets but not *minimum target size* itself, and doesn't cite WCAG at all (PUI is the only source given). SC 2.5.8 is a Level AA numeric requirement (24×24 CSS px minimum, new in WCAG 2.2) that ch03 doesn't currently reference anywhere — this is a genuine citation gap for any interactive form control (checkbox, radio, stepper button) sized below 24px.

**SC 3.2.6 Consistent Help (Level A, new in WCAG 2.2).** Per W3C: if a page provides help mechanisms (human contact details/mechanism, self-help option, or automated contact mechanism such as a chatbot) and those mechanisms repeat across multiple pages in a set, they must occur "in the same order relative to other page content" on each page, unless the user initiates a change.

**Relation to existing content:** Not currently referenced anywhere in ch03 or ch09. Relevant to the diagram/help-content placement question specifically for *repeated* help patterns — e.g., if a multi-step form (ch09's "Multi-step forms" section) shows a contextual illustration/help link on more than one step, SC 3.2.6 requires that help element to stay in a consistent position relative to the surrounding content across steps, not just to exist on each step. This is a layout-consistency rule ch09's multi-step guidance doesn't currently address (it covers progress indicators and review screens, not help-element position consistency).

---

## Gaps found (concrete, editable form)

1. **No rule for placing a diagram/illustration next to a field that requires locating a physical value.** Two independent, converging first-party sources — Baymard (`baymard.com/learn/input-fields`, CVV/REI example, 38% stall-rate stat) and NN/g (`nngroup.com/articles/4-principles-reduce-cognitive-load/`, Dyson serial-number example) — document the same pattern: an inline image/diagram at the field, not a text-only hint. ch09's current "Hints above fields" guidance is text-only and actively discourages tooltips generally; this needs a scoped exception for image-based location hints, with the exception's rationale (a picture of *where to look* is not the same failure mode as a text rule hidden in a tooltip) made explicit. Candidate new check for ch09's Audit Checks table: *"Complex/hard-to-locate field values (serial numbers, security codes, physical labels) paired with an inline image or diagram showing where the value is found, not text-only instructions."*

2. **No orientation-specific exception to top-aligned mobile labels.** Baymard's mobile study (`baymard.com/blog/mobile-form-usability-label-position`) found labels should switch to left-aligned in landscape because the keyboard consumes 67–82% of the viewport. ch09 states top-aligned as the responsive default with no landscape carve-out.

3. **No guidance on standardizing field *widths* as a grouping signal across a row.** Apple HIG's text-field guidance recommends giving related fields (e.g., first/last name) one consistent width and differently-related fields (e.g., address/city) another, as a visual grouping cue distinct from spacing. ch09 covers width-as-affordance-for-input-length (Wroblewski/Christian et al./Couper et al.) but not width-as-grouping-signal.

4. **No accessibility cross-reference anywhere in ch03's layout/grid section.** Zero mention of WCAG. At minimum, SC 1.3.2 (Meaningful Sequence — DOM order vs. visual order risk in CSS grid/flex reordering, directly relevant if diagram-placement guidance is added per gap #1) and SC 2.5.8 (Target Size Minimum, 24×24 CSS px — a numeric floor ch03's L12 touch-spacing check doesn't currently state) should be added as sources/checks.

5. **No guidance on physically separating required fields from optional fields (as opposed to just marking them differently).** Bargas-Avila et al. (2010), citing Tullis & Pons (1997), found spatial separation of required/optional fields improved completion speed independent of marking convention. ch09's "Required & optional" section and its Conflicts & Context entry only resolve the *marking* question (asterisk vs. text vs. color); the *spatial-grouping* question is untouched.

6. **The "asterisk not red" rule (PUI) is in unacknowledged tension with a primary study.** Pauwels et al. (2009), per Bargas-Avila et al. (2010) review, found color-highlighted required fields outperformed asterisk-only on speed, errors, and satisfaction. ch09 currently states PUI's "not red" guidance as settled without flagging this counter-finding — worth adding to the existing Conflicts & Context entry for required/optional marking, not necessarily overturning PUI's rule, but the chapter should note the tension exists.

7. **Unresolved conflict on inline (on-blur) validation error rates between Baymard (field research, favorable) and Bargas-Avila et al. 2009 (controlled study, unfavorable — found on-blur inline validation increased errors vs. end-of-submit/pop-up presentation).** ch09 currently presents on-blur inline validation as a safely-recommended default (FM10) without surfacing that a controlled academic study found the opposite under some conditions. Worth a note in Conflicts & Context rather than a check change, since Baymard's larger and more recent field data is probably the better default — but the tension should be visible to whoever edits the chapter next.

8. **No first-party design-system citation for field-internal spacing values.** ch03/ch09 cite RUI/PUI/KUL spacing scales but no shipped system's actual numbers. Material Design 3 documents 16dp/8dp/8dp (label-above/label-below/input-line padding) for normal-density text fields — a concrete number set that could anchor ch09's field-internal spacing guidance to a real, currently-maintained implementation.

9. **No explicit tab-order / focus-sequence check in ch09's Audit Checks table.** Apple HIG explicitly requires tabbing between fields to "flow as people expect... in a logical sequence" — this connects directly to WCAG SC 1.3.2 (gap #4) but ch09's FM-series checks don't currently test focus/tab order at all, only visual layout and ARIA/labeling (FM3, FM11).

10. **SC 3.2.6 Consistent Help (new in WCAG 2.2) is unaddressed for multi-step forms.** ch09's multi-step form guidance (progress indicator, review screen) doesn't require that contextual help/illustration elements stay in a consistent relative position across steps — a small but concrete, citable gap for forms with recurring per-step help content.

---

## Sources index (all primary/first-party)

- Wroblewski, L. (2008). *Web Form Design: Filling in the Blanks*, presentation PDF: `https://static.lukew.com/webforms_lukew.pdf`
- Penzo, M. (2006). "Label Placement in Forms." UXmatters: `https://www.uxmatters.com/mt/archives/2006/07/label-placement-in-forms.php`
- Bargas-Avila, Brenzikofer, Roth, Tuch, Orsini, Opwis (2010). "Simple but Crucial User Interfaces in the World Wide Web: Introducing 20 Guidelines for Usable Web Form Design." IntechOpen: `https://cdn.intechopen.com/pdfs/10814/InTech-Simple_but_crucial_user_interfaces_in_the_world_wide_web_introducing_20_guidelines_for_usable_web_form_design.pdf`
- Baymard Institute, "Avoid Extensive Multicolumn Layouts": `https://baymard.com/blog/avoid-multi-column-forms`
- Baymard Institute, "8 Recommendations for Creating Effective Input Fields": `https://baymard.com/learn/input-fields`
- Baymard Institute, "Usability Testing of Inline Form Validation": `https://baymard.com/blog/inline-form-validation`
- Baymard Institute, "Field Label UX: Place Labels Above the Field": `https://baymard.com/blog/mobile-form-usability-label-position`
- McCloskey, M. (2013). "Group Form Elements Effectively Using White Space." NN/g: `https://www.nngroup.com/articles/form-design-white-space/`
- Wang, H-H. "Few Guesses, More Success: 4 Principles to Reduce Cognitive Load in Forms." NN/g: `https://www.nngroup.com/articles/4-principles-reduce-cognitive-load/`
- Harley, A. (2020). "Proximity Principle in Visual Design." NN/g: `https://www.nngroup.com/articles/gestalt-proximity/`
- Material Design 3, "Text fields — specs": `https://m3.material.io/components/text-fields/specs`
- Apple, Human Interface Guidelines, "Text fields": `https://developer.apple.com/design/human-interface-guidelines/components/selection-and-input/text-fields/`
- Chang, Dooley, Tuovinen (2002). "Gestalt Theory in Visual Screen Design." Open University repository: `https://oro.open.ac.uk/11356/1/p5-chang_Dooley_Tuovinen.pdf`
- W3C, WCAG 2.2, SC 1.3.2 Meaningful Sequence: `https://www.w3.org/TR/WCAG22/#meaningful-sequence`
- W3C, WCAG 2.2, SC 2.5.8 Target Size (Minimum): `https://www.w3.org/TR/WCAG22/#target-size-minimum`
- W3C, WCAG 2.2, SC 3.2.6 Consistent Help: `https://www.w3.org/TR/WCAG22/#consistent-help`
