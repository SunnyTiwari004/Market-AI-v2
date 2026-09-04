# MARKET AI mock data contract

Approved baseline: 2026-09-04. This is the authoritative specification for later centralized typed fixtures. It creates no TypeScript fixtures and makes no statement about current real market conditions.

## Demo provenance and visible scope

Every financial record must carry, or resolve through an explicit reference to, mock provenance. A small dataset envelope identifies the approved demo dataset and whether content represents the current demo state or a separate example scenario. Referencing an envelope is acceptable; relying on a UI badge without modeled provenance is not.

Display one restrained, persistent application-level indication: **Prototype · Demo research data**. It covers all financial routes, including the focused decision page and Ask AI. Do not repeat loud demo badges on every component. Source/detail views still expose actual provenance and availability as part of their content.

Mock content must never claim to be live, verified, real-time, or exchange verified. The actual documentation date is not a market observation timestamp. Do not refresh demo timestamps from the real clock, attach a fabricated as-of date, or show relative freshness without an approved timeline. Future real data will replace the prototype indication with appropriate provenance/freshness metadata.

## Canonical Tata Motors current demo fixture

| Field | Approved value |
| --- | --- |
| Company | Tata Motors |
| Ticker | TATAMOTORS |
| Exchange | NSE |
| Current price | ₹942.50 |
| Daily percentage change | -3.2% |
| Daily interpretation | Weaker today / Mixed short-term picture |
| Research Picture | 81/100 |
| Evidence Confidence | High |
| Risk | Medium |
| Longer-term business picture | Healthy / Mostly unchanged |
| Absolute Price vs Value | Fairly Valued |
| Relative valuation interpretation, with comparison context | More Attractive after decline |
| Default research horizon | Long term · 3–5 years |

Do **not** include an absolute ₹ daily change, infer a previous close, or calculate an exact rupee decline from the rounded percentage. No additional exact quote history is approved here.

One current quote reference and one current research snapshot reference supply Home, Explore, Stock, Decision, Ask AI, and any other current-state Tata Motors display. The longer-term business interpretation and weaker daily movement are compatible because their concepts and periods differ. The absolute valuation assessment remains distinct from relative attractiveness after the decline.

The score is an **approved demo assessment fixture**. It is not a calculated result, a real verified assessment, an AI-generated score, or an 81% likelihood of gain. Do not derive pillar scores from it.

