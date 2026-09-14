# Ch 13: UX Copywriting, Content & Editorial Style

Sources: [PUI] ch6 · [WSG] ch10, ch4, ch7 · [RUI] "Choose a personality", labels · [TID] ch1 Satisficing, Help Systems · [KUL] CTA copy, hero headings

## Core Idea
Interface text is interface: concise, plain, front-loaded, consistent words in sentence case — headings and links that make sense out of context, button labels that name the outcome, error messages that help — organised as scannable chunks that answer the user's question first.

## Frameworks Introduced
- **Be concise** [PUI][WSG]: remove words without losing meaning; cut filler ("actually, basically, really, quite"), intro phrases ("Would you like to", "In order to", "Are you sure", "There are", "It is"); shorter words; sentences <20 words; short paragraphs. "Would you like to save the article? Don't worry…" → "Save article?" [Save article] [Cancel].
- **Plain, conversational language** [PUI][WSG]: write as if talking to a 6th-grade student unfamiliar with the topic; no jargon/slang; contractions ok; address users as "you"/"we"; active voice ("We'll mail your package on Friday"); Federal Plain Language swaps (in order that → so; in the event of → if; assist → help; addressees → you; promulgate → issue; it is → omit) [WSG].
- **Front-load text** [PUI][WSG]: key info/benefit first in headings, links, list items, sentences ("30% off if you sign up today"); keywords at the start help scanners and screen-reader link/heading lists.
- **Inverted pyramid** [PUI][WSG]: most important → supporting → background (move details to "Learn more"/separate screen). Content first: no "Welcome to our site" intros or paragraphs describing what's on the page [WSG].
- **Conversation & desire lines** [WSG]: every visit is a conversation started by the visitor — anticipate questions, remove content of questionable value, map follow-on questions; watch actual paths (analytics, field studies) and adapt.
- **Chunk & signpost** [WSG][PUI]: break long text with descriptive headings & bullets; headings meaningful out of context ("Free secure parking" not "Parking"); lists for sequences (numbered) and parallel structure; chunk size = fully answers one question.
- **Sentence case** [PUI][WSG]: capitalise first word & proper nouns only; Title Case slows scanning; ALL CAPS only for short labels (small, bold, tracked).
- **Limit abbreviations/acronyms** [PUI][WSG]: "Apt. no." → "Apartment number"; expand on first use; spell out regional abbreviations; global date format (14 March 2026) [WSG].
- **Consistent vocabulary** [PUI][WSG]: one term per concept (cart ≠ bag; sign up ≠ register; log in ≠ sign in; delete ≠ remove; publish ≠ post); controlled vocabulary in the style guide.
- **Numbers** [PUI]: numerals not words ("899 designers"); thousands separators (2,420); large numbers abbreviated ("1 billion", "1.2M").
- **Punctuation** [PUI][WSG]: no full stops on short UI strings unless multi-sentence; consistent across siblings; one space after periods; no characters as decoration.
- **Labels** [PUI][WSG][TID]: no "my"/"your" in form labels ("Email"); no instructional verbs in labels ("Type your email"); labels whose first-guess meaning is correct (satisficing) [TID].
- **Links describe destination** [PUI][WSG]: never "click here", "read more", "learn more" repeated; link the descriptive phrase ("Explore templates", "Email marketing features"); or make the heading the link; if leaving the site, say so [WSG].
- **Buttons: verb + noun** [PUI][KUL]: "Start workout", "Download PDF", "Update payment details"; urgency words ("now/today") in marketing CTAs sparingly [KUL]; avoid Yes/No for consequential dialogs [KUL].
- **Error messages** [PUI][WSG]: state what happened, why, how to fix; never blame; no "Oops/please/sorry"; not robotic; descriptive heading & button ("Payment failed" / "Update your payment details and try again" / [Update payment details]); human alternatives to codes ("We can't find that page" + search + links) [WSG].
- **Similar text lengths** in aligned rows (cards/features) for tidy layouts [PUI][KUL].
- **Personality through language** [RUI]: tone (formal vs friendly) is part of brand personality; keep consistent.
- **Page titles** [WSG]: unique, keyword-first, concise, "Page — Section — Site" (org name last; ≤~60–65 chars).
- **Help systems** [TID]: meaningful on-screen copy first, then hints/prompts, tooltips, contextual "?" help, guides/videos, community; help near the task without constant intrusion.
- **Hero/marketing headings** [KUL]: immediately understandable value, emotional resonance, jargon-free.
- **Credibility (ethos)** [WSG]: typos, broken links, outdated content, missing images erode trust; show author, date, organisation.

## Key Concepts
- **Front-loading**; **inverted pyramid**; **plain language**; **sentence case / down style**; **controlled vocabulary**; **microcopy**; **scent (trigger words)**.

