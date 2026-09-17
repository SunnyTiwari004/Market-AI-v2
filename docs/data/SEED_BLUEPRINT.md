# MARKET AI deterministic seed blueprint

Synthetic Universe Design Gate, 2026-09-17. Status: DATA/METHOD SPECIFIED; IMPLEMENTATION NOT STARTED. This specifies later developer-run generation, not a script, database schema or populated dataset. The [universe](SYNTHETIC_UNIVERSE.md) owns names, timeline and content intentions; the [data model](DATA_MODEL.md), [data invariants](SYNTHETIC_DATA_CONTRACT.md) and [accepted methodology](../research/RESEARCH_METHODOLOGY.md) own structure, precision and calculations. Do not change research thresholds to obtain a desired badge distribution.

## Fixed generation identity

| Property | Fixed contract |
| --- | --- |
| Dataset | market-ai-synthetic-v1; unpublished until full validation |
| Seed specification | seed-blueprint-v1 |
| Seed token | mai-world-20260930-a; UTF-8 literal, not derived from a machine clock |
| Method | research-method-v1; implementation must match the accepted manifest |
| Identity namespace | market-ai-synthetic; stable across dataset releases |
| Calendar | weekday-calendar-v1 / cal-4e8b; Monday–Friday, no extra holidays, session close 15:30 Asia/Kolkata |
| Financial clock | 2026-09-30T18:00:00+05:30, never Date.now() |
| Stock cutoff set | C1 2026-08-01T18:00:00+05:30; C2 2026-08-31T18:00:00+05:30; C3 2026-09-30T18:00:00+05:30 |
| Content authority | Approved numerical input manifest and original evidence text, still to be authored; this blueprint is not that manifest |

Record generator implementation version/digest, seed token, input manifest digest, calendar/fiscal policies, method digest and output content digest. A Git commit may supplement these identities but cannot replace them. Real generatedAt belongs only to operational metadata and is excluded from canonical content comparisons. Re-running an unchanged version with changed inputs must fail, not overwrite historical snapshots.

## Stable IDs and reproducibility

Resolve each research cutoff T as an **as-of timestamp**, independently of its market session: use the latest scheduled synthetic session with a completed close at or before T. C1 (Saturday 2026-08-01 at 18:00 +05:30) therefore uses the 2026-07-31 close; C2 (2026-08-31) and C3 (2026-09-30), both at 18:00, use their own weekday closes. Before a session's 15:30 close, use the previous completed session. Financial/source eligibility still uses publication timestamps at or before T and the existing observation-time checks. Validate this mapping separately from publication eligibility; never move the cutoff, add a weekend price or admit future evidence to fill a gap.

Registry keys in the universe are permanent identity seeds, independent of display names, symbols and table order. Later stable IDs use the full lowercase SHA-256 digest of UTF-8 namespace, entity-kind and immutable registry key separated by NUL delimiters; retain the kind prefix for readability. No hashing implementation is created now. Physical uniqueness remains dataset-version + stable ID. Validate collisions despite their low likelihood.

Derived child identity keys combine immutable parent keys with semantic roles: financial period start/end/basis, scheduled session date, offer stage, article-A1/A2, case label, or cutoff/horizon/method. These are not array indexes. A1/A2 are reserved editorial roles, not sort positions. Reserve the complete key registry before generating relationships, and freeze identity when a dataset version is published. Reporting revisions need explicit new revision identities; never silently overwrite a source.

Order records by kind, immutable key and date for canonical serialization; normalize content to UTF-8/LF, use ISO dates/offset-qualified timestamps and decimal strings. Object-property insertion order, local timezone and locale-sensitive sorting must not determine content hashes. Two independent clean runs must reproduce the same canonical records/relationships/digests while allowing different operational generatedAt metadata.

For any stochastic-looking price variation, use deterministic named streams derived from SHA-256(seed token, immutable listing key, purpose, scheduled date, counter), with the same NUL-separated UTF-8 framing. Map a fixed-width unsigned digest prefix to a documented exact rational before decimal calculations; freeze that mapping and the curve algorithm with the generator implementation version. Do not use unseeded Math.random, runtime LLM values, fetched prices or a mutable global PRNG whose output depends on row iteration order. Date-keyed streams ensure adding unrelated content cannot change another issuer's price path.

The numerical authoring milestone must approve actual base prices, bounded path parameters, input amounts and scenario factors before generating the full universe. The stream specification alone does not supply those values. Record all parameter choices for replay; do not search thousands of seeds for a preferred Strong/Weak distribution.