**Evidence Confidence: High** is an explicitly approved qualitative **DEMO ASSESSMENT FIXTURE**. It is not currently derived from an implemented evidence-confidence methodology or an approved real source catalog. No source count or confidence percentage may be inferred from High. This assessment remains covered by the application-level **Prototype · Demo research data** indication until a real evidence system exists. Detailed evidence must follow the [source contract](#source-count-integrity-and-missing-information).

## What Changed: approved 30-day comparison

| Field | Approved value |
| --- | --- |
| Entity | Tata Motors |
| Comparison period | 30 days |
| Previous Research Picture | 76/100 |
| Current Research Picture | 81/100 |

Represent this as references to the previous and current research snapshots for the same entity and compatible research context. The current reference must be the same current snapshot used above. Every current-state What Changed display resolves these references, rather than copying numbers into its own card or answer.

Competing **68** or **75** research-score baselines are not allowed for this current Tata Motors state. Do not reconcile conflicting reference screenshots by manufacturing a third period or snapshot. The approved previous snapshot contains only the known previous score and comparison context; previous quotes, confidence, valuation, risk, or pillar metrics remain unspecified.

The 30-day comparison period is independent of the research horizon and any scenario horizon. Do not invent exact calendar dates, additional exact historical metrics, guidance changes, or causal explanations for the improvement. If a numerical difference is later displayed, it must be a deterministic difference of these approved endpoints with the correct score-point unit, not another stored historical fixture.

## Research and scenario horizons

| Research key | Label | Meaning |
| --- | --- | --- |
| SHORT | Short term | Next 30 days |
| MEDIUM | Medium term | Next 12 months |
| LONG | Long term | 3–5 years |

Default: **LONG**. These are exactly the three research choices.

Research Horizon describes the selected research context. Scenario Horizon belongs to a particular modeled scenario set. A Long-term 3–5 year research context may contain a specific **30-day** modeled scenario section. Its own time window, baseline, assumptions, and outcome measure must remain visible and stable.

The approved current research fixture provides the long-term demo context; it does not supply separate short- or medium-term scores. Selecting another research horizon must not fabricate, rescale, or silently relabel a long-term assessment. Show unavailable horizon-specific research where no approved record exists. The approved daily quote and its stated daily period remain independent.

Explanation level is another independent dimension: exactly Simple, Normal, Pro, default Simple. Different explanation variants resolve the same claims, values, conclusions, and evidence relationships. Missing deeper copy/data is explicit, not generated to fill a screen.

## Shared market-day fixture

The initial current demo market state is **Mixed / mildly weaker**. Home and any Ask AI answer presented as the current demo market state must resolve the same centralized market-day fixture and its claims.

Do not describe that same current day as strongly rising on one page and falling on another. A falling-market Ask AI archetype may be a separate example/demo scenario with a distinct scenario identity and visible example context. It must not be presented as today's shared current state.

No exact index prices, percentage moves, investor flows, sector contributions, timestamps, causal rankings, or source counts are approved by this semantic market state. Missing details stay unavailable. Price movement, sector research condition, and possible explanatory drivers are different concepts; do not imply a measured additive contribution model without one.

## ABC Technologies

ABC Technologies is **fictional demo content**, modeled as an enterprise software / technology company. Make its fictional nature explicit in the entity description in addition to the application-level prototype notice.

Conceptually coherent Fresh Issue proceeds categories are product development, cloud infrastructure, sales expansion, and general corporate purposes. Do not describe the company as funding a factory. These are approved semantic categories, not approval of an exact allocation or definitive offer terms.

No exact IPO values are approved by this task. Amounts, price band, application size, dates/year, offer status, subscription multiples, ownership percentages, valuation metrics, and listing outcomes require separate approval. Do not reuse numerical values from reference screenshots as fixtures.

Separate Fresh Issue proceeds from OFS proceeds to selling owners. Also keep proceeds, subscription demand, ownership changes, and investor reservation distinct; do not combine them into an ambiguous allocation field. The stock six-question decision framework is not an IPO framework.

## Intended typed concepts

These are contract responsibilities, not a mandate to create every type/file immediately.

| Concept | Required distinction |
| --- | --- |
| Dataset/provenance | Explicit mock origin, approved current state versus separate example, supplied snapshot metadata only. |
| Company and Listing | Company identity separate from exchange, ticker, currency, and listing identity. |
| Quote / typed quantity | Value, currency/unit, period, provenance, and availability; no unsupported absolute daily change. |
| ResearchSnapshot | Entity, context/horizon, stable snapshot identity, supplied assessments and claim references. |
| ResearchChange | Compatible previous/current snapshot references, dimension, comparison period, and supported explanation. |
| Claim and SourceReference | Claim identity, input/source relationships, source category and supplied metadata, provenance, availability. |
| ScenarioSet | Weak/Base/Strong, shared baseline, outcome measure, own horizon, assumptions, approved outputs only. |
| Market-day summary | Shared current semantic state, supported driver/sector claims, separate example identity where applicable. |
| IPO | Fictional entity/offer identity with individually unavailable unapproved financial fields. |
| Decision question/summary | One ordered stock framework and research references; no independent score or recommendation. |
| Explanation/Ask AI copy | Supported answer shapes and depth variants linked to common conclusions and records. |

Use explicit typed availability instead of optional numbers with ambiguous meaning. Zero is a real supplied value, not a substitute for unavailable. Unresolved sources and genuinely empty result sets are different states. Avoid presentation-specific classes in domain data and financial literals in components.

## Source-count integrity and missing information

Every count must be derived from the actual distinct source records supporting the displayed claim/section. Deduplicate by source identity, not by chip count or repeated citation. A preview count and total count must identify their scopes and resolve the same source catalog. Never copy counts from a screenshot or hardcode an impressive-looking total.

No concrete source catalog or exact source count is approved here. Before implementation displays detailed source chips, source counts, or claim-level evidence for the Tata fixture, use one of these two permitted states:

- **A — Separately approved synthetic catalog:** a clearly synthetic mock evidence catalog exists with stable IDs, source categories, explicit mock provenance, and no invented claim of real verification. Detailed displays resolve only those approved records and their actual claim relationships.
- **B — Evidence unavailable:** without that separately approved catalog, evidence details are shown as unavailable in the prototype. The qualitative High assessment does not supply missing source records.

Do not invent real publishers, URLs, filing titles, dates, or verification. Mock claim-to-source links demonstrate structure only and must not imply independent real-world verification. The current baseline uses state B until a catalog is separately approved.

Potential future source categories are company filings, exchange announcements, quarterly results, annual reports, investor presentations, market data, and reputable financial news. Category names alone are not supporting documents. Do not invent titles, publishers, URLs, reporting periods, or document dates, and do not render broken links as usable evidence.

Unavailable price, score, metric, comparison, scenario, or source detail must be distinguishable from zero, low confidence, no change, and no search results. Do not fill missing information with placeholder precision. No numerical scenario ranges, probabilities, or confidence percentages are approved by the presence of a scenario section.

## Four evidence layers

| Layer | Contract |
| --- | --- |
| Observed data | Facts such as supplied quotes or reported results, with provenance, units, period, and availability. A mock record may represent this shape while remaining fictional. |
| Deterministic calculations | Approved method/version, compatible input references, units, output, and missing-input behavior. Formatting and a hardcoded assessment are not calculation evidence. |
| Modeled scenarios | Assumptions, baseline, explicit scenario horizon, modeled outputs, limitations, and model/mock provenance. Scenarios are possibilities, not promises. |
| AI interpretation | Explanation of referenced structured research; no invented observations, scores, sources, or implied validation. Static demo copy is not an AI integration. |

Mock provenance is an independent dimension across all layers. The approved Research Picture values are assessment fixtures with an unimplemented methodology; do not falsely assign them to a completed calculation or AI process. A future method needs separate approval and traceable inputs. Presentation changes cannot promote modeled outcomes or interpretation into observed facts.

## Cross-screen invariants

- Every current Tata display resolves the canonical quote and research references; every current What Changed display resolves the same snapshot pair.
- Every current market-day answer agrees with Home; separate examples identify their different context.
- Simple/Normal/Pro preserve the same underlying research and limitations.
- Research context, comparison period, quote period, and scenario window remain separately labeled.
- Numeric displays and prose interpolate shared approved values; neither creates an independent financial fixture.
- Missing data and source gaps remain visible, and mock content never acquires false freshness or verification claims.

Verify these invariants through [FRONTEND_ACCEPTANCE.md](../qa/FRONTEND_ACCEPTANCE.md) when implementation is authorized.
