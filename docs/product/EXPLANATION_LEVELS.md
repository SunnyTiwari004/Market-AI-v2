# MARKET AI explanation levels

Accepted Gate 2.5 contract: 2026-09-13. This document owns explanation depth. [Experience contracts](EXPERIENCE_CONTRACTS.md) own hierarchy and screen responsibilities; [interaction contracts](INTERACTION_CONTRACTS.md) own observable behavior. [Synthetic data integrity](../data/SYNTHETIC_DATA_CONTRACT.md) and [terminology](TERMINOLOGY.md) remain authoritative. This specification does not authorize implementation, numerical datasets, or calculation methodologies.

## Core requirements

### EXP-001 Same research across levels

Simple, Normal and Pro explain the same entity, dataset version, snapshot, research horizon, financial conclusions, risks, uncertainty, source relationships and scenario assumptions. Level changes never change quotes, calculated outputs, research membership or ordering. Preserve filters and active Stock view. Research horizon, scenario window and What Changed comparison period remain distinct.

### EXP-002 Meaning first

Simple is the default: human meaning first, professional terminology secondary, raw metrics last. Normal adds financial terminology with explanations and useful supporting values. Pro adds supported evidence and technical depth, not clutter or a different research engine. Important financial conclusions, concerns and missing evidence must remain available at every level; Simple is not positive-only. Use Business Health, Growth Potential, Financial Health and Price vs Value; expand unfamiliar abbreviations in independently entered contexts.

### EXP-003 Methodology-gated assessments

Research Picture is a research assessment, never transaction advice. In Simple, meaning/status leads; a numerical score is secondary and appears only when an approved deterministic methodology exists and has actually run on canonical inputs. Normal can show that score with selected supporting metrics and method terminology. Pro can expose approved component inputs, calculation basis, evidence and limitations. A qualitative assessment also requires a defined basis; do not copy a reference status to fill a missing method.

Evidence Confidence appears as an assessment only if its methodology is later defined and executed. Do not manufacture a qualitative value, percentage, score breakdown or source count. Where a method is absent, show an explicit unavailable explanation rather than an assessment badge. Evidence access remains available independently of an unavailable assessment.

### EXP-004 Evidence and missingness

All displayed values and prose resolve canonical records and approved calculations. Missing deeper evidence stays unavailable rather than being generated to satisfy Pro. Do not replace unavailable with zero, omit a material caveat, or imply additional sources exist merely because more detail is displayed. Original source content is unchanged by level. Synthetic inputs, deterministic calculations, modeled scenarios and AI interpretation remain distinguishable.

## Component depth matrix

### EXP-005 Component presentation

The additions below are conditional on supported records and approved methods. Normal includes Simple's meaning; Pro includes the same conclusions and relevant explanations. Supporting detail may use disclosure rather than expanding every card. Mobile retains the same meaning and evidence access.

