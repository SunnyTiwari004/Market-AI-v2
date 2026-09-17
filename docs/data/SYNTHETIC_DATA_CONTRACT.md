# MARKET AI synthetic data contract

Scope reset: 2026-09-12. This is the sole active financial data contract for the college / portfolio project, under [ADR 0006](../architecture/adr/0006-synthetic-financial-universe.md). It defines invariants, not a database schema, generated dataset, financial methodology, or authorization to implement them.

## Purpose and disclosure

The intended dataset is permanently synthetic: companies, stock prices/history, statements, ratios, articles/news, filings/documents, IPOs, market-day conditions, research evidence, scenarios, and historical financial events. It is not a temporary stand-in for licensed market data.

The application behavior is real when implemented: frontend/backend, database/APIs, routing, search/filtering, queries, calculations, research engine, historical snapshots, What Changed, AI retrieval/grounding, accessibility, testing, CI/CD, and deployment. Each milestone requires explicit authorization.

Use **College Project · Simulated financial data** as the canonical disclosure. Content is simulated for educational/demonstration use, not live exchange information or investment advice. [INT-018](../product/INTERACTION_CONTRACTS.md#int-018-release-exclusions-and-trust) defines placement across financial experiences, including focused routes, without huge repeated disclaimers. Source details still expose simulated provenance and availability.

## Fictional entities and stable identity

The demonstration universe uses fictional companies. Tata Motors, HDFC, ICICI, HAL, Reliance, and other real-company references in Stitch are visual/product-structure examples only. Their quotes, ratios, scores, confidence labels, articles, source counts, and IPO terms must not become dataset authority. Existing fictional examples also do not automatically enter the final universe.

A later data-design milestone defines the canonical fictional companies and mapping from design examples. This contract performs no mass UI/content rename and supplies no company rows or numerical financial fixtures.

Use deterministic stable IDs for datasets/versions, companies, listings, quotes, periods, articles, sources, research snapshots, scenarios, and events. IDs must not depend on display names, array positions, screen routes, or the current clock. Preserve identity across display-name changes; references must resolve within the intended dataset version.

Keep company identity separate from listing identity, ticker, venue, and currency. A ticker is not a globally unique company ID. Simulated venues must be identified as fictional, without implying actual exchange listing or verification.

## Canonical ownership and cross-screen consistency

One canonical typed dataset owns inputs, evidence, and entity/state relationships. Initial centralized files and later explicitly authorized database storage must preserve one authoritative source, rather than competing financial copies. This contract does not choose database tables or backend architecture.

Resolve the same entity, dataset version, simulated snapshot, and horizon through shared selection rules. Home, Explore, Stocks, Decision, Ask AI, and any other appearance must derive the same price, metrics, research conclusions, risk, valuation, scenarios, articles, and What Changed results from that source. A separate illustrative scenario needs distinct identity and visible context.

Presentation components and answer prose must not embed screen-specific financial values. Interpolate canonical values or shared calculation outputs into copy. Simple/Normal/Pro change depth, never underlying evidence or conclusions. Domain records must not contain styling classes or layout-specific variants of financial truth.

## Simulated dates and timestamps

Define a dataset version and explicit simulated reference clock/current snapshot. “Today,” “current,” freshness, article age, market-day state, and IPO status resolve that timeline, not the machine clock or documentation/build date. Label simulated time so it cannot imply live exchange freshness.

Use unambiguous date-only values for reporting/session dates and timestamps with explicit timezone/offset for events requiring time-of-day. Distinguish period end, publication time, simulated observation time, snapshot time, and actual seed-generation metadata. Preserve chronology and use one timezone/session policy across routes; the later dataset design sets its concrete calendar.

Do not silently move timestamps forward. Separate current-state demonstrations from historical/example scenarios. Historical research must only use evidence available at its simulated cutoff; later publication cannot support an earlier snapshot.

## Money, currency, and precision

Every financial quantity has an explicit unit, currency where applicable, scale, period, and availability. Use integer minor units for money at the currency's declared precision, or an exact decimal representation with an explicit scale when finer precision is required. Do not rely on binary floating-point arithmetic for canonical money.

Keep ratios, percentages, percentage points, score points, counts, and currency amounts distinct. Financial statements must declare whether amounts are whole units, thousands, millions, or another scale. Do not aggregate incompatible currencies, units, or periods without a defined conversion rule and canonical synthetic inputs.

Calculations use unrounded canonical inputs and a documented rounding/precision policy; round at the output boundary. Define division-by-zero and invalid-domain behavior. Never infer exact previous prices or absolute changes from rounded display percentages. The later methodology defines each calculation's scale and rounding mode.

## Price histories

Each series identifies the listing, currency, simulated session dates/times, sampling interval, and adjustment basis. Records must be chronological with unique series/time identity. Define missing sessions explicitly; gaps are not zero prices and must not be silently interpolated.

Current quote and prior-close selection must agree with the same series/snapshot policy. Calculate daily movement from compatible canonical endpoints. If OHLC/volume or corporate actions are introduced, enforce coherent ranges, nonnegative volume, and consistent adjustment assumptions. Do not splice incompatible adjusted/unadjusted series.

Charts and interpretation resolve the same series and explicit period. A graphic must not imply observations or continuous coverage absent from the dataset.

## Financial periods and statements

Identify company, fiscal period start/end, annual/quarterly/trailing basis, reporting currency, scale, publication time, and revision/version. Do not compare a quarter to a year or incompatible periods as if they were equivalent.

Synthetic statements must be internally coherent under their declared accounting relationships. Growth and ratios use compatible canonical inputs, with a defined policy for restatements and unavailable or inapplicable denominators. Revenue, EPS, debt, and other inputs are synthetic; their growth, P/E, and financial-health calculations must execute defined logic when implemented.

## Articles and synthetic sources

Articles/news carry stable identity, fictional publisher identity, title/body, simulated publication time, related entity/event references, and explicit synthetic provenance. Filings/documents similarly identify their synthetic author/source, category, period, date, content availability, and claim relationships.

Synthetic publishers must not impersonate real publishers. Synthetic filings must not impersonate NSE/BSE/SEBI or actual company filings. Invented URLs to real financial publishers/exchanges are prohibited. Link to available project-owned synthetic content when implemented; unavailable content has an honest unavailable state, not a fabricated external link or dead evidence action.

Categories such as annual report, quarterly result, investor presentation, article, or simulated announcement do not by themselves constitute evidence. Every research claim resolves actual supporting synthetic records or calculation inputs. Traceability demonstrates internal simulation support, not independent real-world verification.

Source counts derive from distinct supporting source IDs in the stated claim/section scope, not chip count, screenshots, or repeated citations. Preview and total counts use the same catalog. Without a catalog, details/counts remain unavailable.

## Research snapshots and What Changed

Snapshots identify entity, dataset version, simulated as-of/cutoff, research horizon, input/evidence references, method version where applicable, outputs, and limitations. Preserve historical snapshot identity and content; later changes create a new version rather than silently rewriting history.

What Changed executes a comparison of compatible previous/current snapshots for the same entity and research context over an explicit period. The current endpoint is the same one used elsewhere. Derive numerical changes from those endpoints with correct units; do not maintain independent change-card numbers.

Missing prior fields remain unavailable. Different methods or input bases require an explicit comparability policy; a score-method change must not masquerade as business improvement. Explanations of causes require linked synthetic events/evidence, not just a numerical difference.

Research Picture and Evidence Confidence require defined methodology before being presented as calculated assessments. No historical Stitch score or qualitative confidence label is an approved output. A supplied demonstration assessment, if separately authorized, must identify its unimplemented methodology and must never be described as an executed calculation.

## Scenarios and research context

Scenario sets carry stable identity, common baseline/input references, assumptions, method/version when computed, outcome measure/unit, explicit scenario horizon, and limitations. Use Weak / Base / Strong in Simple mode. Outcomes are modeled possibilities, not guarantees or investment instructions.

The scenario inputs and financial world are synthetic; scenario computation is real application logic when implemented. Derive intended computed outputs from canonical inputs and method, not independent presentation numbers. Probabilities and confidence percentages remain unavailable unless a defined, authorized method supports them.

Research Horizon, quote/history period, Scenario Horizon, and What Changed comparison period remain distinct. A long-term research context can include a labeled 30-day scenario. Missing horizon-specific research cannot be created by relabeling another horizon. The existing [terminology contract](../product/TERMINOLOGY.md#research-horizons) owns research choices.

## IPO data

Use fictional entity/offer identity with simulated offer dates, currency, price band, application terms, and availability. Status resolves the simulated reference clock. Offer terms and numbers await data design.

Keep Fresh Issue proceeds to the company separate from OFS proceeds to selling owners; distinguish proceeds allocation, investor reservations, subscription demand, and ownership changes. Any allocations and totals must be coherent with their canonical inputs. No design export supplies final terms or listing outcomes.

## Stored inputs, derived outputs, and interpretation

| Layer | Required meaning |
| --- | --- |
| Synthetic input observations | Canonical simulated prices, reported results, articles, and events with units, periods, provenance, and availability; not real observations. |
| Deterministic calculations | Executed methods with compatible input IDs, method/version, units, precision, and missing-input behavior. |
| Modeled scenarios | Explicit assumptions/baseline/horizon and supported modeled outcomes, kept separate from observations. |
| AI interpretation | Explanation grounded in referenced structured research and evidence; no invented inputs, sources, or scores. |

Synthetic provenance applies independently to every layer. A derived metric must be calculated from canonical stored inputs whenever that is intended behavior. Historical/persisted derived outputs retain input and method versions so they can be reproduced; they are not independently editable truth.

Formatting is not a financial calculation. Static answer copy does not prove an AI call occurred. Real AI integration, when authorized, must retrieve and ground answers in the same synthetic records and disclose unsupported questions or missing evidence.

## Missing and unavailable data

Use explicit typed availability with a reason where known. Distinguish missing, not applicable, unsupported method, unresolved source, and a genuinely empty result set. Zero, no change, and low confidence are meaningful states, not placeholders.

Do not fill a screen with invented precision, inferred source counts, historical values, scenario probabilities, or unsupported assessments. Missing source content must remain unavailable even when other metadata exists. Calculations with insufficient inputs propagate an appropriate unavailable state.

## Reproducible seed generation

If seed generation is later introduced, use an explicit seed, deterministic generator/version, fixed simulated timeline, and versioned inputs. The same seed and generator version must reproduce IDs, relationships, values, chronology, and resulting demonstrations. Do not use uncontrolled randomness or wall-clock timestamps as financial truth.

Validate referential integrity, accounting/price constraints, periods, and cross-screen invariants before accepting a generated dataset. Preserve released dataset/snapshot versions; generator changes must not silently mutate historical demonstrations. Generation is not authorized by this contract.

Validate the implemented scope through [FRONTEND_ACCEPTANCE.md](../qa/FRONTEND_ACCEPTANCE.md). Dataset design, database schema, methodology, seed rows, APIs, and AI integration remain later milestones.

System Design Gate 1 (2026-09-16) supplies the later [logical data model](DATA_MODEL.md), [methodology](../research/RESEARCH_METHODOLOGY.md), [backend design](../architecture/BACKEND_ARCHITECTURE.md) and [server contract](../architecture/API_CONTRACT.md). This invariant contract remains authoritative; technical specifications do not imply executed calculations. Fictional records/content, physical schema/migrations and all implementation remain outstanding. Earlier future-tense references above describe the milestones' original boundaries, not a prohibition on these now-authorized design documents.