## Generation dependency order

1. Load the approved identity registry, version/method manifests and fixed calendars; validate catalog counts, known keys and timeline first.
2. Establish sectors, issuers and listing identities. Reserve offer and evidence identities, including typed source children, before resolving their relationships. Reservations are not published partial records.
3. Establish immutable offer terms, holder groups/reservations/proceeds-use proportions, dated observations and publication metadata. MERUVAN's fresh-share effective date must precede calculation of its June weighted shares; do not first seed shares and later patch them from offer totals.
4. Author the approved typed financial inputs and report content together: three annual and eight quarterly groups per issuer, reconciled overlaps and publication times. Generate exact ordinary share history from the permitted capital events, then derive weighted-average reporting inputs under the model's six-decimal convention. No emitted EPS/ratio input competes with calculated EPS.
5. Generate complete positive price observations only on eligible scheduled sessions from approved path parameters and named streams. Validate chronology and absence of pre-listing prices immediately.
6. Materialize the remaining original announcements, offer/lifecycle bodies, 32 articles, six concepts and event relationships. Resolve the reserved evidence IDs and complete all required typed parents/children and relevance joins. Reports use canonical statement values; articles cite them rather than separately inventing numbers.
7. Materialize the explicit two-theme/two-collection memberships and per-member rationale from the universe. Do not derive financial rankings from their titles.
8. Resolve each cutoff's eligible annual/quarterly inputs, TTM windows, price histories, peer candidates and reasons for exclusions. Eligibility depends on both publication and observation time.
9. Create the separately owned, reviewed Stock/IPO scenario assumption records against those contexts, including case rationale and applicable evidence. Inapplicable valuation can still have an explicit scenario-set unavailability result; do not invent a valid denominator.
10. Execute pure methodology functions, producing deterministic metrics, pillars, Risk, valuation, Direction, Research Picture, confidence, scenario outputs and grounded finding references. Financial truth is never written by an LLM.
11. Assemble all 108 Stock snapshots, four separate IPO evaluations, and shared scenario output sets with immutable input/method/assumption digests. Render no independent financial prose numbers into a second authoritative store.
12. Derive broad/sector index history and three market contexts, then bind supported briefing/watchpoint meaning to eligible events and calculated movement. Preserve request-time ownership: any generation-time calculations are validation artifacts, not new editable index records.
13. Exercise the 72 adjacent same-horizon What Changed pairs using the query-time comparison function; preserve missing-first-baseline behavior. Do not create authored change rows or a new relationship table merely because this checklist names the pairs.
14. Run all integrity and required-coverage checks, independent arithmetic expectations and content review. Produce the separate nonblocking research-state coverage report.
15. Publish only a fully validated immutable version/manifest through the existing transaction policy. A failed draft cannot become active. No frontend request seeds missing records or recalculates the past with future evidence.

This order breaks evidence-reference cycles through key reservation and coordinated validation, not weak generic subject-type/subject-ID references. Physical transaction batching is an implementation detail; activation occurs only after every required relation and check passes. No AI/network request belongs inside the generation transaction.

## Financial and price authoring policy

Author business inputs before derived assessments. Select plausible absolute scales later from the relative size/operating stories; do not label them real-company market-cap equivalents. Quarterly statements are discrete; annual overlapping flow totals equal their four quarters, balance sheets equal the ending quarter, and weighted shares use day weighting. Where early quarters are outside the eight-quarter window, annual inputs stand on their own report and opening balances have explicit provenance; do not silently fabricate additional emitted quarter records.

All issuer annual periods and all eight quarters must exist with complete readable source content at C3. Historical snapshots select only published content. AVENQOR/TALVESSA March quarters publish with June annual reports; MERUVAN has the explicitly delayed 2026 March/June publication sequence. Preserve these exceptions as source metadata, not method changes. No hypothetical subsequent September-quarter inputs are present at the current cutoff.

For the 11 established issuers, ordinary shares remain stable throughout modeled periods. MERUVAN's historical pre-offer shares remain unchanged until the fresh issue on 2026-05-29; fresh cash/equity, issue expenses and holder movements must reconcile with its quarter's financing/cash statements. OFS cash goes to sellers and never appears as operating or company financing receipts. Other IPOs' fresh shares remain pro-forma at C3. No unmodeled dilution, dividend, split or FX effect repairs an accounting imbalance.

