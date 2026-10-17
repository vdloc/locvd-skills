# Web Form Layout: Evidence from Primary Sources (desktop and tablet, visual layout)

This file is research input for the Claude skill **web-form-layout-refactor**. All sources were accessed on 2026-10-17.

**Scope.** It covers the visual and structural layout of forms at desktop and tablet widths. Accessibility (WCAG, ARIA, screen readers, focus, target sizes) and phone or mobile layout are **deliberately out of scope**, at the user's request.

It complements `/home/vdloc/Documents/DesignBooks/Web_Form_Design_Knowledge.md`, which summarises 14 design books (cited there as `[FDP p.N]` etc.). This file does not repeat the book material; it points to it as **[KB §n]**.

**Markers**

- Every claim has an inline link to the source that owns it. Short verbatim quotes are in "double quotes".
- **[v]**: the quote was checked against the raw page text, the PDF text or the page's source repository during this session (curl, pdftotext, GitHub raw, rendered page text).
- **[x]**: the quote came through a web-fetch extraction step and was not re-checked character by character. Spot-check it before quoting publicly.
- **UNVERIFIED**: no primary source could be reached or found.
- **INFERENCE**: my reasoning; no source states it.

**Evidence types**

- **STUDY**: empirical; N given where known.
- **DS**: design-system guideline.
- **SPEC**: CSSWG or MDN documentation.
- **OPINION**: expert recommendation with no data on the page.

---

## 1. Single-column vs multi-column forms

### Evidence

- **Baymard Institute (2023): STUDY.** Qualitative usability testing over several rounds; N not stated on the page.
  - "single-column layouts resulted in fewer skipped fields, misinterpreted fields, and errors compared to multicolumn layouts" [v].
  - "16% of sites use extensive multicolumn forms" in Baymard's e-commerce benchmark [v].
  - The exception: "having 2–3 inputs on a single line didn't cause issues when they logically belonged to the same single entity — and so long as the rest of the overall form layout only consisted of a single column" [v]. Examples are dates, full names, city/state/ZIP and card details.
  - A general "two-column form layout" is called "generally problematic and never recommended" [v].
  - Source: E. Scott, "Form Field Usability: Avoid Extensive Multicolumn Layouts", 31 Oct 2023, https://baymard.com/blog/avoid-multi-column-forms
- **Baymard (2021): STUDY (testing anecdote).** On a two-column Perfume.com checkout, "test participants had difficulties understanding the relationship between the fields" [x].
  - Source: C. Holst, "Form Design: 6 Best Practices", 16 Dec 2021, https://baymard.com/blog/form-design
