# MARKET AI interaction contracts

Accepted Gate 2.5 contract: 2026-09-13, incorporating the accepted audit corrections. This document owns observable interaction behavior. [Experience contracts](EXPERIENCE_CONTRACTS.md) own hierarchy/responsibilities, [explanation levels](EXPLANATION_LEVELS.md) own depth, [design](../design/DESIGN_SYSTEM.md) owns presentation, and [synthetic data](../data/SYNTHETIC_DATA_CONTRACT.md) owns financial integrity. This is a specification, not permission to implement code, APIs, schemas, AI, financial datasets or deployment.

## Shared profiles

### INT-001 No Dead UI and release scope

Anything appearing clickable, tappable, selectable, expandable, dismissible, searchable, shareable, navigable, editable or draggable must have defined functioning behavior before exposure. No placeholder hrefs, no-op handlers, fake source links, decorative interaction chevrons or dead View All actions. Static surfaces must not imply action.

Inventory classifications: **KEEP** retains an established action; **DEFINE** retains it with the contract below; **REMOVE** means remove for the current project; **DEFER** means defer and do not expose. KEEP/DEFINE are final Release 1 targets unless explicitly conditional. Final Release 1 does not mean the first coding milestone: verified vertical slices may expose only functional views/actions. An unfinished view is hidden, not represented by an enabled placeholder tab. Missing records within an implemented view are legitimate unavailable/partial states.

Every retained inventory row inherits the profiles below for trigger, enablement, URL effect, pending/success/error feedback, keyboard/touch, focus, history and direct entry. D/M means desktop/mobile. Repeated cards, rows and icons share the same contract.

Profile legend: N = navigation; U = validated URL-backed selection; L = local disclosure; H = context help; S = source reader; Q = search; F = filter draft/apply lifecycle; A = Ask handoff/submission behavior governed by INT-014; SH = Share behavior governed by INT-016. A plus sign combines the applicable profiles.

### INT-002 Navigation and focus profile N

Use real anchors for destinations; click/tap/Enter navigates and modifier-click works normally. Use buttons for actions, activatable by click/tap/Enter/Space. Icon-only controls have names; decorative icons are hidden from assistive technology. No nested interactive elements inside whole-card links; prefer linked headings and distinct actions. Targets generally support 44px touch areas and visible keyboard focus.

Preserve relevant entity/level/horizon, drop unrelated page filters. Navigation has destination loading/error states, not success toasts. New route focus targets the main heading; same-page section navigation targets its heading with sticky clearance. URL selection retains control focus and announces changed content. Keep previous results visibly marked as updating during retrieval; failure must not silently present them as the requested state. Missing optional destinations are not exposed. Transient UI closes on route/history navigation. Direct entry starts with local overlays closed.

### INT-003 History policy

| Ownership | Actions |
| --- | --- |
| PUSH | Page navigation, Stock view navigation, Decision step navigation, research-horizon changes, committed Explore category/scope/filter changes that materially change results. Submitted directory search/filter changes and supported Stock period/range/filter changes that materially change the viewed data also push. |
| REPLACE | Explanation-level changes, invalid/default URL normalization, canonical parameter cleanup, equivalent-state normalization. Equivalent state does not create redundant entries. |
| LOCAL / no history | Filter drafts, popovers, sheets, source readers unless a future dedicated source route is defined, selected chart point, disclosure expansion, Ask composer draft and active session conversation. |

Back/Forward reconstruct addressable state without presentation-preference history pollution. Restore directory/discovery scroll where possible. The browser's own Back/Forward remains normal history and may return to Explore, Home or search results. Stock and IPO detail app Back controls instead navigate to their canonical directories; they do not wrap browser history or require returnTo parameters, navigation-session stores, cookies or localStorage. Decision Back behavior is unchanged. Ordinary desktop Decision scrolling does not create step history. Refresh reconstructs URL-owned state, not lost transient UI or fabricated conversation history.

