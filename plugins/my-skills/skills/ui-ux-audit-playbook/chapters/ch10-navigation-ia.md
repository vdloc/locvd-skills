# Ch 10: Navigation, Information Architecture & Wayfinding

Sources: [TID] ch2–3 · [WSG] ch4, ch6–7 · [PUI] ch2 · [KUL] navigation, search

## Core Idea
Structure before screens: organise content in user vocabulary with mutually exclusive categories, keep navigation distances short, and give every page clear "you are here" signposts, a way back, and search — so users can orient, choose a route, and recognise arrival.

## Frameworks Introduced
- **IA foundations** [TID][WSG]: IA = organising & labelling an information space (categories, navigation, workflows, labels, search/filter, screen templates). Layered design: IA → functionality → presentation; separate information from presentation. Bad structure can't be fixed with visual design [WSG].
- **MECE** [TID]: categories Mutually Exclusive, Collectively Exhaustive, extensible.
- **LATCH / Five Hat Racks** [TID][WSG]: Location, Alphabet, Time, Category (facets), Hierarchy (+ Number/Continuum).
- **Controlled vocabulary** [WSG]: same thing, same label everywhere; audience words ("doctor" not "physician").
- **Organizing process** [WSG]: inventory content → hierarchical outline + vocabulary → chunk → diagram site & wireframes → test (open card sort to discover names, closed sort to place, reverse/tree test to validate; ~5 users ≈80% of insight). Avoid org-chart sites.
- **Screen types** [TID]: Overview (lists/grids), Focus (one item), Make (editors), Do (single task). Build a system of screen templates.
- **Navigation purposes** [TID]: what's here, how it's structured, where am I, where can I go, where did I come from / how to go back. **Signposts** (titles, logos, tabs, selection indicators, breadcrumbs, progress) · **Wayfinding** (signage at every decision point, environmental clues, maps) [TID]; Lynch's paths/edges/districts/nodes/landmarks; orientation → route decisions → mental mapping → closure [WSG].
- **Navigation types** [TID][WSG]: global (every screen; top/left; mobile bottom bar or menu), utility (account, help, settings — top-right), local/section (left sidebar convention), associative/contextual (related content, tags), footer (sitemap footer).
- **Keep distances short** [TID][WSG]: broad & shallow hierarchy with good "scent" (users prefer ≥5–7 well-organised links per menu to many thin layers [WSG]); frequent destinations in global nav; aim for common 80% tasks on one page; content 1–2 clicks from menus. But cap top-level categories at ~7–10 and progressively disclose [WSG]. Krug: clicks are fine if each is mindless and unambiguous [WSG].
- **Navigational models** [TID]: hub & spoke, fully connected, multilevel/tree (convert via fat menus/sitemap footer), step-by-step, pyramid, pan & zoom, flat (tool apps). Immersive/task modes need minimal nav + escape hatch.
- **Scent of information** [WSG]: distinguishable links; trigger words at start of link text; words in link appear prominently on destination; confidence grows with each click.
- **Browse + search** [WSG][TID]: ~⅔ browse-first, ~⅓ search-first, nearly all use both; browse nav teaches vocabulary & gives landmarks; sites beyond a few dozen pages need search; search box on every page, top-right, simple, ≥~27 characters wide, clear scope; results page in site chrome.
- **Navigation patterns** [TID]: *Clear Entry Points* · *Menu Page* · *Pyramid* · *Modal Panel* · *Deep Links* (URL restores state) · *Escape Hatch* (way back to safe place; 404s) · *Fat Menus* (organised mega menus; keyboard/screen-reader operable) · *Sitemap Footer* · *Sign-In Tools* (top-right) · *Progress Indicator* · *Breadcrumbs* (from 2+ levels; links; current page not linked) · *Annotated Scroll Bar* · *Animated Transition* (~300ms, local, combine repeats) · *Feature, Search, and Browse* · *Streams & Feeds* · *Dashboard* · *Wizard* · *Settings Editor* (findable in conventional place, grouped pages, show current values) · *Alternative Views* · *Many Workspaces* · *Help Systems* (inline copy → tooltips → guides) · *Tags*.
- **Nav bar best practices** [KUL][WSG][PUI]: logo top-left linked home; short concise labels; CTA visually distinct from links; too many links → dropdown/mega-menu/footer; hover + active/current states; sticky nav with subtle shadow/stroke/blur; link contrast on translucent headers; don't hide nav behind hamburger when space exists [PUI]; dropdowns must not open on hover only (keyboard/touch) [WSG].
- **No dead-end pages** [WSG]: every page links home + main sections; users land deep from search.
- **Search UX** [KUL][PUI][TID]: prominent if core; recent searches (clear all / remove one); reset query; Cancel returns; placeholder with example queries; autocomplete/suggestions; helpful no-results page (related results, spelling, popular); highlight matched terms.
- **Every page needs** [WSG]: informative `<title>` (Page — Section — Site), visible h1, owner/author, date, home link, link to parent section, contact info or link.