- **CXL Institute / Speero (2016): STUDY.** A between-subjects online survey, desktop only, N = 702.
  - Groups: single column n = 356, multi-column n = 346.
  - Mean completion time: 102.338 s (single) vs 117.791 s (multi). The difference is 15.453 s, p = 0.00412 [v].
  - Completion time was the **only** metric: no error, abandonment or conversion data. As the write-up puts it, "All 702 participants completed the form. The study can only see people who finished." [v]
  - The question set, field types and label treatment were fixed.
  - Source: B. Labay, Speero (successor to the CXL Institute research), https://speero.com/post/form-field-usability-should-you-use-single-or-multi-column-forms-original-research
  - The original CXL URL (https://cxl.com/research-study/form-field-usability/) returned HTTP 403, so the CXL page itself is UNVERIFIED.
- **Nielsen Norman Group (2016): OPINION / expert guideline, no data on the page.**
  - "Multiple columns interrupt the vertical momentum of moving down the form" [x].
  - Recommends "a single column with a separate row for each field" [x].
  - Source: K. Whitenton, "Website Forms Usability: Top 10 Recommendations", 1 May 2016, https://www.nngroup.com/articles/web-form-design/
- **University of Basel / Google: guideline set (2010) plus validation study (CHI 2014).**
  - Guideline 6: "Do not separate a form into more than one column and only ask one question per row." [v]
  - In the CHI 2014 paper, 14 HCI experts rated the seriousness of violating guideline 6 at only **3.36 / 5** (range 1–5). That places it mid-table among the 20 guidelines [v].
  - The CHI study (N = 65, lab, eye tracking) applied **all 20 guidelines together** to three real registration forms, so the column rule's own effect cannot be isolated. Results [v]:

    | Form | Completion time, original → improved | Change | First-trial submissions |
    |---|---|---|---|
    | Sueddeutsche | 113 → 85 s | −25% | 10 → 24 |
    | NZZ | 105 → 70 s | −33% | 9 → 24 |
    | Spiegel | 104 → 85 s | −18% | not given here |

  - The authors credit the largest gains to guideline 13 (state format rules in advance) and guideline 17 (error message location and design) [v].
  - Sources: Seckler, Heinz, Bargas-Avila, Opwis, Tuch, CHI 2014, https://research.google/pubs/designing-usable-web-forms-empirical-evaluation-of-web-form-improvement-guidelines/ (PDF: https://research.google.com/pubs/archive/42513.pdf). Blog summary: https://research.google/blog/simple-is-better-making-your-web-forms-easy-to-use-pays-off/
- **Google web.dev: DS / OPINION.** "research shows that it's best to use only a single column" [v]. The link points to Baymard.
  - Source: https://web.dev/learn/forms/design-basics
- **Design systems**
  - **Atlassian: DS.** "Use one form column as it's easier to follow and comprehend." and "Don't use multiple form columns." [v]
    - Source: https://atlassian.design/components/form/usage
  - **Carbon (IBM): DS.**
    - "Based on research from the Nielsen Norman Group, Carbon generally recommends single-column forms, simply because multicolumn forms are more prone to misinterpretation." [v]
    - "Two to three inputs on a single line will not cause problems if they logically belong together." [v]
    - Examples: `[first name][mi][last name]`, `[credit card number][expiration date][security code]`, `[city][state/province][zip code]` [v].
    - "the number of columns should depend on the number of input controls on the page, their relationship to one another, and the screen size of the product window." [v]
    - Source: https://carbondesignsystem.com/patterns/forms-pattern/ (last updated 11 Aug 2026)
  - **Shopify Polaris: DS.**
    - Default: "stack form fields vertically, which makes them easier to scan and complete."
    - Field groups "Works best for familiar layouts such as a row of city, state, and zip code fields. Use caution when arranging unrelated fields next to each other as this makes fields easier to miss. Field groups will wrap automatically on smaller screens." [v]
    - Source: https://github.com/Shopify/polaris/blob/main/polaris.shopify.com/content/components/layout-and-structure/form-layout.mdx
  - **USWDS: DS.** "Keep your form blocks in a vertical pattern." [x]
    - Source: https://designsystem.digital.gov/components/form/
  - **GOV.UK: DS.** There is no multi-column form layout; the default is one thing per page (§5).
    - Inline (horizontal) radios only when "the question only has two options" and "both options are short" [v].
    - Source: https://design-system.service.gov.uk/components/radios/
- **Counter-evidence.**
  - No primary study found shows multi-column forms performing *better*.
  - Das, McEwan & Douglas (NordiCHI 2008) used eye tracking on "a small sample" of 11 UK university-educated users [v, abstract via OpenAlex]. They "recommend right-aligned labels, at least in the context of forms with multiple columns". This concerns label alignment *within* multi-column forms, not evidence for the layout itself.
    - Source: https://doi.org/10.1145/1463160.1463217
  - The pro-multi-column view in [KB §3] (UX Movement) is OPINION.

### When multi-column is acceptable (consensus)

- Put 2–3 inputs on one row only when they form **one logical entity**: date parts, first/middle/last name, city/state/ZIP, card number/expiry/CVC (Baymard, Carbon, Polaris).
- Two short radio options may sit inline (GOV.UK).
- A single full-name field or address lookup often removes the need for a shared row at all (Baymard [x]).

### Implications for the skill

- Default to **one field per row**. A row with 2 or more fields needs a "same entity" justification.
- Allow at most **3 inputs per shared row** (Baymard, Carbon).
- Never place **unrelated** fields side by side to fill a wide screen. Use whitespace or an aside instead (§6).
- When reporting "single column is faster", state the evidence strength:
  - The only timed head-to-head test (CXL/Speero, N = 702, desktop) measured time only.
  - Baymard's evidence is qualitative error observation.

---

## 2. Grid-based layout and field width

### Field width = expected input length

- **Baymard (2010): STUDY.** Usability test; N not stated.
  - The width issue "had a surprisingly big impact on the overall usability of a form" [x].
  - When a field was too long or too short, "the test subjects started to wonder if they had misunderstood the label" [x].
  - Three cases [x]:
    1. **Fixed-length input:** make the field "just long enough to contain all the characters of the input".
    2. **Variable input with a normal average** (name, email): one shared, slightly generous width.
    3. **Unusually short or long average** (ZIP): a custom width.
  - Source: J. Holst, "Form Field Usability: Matching User Expectations", 31 Aug 2010, https://baymard.com/blog/form-field-usability-matching-user-expectations
- **NN/g (2016): OPINION.**
  - "Text fields should be about the same size as the expected input" [x].
  - "it's extremely error prone when users can't see their full entry" [x].
  - Source: https://www.nngroup.com/articles/web-form-design/
- **Basel/Google guideline 7.** "Match the size of the input fields to the expected length of the answer." [v] Expert seriousness rating: 3.29/5.
  - Source: https://research.google.com/pubs/archive/42513.pdf
- **GOV.UK Design System: DS.**
  - "By default, the width of text inputs is fluid and will fit the full width of the container they are placed into." [x]
  - "Use fixed width inputs for content that has a specific, known length." [x]
  - The docs list `govuk-input--width-20`, `--width-10`, `--width-5`, `--width-4`, `--width-3` and `--width-2`, for 20, 10, 5, 4, 3 and 2 characters [x].
  - The GOV.UK Frontend source (v6.6.0) also defines `govuk-input--width-30`. Each class sets a `max-width` in **em**, not `ch` [v]:

    | Class | `max-width` |
    |---|---|
    | `--width-30` | 29.5em |
    | `--width-20` | 20.5em |
    | `--width-10` | 11.5em |
    | `--width-5` | 5.5em |
    | `--width-4` | 4.5em |
    | `--width-3` | 3.75em |
    | `--width-2` | 2.75em |

  - Fluid overrides relative to the parent: `govuk-!-width-full`, `-three-quarters`, `-two-thirds`, `-one-half`, `-one-third`, `-one-quarter` [x].
  - Sources: https://design-system.service.gov.uk/components/text-input/ and https://github.com/alphagov/govuk-frontend/blob/main/packages/govuk-frontend/src/govuk/components/input/_index.scss
- **USWDS: DS.**
  - "Use fields appropriate to the length of the input." and "The length of the text input provides a hint to users as to how much text to write." [x]
  - Width modifiers: `2xs` (5ex), `xs` (9ex), `sm` (13ex), `md` (20ex), `lg` (30ex), `xl` (40ex), `2xl` (50ex) [x].
  - Source: https://designsystem.digital.gov/components/text-input/
- **Atlassian: DS.** "The length of a field should reflect the intended length of content. Available lengths are 75px, 150px, 250px, 350px, and 500px." [v]
  - Also: "The width of a form typically follows the width of where it lives, for example in a modal or page." [v]
  - Source: https://atlassian.design/components/form/usage
- **Carbon: DS.** "The field widths should reflect the intended length of the content while still aligning to the responsive column or mini unit grid." [v]

### Column grids for forms

- **Carbon 2x Grid: DS.** Source: https://carbondesignsystem.com/elements/2x-grid/overview/ (updated 25 Sep 2026)
  - Breakpoints [v]: md 672px = 8 columns; lg 1056px = 16; xlg 1312px = 16; max 1584px = 16.
  - The mini unit is 8px. The total gutter is 32px [v].
  - "On dedicated page forms, use the responsive grid to drive layout decisions. Dialogs and side panel forms will revert to a box model so designers will use mini units to guide field widths." [v]
  - Spacing [v] (forms page):
    - Inputs are 40px high.
    - 32px between inputs on dedicated pages; 24px or 16px in side panels and modals.
    - Sections: 32px when inputs are 24px apart, 40px when inputs are 32px apart.
    - 48px before the button group.
- **GOV.UK layout: DS.** Source: https://design-system.service.gov.uk/styles/layout/
  - "Your main content should always be in a two-thirds column" [x].
  - Classes: `govuk-grid-row`, `govuk-grid-column-{full|one-half|one-third|two-thirds|one-quarter|three-quarters}`, plus `-from-desktop` variants [x].
  - The two-thirds layout "stops lines of text getting so long that the page becomes difficult to read on desktop devices. This would usually mean no more than 75 characters per line." [v]
  - Page width: the docs say "The default maximum page width is 1020px" [v]. The Frontend source sets `$govuk-page-width: 960px` and `$govuk-gutter: 30px` [v]. INFERENCE: 1020 = 960 + 2 × 30 px.
- **USWDS: DS.** `.usa-form` gets `max-width: units("mobile")` and `.usa-form--large` gets `units("mobile-lg")`. `$theme-input-max-width` is `"mobile-lg"` [v].
  - Source: https://github.com/uswds/uswds/blob/develop/packages/usa-form/src/styles/_usa-form.scss
  - The token values (≈20rem and ≈30rem) were not re-fetched: UNVERIFIED.
- **Material 3: DS.** "For medium and expanded breakpoints, text fields should be bound by flexible margins or other containers." "text fields should not span the full width of a large screen." [v]
  - Source: https://m3.material.io/components/text-fields/guidelines

### Implications for the skill

- Size each input by its **expected content**, then **snap that width** to a grid span or design-system token. This is Carbon's reconciliation of the two rules.
- Content-length token sets to choose from:
  - GOV.UK `--width-2…30` (em max-widths)
  - USWDS 5–50ex
  - Atlassian 75/150/250/350/500px
- Free-text fields of unknown length fill the **form column**, never the page.
- Cap the form column:
  - GOV.UK two-thirds of 960px (about 640px; 75 characters per line)
  - USWDS form max-width tokens
  - Material: not full width on large screens
- Implement widths as `max-width` with `width: 100%`, as GOV.UK Frontend does [v], so a narrowed container never overflows.

---

## 3. Rows with more related fields than columns; alignment and scanning

### What sources say about overflowing rows

- **No primary source directly addresses "N fields on a grid with fewer columns".** The closest rules:
  - **Cap:** 2–3 inputs per row, for one entity only (Baymard [x]; Carbon [v]).
  - **Wrap:** Polaris `FormLayout.Group` "will wrap automatically on smaller screens" [v]. In the source, grouped items are `flex: 1 1 0` with `min-width: 220px`, and condensed items have a 110px basis and minimum. A 5-field group therefore wraps into as many rows as 220px slots fit.
    - Source: https://github.com/Shopify/polaris/blob/main/polaris-react/src/components/FormLayout/FormLayout.module.css
  - **Group:** GOV.UK date input groups day/month/year in one `fieldset` with a legend [v].
    - Source: https://design-system.service.gov.uk/components/date-input/
- **INFERENCE (no source).** For 5 related fields on a 4-column grid, avoid a lone orphan field on the second row. Options:
  1. Split by semantic subgroup, e.g. `[street][number]` / `[city][state][ZIP]`.
  2. Use a column count that the group divides into, e.g. a 6-column grid with spans 3+3 / 2+2+2.
  3. Use Polaris-style wrapping with a minimum width.
  - In all cases, keep the subgroup inside one fieldset or visual group so the line break does not read as a new group.

### Eye-tracking and alignment evidence

- **Penzo (UXmatters 2006): STUDY.** Eye tracking; N not stated; expert and novice users.
  - Left-aligned labels beside fields: "a medium saccade duration of 500ms (milliseconds) was typical, which is quite long, showing that users were experiencing heavy cognitive loading" [v].
  - Right-aligned labels beside fields: "reduced the overall number of fixations by nearly half" [v]. Completion times were also roughly halved, and saccades were about 170ms (experts) and 240ms (novices) [x].
  - Labels above fields: "permitted users to capture both elements with a single eye movement"; "shorter saccade times of just 50ms" [v].
  - Bold labels above: about 50→80ms [x].
  - Caroline Jarrett's 2011 comment criticises the simple test forms and the fact that eye movement is not thinking effort.
  - Source: M. Penzo, "Label Placement in Forms", 12 Jul 2006, https://www.uxmatters.com/mt/archives/2006/07/label-placement-in-forms.php
- **Wroblewski slides (2009), summarising Penzo.** "Top-aligned labels … Permitted users to capture both labels & inputs with a single eye movement … Ten times faster than left-aligned" [v].
  - Source: https://static.lukew.com/WebForms_LukeW_101209.pdf
- **Seckler et al. (CHI 2014): STUDY.** The improved forms needed "fewer fixations and saccades" [v]. This was the combined effect of all 20 guidelines.
- **Das et al. (2008): STUDY, N = 11.** In multi-column forms, the results favoured right-aligned labels, against Wroblewski's ranking [v, abstract].
- **NN/g (2013): OPINION with worked examples.**
  - "Place the label closer to the associated text field than to other text fields." [x]
  - "Group together related fields." [x]
  - Added whitespace made a 15-field form "less overwhelming" [x].
  - Source: M. McCloskey, https://www.nngroup.com/articles/form-design-white-space/
- **Carbon: DS.** "When fields appear side-by-side and one input has helper text while the other one doesn't; always top align the input fields, not the labels." [v]
- **Wroblewski slides: OPINION.**
  - "Illuminate a clear path to completion" [v].
  - "Align primary actions with input fields for a clear path to completion" [v].

### Implications for the skill

- A row holds **at most 3 inputs**. Larger related sets wrap, or split by subgroup inside one group.
- In a shared row, the **input boxes share a top line** (Carbon). Labels or hints of different heights must not push one input below its neighbour (§10 subgrid).
- Keep one strong left edge: labels above and left-aligned, with the primary button aligned to the inputs (Penzo, Wroblewski, Carbon).
- The gap from a label to its own field must be clearly smaller than the gap from a field to the next label (NN/g; Carbon tokens).

---

## 4. Label placement (visual evidence)

### Evidence

- **Top-aligned labels.**
  - Penzo 2006: fastest saccades (§3).
  - Wroblewski 2007, OPINION informed by testing [x]:
    - "Top-aligned labels tend to reduce completion times … the most for familiar data".
    - They suit localisation and long labels.
    - They "do take up a lot of vertical real estate".
    - Source: https://www.lukew.com/ff/entry.asp?504
  - Basel/Google guideline 5: "place the labels above the corresponding input fields" [v]. Expert seriousness rating was only 2.71/5 [v].
- **Right-aligned left labels.** "a bit slower to complete but require less vertical screen space". They have "flexibility issues when the labels change widths" and are harder to scan [x] (LukeW 2007).
- **Left-aligned left labels.** "the slowest of the three to complete". They suit unfamiliar data and deliberate reading [x] (LukeW 2007). Penzo measured about 500ms saccades.
- **NN/g (2016).**
  - Labels "immediately above the field for mobile and shorter desktop forms" [x].
  - Labels "next to the field for extremely long desktop forms" [x].
- **Inline labels (the label used as a placeholder).**
  - **Baymard (2013, from its mobile series; the finding is general): STUDY.** Source: https://baymard.com/blog/mobile-forms-avoid-inline-labels
    - "in every usability test we've conducted inline labels have suffered from major usability problems". The label disappears on typing, so context is lost [x].
    - Acceptable only for 1–2 field, frequently used forms.
    - Not for drop-downs: "Sort by" was misread as the current value.
    - On floating labels: "there's currently no in-depth usability testing available on the performance or potential side effects" [x].
  - **NN/g (Sherwin 2014, reviewed 2018).** Source: https://www.nngroup.com/articles/form-design-placeholders/
    - Placeholder labels strain memory and prevent users checking their work.
    - "Eyetracking studies show that users' eyes are drawn to empty fields". Filled-looking fields get skipped [x].
    - "floating labels do offer a better user experience than the label as a placeholder", yet "placing the label and hint outside the field is still the best way to go" [x].
- **Design systems**
  - **GOV.UK:** "You should align labels above the text input they refer to." [x]
  - **Carbon:** "Top-aligned labels are Carbon's default (vs. left-aligned labels) and the only label arrangement currently offered." It adds that they give "a consistent left edge, a close proximity between label and input" [v].
  - **Atlassian:** "Labels should be concise, left-aligned, and placed above a form field." "Don't use placeholder text" (except search) [v].
  - **Material 3 (floating labels)** [v]:
    - "Label text should be aligned with the input text, and always visible. It can be placed in the middle of a text field, or rest near the top of the container."
    - "When the field is selected, the label text moves from the middle of the text field to the top."
    - Alternative: "A text field doesn't require a label if the field's purpose is indicated by a separate, adjacent label."
  - **web.dev:** "best practice is to position the label above the form control" [v].
  - **Atlassian AUI (legacy):** default left labels, with a `top-label` variant for narrow spaces [x]. Source: https://aui.atlassian.com/aui/9.5/docs/forms.html. Now superseded by atlassian.design (labels above).

### Implications for the skill

- Refactor to **visible labels above inputs, left-aligned**. This is the near-universal default with the best evidence.
- Do not introduce floating labels. If the codebase uses Material floating labels, keep the label always visible (Material's own rule). Note that Baymard found no testing of floating labels.
- Side labels are an exception for very long expert or desktop forms (NN/g, LukeW). If they are used, right-align them (Penzo; Das et al.).
- Remove placeholder-as-label. A placeholder may show a format example at most.

---

## 5. Grouping, section headings, spacing and steps

### Evidence

- **W3C WAI Forms tutorial (visual aspect only).** "Grouping related form controls makes forms more understandable for all users, as related controls are easier to identify. It also makes it easier for people to focus on smaller and more manageable groups rather than try to grasp the entire form at once." "Grouping needs to be carried out visually and in the code" [v].
  - The code wrapper is `fieldset`/`legend`.
  - Source: https://www.w3.org/WAI/tutorials/forms/grouping/
- **GOV.UK fieldset: DS.** Use it "when you need to show a relationship between multiple form inputs", for example an address. Its legend may be a question or a statement such as "Personal details" [v].
  - Source: https://design-system.service.gov.uk/components/fieldset/
- **GOV.UK "one thing per page": DS / OPINION based on internal, unpublished user research.**
  - "Start by splitting the form across multiple pages with each page containing just one thing" [x].
  - "User research will tell you when you can merge pages together." [x]
  - On a page with several questions, "use a statement as the heading" [x].
  - Sources: https://www.gov.uk/service-manual/design/form-structure (updated 7 Aug 2018) and https://design-system.service.gov.uk/patterns/question-pages/
  - Quantitative cases (Boots; Just Eat +5%) are in [KB §2] from Silver's book. They were not re-verified here.
- **Carbon: DS.**
  - "Inputs should be grouped to help users understand what is required of them in a logical way." [v]
  - Group headings are smaller than the form heading and larger than labels.
  - Section spacing is 32–40px (§2).
  - "Do consider multistep forms when faced with a lot of inputs." [v]
  - "Carbon does not have consolidated guidance around rules within forms" (divider lines) [v].
- **Atlassian: DS.** "Use sections to group form fields into smaller parts. Include a concise section title". "Don't provide a form of unrelated information." [v]
- **Polaris: DS.** "Group related tasks under section titles to provide more context and make the interface easier to scan" [v].
- **USWDS: DS.** "Group each set of thematically related controls in a fieldset element." [x]
- **NN/g (2013).** Whitespace grouping (§3). The example recreation splits 15 fields into three groups of 4–6 [x].

### Implications for the skill

- Every multi-input entity (address, date, name parts, card, a set of radios or checkboxes) becomes one visual group, wrapped in `fieldset`.
- Sections get a heading between label size and form-title size. Space between sections must be clearly larger than space between fields (Carbon 32→40px; NN/g).
- Long single pages with many unrelated groups: recommend steps. No source gives a numeric threshold; the book notes in [KB §2] give 5–6 fields as a heuristic.

---

## 6. Form with a side diagram, preview or summary panel (desktop and tablet)

### Evidence

- **GOV.UK layout: DS.** "For most types of page, we recommend using either a 'two-thirds' or a 'two-thirds and one-third' layout." [v] The form goes in the two-thirds column; related content goes in the one-third column.
- **Material 3 breakpoints: DS.** Source: https://m3.material.io/foundations/layout/breakpoints/overview

  | Class | Width | Recommended panes |
  |---|---|---|
  | medium | 600–839dp | "1 (recommended) or 2" |
  | expanded | 840–1199dp | "1 or 2 (recommended)" |
  | large | 1200–1599dp | "1 or 2 (recommended)" |
  | extra-large | 1600dp+ | "1 to 3" |

  - "Layouts typically transition from a single pane to two or three panes as window size increases" [v].
- **Carbon: DS.** Side-panel forms use the box model and mini units for widths. Their button group "should span the width of the container and buttons should bleed to the bottom edge" [v].
- **Baymard (accordion checkout).** Users rely on summaries of the data they entered to catch errors. Completed steps should collapse to summaries, not to bare headers [x; search snippet only, the guideline is paywalled].
  - Source: https://baymard.com/blog/accordion-checkout-usability
  - The order summary beside the form is in [KB §2] (Silver).
- **`position: sticky` (MDN): SPEC docs.** Source: https://developer.mozilla.org/en-US/docs/Web/CSS/position
  - Sticky is "offset relative to its nearest scrolling ancestor and containing block" [x].
  - It "'sticks' to its nearest ancestor that has a 'scrolling mechanism' (created when `overflow` is `hidden`, `scroll`, `auto`, or `overlay`), even if that ancestor isn't the nearest actually scrolling ancestor" [x].
  - At least one inset must be non-`auto`; otherwise it behaves as `relative` [x].
  - MDN warns of repaint jank and suggests `will-change: transform` [x].
  - Support (caniuse): full in Chrome/Edge 91, Firefox 59, Safari 7.1; about 97% global [v].
- **Configurators and calculators with a live diagram.** No design-system guidance was found that specifically addresses a form plus live-preview split. **GAP**: apply the general rules above.

### Implications for the skill

- **Desktop (≥ about 1024px; Carbon lg 1056, Material expanded 840+):**
  - The form goes in the main column (about two-thirds) and the diagram, preview or summary in a secondary column (about one-third).
  - The form column keeps its own max-width (§2). The aside takes the remaining space; it is not shared by form fields.
  - Make the aside `position: sticky; top: <header height>` only if it fits the viewport height. INFERENCE from the MDN definition: a taller sticky aside can never be scrolled fully into view, so give it `max-height` and internal scroll.
  - If sticky does not work, check whether an ancestor has `overflow: hidden/auto` (MDN).
- **Tablet (Material medium 600–839; Carbon md 672 / 8 columns; GOV.UK tablet 641–768):**
  - Material recommends one pane. Collapse to a single column, deliberately ordered:
    - the diagram first if it explains the inputs (a configurator);
    - the summary after the form if it reviews them.
  - INFERENCE: change the source order, not only the visual order.
- Place side-panel action buttons full width at the panel bottom (Carbon).

---

## 7. Tables of inputs inside forms (visual layout and add/remove rows)

### Evidence

- **MOJ "Add another": DS ("Status: Official", "Updated in July 2026").** Source: https://design-patterns.service.justice.gov.uk/components/add-another/
  - "works best in a shallow layout for users to enter a small amount of information, ideally only a few times." [x]
  - "Do not use the 'Add another' component to collect lengthy or complex data." Items are saved only on submit [x].
  - Layout:
    - Each item is a stacked group (`fieldset`) titled with a numbered name ("Participant 1"): "The item names are numbered 1, 2, 3 and so on." [x]
    - Each item has its own Remove button: "Do not change the button position" [x].
  - Implementation source: https://github.com/ministryofjustice/moj-frontend/blob/main/src/moj/components/add-another/add-another.mjs
- **For many or complex items, use a loop instead of an inline table.** One item is entered per page sequence, then shown in a summary list with Add another / Change / Remove [x; search summary only]:
  - MOJ "Add to a list" (status "To be reviewed"): https://design-patterns.service.justice.gov.uk/patterns/add-to-a-list
  - DWP "Add another thing": https://design-system.dwp.gov.uk/patterns/add-another-thing/how-it-works
  - Book version: [KB §2].
- **Carbon data table usage (updated 30 Sep 2026).** Covers selection, expansion, batch actions, inline row *actions*, and a toolbar for "editing table data". It has **no inline cell-editing guidance** [v].
  - "Data tables should be placed in a page's main content area and given plenty of space to display data without truncation. Avoid placing data tables inside data tables or smaller containers" [v].
  - Inline actions: "When the overflow menu contains fewer than three options, keep the actions inline as icon buttons instead." [v]
  - Source: https://carbondesignsystem.com/components/data-table/usage/
- **Atlassian Inline edit: DS.** Source: https://atlassian.design/components/inline-edit/usage
  - "Use inline edit for an editable field that is not part of a form. Don't use inline edit inside of a form." [v]
  - In edit view "the field snaps to the width of the column and the text remains aligned with the label". Save and cancel controls "appear at the end of the field" [v].
  - Read view and edit view should have "identical styling" [v].
- **`table-layout: fixed` (MDN).**
  - It requires an explicit table width; with `width: auto` it "has no effect" [v].
  - Column widths then "depend only on the table's width, the width of the columns, and borders or cell spacing", not on cell content [v].
  - Source: https://developer.mozilla.org/en-US/docs/Web/CSS/table-layout

### Implications for the skill

- **Choose the pattern by item complexity:**

  | Item size | Pattern |
  |---|---|
  | Few columns, few rows | a table of inputs |
  | 3–6 fields per item, few items | MOJ-style stacked numbered groups |
  | Long or branching items | an add-to-a-list loop |

- **Table of inputs:**
  - Use `table-layout: fixed; width: 100%`, with column widths from expected content (`<col>`), so typed values never resize columns.
  - Inputs are `width: 100%` of their cell.
  - The row action (Remove) sits in the last column, in a fixed position.
  - The Add row button goes below the table, left-aligned with the first column.
- **Tablet:** if the column widths no longer fit, either let the table scroll horizontally inside its own container, or switch to stacked numbered groups. This is INFERENCE; the per-device choice is out of scope.
- Do not mix Atlassian-style inline edit (read view ↔ edit view) into a submit-style form.

---

## 8. Error summary and inline error placement (visual position)

### Evidence

- **GOV.UK error summary: DS.** Source: https://design-system.service.gov.uk/components/error-summary/
  - "Put the error summary at the top of the `main` container. If your page includes breadcrumbs or a back link, place it below these, but above the `<h1>`." [v]
  - Content: the heading "There is a problem" and a link to each answer with an error. Multi-field questions link "to the first field that contains an error" [v].
  - "Always show an error summary when there is a validation error, even if there's only one." [v]
  - The summary text must match the inline message wording [x].
- **GOV.UK error message: DS.** Source: https://design-system.service.gov.uk/components/error-message/
  - "put the message in red after the question text and hint text". This places it **between the label/hint and the input** [v].
  - "use a red border to visually connect the message and the question it belongs to" [v].
  - "if the error relates to a specific field within the question, give it a red border" [v].
- **GOV.UK date input.** "If there's more than one error, show the highest priority error message." Highlight only the wrong part (day, month or year), or the whole date [v].
- **Basel/Google guidelines.** Source: https://research.google.com/pubs/archive/42513.pdf
  - Guideline 16: "Show them all together embedded in the form." [v]
  - The refined guideline 17 in the CHI table reads "Show error messages in red at the right side" [v].
  - The CHI blog says: "Error messages must be placed next to the erroneous field." [x]
  - The CHI authors credit guideline 17 (location and design of errors) with a "remarkable effect on submission trials" [v].
- **NN/g (Krause 2019, reviewed 2024).** Source: https://www.nngroup.com/articles/errors-forms-design-guidelines/
  - "Keep Error Messages Next to Fields"; show them "below or next to the problem field" [x].
  - "Don't Use Validation Summaries as the Only Indication of an Error" [x].
  - Use colour plus an icon to the left of the message [x].
- **Wroblewski / Etre (A List Apart #291, 1 Sep 2009): STUDY, N = 22.** Six variants of a registration form.
  - Inline messages beside fields vs errors only after submit: "a 22% increase in success rates, a 22% decrease in errors made, a 31% increase in satisfaction rating, a 42% decrease in completion times, and a 47% decrease in the number of eye fixations" [x].
  - Wroblewski's slides word the first figure as "22% increase in completions" [v].
  - Placement findings:
    - Persistent messages placed **beside** fields outperformed messages **inside** fields, which "offered no substantial benefit" [x].
    - Only 30% noticed inline validation on the easy top fields, versus 80–100% on the user ID and password fields lower down [v slides].
  - Sources: https://alistapart.com/article/inline-validation-in-web-forms/ and https://static.lukew.com/WebForms_LukeW_101209.pdf
- **Carbon: DS.**
  - "The validation label below the field should be as informative as possible" [v].
  - Server-side errors: "use an inline notification as well as inline error messaging" [v].
- **Material 3: DS** [v]:
  - "replace supporting text with error text. Swapping supporting text with error text prevents new lines of text from bumping content and changing the layout."
  - "Don't add error text in addition to supporting text".
  - "ensure padding between text fields is sufficient to prevent multi-lined errors from bumping layout content".
- **USWDS: DS.** Validation messages sit visually next to their inputs [x].

### Implications for the skill

- **Summary block:**
  - It sits at the very top of the main content, below breadcrumbs and back links and above the page heading.
  - It lists linked errors in form order (INFERENCE: GOV.UK gives no order rule).
  - It spans the form column width, not the aside.
- **Inline message:**
  - One per question or group, attached to that field.
  - Position follows the house design system:
    - GOV.UK: between label/hint and input, with a red left border on the group.
    - Carbon, Material, NN/g: below the input.
  - Pick one and never mix them in one form.
- **Multi-field rows:** an error on one field must not shift its neighbours.
  - Either swap the hint for the error in the same slot (Material), or
  - reserve the message row with subgrid (§10) so all inputs in the row stay aligned.
  - For grouped entities (date, address line), show **one** message for the group (GOV.UK).
- **Next to the field beats inside it** (Etre). Never put error text inside the input.

---

## 9. Breakpoints: desktop → tablet

### Evidence

- **Design-system breakpoints [v]:**
  - **GOV.UK:** tablet 641px, desktop 769px (Frontend `settings/_media-queries.scss`).
  - **Carbon:** md 672px (8 columns), lg 1056px (16), xlg 1312px (16), max 1584px (16).
  - **Material:** medium 600–839, expanded 840–1199, large 1200–1599, extra-large 1600+dp.
- **No primary source prescribes a "4 → 2 columns at tablet" rule for form fields.**
  - Carbon's page grid halves from 16 to 8 columns at md. That is a page-grid rule, not a form rule.
  - The form-specific evidence is wrapping: Polaris groups wrap at a 220px item minimum [v].
  - Material recommends one pane at medium [v].
- **Carbon.** The number of form columns depends on "the screen size of the product window" [v].

### Implications for the skill

- **INFERENCE / convention** (not evidence), consistent with Carbon's grid halving and Polaris wrapping:
  - A 4-column field grid at desktop becomes 2 columns at tablet (about 640–1024px).
  - Spans recalculate: full-width fields stay full; a 1-span short field stays 1 of 2.
  - Compound entities wrap as a unit, so a 3-field city/state/ZIP becomes 2+1 only if a 2+1 split still reads as one group. Otherwise stack it.
- Side panel or preview: two panes at desktop, one pane at tablet (Material medium), ordered as §6.
- Prefer **container queries** over viewport breakpoints for forms that also appear in side panels and modals (§10). Carbon's box-model contexts make the same form appear at different widths.

---

## 10. CSS implementation techniques

### Evidence

- **Grid.** `grid-template-columns: repeat(n, 1fr)` with `grid-column: span k` is the standard CSS Grid track and placement model: https://www.w3.org/TR/css-grid-1/
  - Grid Level 1 support: Chrome 57, Firefox 52, Safari 10.1, Edge 16; about 97% global [v] (https://caniuse.com/css-grid).
- **Subgrid (MDN).** Source: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Subgrid
  - "If you set the value `subgrid` on `grid-template-columns`, `grid-template-rows` or both, instead of creating a new track listing, the nested grid uses the tracks defined on the parent." [x]
  - "While gaps are inherited, they can be overridden". Parent line names pass into the subgrid [x].
  - MDN Baseline: "Widely available … since September 2023" [x].
  - caniuse: Chrome/Edge 117, Firefox 71, Safari 16.0; about 94.4% global [v] (https://caniuse.com/css-subgrid).
  - MDN links Jen Simmons's video "Laying out forms using subgrid" (2019) [x].
- **Container queries (MDN).** Source: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries
  - They "enable you to apply styles to an element based on certain attributes of its container" [x].
  - Syntax: `container-type: inline-size`, then `@container (width > 700px) {…}` [x].
  - `cqi` is "1% of a query container's inline size" [x].
  - caniuse: Chrome/Edge 106, Firefox 110, Safari 16.0; about 95.8% global [v].
- **`gap` (MDN).** It "sets the gaps (also called gutters) between rows and columns on multi-column, flex, and grid containers" [v].
  - Source: https://developer.mozilla.org/en-US/docs/Web/CSS/gap
- **`table-layout: fixed`** (§7) [v].
- **Uneven labels and hints:**
  - Carbon: "always top align the input fields, not the labels" [v].
  - Material: swap hint and error to avoid layout shift [v].

### Techniques (INFERENCE / engineering practice consistent with the sources above)

1. **Form grid.**
   - Container: `.form-grid { display:grid; grid-template-columns: repeat(var(--cols,4), minmax(0,1fr)); column-gap: var(--gap-x); row-gap: var(--gap-y); }`.
   - Fields take `grid-column: span k`, where k comes from the width token. Full width is `1 / -1`.
   - Use `minmax(0,1fr)`, not bare `1fr`, so long content cannot blow out a track.
   - Use `gap`, not field margins, for spacing.
   - Keep the token `max-width` on the input. The span decides the slot; the token caps the box (GOV.UK pattern).
2. **Align label, hint, input and error across a row (subgrid).**
   - Each field wrapper gets `display:grid; grid-row: span 4; grid-template-rows: subgrid;`. Label, hint, input and error sit on four shared row tracks of the parent.
   - Inputs in the row then line up even if only one field has a two-line hint or an error. This implements Carbon's rule. Subgrid has been Baseline since Sept 2023.
3. **Fallback without subgrid.** `align-items: end` on the row aligns the input **bottoms**. It only works if nothing renders below the inputs. Otherwise:
   - put hints above the input and swap errors into the hint slot (Material), or
   - give the message slot a fixed `min-height` (UX Movement gutter values in [KB §3]).
4. **Collapse inside panels.** Wrap the form in `container-type: inline-size`, then `@container (width < 48rem) { .form-grid { --cols: 2 } }`. The same form then adapts in a side panel and on the page.
5. **Wrapping groups without a grid (Polaris).** Use `display:flex; flex-wrap:wrap; gap`. Items get `flex: 1 1 0; min-width: 220px` (110px for short inputs) [v source values].
6. **Sticky aside.** `.aside { position: sticky; top: var(--header-h); align-self: start; max-height: calc(100vh - var(--header-h)); overflow: auto; }`.
   - `align-self: start` is required in grid or flex. Otherwise the aside stretches to the row height and has no room to stick.
   - No ancestor may have `overflow` set (MDN).
7. **Tables of inputs.**
   - `table-layout: fixed; width: 100%` with `<col>` widths (MDN). Inputs are `width: 100%; box-sizing: border-box`.
   - `border-collapse: separate; border-spacing: 0 8px` gives vertical gaps between rows, which `margin` on `tr` cannot do.
   - At or below tablet width, or whenever the columns no longer fit, wrap the table in an `overflow-x: auto` container rather than squeezing the columns.

### Implications for the skill

- One grid system per form: column count, `gap` tokens, and spans derived from content-length tokens. No ad-hoc pixel widths.
- Use subgrid rows for multi-field rows with uneven labels, hints or errors. Use `align-items: end` only when nothing renders below the inputs.
- Prefer container queries for form components that live in panels.

---

## (a) Rules with evidence strength

| # | Rule | Sources | Evidence type |
|---|---|---|---|
| 1 | Default to one field per row | Baymard 2023; CXL/Speero 2016 (N=702, time only); Basel/Google g6; NN/g 2016; Atlassian; Carbon; Polaris; USWDS; web.dev | STUDY (qualitative + one timed A/B) + DS |
| 2 | 2–3 inputs per row only for one logical entity (date, name parts, city/state/ZIP, card) | Baymard 2023; Carbon; Polaris | STUDY (qualitative) + DS |
| 3 | Never put unrelated fields side by side | Polaris; Baymard 2021; Atlassian | STUDY (qualitative) + DS |
| 4 | Width signals expected length: size by content, snap to grid or token | Baymard 2010; NN/g; Basel/Google g7; GOV.UK; USWDS; Atlassian; Carbon | STUDY (qualitative) + DS |
| 5 | Cap the form column (two-thirds; ≤75 characters per line; never full width on large screens) | GOV.UK; Material 3; USWDS | DS |
| 6 | Labels visible, above the field, left-aligned | Penzo 2006; LukeW 2007; Basel/Google g5; GOV.UK; Carbon; Atlassian; web.dev | STUDY (eye tracking, small or unstated N) + DS |
| 7 | No placeholder-as-label; floating labels untested | Baymard 2013; NN/g 2014; Atlassian (Material permits floating) | STUDY (qualitative) + DS |
| 8 | Side labels only for long expert desktop forms, right-aligned | NN/g 2016; LukeW 2007; Penzo; Das 2008 | OPINION + STUDY (N=11) |
| 9 | Label closer to its own field than to the next field; larger gaps between groups | NN/g 2013; Carbon spacing tokens | OPINION + DS |
| 10 | Group related fields under section titles | WAI; GOV.UK; Carbon; Atlassian; Polaris; USWDS | DS |
| 11 | Start with one thing per page; merge only on research | GOV.UK | DS (unpublished internal research) |
| 12 | In shared rows, align input boxes, not labels | Carbon | DS |
| 13 | Overflowing related fields wrap (min width) or split by subgroup; avoid orphans | Polaris (wrap); Baymard/Carbon (cap); orphan rule = INFERENCE | DS + INFERENCE |
| 14 | Desktop: form two-thirds + aside one-third; tablet: one pane | GOV.UK; Material breakpoints | DS |
| 15 | Sticky aside only if it fits the viewport; no overflow on ancestors | MDN `position` | SPEC docs + INFERENCE |
| 16 | Error summary at the top of main, below breadcrumbs, above h1, linking to fields | GOV.UK | DS |
| 17 | Inline error attached to its field (above the input in GOV.UK, below in Carbon/Material/NN/g), never inside the input | GOV.UK; Carbon; Material; NN/g; Etre 2009; Basel/Google g17 | DS + STUDY |
| 18 | One error message per grouped entity; highlight only the wrong part | GOV.UK date input | DS |
| 19 | Errors must not shift neighbouring fields (swap hint for error or reserve space) | Material 3 | DS |
| 20 | Small repeating sets: a table or numbered stacked groups; complex items: an add-to-a-list loop | MOJ Add another; MOJ Add to a list; DWP | DS |
| 21 | Don't put inline-edit (read ↔ edit) controls inside a submit form | Atlassian | DS |
| 22 | Use subgrid for row alignment (Baseline Sept 2023, about 94% support) | MDN; caniuse | SPEC docs / data |
| 23 | Container queries for forms reused in panels | MDN; Carbon box-model contexts | SPEC docs + DS |
| 24 | 4 → 2 field columns at tablet width | Carbon grid 16→8 (page grid only); Polaris wrapping | Convention / INFERENCE |

---

## (b) Open conflicts

1. **Single vs multi-column.**
   - For single: Baymard (qualitative, N unpublished); CXL/Speero (N=702, desktop, completion time only, about 13% faster); Basel/Google g6 (bundled with 19 other guidelines; expert seriousness only 3.36/5); design systems citing the same research.
   - For multi: practitioner opinion only (UX Movement, [KB §3]).
   - No study shows multi-column winning, and none compares errors or conversion head-to-head with a large N.
2. **Field width by expected length vs full-width fields.**
   - By length: Baymard, NN/g, Basel/Google, GOV.UK fixed classes, USWDS, Atlassian.
   - Full width: GOV.UK's default fluid input fills its container.
   - Carbon reconciles the two: content length, snapped to the grid.
   - The token units disagree: GOV.UK em max-widths, USWDS ex, Atlassian px. None uses `ch`.
3. **Label position.**
   - Top: Penzo, LukeW, most design systems.
   - Right-aligned side labels in multi-column forms: Das et al. (N=11).
   - Side labels for extremely long desktop forms: NN/g.
   - Floating labels inside the field: Material. Baymard calls them untested; NN/g says they beat placeholders but lose to outside labels.
4. **Inline error position.**
   - Above the input (after label and hint): GOV.UK.
   - Below the input: Carbon, Material.
   - "Below or next to": NN/g.
   - "At the right side": Basel/Google refined g17.
   - No comparative study was found.
5. **Error summary.**
   - Mandatory even for a single error: GOV.UK.
   - Never the *only* indication, but not required: NN/g.
   - An inline notification only for server-side errors: Carbon.
6. **Etre statistic wording.** "22% increase in success rates" (ALA) vs "22% increase in completions" (slides). Cite ALA, and do not restate it as a conversion-rate claim.
7. **GOV.UK maximum page width.** 1020px in the docs vs `$govuk-page-width: 960px` in source. INFERENCE: content width vs width including outer gutters.
8. **Carbon helper text position.** The page says "Helper text appears below the input label". Verify against the live component before encoding hint position.

---

## (c) Bibliography (all accessed 2026-10-17)

**Research organisations and studies**

1. Baymard Institute, E. Scott, "Form Field Usability: Avoid Extensive Multicolumn Layouts", 31 Oct 2023. https://baymard.com/blog/avoid-multi-column-forms
2. Baymard Institute, C. Holst, "Form Design: 6 Best Practices for Better E-Commerce UI", 16 Dec 2021. https://baymard.com/blog/form-design
3. Baymard Institute, J. Holst, "Form Field Usability: Matching User Expectations", 31 Aug 2010. https://baymard.com/blog/form-field-usability-matching-user-expectations
4. Baymard Institute, J. Holst, "Mobile Form Usability: Never Use Inline Labels", 4 Jun 2013. https://baymard.com/blog/mobile-forms-avoid-inline-labels
5. Baymard Institute, accordion checkout article (snippet only). https://baymard.com/blog/accordion-checkout-usability
6. Speero (formerly CXL Institute), B. Labay, "Form Field Usability: Single or Multi-Column Forms", 17 Oct 2016. https://speero.com/post/form-field-usability-should-you-use-single-or-multi-column-forms-original-research (the original https://cxl.com/research-study/form-field-usability/ returned 403)
7. Nielsen Norman Group, K. Whitenton, "Website Forms Usability: Top 10 Recommendations", 1 May 2016. https://www.nngroup.com/articles/web-form-design/
8. Nielsen Norman Group, K. Sherwin, "Placeholders in Form Fields Are Harmful", 11 May 2014. https://www.nngroup.com/articles/form-design-placeholders/
9. Nielsen Norman Group, M. McCloskey, "Form Design Quick Fix: Group Form Elements Effectively Using White Space", 3 Nov 2013. https://www.nngroup.com/articles/form-design-white-space/
10. Nielsen Norman Group, R. Krause, "10 Design Guidelines for Reporting Errors in Forms", 3 Feb 2019. https://www.nngroup.com/articles/errors-forms-design-guidelines/
11. Seckler, Heinz, Bargas-Avila, Opwis, Tuch, "Designing Usable Web Forms: Empirical Evaluation of Web Form Improvement Guidelines", CHI 2014. https://research.google/pubs/designing-usable-web-forms-empirical-evaluation-of-web-form-improvement-guidelines/ ; PDF https://research.google.com/pubs/archive/42513.pdf
12. Google Research Blog, "Simple is better – Making your web forms easy to use pays off", Jul 2014. https://research.google/blog/simple-is-better-making-your-web-forms-easy-to-use-pays-off/
13. Bargas-Avila et al., "Simple but Crucial User Interfaces in the World Wide Web: Introducing 20 Guidelines for Usable Web Form Design", InTech, 2010. https://www.intechopen.com/chapters/10814 (guideline text taken from Table 1 of item 11)
14. M. Penzo, "Label Placement in Forms", UXmatters, 12 Jul 2006. https://www.uxmatters.com/mt/archives/2006/07/label-placement-in-forms.php
15. S. Das, T. McEwan, D. Douglas, "Using eye-tracking to evaluate label alignment in online forms", NordiCHI 2008, pp. 451–454. https://doi.org/10.1145/1463160.1463217
16. L. Wroblewski, "Inline Validation in Web Forms", A List Apart #291, 1 Sep 2009. https://alistapart.com/article/inline-validation-in-web-forms/
17. L. Wroblewski, "Top, Right or Left Aligned Form Labels", 2 Apr 2007. https://www.lukew.com/ff/entry.asp?504
18. L. Wroblewski, "Web Form Design" slides, Dec 2009. https://static.lukew.com/WebForms_LukeW_101209.pdf

**Design systems**

19. GOV.UK Design System, Text input. https://design-system.service.gov.uk/components/text-input/
20. GOV.UK Design System, Layout. https://design-system.service.gov.uk/styles/layout/
21. GOV.UK Design System, Error summary. https://design-system.service.gov.uk/components/error-summary/
22. GOV.UK Design System, Error message. https://design-system.service.gov.uk/components/error-message/
23. GOV.UK Design System, Question pages. https://design-system.service.gov.uk/patterns/question-pages/
24. GOV.UK Design System, Fieldset; Date input; Radios. https://design-system.service.gov.uk/components/fieldset/ · https://design-system.service.gov.uk/components/date-input/ · https://design-system.service.gov.uk/components/radios/
25. GOV.UK Service Manual, "Structuring forms" (updated 7 Aug 2018). https://www.gov.uk/service-manual/design/form-structure
26. GOV.UK Frontend v6.6.0 source: input widths https://github.com/alphagov/govuk-frontend/blob/main/packages/govuk-frontend/src/govuk/components/input/_index.scss ; breakpoints `src/govuk/settings/_media-queries.scss` ; page width and gutter `src/govuk/settings/_measurements.scss`
27. MOJ Design System, Add another (Official, updated July 2026). https://design-patterns.service.justice.gov.uk/components/add-another/ ; source https://github.com/ministryofjustice/moj-frontend/blob/main/src/moj/components/add-another/add-another.mjs
28. MOJ Design System, Add to a list. https://design-patterns.service.justice.gov.uk/patterns/add-to-a-list
29. DWP Design System, Add another thing. https://design-system.dwp.gov.uk/patterns/add-another-thing/how-it-works
30. USWDS, Text input. https://designsystem.digital.gov/components/text-input/
31. USWDS, Form. https://designsystem.digital.gov/components/form/ ; source https://github.com/uswds/uswds/blob/develop/packages/usa-form/src/styles/_usa-form.scss
32. Carbon Design System, Forms pattern (updated 11 Aug 2026). https://carbondesignsystem.com/patterns/forms-pattern/
33. Carbon Design System, 2x Grid overview (updated 25 Sep 2026). https://carbondesignsystem.com/elements/2x-grid/overview/
34. Carbon Design System, Data table usage (updated 30 Sep 2026). https://carbondesignsystem.com/components/data-table/usage/
35. Material Design 3, Text fields guidelines. https://m3.material.io/components/text-fields/guidelines
36. Material Design 3, Breakpoints overview. https://m3.material.io/foundations/layout/breakpoints/overview
37. Atlassian Design System, Form usage. https://atlassian.design/components/form/usage
38. Atlassian Design System, Inline edit usage. https://atlassian.design/components/inline-edit/usage
39. Atlassian AUI 9.5, Forms (legacy). https://aui.atlassian.com/aui/9.5/docs/forms.html
40. Shopify Polaris, Form layout doc and CSS source. https://github.com/Shopify/polaris/blob/main/polaris.shopify.com/content/components/layout-and-structure/form-layout.mdx ; https://github.com/Shopify/polaris/blob/main/polaris-react/src/components/FormLayout/FormLayout.module.css
41. Google web.dev, "Design basics" (Learn Forms, updated 2021-11-03). https://web.dev/learn/forms/design-basics
42. W3C WAI Tutorials, Grouping Controls (updated 2019-07-27; used only for its visual-grouping statement). https://www.w3.org/WAI/tutorials/forms/grouping/

**Specs and official docs**

43. CSS Grid Layout Module Level 1 and 2 (subgrid). https://www.w3.org/TR/css-grid-1/ · https://www.w3.org/TR/css-grid-2/
44. MDN, Subgrid. https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Subgrid
45. MDN, `position`. https://developer.mozilla.org/en-US/docs/Web/CSS/position
46. MDN, Container queries. https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries
47. MDN, `gap`; `table-layout`. https://developer.mozilla.org/en-US/docs/Web/CSS/gap · https://developer.mozilla.org/en-US/docs/Web/CSS/table-layout
48. caniuse data (Fyrd/caniuse JSON): css-subgrid, css-container-queries, css-sticky, css-grid. https://caniuse.com/css-subgrid · https://caniuse.com/css-container-queries · https://caniuse.com/css-sticky · https://caniuse.com/css-grid