Price generation must be separate from ratio calculation: a close is a seeded observation, not recomputed from a desired P/E badge. Use issuer-specific approved piecewise trend/variability parameters with deterministic variation, no real market paths. Numeric ranges, segment anchors and shock amplitudes remain future input-authoring decisions; reject nonpositive/out-of-range generated values instead of clamping silently. Events supply story context but not an asserted causal contribution algorithm. All charts, quote changes and index observations resolve this single history.

Expected full price inventory is **11 × 523 + 89 = 5,842 closing observations** under the locked calendar, not generated in this gate. The broad index has 523 supported base/history dates and 522 intervals; Facility membership changes only after MERUVAN's first close. Market/sector chains are derived, with no secondary source of numerical truth. The corpus remains modest; do not generate extra records for density.

## Scenario assumption blueprint

Developer-authored and reviewed seed inputs own assumptions. There is no runtime assumption generation or LLM authority. Plan **36 Stock assumption sets** (12 listings × three cutoffs), shared across three research horizons, plus **four separate IPO sets**, each with three labeled cases. Preserve a set even when the engine must return unavailable, so absence of a required authored assumption is distinguishable from nonpositive EPS or insufficient peers. No numerical g/m values or output prices are assigned in this milestone.

Each set requires dataset/method version, immutable set key, issuer plus listing or offer identity, research/evaluation cutoff, case labels, explicit window, selected input/provenance context, authored rationale and evidence references for factual premises. Each case records g (earnings-change fraction), m (peer-multiple multiplier) and business-condition explanation. Store assumptions separately from executed outputs and their exact references/digests.

Conceptual envelope: modest contraction/stability/expansion of positive earnings and compression/unchanged/expansion of a positive peer multiple, justified individually by business context. The hard mathematical domains remain **g > -1 and m > 0**; baseline EPS, reference price and compatible peer median must all be positive. No new universal stress bounds or sector thresholds are selected. Extreme factors need explicit review of plausibility before approval; they do not become a way to imply spectacular expected returns. A discretionary educational stress has an authored-assumption label rather than a fabricated supporting source.

Per-case engine output remains EPS × (1+g) × median peer P/E × m, and percentage change uses the stated reference price. Do not reuse display-rounded intermediates. Validate dataset/method/entity/cutoff/window identity and at least two eligible peers before computing. Missing/invalid prerequisites give unavailable; invalid seed assumptions or calculated Weak > Base or Base > Strong block publication. Equal values are allowed and disclosed; do not reorder labels or clip results to make them valid.

Stock sets keep the next 30-calendar-day window at all horizons; changing Short/Medium/Long cannot change the same-cutoff values. IPO sets retain the listing-day window, positive pro-forma TTM EPS using post-offer shares, and cutoff-qualified final issue price or upper-band illustration. No proceeds-driven earnings growth is implicit, and MERUVAN's realized listing close is unavailable at its historical scenario cutoff. Outputs may all lie above or below reference; labels are sensitivities, not probabilities or investment instructions.

## Evidence, findings and grounding rules