### INT-004 Route validation and profile U

Validate state at the page boundary. Canonical Stock paths use lowercase symbols mapped to explicit listing/entity records. Unknown entities produce proper not-found results, never another entity's page. Level defaults to Simple, horizon to Long, implemented Stock view to Overview, Decision step to 1. Unsupported/ambiguous repeated scalar values resolve to documented defaults; remove invalid filters and explain when results change. Normalize equivalent/default parameters consistently through replacement.

| Route | Addressable state |
| --- | --- |
| `/` | Level; market context resolves canonical simulated records. |
| `/explore` | Level, horizon, submitted q, type, compatible categorical filters, sector/theme/collection scope and relevant section. |
| `/stocks` | Level, horizon, submitted q and sector. |
| `/stocks/[symbol]` | Level, horizon, view; supported Financials period, Chart range, Filings type/period. |
| `/stocks/[symbol]/decision` | Level, horizon, step 1–6 or summary. |
| `/ipos` | Level, submitted q and status. |
| `/ipos/[slug]` | Level; no invented Stock horizon semantics. |
| `/ask` | Safe validated intent, prompt/concept/entity/comparison identifiers and applicable level/horizon. |

Never put quotes, scores, counts, financial values or arbitrary Ask text in URLs. Research Horizon is short/medium/long with the meanings in [terminology](TERMINOLOGY.md#research-horizons); it does not stretch scenario or comparison windows. Selectors are labeled; only approved options appear. Unavailable horizon research is explicit, not relabeled output.

### INT-005 Local disclosure profile L

Use a button with expanded/controlled-content semantics or native disclosure. Toggle retains trigger focus. No history mutation, success toast or loading for already available content. Lazy content, when justified, has local pending/error feedback. Close/reset local state on route navigation; direct entry uses documented collapsed defaults. Do not make an entire financial card clickable to conceal a small disclosure.

### INT-006 Context Help profile H

Desktop ordinary informational help is **nonmodal**. Activating a named trigger opens its popover; focus normally remains on the trigger. Expose expanded/relationship semantics. Interactive content is reachable by normal keyboard navigation; no focus trap. Escape closes and retains/restores trigger focus. Outside click closes without unexpectedly forcing focus. A visible close action is available. Hover may supplement, never gate access.

Mobile uses a modal bottom sheet: accessible title, initial focus inside, trapped focus, visible close, Escape/backdrop dismissal, focus return and background scroll lock. Respect keyboard, safe areas and viewport; long content scrolls within the sheet. No release-1 drag-to-dismiss behavior or misleading drag handle.

One help item is open at a time. Replacing an item or resizing must not strand focus. Close help before opening a modal source reader through a nested link. Content meaning is shared across presentations; exact visual composition awaits the required reference boards.

### INT-007 Source reader profile S

Citations open their actual supporting canonical record; counts open the deduplicated supporting-source list in the stated scope. Reader/list controls are buttons when opening local UI. Desktop may use a modal reader panel; mobile uses a full-height modal sheet/dialog. Each has title, close/Escape, initial focus, contained focus when modal, scrollable content and return to the invoking control. If that control is gone, return to the relevant section heading. Readers are local, not new routes or URL parameters; browser navigation dismisses them. Direct entry starts closed.

Loading/failure remains local with retry; absent evidence shows unavailable instead of a fake link. Show simulated provenance, fictional publisher, reporting/publication dates and availability. Counts derive from distinct records, not screenshot text. Open article content through the same reader pattern. Downloads appear only if an actual downloadable artifact exists; they are otherwise deferred. Reader content is not rewritten by explanation level.

### INT-008 Search profile Q

Each input has a persistent accessible label, clear action and explicit submission. Preserve Unicode and ordinary financial punctuation. Match canonical names/symbols/approved aliases case-insensitively after trimming; exact matches rank before prefix/partial matches. Do not guess a different entity. Suggestion lists support Arrow keys, Enter, Escape and normal Tab exit; mobile results have full-width touch targets. Loading/results are announced without stealing typing focus. Discard stale lookup responses. Network failure is distinct from no match. Empty submitted directory query clears q; Home empty input offers neutral entry guidance.

| Search | Input and suggestions | Submit / free-language handling | State and recovery |
| --- | --- | --- | --- |
| Home | Grouped Stock/IPO entity suggestions plus explicit Ask option. | Selected entity opens detail. Enter without a selection retains/shows matches, not a guessed entity. Explicit Ask hands a question to Ask without auto-generation. | Draft local; destination addressable. Unknown entity shows no match with Explore/Ask recovery. |
| Explore | Company, sector, theme, IPO within selected category; All groups kinds. | Submit filters discovery; questions do not auto-generate. Offer explicit Ask handoff. | q/type/compatible applied filters in URL. Preserve query on zero results. |
| Stocks | Fictional company name, symbol and aliases. | Selected match opens Stock; otherwise submit matching directory. Question-like input can offer Ask. | q/sector in URL; never substitute an unknown company. |
| IPOs | Canonical issuer/offer name and aliases. | Selected offer opens IPO; otherwise submit matching directory. No ticker assumption. | q/status in URL; no-match recovery preserves query. |
| Ask | Question, selected canonical context, concept or comparison intent. | Submit answer workflow. Entity-only input requests clarification or offers Understand this company. | Safe identifiers only in URL; draft local; ambiguous/unsupported states below. |

Free-text handoff from Home/Explore uses local transient state, never raw question URL text. If unavailable after refresh/direct entry, show an empty composer and explanation rather than silently losing a claimed submitted answer. This specifies observable behavior without mandating a browser-storage implementation.

### INT-009 Filter profile F and bounded lists

Draft choices are local until Apply. Use one option per group, Any as default and AND between groups. Apply commits state under the history policy, closes a mobile sheet, restores filter-trigger focus and announces result count. Cancel/close/Escape discards draft. Reset restores draft defaults, requiring Apply; Clear all outside the sheet immediately commits defaults while preserving unrelated context. Removing an applied chip commits that one change. Applied zero results are valid, not validation failure. Pending/error uses the result region and retains requested choices for retry.

Explore's Research Picture, Price vs Value, Risk and Recent Change use approved categorical values, not historical numeric score thresholds. Research Horizon is independent. Company research filters apply to Stocks only. Other category selections clear incompatible filters with an announcement; a labeled Filter stocks action can switch category first. Mobile Filters stays outside the scrolling category rail; show applied nondefault filter count. Desktop also distinguishes drafts from applied results. Do not add raw-ratio filters merely for Pro.

The bounded synthetic universe may render all supported Stocks/IPOs records in Release 1. Do not expose pagination/Load More or mandate URL page count before dataset size justifies it. Explore more research navigates to or reveals a fuller relevant section/directory. Limited historical card counts do not justify pagination. Reconsider ordering, paging and restoration only if final dataset size requires them.

## Experience inventories

### INT-010 Shared shell and Home

| Control / surface | D/M | Class / profile | Destination or behavior |
| --- | --- | --- | --- |
| Brand and five primary destinations | Both | KEEP N | Home, Explore, Stocks, IPOs, Ask AI; current-section semantics. Focused Decision excludes ordinary navigation. |
| Level selector | Both | KEEP U | Exactly Simple/Normal/Pro; replace history; mobile consistent dropdown. |
| Home search / clear / submit / options | Both | DEFINE Q | Home search contract. |
| Header search icon | Mobile | DEFINE L + Q | Reveal/focus the same search, not a second search system; close restores trigger. |
| Question chips / Explain today's market | Both | DEFINE N + A | Ask with approved prompt and simulated market context; prefill without automatic generation. |
| Market drivers / What Matters | Both | DEFINE static + N + S | Static meaning with explicit supported entity/source actions; remove blanket hover/pointer behavior. |
| Sector names | Both | DEFINE N | Explore scoped to canonical sector, retaining explanation/concern. |
| Sector View All / Explore More | Both | DEFINE N | Explore sectors section, heading focus. |
| Worth Researching cards | Both | KEEP N | Corresponding fictional Stock; same reason and caution across widths. |
| Screen More / research Explore More | Both | DEFINE N | Label Explore more research; fuller Explore research section. |
| Research-change rows | Both | DEFINE N | Stock Overview, What Changed section; actual snapshot context. |
| See all changes | Both | DEFINE N | Fuller Explore Changes section. |
| IPO cards / View all | Both | KEEP N | IPO detail / IPO directory respectively. |
| Bottom Ask composer / send / chips | Both | DEFINE A | Explicit Ask handoff; chips prefill draft/context. |
| Chips and compact research rails | Primarily mobile | DEFINE L | Bounded discoverable scroll; keyboard/touch access, no drag-only action. |

Statuses, decorative icons and separators remain static. Chevron/pointer styling requires a real action. Removed shared controls are listed in INT-018.

### INT-011 Explore

| Control / surface | D/M | Class / profile | Destination or behavior |
| --- | --- | --- | --- |
| Search / clear / submit | Both | DEFINE Q | Explore search contract. |
| All / Stocks / Sectors / Themes / IPOs | Both | DEFINE U | Validated type; All groups results; incompatible filters cleared visibly. |
| Discovery groups / Horizon | Both | DEFINE F + U | Filter contract; horizon independently changes research context. |
| Filters / Apply / Cancel / Reset / Clear all / chips | Both, sheet on mobile | DEFINE F | Draft/applied distinction and zero-result recovery. |
| Worth Researching / Open Research | Both | KEEP N | Stock detail from canonical record. |
| View more research | Both where preview limited | DEFINE N + L | Reveal fuller research section or navigate to Stocks; no invented pagination. |
| Changes rows / See all | Both | DEFINE N + L | Row opens Stock What Changed; See all reveals full Changes section. |
| Sector / Explore sector | Both | DEFINE U | Scope research to canonical sector; mobile retains reason/concern in text/disclosure. |
| Theme / Explore Theme / All Themes | Both | DEFINE U + L | Canonical theme scope / full theme section; count from records. |
| Constituent labels | Both | KEEP static | Only explicit company links navigate; avoid ambiguous chip styling. |
| Curated collections | Both | DEFINE U | Canonical collection ID and inclusion rationale; membership not invented from title. |
| IPO cards / View All Upcoming | Both | DEFINE N | IPO detail / IPO directory with upcoming status. |
| Ask composer / chips | Both | DEFINE A | Visible relevant canonical context. |

### INT-012 Stock and six view contracts

| Control / surface | D/M | Class / profile | Destination or behavior |
| --- | --- | --- | --- |
| Mobile Back | Mobile | DEFINE N | Navigate to `/stocks`, preserving applicable explanation level and research horizon; discard unrelated Explore filters. This app control always returns to the canonical directory, including on direct entry. |
| Level / Horizon | Both | KEEP U | Preserve entity and view; history differs by selector. |
| Share | Both | KEEP SH | Safe Stock state; INT-016. |
| Ask about company | Both | DEFINE N + A | Safe company context, editable draft in Ask. |
| Six view links | Both | DEFINE N + U | view selects implemented Overview/Financials/Chart/News/Peers/Filings; bounded mobile rail. |
| Help / info / highlighted terms | Both | DEFINE H | Specific named concept, not unexplained decorative chevron. |
| Pillars | Both | KEEP static + H + S | Meaning and evidence; no blanket card click. |
| Chart interpretation / earnings disclosure | Both | DEFINE L | Supported content only; no placeholder future-content prose. |
| View Full Chart | Both | DEFINE N | Stock Chart with context. |
| What Changed details | Both | DEFINE H + S | Compatible previous/current snapshots, dates and missing baseline. |
| Scenario explanation | Both | DEFINE H | Defined window, assumptions and modeled status; graphics static, no arbitrary probability widths. |
| Citation / source count / Original Documents | Both | DEFINE S + N | Specific source / source list / Filings respectively; clear action labels. |
| Help Me Think It Through | Both | KEEP N | Decision step 1 after research/evidence context; preserve level/horizon. |

Final Release 1 includes all six bounded views. Implementation exposure follows INT-001.

| View | Minimum functioning contract |
| --- | --- |
| Overview | Authoritative hierarchy, coherent snapshot/horizon, good/attention findings, pillars, supported deeper disclosures, What Changed, scenarios, sources and Decision entry. |
| Financials | Annual/quarterly selection, income/balance-sheet/cash-flow groups, available periods, currency/units/reporting scope; explained major changes and source/calculation references. Missing cells unavailable, not zero. No export/edit/forecast builder required. |
| Chart | Stored synthetic closing-price history; supported ranges, selected date/value; pointer/touch/keyboard point inspection and accessible table alternative. Range addressable, point local. Quote and chart share timeline. No candlesticks without OHLC or indicators/support/resistance without approved methods. |
| News | Newest-first canonical simulated articles: title, date, fictional publisher, relevance and source identity; full local reader. No fake external feed or undisclosed current-market data. |
| Peers | Canonical peer set; a small relevant comparable metric set with consistent units, periods and reporting bases. Explicit incomparable/missing values, company links and trade-offs; select one peer for contextual Ask comparison. No overall winner or arbitrary peer discovery. |
| Filings | Canonical simulated statements/reports/presentations/announcements; available type/period filters, newest-first ordering, provenance/dates, source reader. Download only for actual artifact. |

### INT-013 Decision flow

Dedicated route on all widths; desktop focused page panel may show all six sections, mobile shows one question. No fake background Stock page, intercepted modal or page-level focus trap. Exactly the six questions in [experience hierarchy](EXPERIENCE_CONTRACTS.md#help-me-think-it-through); no personal-finance questionnaire or transaction instruction.

| Control | D/M | Class / profile | Behavior |
| --- | --- | --- | --- |
| Exit / Back to company / close-shaped action | Both | DEFINE N | Return to Stock Overview with level/horizon; accessible name Return to company research, not Close modal. |
| Question index | Both | DEFINE N | step 1–6; desktop targets section, mobile changes question. Mobile index is a local disclosure of navigable labels. |
| Back / Next | Both | KEEP N | Prior/next step; question 1 Back returns to research; question 6 Next is View research summary. |
| Question help | Both | KEEP H | Same research and explanation context. |
| View all six questions | Mobile | DEFINE L | Compact index, not six squeezed answers. |
| Summary link / View Full company Research | Both | KEEP N | step=summary / Stock Overview respectively. |

Explicit step changes push history; refresh/direct entry restores step, invalid step becomes 1. Browser Back/Forward traverses prior addressable steps. Resizing preserves step. No completion gate: any question or summary can be entered directly. Missing question evidence is explicit; Next stays enabled. Summary combines the same findings, risks, scenarios and watchpoints without a new score; it is not question 7. No ordinary mobile bottom nav. Extra summary actions (watchlist, compare, financials shortcuts) are deferred, leaving the primary return to full research.

### INT-014 Ask lifecycle

Exactly four capability entries are exposed on desktop and mobile: Understand a Stock, Compare, Explain Something, Understand the Market. No response-type tabs or generic chatbot substitution.

| Control | D/M | Class / profile | Behavior |
| --- | --- | --- | --- |
| Primary composer / Ask | Both | DEFINE A | Validate and submit a question. |
| Capability cards | Both | DEFINE L + A | Set intent, reveal/focus relevant input; never auto-generate. Stock uses company picker; Compare two distinct comparable-kind canonical entities; Concept concept/question; Market current simulated market/sector or labeled historical example. |
| Suggestion chips | Both | DEFINE A | Prefill draft and safe context; user submits. |
| Context label / change / clear | Both | DEFINE N + L | Linked entity opens research; explicit change/clear changes visible context. |
| View Sources / counts / source chips | Both | DEFINE S | Actual answer-supporting records, not fake badges. |
| Open Full Research / View Chart | Both | KEEP N | Relevant Stock / implemented Chart when data exists. Label chart type honestly. |
| Compare with peer | Both | DEFINE N + A | Two safe IDs and editable comparison intent. |
| Follow-up chips / composer / send | Both | DEFINE A | Retain visible context and snapshot unless explicitly changed. |
| Load Comparison / Explore Concepts / Market Pulse | Both | DEFINE N + A | Approved pair / concept ID / current market prompt within Ask; no dead new destination. |
| Driver/change/market graphics | Both | KEEP static + H + S | Explicit evidence/help actions only; no unsupported price-impact ranking. |

Whitespace-only input cannot submit. Validate input, preserve Unicode/ordinary financial punctuation, and never silently truncate. A hard maximum will be selected later from the actual AI/API/security contract; no exact input limit is established here. Output length guidance is editorial only under EXP-006.

Ambiguous entity requires choosing a canonical match. Entity-only questions can offer an Understand action. Unknown real-world entities/live requests receive a specific simulated-universe limitation and supported alternatives. Partial evidence permits only supported answers, with gaps and actual citations visible.

Submission runs once; pending prevents duplicates and announces Preparing answer from simulated research without invented percentages. Success announces answer availability, not each streamed fragment. Preserve draft/context on failure with Retry and Edit question. Retry reuses submitted context without duplicate exchanges. Desktop textarea Enter submits, Shift+Enter inserts a line; IME composition never accidentally submits. Mobile has visible reachable Send.

Current conversation is local/session memory, with no persistent Recent Questions panel or account history. Refresh/direct entry restores safe URL context, not an invented prior answer; explain when a session answer is no longer available. Follow-ups retain context visibly. Real retrieval-grounded AI is intended but separately authorized. Until integrated, render approved content as Example answer, with no fabricated generation delay or claim an AI call occurred; unsupported examples get an honest limitation state.

### INT-015 IPO and directory contracts

| Control | D/M | Class / profile | Behavior |
| --- | --- | --- | --- |
| IPO mobile Back | Mobile | DEFINE N | Navigate to `/ipos`, preserving applicable explanation level; do not introduce Stock horizon behavior. This app control always returns to the canonical directory, including on direct entry. |
| IPO level / Share | Both | KEEP U + SH | Depth only / safe IPO URL. |
| Offer dates, band, minimum application | Both | KEEP static | Simulated year/date/currency/lot basis; no purchase/application control. |
| Source count / assessment help | Both | DEFINE S + H | Actual evidence list / methodology-qualified explanation. |
| Fresh Issue/OFS, proceeds, ownership, investor categories, valuation, scenario help | Both | DEFINE H + S | Meaning, units, timestamp, method and supporting record. Bars static, values explicit; no undefined probabilities. |
| IPO source list/reader | Both | KEEP S | Actual simulated documents, even if historical screenshot showed only text. |
| Stocks directory search / sector / clear | Both | DEFINE Q + U | Bounded fictional-company directory, sector Any/default, query recovery. |
| Stock directory cards / Ask about company | Both | KEEP N + A | Company research / explicit contextual Ask; show meaning, reason, caution and date. Stable name order, not a score leaderboard. |
| IPO directory search / status / clear | Both | DEFINE Q + U | All, Upcoming, Open, Closed, Listed only as defined by timeline; grouped All default and deterministic date ordering. |
| IPO directory cards | Both | KEEP N | Detail; dates, status, summary and available terms. |

Directory results may show the complete bounded dataset; no mandatory Load More. Empty/no-result recovery preserves context. IPO minimum application uses approved lot/price basis; issue/fresh/OFS reconcile; proceeds distinguish company from selling holders; ownership uses defined before/after bases; subscription has category/time/quantity basis. These are data prerequisites, not approved amounts. Listing-day and long-term lenses stay distinct. The release excludes the IPO Decision CTA/framework; never reuse the Stock framework.

### INT-016 Share profile SH

Expose on functional Stock and IPO detail only. Build safe route state: Stock entity/view/level/horizon/supported chart range, IPO entity/level. Exclude readers, help, drafts, financial values and conversation text. Native Web Share where supported; clipboard fallback otherwise; labeled selectable manual URL if copying fails. Native cancellation is neutral, not an error. Copy success announces Link copied without moving focus; genuine failure offers actionable recovery. Pending prevents duplicate action and remains local. No history mutation. Decision and Ask answer sharing are not release-1 controls.

### INT-017 Reusable states

Use shared inline, section or route patterns, not a separate document/page for each state.

| State | Observable behavior |
| --- | --- |
| Populated | Coherent content, context, date and evidence status. |
| Loading | Affected-region skeleton/progress with busy announcement and stable layout. |
| Empty dataset | Explain absent canonical records; distinct from search failure. |
| No results | Keep query/applied filters and zero count; clear query/filters or return to full directory. Includes Explore and filter zero results. |
| Unavailable | Missing metric/section identified with reason when known; em dash with accessible Unavailable, never zero. |
| Partial data | Supported content remains; missing portions local, confidence not inflated. |
| Validation error | Associated input message, retained value, actionable correction. |
| Action error | Local error, state preserved, retry when meaningful. |
| Success confirmation | Concise announced copy/result/completion feedback where needed; no ordinary navigation toast. |
| Entity not found | Proper unknown Stock/IPO outcome with directory/search recovery, never entity substitution. |
| Global 404 | Clear missing-page message, brand and Home/navigation recovery. |
| Unsupported Ask question | Supported simulated-scope explanation and alternatives. |
| Ask generating | Visible progress, duplicate submission disabled; never fake progress for static examples. |
| Ask failure / retry | Retained submitted context and draft; Retry/Edit; same context without duplicate exchange. |
| Offline/network error | Preserve available content/drafts; explain inability to load/submit, avoid false freshness. |
| Share success/failure | Announced copy success, neutral cancellation, clipboard/manual URL recovery. |

### INT-018 Release exclusions and trust

DEFER AND DO NOT EXPOSE: profile/account, watchlist/star, Watch IPO, persistent Recent Questions, Ask answer sharing, IPO Decision framework, downloads without actual artifacts, notifications and extra Decision summary actions. The current session conversation does not justify a Recent Questions panel.

REMOVE: Customize Columns, mobile hamburger, fake verification badges, fake live-market labels, placeholder href controls, unsupported candlestick wording, authoritative investment-action language and unsupported draggable affordances. KEEP WHEN FUNCTIONAL: Stock/IPO Share, source access, six Stock views, contextual Ask, Simple/Normal/Pro and meaningful Research Horizon.

Display **College Project · Simulated financial data** perceptibly near the top of standard financial routes and in the focused Decision header; use restrained presentation rather than warnings on every card. Quotes/offers/market summaries expose simulated as-of dates. Sources identify simulated documents and fictional publishers; charts identify simulated history; scenarios identify modeled windows. Real generation time is distinct from financial as-of time. No real publisher/exchange impersonation, invented source URL/count, unexecuted assessment or unsupported causal decomposition.

## Handoff and verification

The [acceptance traceability table](../qa/FRONTEND_ACCEPTANCE.md#gate-25-requirement-traceability) verifies these requirements. Required visual references are tracked in the [design handoff](../design/DESIGN_SYSTEM.md#gate-25-reference-handoff); no boards are created by this contract. The [status handoff](../../README.md#requirements-handoff-before-implementation) records the remaining requirements/data/backend baseline before application implementation. No pagination architecture or backend design is implied here.
