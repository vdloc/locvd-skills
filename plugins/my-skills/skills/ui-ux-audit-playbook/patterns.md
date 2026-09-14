# Patterns Catalog

Format: **Name** — when to use · how (key rules) · trade-off. Tags = source; chapter = where expanded.

## Structure & Navigation [TID ch2–3 → ch10]
- **Feature, Search, and Browse** — content/product catalogues · featured item in Center Stage + prominent search + browsable categories near top · featured items define what the site is about.
- **Mobile Direct Access** — single-purpose app · first screen shows actionable result using location/time, no input · wrong assumptions frustrate.
- **Streams & Feeds** — frequently updated content · newest first, refresh, card items with who/what/when · algorithmic order may disorient.
- **Dashboard** — monitoring key metrics · one screen, actionable data only, simple charts, Titled Sections, drilldown · clutter if not edited ruthlessly.
- **Canvas Plus Palette** — graphical editors · tool grid beside large canvas · tool behaviours need testing.
- **Wizard** — long, novel, branched tasks · chunk into sensible steps (not 2, not 15), Back/Next, progress · removes user control; simplify task first.
- **Settings Editor** — preferences/accounts · conventional location, grouped named pages, show current values, Save vs instant per platform.
- **Alternative Views** — conflicting needs (list/grid, print) · switch control, preserve state, remember choice.
- **Many Workspaces** — multitasking/comparison · tabs, split panes, restore sessions.
- **Help Systems** — every product · layered: on-screen copy → hints/prompts → tooltips → contextual help → guides → community.
- **Tags** — large user-generated content · tags as links to filtered results.
- **Clear Entry Points** — many first-time users · few task-oriented "doors" with plain language, emphasised proportionally.
- **Menu Page** — table-of-contents screens · list of links with just enough description; avoid overwhelming.
- **Pyramid** — sequences also browsable non-linearly · parent list + Back/Next + Up link on each item.
- **Modal Panel** — required decision/subtask without losing context · 1–3 labelled exits, lightbox, return to origin · disruptive if overused.
- **Deep Links** — stateful views worth sharing · encode position/filters in URL; update live.
- **Escape Hatch** — wizards, modals, error/404, deep-linked pages · obvious link to a safe place.
- **Fat Menus** — large multi-level sites · titled columns, horizontal space, keyboard/AT operable; linearise on mobile.
- **Sitemap Footer** — medium-large sites · categorised links + utility info in footer.
- **Sign-In Tools** — signed-in services · top-right cluster: name/avatar, account, help, sign out, cart, notifications.
- **Progress Indicator** — linear multi-page processes · one-line map with numbers + short titles, current step marked, visited steps clickable.
- **Breadcrumbs** — hierarchies ≥2 levels · parent links separated by ›, current page unlinked.
- **Annotated Scroll Bar** — long documents/data · position tooltips or markers (search hits) on scroll bar.
- **Animated Transition** — state changes, zoom, open/close · ~300ms, local, quick, merge repeated actions · motion sickness if overdone.

## Layout & Chunking [TID ch4, RUI, PUI → ch02–03, ch12]
- **Visual Framework** — multi-screen products · shared layout, colours, type, signposts, spacing defined once.
- **Center Stage** — screens with one main job · main area ≥2× side panels; tools around it.
- **Grid of Equals** — peer items · common template, equal weight; hover highlight without layout shift.
- **Titled Sections** — lots of visible content · strong titles, whitespace/background separation; hard-to-name group = regroup.
- **Module Tabs** — few (<10) similar-size modules seen one at a time · selected tab unmistakable, never double-row · hides comparison.
- **Accordion** — stacked modules, variable heights · allow multiple open, chevron affordance, persist state.
- **Collapsible Panels** — optional supporting content · default closed unless most users open it.
- **Movable Panels** — personalised dashboards/pro tools · drag slots, close/add modules.
- **Progressive Disclosure** [PUI][TID] — reduce load · show essentials, reveal on demand with descriptive trigger.
- **Rectangles within rectangles** [PUI] — spacing · small inner gaps growing outward (8 → 24 → 32 → 80).
- **Start with too much white space** [RUI] — any layout · begin generous, remove.
- **Split into columns instead of stretching** [RUI] — narrow content on wide screens.

## Mobile [TID ch6 → ch14]
- **Vertical Stack** — mobile web · priority-ordered single column; useful content in first ~100px.
- **Filmstrip** — parallel full screens · swipe + dot indicator · poor for many screens/discoverability.
- **Touch Tools** — immersive media · tap to reveal translucent controls; auto-hide.
- **Bottom Navigation** — mobile global nav · labelled items at bottom; top reserved for content.
- **Collections and Cards** — rich lists · thumbnail left, visual markers, bold colour ok.
- **Infinite List** — bottomless lists · load-more (state count) or lazy load.
- **Generous Borders** — any touch target · 44pt iOS / 48dp Android + tappable whitespace.
- **Loading/Progress Indicators** — slow loads · show partial content, indicator in place.
- **Richly Connected Apps** — phone/address/date data · link to dialer, maps, calendar, camera.