The complete source plan is [184 non-article records, 32 articles and six concepts](SYNTHETIC_UNIVERSE.md#evidence-corpus-inventory). Each issuer receives exactly 11 period reports; every listed issuer also has its announcement and two distinct articles. Offer ownership, proceeds and reservations are sections of the four offer documents, avoiding unnecessary source proliferation. Three lifecycle documents hold the appropriate demand/final-price evidence; each observation's time stays explicit.

Reserve stable section locators for reports, offer terms and concepts. A source count uses distinct supporting IDs, not repeated citations or document-section count. Article/document subtypes remain separate and validated under the common EvidenceRecord identity; explicit issuer/sector/offer/market relevance joins support retrieval. No model invents a source ID, source URL, company relationship or missing paper.

Findings derive from executed rules and eligible inputs. Event context may explain a relevant factual development, but financial causality needs direct support and cannot be inferred solely from price co-movement. Current Home/Ask share calculated state, never a prewritten assumption that the market fell. Numerical text references canonical fields. Source readers preserve original content across explanation levels.

| Ask capability | Required structured support / later acceptance |
| --- | --- |
| Understand a Stock | Any of 12 listings; selected snapshot, metrics, finding/risk keys, What Changed and exact supporting reports/articles. Check all three depths against identical results. |
| Compare | Two distinct supported listings; shared periods/units and eligible metrics, with TAVREN/NERALITH as an initial comparable pair. Cross-sector interpretation cannot silently use cross-sector P/E reference medians. |
| Explain Something | One of six reviewed concept modules or supported section; examples are separate teaching content, not an issuer quote. Unsupported broader concepts are identified. |
| Understand the Market | One shared current market context, derived index/sector movement/category counts and cutoff-qualified event evidence; no additive causal percentages. |

No prompts, answer bodies, embeddings or provider calls are generated now. Later generation must satisfy the existing constrained claim/reference validation, resource and privacy contracts. IPO-only entities remain outside ordinary Stock context. Missing-data, unsupported live/real-company, ambiguity, injection and provider-failure cases need honest behavior, not fake successful responses.

## Publication-blocking validation contract

These are future checks, not implemented tests. Fail the draft before activation and report exact identity/field/reason. Do not repair a failure by silently dropping an issuer, replacing evidence, changing the calendar or weakening research rules.

| Domain | Blocking requirements |
| --- | --- |
| Version and identity | Expected immutable namespace/keys; no duplicate stable IDs within kind/version; valid full reference graph; unique 15 issuer slugs and 12 uppercase tickers/lowercase route symbols; unique offer slugs; all references stay in the dataset version. |
| Universe | Exactly 15 issuers, 12 listings, four sectors with three listed members each, four offers, exactly one Listed overlap i-f7a1; three IPO-only issuers have no Listing. Exactly two themes/two collections with at least two explicit valid members each and six concept records. |
| Calendar and time | Fixed current timestamp; exactly C1/C2/C3 at -60/-30/0 days; common fiscal period boundaries and INR/standalone basis; publication after period end; no claim or calculation uses an observation/publication after cutoff. Future timetable dates are explicitly planned, never observed future data. |
| Financial records | 45 annual +120 quarterly complete report/statement groups at C3; actual three/eight period sets match the universe. Valid signs/units/precision; assets = liabilities + equity, cash <= assets, debt <= liabilities; opening cash + OCF + investing + financing = closing cash = balance-sheet cash; adjacent quarter cash reconciles; annual/quarter overlaps and ending shares reconcile. |
| Shares and TTM | Positive ordinary/weighted shares; exact permitted issuance history and day weighting; no zero, negative or impossible weighted share count. TTM four consecutive eligible quarters or explicit unavailable reason; correct selected window and 200-day recency, never fabricate a quarter or use annual fallback. Loss EPS is valid data, not a seed-integrity failure. |
| Prices | Exactly 5,842 expected positive closes at approved precision; every supported scheduled session present once; no weekends, gaps, prices before listing or post-reference observations. Eleven two-year series and MERUVAN's full 124-calendar-day span. No unexpected missing eligible close may enter the canonical seed. |
| IPO | Open <= close < actual listing when actual exists; derived statuses at C3 Upcoming/Open/Closed/Listed exactly once. Terms/price/publication gating; no demand before opening; category observations share the stated instant; positive reservations total issue shares. Fresh + OFS = offered shares; post-offer = pre-offer + fresh; expenses <= gross fresh; purpose fractions sum to one for positive net fresh; holder pre/sold/fresh totals and after-ownership reconcile. Current non-Listed ownership remains pro-forma. |
| Sources and events | Exactly 184 required non-article documents and 32 planned articles with readable original content at C3; no missing typed child, dangling finding/source reference, fabricated URL or real publisher/exchange impersonation. Every material fact has eligible actual support; source relevance links are explicit and counts deduplicated. Event occurrence/publication precedes eligible consumption. |
| Research | Exactly 108 Stock snapshots across full listing/cutoff/horizon product, plus four separate IPO evaluations; fixed method/dataset identity; exact inputs/results match approved formulas and reasons. No manually supplied overall badge, numerical Research Picture, LLM override or confidence-as-attractiveness. Critical reconciliation/provenance inconsistency blocks publication. |
| Scenarios | All 36 Stock/four IPO explicit assumption sets present; each has three valid documented cases and correct window/version/context. Where prerequisites permit, exact outputs and ordering validate. Inapplicable baseline/peers produces an honest unavailable set, not invented values; malformed assumptions or ordering failure is blocking. No duplicate scenario output owner per horizon. |
| Index | Base 100, exact eligible membership at interval start, both endpoints per member, arithmetic-mean daily return and correct chain; 523 supported broad dates/522 intervals, no missing canonical interval. New listing contributes only after first close. Sector chains obey identical rules; no hidden reweighting or additional editable index rows. |
| Historical comparisons | C1→C2/C2→C3 same listing/horizon/version; definitions/bases compatible; C1 prior comparison unavailable. Added evidence is not backdated. Newly available is distinct from improvement; all comparison values derive, never authored. |
| Reproducibility and publication | Two clean runs match canonical digests; unchanged replay is idempotent, conflicting content under same published version fails. Transaction failure leaves prior published version active. No runtime seed/write endpoint or migration credential reaches a public request. |

Not all unavailability is corruption: stale unpublished MERUVAN quarters at C1, nonpositive EPS, too few peers and insufficient 252-session history are valid typed outcomes. Missing a required current source body or a scheduled price is not. Every such distinction must appear in validation reasons rather than a generic success/failure badge.

## Coverage report without category quotas

After integrity passes, emit a developer review report grouped by cutoff/horizon, with category counts, representative IDs, input reasons and unsupported targets. This report is **non-publication-blocking for preferred research-state diversity**. It cannot override the blocking universe counts, IPO lifecycle completeness or full-release feature requirements. A defect preventing a promised capability is still a release issue even when badge diversity itself is optional.

Report all pillar categories; Risk Low/Medium/High/partial/unavailable; valuation Attractive/In line/Expensive/unavailable; Direction Up/Flat/Down by window; Research Picture outcomes; confidence High/Medium/Low/unavailable; four Ask archetypes and their evidence routes; all four IPO statuses; and changed/unchanged/newly available/incompatible comparison examples. Record sector peer viability at each cutoff, including temporary Household/Facility constraints. Do not reroll numerical inputs merely to balance counts.

Confidence diversity uses the actual five-check method. Standard C1 seven-quarter coverage can produce Medium; MERUVAN's stale discrete quarter can produce Low; complete current coverage can produce High independent of financial health. Current all-High is acceptable. Optional partial High requires a genuine supported High trigger; do not add debt or erase prices just to exhibit it.

Negative test variants are isolated from the published seed: missing scheduled close, broken accounting, invalid scenario factor/order, future citation, method mismatch, unknown ID, absent baseline or unreadable body. These deliberately invalid inputs verify rejection/unavailable behavior and never count toward the 15-issuer canonical world.

## Future verification handoff

Implement the accepted methodology's pure exact-value/boundary tests, then integration checks for selection, provenance and transactions. Required cases include positive/zero/loss cash conversion and EPS; compatible/incomplete CAGR; P/E at 0.85/1.15, zero/loss EPS, only one eligible peer and stale TTM; Direction exactly ±5 and short/gapped windows; Risk sample divisor 59, both thresholds and partial High; ordered/invalid scenarios; new-listing index entry, two-member equal weights and missing-close publication failure; What Changed method mismatch; and Research Picture's completeness-first rules with one versus two Weak pillars.

Independently calculate review expectations using approved decimal arithmetic and reviewed fixtures before full publication; do not use the same engine output as its own oracle or an LLM as a mathematical validator. Snapshot digests and cross-route/depth identity checks supplement arithmetic tests. Test requirements are not claims of passing implementation today.

## Smallest future implementation slice

Select **TAVREN as the primary issuer**, with **NERALITH and ORYNTEL** as the minimum peer set in Digital Operations Services. A one-company slice is smaller but necessarily leaves P/E and scenarios unavailable; this three-company set exercises the accepted two-peer rule without involving IPO share changes or delayed quarter publication.

After separate authorization: real PostgreSQL schema/migration and small Drizzle query modules for the required subset; three issuers/listings in one sector, their three annual/eight quarterly inputs, complete bounded price histories and evidence; three C3 Long snapshots and three shared scenario sets; deterministic ratios/pillars/Risk/valuation/scenarios; TAVREN Stock Overview through direct server retrieval with actual source reading; unit/integration checks, loading/error/not-found/unavailable behavior. Peer evidence is real subset data, not hardcoded P/E constants. Do not expose unfinished Stock tabs or fake Ask generation. The other horizons, historical snapshots and What Changed prior baseline remain absent in this slice and must say so.

This deliberately partial development profile is explicitly not market-ai-synthetic-v1 published Release 1. It may use a developer-only subset manifest with stable eventual issuer identities; full-count validation remains mandatory for final publication. No full-market index claim follows from one sector. Expand later to all 108 snapshots, full corpus and required journeys without redefining the release.

The five [visual dependencies](../product/PRD.md#prd-011-visual-and-architecture-prerequisites) remain required before their relevant frontend presentation work; storage/method/query tests can proceed independently when authorized. Actual numerical authoring and evidence bodies, reviewed parameter/algorithm choices, compatible PostgreSQL/Drizzle/decimal packages, physical schema and hosting/provider decisions remain outstanding. This document creates no implementation, dependency, database, migration, seed file, prompts or UI.