## Key Concepts
- **Information architecture (IA)**; **taxonomy**; **controlled vocabulary**.
- **Card sorting** (open/closed/reverse) [WSG].
- **Signpost**, **wayfinding**, **escape hatch**, **deep link** [TID].
- **Global / utility / local / contextual navigation**.
- **Scent of information** [WSG].
- **Click depth**.

## Mental Models
- Label with user words; test labels before pixels.
- A page is an entrance, not a room in a sequence — assume users arrive from search.
- Shallow + well-labelled beats deep + tidy.
- Navigation should recede; it's the frame, not the painting [WSG].

## Audit Checks
| # | Check | Pass criterion | Src |
|---|---|---|---|
| N1 | Labels in user vocabulary | Nav/category names understood first-guess; no internal jargon/org-chart structure | WSG, TID |
| N2 | Categories MECE | No overlapping sections; no "Misc"; everything has a home | TID |
| N3 | Location cues | Current page highlighted in nav; page title/h1; breadcrumbs for ≥2 levels | TID, WSG, KUL |
| N4 | Way back | Logo→home; no dead ends; escape hatch in modals/wizards/404 | WSG, TID |
| N5 | Distance | Top tasks ≤2–3 clicks; frequent destinations in global nav; top level ≤~7–10 items | TID, WSG |
| N6 | Visibility | Primary nav visible when space allows (no needless hamburger on desktop) | PUI |
| N7 | Search | Present on content-rich sites; consistent place; adequate width; suggestions; useful no-results | WSG, KUL |
| N8 | Link scent | Links start with keywords, describe destination; no "click here/learn more" | WSG, PUI |
| N9 | Menu operability | Dropdown/mega menus usable by keyboard & touch; not hover-only; focus management | WSG |
| N10 | Consistency | Nav in same place/order on every page; no rearranging menus | TID, WSG |
| N11 | Deep links | Shareable URLs restore filters/state; back button works | TID |
| N12 | Page identity | Unique descriptive `<title>` (specific→general); visible h1; last-updated where relevant | WSG |
| N13 | Utility conventions | Account/sign-in/cart/help top-right; search top-right or prominent | TID, WSG |
| N14 | Progress in sequences | Steps show "Step n of m" or progress map | TID, PUI |

## Fix Recipes
1. **Confusing categories** → content inventory → open card sort (≥5 participants) → rename in users' words → tree test.
2. **Deep hierarchy** → flatten: promote frequent subpages; add fat menu or sitemap footer.
3. **Missing orientation** → `aria-current="page"` + visual active state; breadcrumbs; consistent page titles.
4. **Hamburger on desktop** → expose top-level links; keep menu for overflow.
5. **Hover-only mega menu** → disclosure buttons (`aria-expanded`), Esc closes, Tab order, click/tap to open.
6. **Bad search** → autocomplete + recent + no-results suggestions; scope label; results styled in site template.
7. **Filtered views lose state** → encode filters/sort/page in URL query.

```html
<nav aria-label="Main">
  <ul class="nav">
    <li><a href="/projects" aria-current="page">Projects</a></li>
    <li><button aria-expanded="false" aria-controls="menu-resources">Resources</button>
        <ul id="menu-resources" hidden>…</ul></li>
  </ul>
</nav>
<nav aria-label="Breadcrumb"><ol class="breadcrumb">
  <li><a href="/">Home</a></li><li><a href="/guides">Guides</a></li><li aria-current="page">Forms</li>
</ol></nav>
```

## Conflicts & Context
- Breadth vs choice overload: [TID][WSG] favour broad/shallow; [PUI] Hick's Law & [WSG] paradox of choice cap choices (~7–10). Resolution: broad but *grouped* (fat menus with titled sections), progressive disclosure below top level.
- Left vs right section nav: left is the convention [WSG]; right works if consistent and not ad-like.
- Hamburger: acceptable on small screens [TID][WSG]; avoid when space exists [PUI].

## Anti-patterns
- **Org-chart navigation** [WSG].
- **Mystery-meat / creative nav metaphors** [WSG].
- **Dead-end pages** without home/section links [WSG].
- **Hover-only menus** [WSG].
- **"Learn more" ×3 links** [PUI].
- **Global nav on immersive tasks** (checkout) distracting from completion [TID][WSG].
- **Penn Station sites** — sub-sites with competing nav systems [WSG].

## Worked Example
*Blog slide-out menu [PUI] (Fitts's Law):* Menu icon top-left opens a panel whose category list sits mid-screen with small targets and a close button top-right. Fix: close button placed exactly where the open icon was (no finger travel), categories moved to the top-left and left-aligned, each item enlarged with a bordered full-width target. Combined with [TID] signposting: the active category is marked, and a breadcrumb "Home › Workspace › 50 workspace ideas" appears on article pages so search visitors can climb up.

## Key Takeaways
1. IA first, in user vocabulary, tested with card sorts.
2. Short distances, grouped breadth, visible primary nav.
3. Always show where users are and how to get back.
4. Search + browse together; design no-results.
5. Menus operable by keyboard and touch; state in URLs.

## Connects To
- **ch11** lists & data browsing · **ch14** mobile navigation · **ch12** dropdowns/modals/search components · **ch13** link text