## Lists & Data [TID ch7, ch9 → ch11]
- **Two-Panel Selector (Split View)** — browse items with details on large screens.
- **One-Window Drilldown** — small screens · add prev/next to avoid pogo-sticking.
- **List Inlay** — compare details in place.
- **Cards** — heterogeneous items with same actions · design for longest & shortest content.
- **Thumbnail Grid** — visual items · uniform size, consistent crops, small metadata.
- **Carousel** — casual browsing in little vertical space · <10 visible, arrows move several.
- **Pagination** — very long goal-directed lists · first page must satisfy; show count, prev/next, jumps.
- **Jump to Item / Alpha-Numeric Scroller** — long sorted lists · type-ahead or letter rail.
- **New-Item Row** — tables/lists needing quick creation · create in place with defaults.
- **Datatips** — values on hover/tap over graphics.
- **Data Spotlight** — highlight one slice, dim others.
- **Dynamic Queries** — filters with instant results (sliders, checkboxes).
- **Data Brushing** — select in one view, highlight in all.
- **Multi-Y Graph** — related series sharing x-axis.
- **Small Multiples** — many dimensions; same scale grids.

## Actions [TID ch8, PUI ch7, RUI → ch08]
- **Button Groups** — 2–5 related actions · same treatment, same scope, beside target.
- **Hover or Pop-Up Tools** — per-item actions (desktop) · instant, no reflow · undiscoverable on touch.
- **Action Panel** — many or complex actions · always visible, task-grouped, dynamic.
- **Prominent "Done" Button / Assumed Next Step** — end of any transaction · real button, specific label, end of visual flow.
- **Smart Menu Items** — context-dependent commands · label names the object ("Undo typing").
- **Preview** — costly/visual actions · show outcome; commit or change from preview.
- **Spinners & Loading Indicators** — ops >1–2s · what's happening, % done, time left, cancel.
- **Cancelability** — long ops/modal states · immediate stop, confirm cancelled.
- **Multilevel Undo / Command History / Macros** — complex authoring tools.
- **Three button weights** [PUI][RUI] — primary solid, secondary outline, tertiary underlined link.
- **Destructive friction ladder** [PUI] — initial → light → moderate → heavy → undo.
- **Lock icon instead of disabled** [PUI] — unavailable/premium actions with explanation.

## Forms [TID ch10, PUI ch8 → ch09]
- **Forgiving Format** — varied syntax (dates, locations).
- **Structured Format** — fixed universal formats (card numbers) only.
- **Fill-in-the-Blanks** — rule/query builders · sentence with controls · hard to localise.
- **Input Hints** — non-obvious fields · short, visible, under label.
- **Input Prompt** — no good default · "Choose a state"; not a label substitute.
- **Password Strength Meter** — new passwords · live strength + specific advice + rules upfront.
- **Autocompletion** — predictable values/long lists · suggestions ≤~10, bold match.
- **Drop-down Chooser** — complex choice in small space (calendar, colour, tree).
- **List Builder** — subset from large source · two lists + Add/Remove, multi-select.
- **Good Defaults and Smart Prefills** — most users would pick the same · never sensitive fields.
- **Error Messages** — prevent first; field-level text+icon; summary for long forms.
- **Opt-in progressive field** [PUI] — replace optional fields with checkbox-revealed required ones.
- **Stepper** [PUI] — small numeric changes · horizontal +/−, ≥48pt.
- **Checkbox vs toggle** [PUI] — checkbox applies on submit; toggle applies immediately.
- **Multi-step form** [PUI] — long forms · duration notice, 5-ish questions/step, progress, review, success.

## Visual Polish [RUI → ch05–07]
- **Define shades up front** — 9-step scales picked by eye (100–900).
- **Flip the contrast** — dark coloured text on light tint instead of white on dark colour.
- **Rotate hue for brightness** — ≤20–30° toward bright/dark hues.
- **Two-part shadows** — soft ambient + tight contact shadow.
- **Overlap to create layers** — cards crossing backgrounds; invisible image borders.
- **Supercharge the defaults** — icon bullets, quote marks, custom underlines/checkboxes.
- **Decorate backgrounds** — section colour, subtle gradient (≤30° hue), low-contrast pattern.
- **Use fewer borders** — shadow, background change, or spacing instead.
- **Labels are a last resort** — self-describing values ("3 bedrooms").
- **Text on images** — overlay, lower contrast, colorize, glow shadow.
- **Everything has an intended size** — don't scale icons/screenshots/logos; enclose small icons in shapes.
