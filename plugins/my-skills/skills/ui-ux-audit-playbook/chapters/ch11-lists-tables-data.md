# Ch 11: Lists, Tables, Dashboards & Complex Data

Sources: [TID] ch2 (Dashboard), ch7, ch9 · [RUI] labels, tables, colour · [PUI] hierarchy, unbreakable UI · [KUL] cards, info cards · [WSG] ch11

## Core Idea
Choose list and data presentations from the *use case* (overview, browse, find, compare, rearrange) and the data's organisational model, encode meaning with preattentive variables (position, size, colour, shape) redundantly, keep "focus plus context", and make exact values, sorting and filtering easy.

## Frameworks Introduced
- **List use cases** [TID]: overview · browse item by item · search for a specific item · sort & filter · rearrange/add/delete/recategorise (multi-select by platform standard or checkboxes).
- **List IA questions** [TID]: length (bottomless?) · natural order & user re-sorting (order vs grouping trade-off) · grouping/categories/hierarchy · item types (rich vs simple, images, sortable fields) · interaction (show whole vs representation; view/select/act; multi-select) · dynamic behaviour (load time, live updates).
- **Where to show item detail** [TID]: *Two-Panel Selector / Split View* (large screens; list left/top, single-click select, arrow keys, obvious selection) · *One-Window Drilldown* (mobile; add prev/next to avoid pogo-sticking) · *List Inlay* (expand in place; compare multiple; close control near open control).
- **Visual lists** [TID][KUL][RUI]: *Cards* (mock up longest & shortest content), *Thumbnail Grid* (uniform size; consistent product crops; small metadata), *Carousel* (<10 visible; arrows move several), *Grid of Equals* (common template; hover highlight without layout change).
- **Long lists** [TID]: *Pagination* (first page must satisfy; show position & count; prev/next disabled at ends; controls top & bottom for long pages) · *Infinite List / load more* (tell how many load) · *Jump to Item* (type-ahead) · *Alpha/Numeric Scroller* · filters + find field · *New-Item Row* (create in place).
- **Hierarchies** [TID]: Titled Sections (one level), Accordion (few sections), trees (indent + disclosure icons).
- **Tables** [RUI][TID][PUI]: right-align numbers (tabular figures) [RUI]; labels are a last resort — combine related columns into one cell with hierarchy (name bold + email weak) if not separately sortable [RUI]; add images/colour badges to enrich [RUI]; row striping or spacing for scanability [TID]; sortable columns [TID]; fewer borders [RUI]; truncate thoughtfully & keep full value accessible [PUI].
- **Information graphics basics** [TID]: answer — how is data organised? what's related? how to explore? can I rearrange? how to see only what I need? what are exact values?
- **Organisational models** [TID]: linear (list, single-variable plot) · tabular (table, multi-Y) · hierarchical (tree) · network (graph, flowchart) · geographic/spatial (map, scatter) · textual (word cloud) · other (treemap, parallel coordinates). If two fit, consider showing both.
- **Preattentive variables & layering** [TID]: colour hue, size, position/alignment, shape, orientation etc. are found in constant time; use them to make key values pop and to encode dimensions; redundant encoding (shape + colour) separates groups; layered visual classes.
- **Navigation of data** [TID]: focus plus context; scroll/pan with overview; zoom revealing detail; open/close in place; drill down; link search results to pan/zoom.
- **Sorting & rearranging** [TID]: alphabetical, numerical, time, location, category, popularity, user-defined; sorting by value surfaces patterns; let users pick the stacked-bar baseline series.
- **Filtering** [TID]: best filters are highly interactive (without lagging typing), iterative, contextual (results in context), and support compound conditions.
- **Exact values** [TID]: direct labels (precise; avoid clutter), legends near graphic, axes/scales, *Datatips*.
- **Data patterns** [TID]: *Datatips* (tooltip at pointer, compact, don't cover data, may include drill link) · *Data Spotlight* (highlight slice, dim others) · *Dynamic Queries* (sliders, range sliders, checkboxes; instant results) · *Data Brushing* (select in one view, highlight in all) · *Multi-Y Graph* (shared x, stacked y) · *Small Multiples* (same scale/size; label varying dimension; bin large ranges).
- **Dashboard** [TID][KUL]: decide what users must monitor/act on; remove non-actionable data; strongest visual hierarchy for key metrics; one screen with little scrolling; group in Titled Sections; tabs only if side-by-side comparison isn't needed; drilldown; simple line/bar charts beat gauges, dials, pies, 3D bars; tables when numbers matter; highlight key numbers; consider customisation (Movable Panels). Info cards: label, value, delta with ▲▼ icon + colour [KUL][RUI].
- **Graphics ethics** [WSG]: don't distort data; don't cherry-pick; trust readers; captions + data tables for accessibility.
- **Colour in data** [RUI][TID]: don't rely on hue alone — vary lightness; direct labels; icons for up/down.

## Key Concepts
- **Preattentive variable**; **encoding**; **layering** [TID].
- **Focus plus context** [TID].
- **Split view / drilldown / inlay** [TID].
- **Tabular numerals**: fixed-width digits for alignment.
- **Small multiples** [TID, after Tufte].

## Mental Models
- Start from the question the user is asking of the data, then pick the shape.
- Make the important number the biggest, darkest thing; labels whisper [RUI].
- Every chart promises to make something easier to understand — if it doesn't, use a table [WSG][TID].

## Audit Checks
| # | Check | Pass criterion | Src |
|---|---|---|---|
| DL1 | Pattern fits use case | Detail view pattern (split/drilldown/inlay) suits screen size & comparison needs | TID |
| DL2 | Long list strategy | Pagination/load-more/virtualisation + find/filter; position feedback ("11–20 of 128") | TID, PUI |
| DL3 | Table alignment | Numbers right-aligned with tabular figures; text left; headers aligned with content | RUI |
| DL4 | Table hierarchy | Primary identifiers emphasised; secondary data weak; related columns combined where not sortable | RUI |
| DL5 | Sort & filter | Sortable columns indicated; active filters visible & clearable; state in URL | TID |
| DL6 | Selection | Multi-select affordance, selected state obvious, bulk actions near selection | TID |
| DL7 | Empty/loading/error | Designed empty state, skeleton/indicator for loads, error with retry | RUI, TID |
| DL8 | Chart choice | Simple line/bar for comparisons/time; no 3D/gauges/pies for precise comparison | TID |
| DL9 | Encoding | Not colour-only; lightness/shape/labels; legend adjacent or direct labels | TID, RUI |
| DL10 | Exact values | Tooltips/datatips or labels; axes readable; units stated | TID |
| DL11 | Dashboard focus | Key metrics first & largest; above-the-fold essentials; no decorative widgets | TID |
| DL12 | Unbreakable data | Long names, huge numbers, zero values, negatives handled (formatting 2,420; 1.2M) | PUI |
| DL13 | Accessible graphics | Chart has text summary/data table; datatips keyboard-reachable | WSG |

## Fix Recipes
```css
.table{ border-collapse:collapse; width:100%; font-size:.875rem; }
.table th{ text-align:left; font-weight:600; color:var(--text-weak); padding:.75rem 1rem; }
.table td{ padding:.75rem 1rem; border-top:1px solid var(--stroke-weak); }
.table td.num, .table th.num{ text-align:right; font-variant-numeric: tabular-nums; }
.table tbody tr:hover{ background:var(--fill-hover); }
.cell-primary{ font-weight:600; color:var(--text-strong); } .cell-secondary{ color:var(--text-weak); display:block; }
.delta-up::before{ content:"▲ "; } .delta-down::before{ content:"▼ "; }  /* not colour alone */
```
1. **Label: value dump** → cards/rows with hierarchy; drop redundant labels.
2. **Spreadsheet-like table** → merge "Name" + "Email" into one cell; status as coloured badge with text; avatars.
3. **Gauge/pie dashboard** → bar/line charts, sparklines, big-number cards with deltas.
4. **Unscannable long list** → filters + search + sort + pagination with count; sticky header.
5. **Hue-only chart series** → lightness steps + direct end-of-line labels.
6. **Mobile table overflow** → priority columns + row drilldown, or stacked card rows; horizontal scroll only with visible cue.

## Conflicts & Context
- Pagination vs infinite scroll [TID]: pagination for goal-directed search (position, return), infinite/load-more for casual feeds; avoid infinite scroll where footer content matters.
- Tables vs cards: tables for comparison across attributes; cards for heterogeneous, visual items [TID][KUL].

## Anti-patterns
- **Left-aligned numeric columns** [RUI].
- **Everything in its own column** with equal emphasis [RUI].
- **3D bars, gauges, dials** for comparisons [TID].
- **Legends far from charts** [TID].
- **Silently truncated key data** [PUI].
- **Pogo-sticking drilldowns** without prev/next [TID].

## Worked Example
*Applicant table (Practical UI dark dashboard example, reconstructed + RUI table advice):* Columns "Applicant | Email | Date applied | Status | Actions". Improvements: combine applicant name (Text strong) with role (Text weak) and email in one cell; status as badges "Approved / On hold / Rejected / Pending" with icon + text (not colour alone); date right-aligned tabular; row actions shown as tertiary icon buttons with labels on focus/hover and a bulk-action bar ("2 items selected · Download · Delete") appearing when rows are checked; tabs "All / Approved / On hold / Pending / Rejected" as filters; pagination "Previous 1 2 3 … 10 Next · Showing 11–20 of 128".

## Key Takeaways
1. Pick list/data patterns from use cases and data shape.
2. Preattentive, redundant encoding; never hue alone.
3. Tables: right-aligned numbers, merged hierarchy cells, fewer lines.
4. Long lists need filter, sort, search, position.
5. Dashboards: actionable metrics, simple charts, drilldown.

## Connects To
- **ch05** colour encoding · **ch10** search & navigation · **ch12** cards · **ch14** mobile lists