## Mental Models
- If a word can go without loss, it goes.
- Write headings and links for someone who reads *only* headings and links (scanners, screen readers).
- Consistency of words is as important as consistency of components.
- Error copy is support staff — be specific and kind.

## Audit Checks
| # | Check | Pass criterion | Src |
|---|---|---|---|
| W1 | Concision | No filler/intro phrases; sentences <~20 words; UI strings short | PUI, WSG |
| W2 | Plain language | No unexplained jargon, internal names, acronyms; active voice | PUI, WSG |
| W3 | Front-loaded | Headings/links/list items start with key word/benefit | PUI, WSG |
| W4 | Case | Sentence case for headings, buttons, labels, menus; no ALL CAPS sentences | PUI, WSG |
| W5 | Headings | Descriptive, standalone meaning; logical hierarchy; frequent enough to scan | PUI, WSG |
| W6 | Link text | Destination-descriptive; no "click here"/duplicate "learn more" | PUI, WSG |
| W7 | Button labels | Verb + noun; consistent with resulting page/title | PUI, KUL |
| W8 | Vocabulary consistency | One term per concept across nav, buttons, titles, emails | PUI, WSG |
| W9 | Numbers & dates | Numerals, separators, unambiguous dates/units, locale-aware | PUI, WSG |
| W10 | Error copy | What/why/fix, no blame, no codes-only, adjacent to issue | PUI, WSG |
| W11 | Content first | No welcome fluff; most important info first | WSG, PUI |
| W12 | Empty/success copy | Explains state & next step | PUI, RUI |
| W13 | Credibility | No typos, stale dates, broken links; owner/date shown where relevant | WSG |
| W14 | Page titles | Unique, descriptive, specific→general | WSG |

## Fix Recipes (before → after)
| Before | After | Rule |
|---|---|---|
| "Are you sure you want to delete this message?" [OK] [Cancel] | "Delete message?" [Delete message] [Cancel] | concise, verb+noun |
| "Click here to download our 5 UI eBooks" | "Download 5 UI design eBooks" (linked) | link text |
| "Sign Up Today For 30% Off" | "30% off when you sign up today" | front-load, sentence case |
| "Oops! Something went wrong." [Ok] | "Payment failed — update your payment details and try again" [Update payment details] | error copy |
| Label "My email address:" placeholder "Type your email" | Label "Email" + hint "We'll send the receipt here" | labels |
| "Location" / "Parking" | "Beautiful waterfront location" / "Free secure parking" | descriptive headings |
| "eight hundred and ninety nine members" | "899 members" | numerals |
| "Escape the stresses of quotidian existence with this harmonious fusion of contemplative pranayama…" | "Escape everyday stress with a balanced blend of mindful breathing and physical postures." | plain language |
| Cart icon labelled "Bag", button "Add to cart" | "Cart" everywhere | vocabulary |

Process: (1) inventory strings (i18n files help); (2) build terminology list; (3) rewrite by rule table; (4) read headings+links only — do they tell the story? (5) test with 5 users for comprehension.

## Conflicts & Context
- Title Case for marketing CTAs appears in [KUL] examples; [PUI][WSG] recommend sentence case. Default to sentence case for product UI; brand marketing may deviate only if consistent.
- Joining words: [PUI] suggests dropping "a/an/the" where possible for brevity in UI strings — don't let it produce telegraphic, unclear copy; full sentences in body text.

## Anti-patterns
- **Jargon & internal project names** in UI [PUI][WSG].
- **Title Case Everywhere** [PUI][WSG].
- **"Click here", "Read more" links** [PUI][WSG].
- **Mixed terms for the same thing** [PUI].
- **Blaming/robotic errors** ("Invalid input", "Error 0x8004") [PUI][WSG].
- **Welcome paragraphs & "this page contains…" intros** [WSG].
- **Double negatives in confirmations** [KUL].

## Worked Example
*Property features block [PUI]:* Before — one paragraph: "Beautiful waterfront location. 98% of recent guests gave this location a 5-star review. Fast check-in experience. 95% of recent guests gave the check-in experience a 5-star review. Free secure parking. This property features a single lock-up garage with storage." After — three chunks, each with a descriptive heading (Text strong) and supporting line (Text weak): **Beautiful waterfront location** / 98% of recent guests gave the location 5 stars; **Fast check-in experience** / 95% gave check-in 5 stars; **Free secure parking** / Single lock-up garage with storage. Full stops removed consistently (fragments), numerals kept, headings meaningful when read alone by a screen reader.

## Key Takeaways
1. Cut words; front-load meaning; plain language.
2. Sentence case; consistent terminology.
3. Headings & links must stand alone.
4. Buttons say the outcome; errors say the fix.
5. Content first — skip welcome fluff.

## Connects To
- **ch08** button labels · **ch09** form & error copy · **ch10** link scent · **ch15** screen-reader headings/links