| Experience / component | Simple | Normal adds | Pro adds |
| --- | --- | --- | --- |
| Home market summary | Market meaning and principal concern. | Named measures, explained values and comparison period. | Available breadth/components, calculation basis and provenance. |
| Home drivers / What Matters | Event, why it matters, affected entities. | Relevant metric and reporting period. | Supporting observations, uncertainty and evidence-qualified interpretation; no unsupported causal ranking. |
| Home research cards | Research meaning, reason and caution. | A few explained supporting metrics. | Compact ratio/period evidence through disclosure, not a table on every card. |
| Explore cards | Why It Stands Out and Needs Attention. | Financial terms and supporting values. | Metric/evidence basis; same membership and ordering. |
| Explore filters | Plain-language categories. | Secondary terminology and help. | Method explanation; no automatic advanced ratio-filter expansion. |
| Sectors, themes, collections | Meaning, concern and constituent context. | Supporting measures. | Membership/aggregation basis and evidence availability. |
| Stock Overview / Quick View | Understandable Research Picture, Evidence Confidence, Risk, Price Direction and Price vs Value, subject to methodology gates. | Selected metrics and method terms. | Approved inputs, formulas, periods, evidence and limitations. |
| Stock pillars | Business Health, Growth Potential, Financial Health; meaning, reason and concern. | Selected supporting metrics and secondary technical terms. | Formula inputs, reporting scope, trend periods and sources. |
| Financials | Main statement movements in human language, with key values accessible below. | Named statement rows and explained ratios. | Full supported rows, multiple periods, calculations and provenance. |
| Chart | What price did, readable selected value and explicit range/dates. | Supported percentage change and comparisons. | Approved indicator mechanics and further data detail only when implemented and method-defined. |
| News | What happened and why it matters. | Reporting context and material figures. | Evidence and calculation references; original article remains unchanged. |
| Peers | Few comparable measures and plain trade-offs. | Explained ratios and periods. | Formula bases, comparability limits, reporting differences and sources. No overall winner instruction. |
| Filings | What the document is and why it matters. | Reporting context and useful figures. | Full source and calculation references; original document remains unchanged. |
| What Changed | What changed, what stayed the same, why it matters. | Previous/current values and dates. | Snapshot/calculation basis and evidence differences through disclosure. |
| Stock scenarios | Weak / Base / Strong, meaning and key condition. | Supported values/ranges and explicit window. | Inputs, assumptions, method and limitations; no undefined probabilities. |
| IPO Overview / Research Picture | Business, price concern, risk; listing-day and long-term lenses identified. | Supported business/valuation metrics. | Calculation bases, periods, offer assumptions and provenance. |
| IPO proceeds / ownership | Company receives this portion; selling owners receive that portion. | Fresh Issue/OFS terminology and amounts. | Share/amount reconciliation and pre/post ownership basis. |
| IPO subscription | Investor categories and what demand means. | Subscription multiple and simulated as-of time. | Offered/subscribed quantities and category calculation basis. |
| IPO valuation / listing scenarios | Meaning and uncertainty; Weak / Base / Strong. | Peer comparison and modeled values. | Peer-set basis, offer-price assumptions and scenario mechanics. |
| Ask contextual company answer | Direct answer, drivers, seriousness, changes, watchpoints and sources. | Financial terms and supporting values. | Evidence, assumptions, methods and alternative interpretations, still answer-first. |
| Ask comparison | Small trade-off matrix without winner instruction. | Explained ratios and periods. | Comparable bases, formulas, missingness and evidence. |
| Ask concept | Plain definition and explicitly illustrative arithmetic. | Formal term, interpretation and common misuse. | Formula conditions, edge cases and limitations. |
| Ask market explanation | Supported developments and meaning. | Market measures and sector context. | Contribution methodology only if defined; otherwise evidence-qualified context. |
| Decision | Same six questions, plain answer and key caveat. | Supporting terms and values. | Evidence, assumptions and calculations in disclosures. Summary conclusions do not change. |

### EXP-006 Ask editorial guidance

For a contextual answer, approximate editorial targets are Simple 150–250 words, Normal 250–450, Pro 400–700 with deeper material in disclosures. A definition may be much shorter. These are writing guidance only, not validation limits, mandatory lengths or truncation rules. No financial conclusion, source qualification or material caveat may disappear to meet a word target. Input validation is owned by [Ask submission](INTERACTION_CONTRACTS.md#int-014-ask-lifecycle), not these output guidelines.

### EXP-007 Context and presentation ownership

Exactly one level is active. Standard mobile experiences use the consistent level dropdown; Decision inherits active context. Changing level replaces URL history under [INT-003](INTERACTION_CONTRACTS.md#int-003-history-policy); it does not reset research or create a persistent account preference. Source readers expose original evidence, with surrounding explanation at the active level.

## Visual and acceptance handoff

The [required reference list](../design/DESIGN_SYSTEM.md#gate-25-reference-handoff) covers representative Pro mobile density without requiring whole Normal screen sets. Do not invent numerical content to create a visual variant. [Frontend acceptance](../qa/FRONTEND_ACCEPTANCE.md#gate-25-requirement-traceability) maps these stable requirements to verification. Requirements describe the final product; separately authorized development slices must report their actual implemented scope.
