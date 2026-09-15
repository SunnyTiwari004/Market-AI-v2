# MARKET AI product requirements

Product Baseline Gate: 2026-09-15. Status: specified, implementation not started. This document owns the final Release-1 scope, dataset size, product priorities and completion gate. It does not authorize implementation, schemas, records, integrations or deployment.

## Product and users

MARKET AI is a college / portfolio full-stack financial-research simulation. The software is real; its financial universe is permanently fictional and synthetic. It demonstrates responsive frontend, server logic, relational data, deterministic research, historical snapshots, evidence handling, search/filtering, grounded AI, testing, CI/CD and deployment at a manually reviewable scale.

Beginners struggle to connect financial terminology and disconnected figures to a balanced understanding of a business. They need to see what matters, what could go wrong, and what supports an explanation. Primary users are students and first-time research learners; secondary users are project evaluators reviewing the software and its engineering evidence. Users are not expected to supply personal financial information.

The value proposition is a coherent path from a plain-language briefing to deeper research, evidence and questions, with the same conclusions at every explanation level. Success is demonstrated by working journeys and reproducible research, not predictions, user counts or a claimed AI accuracy percentage.

### PRD-001 Product and trust boundary

Use industry-style engineering at college scale: reduce breadth before engineering quality. Retain the permanent synthetic universe, canonical disclosure, evidence distinctions and exclusions in [product principles](PRODUCT_PRINCIPLES.md), [the data contract](../data/SYNTHETIC_DATA_CONTRACT.md) and [INT-018](INTERACTION_CONTRACTS.md#int-018-release-exclusions-and-trust). This is not a brokerage, trading terminal, prediction or investment-advice product, nor a commercial market-data ingestion system. No real-company research, licensed feeds, transaction instructions or publisher/exchange impersonation enter Release 1.

## Primary journeys

1. Read the current simulated Home briefing, understand a sector concern, open a company, inspect What Changed and its evidence.
2. Discover a company through Explore or Stocks search and filters, read its six research views, compare a peer and use the six-question Decision framework.
3. Find an IPO by lifecycle status, understand offer structure, valuation and modeled listing outcomes, inspect sources and share its research link.
4. Ask about a supported company, pair, concept or current simulated market; inspect actual supporting records and ask a contextual follow-up.
5. Move from Simple to Normal or Pro, or between mobile and desktop, without changing the research conclusion, losing concerns or hiding source access.

## Release-1 universe

### PRD-002 Bounded coverage

The following is the recommended final-release baseline, not generated data. Counts are coverage commitments; names, dates, values, methods and records belong to the next data-design milestone. Count shared evidence once, regardless of how many screens cite it.

| Domain | Release-1 decision | Reason and acceptance boundary |
| --- | --- | --- |
| Listed companies | **12**, one supported listing per company. | Four groups of three give each company two same-sector peer candidates, 12 directory/search targets and manageable manual reconciliation. Peer eligibility still requires comparable reporting bases. Eighteen companies add content review without a new journey. |
| Sectors | **4**, exactly three listed companies in each at the reference clock. | Enough contrast for discovery and market context without thin one-company sectors. Sector names and membership await data design. |
| IPOs | **4 offers**, one Upcoming, one Open, one Closed and one Listed at the fixed reference clock. | Exercises every directory status. The Listed offer links to one of the 12 listed companies; the other three have separate fictional issuers. Thus **15 distinct issuers**, not 16 listed companies or duplicate company identities. No extra IPOs solely for card density. |
| Market context | **1 synthetic broad-market index** and **4 derived sector aggregates**. | Reuse compatible company inputs; define membership, weighting, base, calendar and treatment of listing changes before calculation. No separate commercial-style index catalog or causal price-impact model. |
| Discovery | **2 themes and 2 curated collections**, each with explicit rationale and at least two relevant members. | Exercises scoping and membership without gratuitous taxonomy. Titles alone cannot determine inclusion or rankings. |
| Articles | **2 per listed company, 1 IPO-specific per offer, and 4 market/sector articles**: target **32 distinct articles**. | Supports News, company and IPO context, and market grounding. Reuse across readers and claims. A third company article is optional only for a distinct supported event; no bulk news feed. |
| Statement sources | Per issuer, **3 annual and 8 quarterly report records**, with readable supported statement content. | One source can cover income, balance sheet and cash flow for its period; do not create a separate document per metric. Twelve listed plus three other issuers yield **165 period reports**. This is source coverage for the financial periods, not 165 long-form editorial reports. |
| Other documents | **1 announcement per listed company**, **1 offer document per IPO**, and **1 lifecycle update for each of Open, Closed and Listed offers**. | Adds event, offer and lifecycle provenance: **19 documents**, giving **184 non-article source records** at baseline. Optional presentation/transcript content is outside this minimum. Articles and reports are different source categories, not duplicate evidence counts. |
| Concepts | **6 supported concepts**, selected during content design to cover recurring research, valuation, risk and IPO help. | Small reviewed teaching corpus shared by Context Help and Ask; illustrative arithmetic is labeled and centrally owned. No open-ended textbook promise. |

The report count follows period coverage rather than arbitrary document volume. Use compact internally coherent simulated content with the actual inputs required by the product; complete replicas of statutory reports are not required. At data design, inventory each needed claim against these sources. Add a source only for a demonstrated gap, with the resulting count documented; do not quietly expand the universe. A source-count target alone does not establish evidentiary support.

### PRD-003 Historical coverage

| Coverage | Required minimum and rationale |
| --- | --- |
| Daily closing prices | **2 years of daily simulated session closes** for the 11 established listings; the IPO-linked listing has **at least 90 calendar days since listing**, with closes only on its defined sessions. Two years exercises short and multi-year chart ranges without a third year's maintenance. The recent listing deliberately exercises shorter history: no pre-listing prices or padded ranges. |
| Market/sector history | The same two-year calendar where inputs support it. Membership before the recent listing must be explicit; the later methodology must not backfill that company's pre-listing prices. |
| Financial statements | **3 completed annual periods plus 8 completed quarterly periods per issuer**, subject to the simulated publication cutoff. Eight quarters support comparable year-on-year quarters; three annual periods support two annual growth comparisons. The overlapping annual/quarterly coverage must reconcile under a declared policy. Pre-listing statements are valid and distinct from pre-listing prices. |
| Stock research snapshots | **3 cutoffs per listed company per research horizon**: current, 30 calendar days earlier and 60 calendar days earlier, with a defined session/cutoff convention. Across 12 companies and three horizons this is **108 snapshots**. Each same-horizon series uses compatible input bases and method versions and supports two adjacent comparisons. The recent listing is old enough to support these cutoffs. |
| Snapshot cases | Seed design must include supported improvement, deterioration and unchanged findings across companies, plus explicit field-level missing/incomparable cases. Negative test variants exercise a missing baseline or method mismatch without corrupting the coherent main demonstration dataset. Never author outcomes independently of inputs. |
| Market snapshots | Current and the same two earlier cutoffs for broad-market/sector context, derived from their compatible inputs. Home and current-market Ask resolve the same current state. |
| IPO lifecycle | All four current statuses plus dated preceding lifecycle events where they have occurred. The Listed offer covers offer, close and listing; Open and Closed cover their actual earlier stages. No future subscriptions, listing prices or later publications leak into earlier cutoffs. |
| Scenarios and AI | Stock scenarios retain the explicit **30-day** window; IPO scenarios retain the listing-day window. Historical observations support assumptions, not guaranteed forecasts. Retrieval respects each research cutoff. A Long research horizon of 3–5 years does not require inventing 3–5 years of price observations or forecasts. |

Calendar dates, financial precision, reporting scope, scenario methods and horizon-specific assessment rules remain data/method decisions. This pass chooses coverage only. Snapshots preserve historical evidence availability rather than recalculating the past with current knowledge.

## Feature priorities and sequencing

### PRD-004 Release feature boundary

**MUST HAVE** is a final-release gate. **SHOULD HAVE** is useful conditional depth or supporting refinement, omitted if it would delay a coherent release; do not expose an unfinished control. **DEFER** is outside Release 1 and unexposed. These priorities do not replace Gate 2.5's control classifications or section hierarchy.

For this project, MVP means the coherent final Release-1 MUST scope below. An intermediate frontend prototype or single-company vertical slice is a development milestone, not a second, smaller definition of the MVP.

The accepted core is substantial for a college project. Retain it through shared components and the small universe above. Most named journey capabilities are MUST because Gate 2.5 explicitly retains them; optional depth and infrastructure are not. No accepted unconditional feature is silently demoted. If time proves insufficient, propose an explicit scope amendment before implementation/release claims, rather than declaring a partial slice complete.

| Capability | Priority | Bounded release interpretation / authority |
| --- | --- | --- |
| Shell and all eight routes | MUST HAVE | Five nav destinations and focused Decision; `/`, `/explore`, `/stocks`, `/stocks/[symbol]`, `/stocks/[symbol]/decision`, `/ipos`, `/ipos/[slug]`, `/ask`. [Route contract](INTERACTION_CONTRACTS.md#int-004-route-validation-and-profile-u). |
| Home | MUST HAVE | Briefing, drivers/What Matters, sector picture, Worth Researching, Research Changes, IPO preview and Ask entry. [Home](EXPERIENCE_CONTRACTS.md#home--market-today). |
| Explore | MUST HAVE | Guided discovery, categorical filters, sectors, themes, collections, research changes, IPO and Ask handoffs, within bounded coverage. [Explore](INTERACTION_CONTRACTS.md#int-011-explore). |
| Stocks and IPO directories | MUST HAVE | Complete bounded search/filter results, counts, recovery and working detail links; no compulsory pagination. [Directories](INTERACTION_CONTRACTS.md#int-015-ipo-and-directory-contracts). |
| Stock Overview | MUST HAVE | Canonical hierarchy, balanced pillars/Quick View, What Changed, supported 30-day scenarios, sources, Share and Decision entry. [Six views](INTERACTION_CONTRACTS.md#int-012-stock-and-six-view-contracts). |
| Stock Financials | MUST HAVE | Annual/quarterly income, balance sheet and cash flow with units, explained changes and evidence. Same six-view authority. |
| Stock Chart | MUST HAVE | Closing-price ranges, accessible point inspection and table alternative. Same six-view authority. |
| Stock News | MUST HAVE | Canonical articles and full source reader. Same six-view authority. |
| Stock Peers | MUST HAVE | Two eligible same-sector peers where comparable, a small approved metric set, trade-offs and contextual two-company Ask. Same six-view authority. |
| Stock Filings | MUST HAVE | Supported reports/announcements, type/period filtering and source reader. Same six-view authority. |
| Decision | MUST HAVE | Exactly six questions and the final research summary, same findings and direct entry; no completion gate. [Decision](INTERACTION_CONTRACTS.md#int-013-decision-flow). |
| IPO research | MUST HAVE | Full accepted offer/proceeds/ownership/demand/valuation hierarchy, supported listing scenarios, sources and Share. Lifecycle-specific unavailability is explicit. [IPO](EXPERIENCE_CONTRACTS.md#ipo-research). |
| Ask AI | MUST HAVE | Four capabilities, actual grounded generation, contextual follow-ups, sources and supported/partial/unsupported/failure/retry behavior. [AI contract below](#prd-007-grounded-ai-release-contract). |
| Shared depth and interactions | MUST HAVE | Simple/Normal/Pro, meaningful horizons, search, filters, source access, Context Help, Stock/IPO Share, history, direct entry and all applicable reusable states. [INT contracts](INTERACTION_CONTRACTS.md) and [EXP contracts](EXPLANATION_LEVELS.md). |
| Additional Deep Research content | SHOULD HAVE | Earnings-call breakdown or additional chart interpretation only with an actual supporting transcript or approved method. Accepted Overview and its core research remain mandatory; conditional deeper disclosures do not authorize invented content. |
| Extra articles and optional review boards | SHOULD HAVE | Additional event coverage within the bounded article range; helpful desktop Pro / Decision-summary / shared-state boards in the [design handoff](../design/DESIGN_SYSTEM.md#gate-25-reference-handoff). Required five boards remain prerequisites. |
| Downloadable source artifacts | DEFER | Full readable source content is mandatory; creating downloadable files is not. Keep download controls unexposed unless an actual artifact is later deliberately included. |
| Accounts, watchlists, notifications, persistent Ask history, Ask sharing, IPO Decision, extra Decision summary actions | DEFER | Existing [INT-018 exclusions](INTERACTION_CONTRACTS.md#int-018-release-exclusions-and-trust) remain in force. Removed deceptive/dead controls remain removed, not backlog promises. |
| Advanced charting, raw-ratio screener, bulk export, large universe or live ingestion | DEFER | No OHLC/indicator expansion, forecast builder or market-data integration in this release. Any later work needs explicit scope and method approval; live ingestion requires changing the permanent synthetic scope. |

### PRD-005 Development slices

Sequence authorized work through: data/method/backend design; one company with real storage, calculations and evidence; all six Stock views and Decision; bounded Home/Explore/directories and IPOs; grounded Ask; final cross-route quality and release checks. Shared accessibility and tests accompany each slice, not only the end. Populate the full agreed universe before declaring Release 1 complete. This is a dependency sequence, not implementation permission or a fixed schedule; AI feasibility can be evaluated during architecture planning.

### PRD-006 Explanation and interaction parity

All required features follow [EXP-001 through EXP-007](EXPLANATION_LEVELS.md) and [INT-001 through INT-018](INTERACTION_CONTRACTS.md). Those files remain the sole owners of depth and observable mechanics. Search/filter scope, canonical directory Back actions, push/replace/local history, help focus, session-only Ask, Share fallbacks and missing-data behavior are unchanged. Neither priority nor explanation level authorizes contrary conclusions or mobile feature loss.

## AI and research

### PRD-007 Grounded AI release contract

Release 1 requires a real submitted-request workflow: resolve supported intent and canonical context, retrieve permitted synthetic records, construct bounded grounded context, generate the explanation, validate its references and factual support, and present actual evidence links at the selected explanation depth. Follow-ups retain visible entity/snapshot/horizon until explicitly changed. Generation time is separate from simulated financial time. [INT-014](INTERACTION_CONTRACTS.md#int-014-ask-lifecycle) owns composer, context, pending, retry and session mechanics.

| Capability | Minimum supported scope |
| --- | --- |
| Understand a Stock | Any of the 12 supported listings, using its selected research snapshot, evidence, risks, changes and watchpoints. |
| Compare | Two distinct supported listed companies; use compatible approved metrics and disclose reporting differences. Cross-sector questions may explain trade-offs and omit inapplicable metrics; never announce an overall winner. |
| Explain Something | One of the six reviewed concepts and its supported follow-ups, using canonical teaching content and clearly illustrative examples. |
| Understand the Market | Current simulated broad-market/sector context shared with Home; historical examples only when supported and visibly distinguished from current state. |

**SUPPORTED:** the requested entity, time, concept and material claims have canonical support and approved calculation methods where required. Answer with references to the actual supporting records and relevant calculations.

**PARTIALLY SUPPORTED:** some requested claims have support but others lack evidence, comparable periods or a method. Answer only supported parts; identify omitted claims and why. Missing evidence never becomes a confident inference, a zero or an uncited company-memory answer.

**UNSUPPORTED:** an unknown/real entity, live market request, unsupported concept/time, transaction instruction or question with no sufficient canonical grounding. Explain the limitation and offer supported alternatives. Ambiguous identity requires clarification rather than guessed selection. Unsupported portions of a mixed request stay unsupported even if another portion can be answered.

AI explains research; it does not establish canonical research truth. It cannot invent scores, qualitative assessments, evidence, citations, source counts, causes or real-source verification. Treat question text and retrieved document content as untrusted instructions; they cannot override grounding or grant tools/financial writes. Do not publish unsupported factual output as a successful answer: use a qualified partial result or failure/retry according to the cause. Citations must support the attached claim, not merely resolve to an existing record.

Verify a reviewed question set covering all four capabilities at all three levels, follow-ups, ambiguity, missing evidence, unsupported/live requests, prompt injection and generation failure. Check claims against canonical outputs rather than exact generated wording. No vendor/model/API, exact token limit or pricing is selected here. Before implementation, architecture must define context selection, output validation, timeouts, input/resource limits and affordable abuse controls. Static Example answers may support an earlier slice but do not satisfy this release requirement.

### PRD-008 Deterministic research boundary

| Research family | Canonical responsibility and method gate |
| --- | --- |
| Ratios, growth and price changes | Deterministic calculations over compatible canonical inputs with defined formula, units, precision, periods, denominator and missing-input handling. |
| Financial-health, growth and risk signals | Deterministic rules over specified statements/history/evidence; define thresholds and applicability before implementation. |
| Price vs Value | Defined valuation basis, horizon and comparability policy; no LLM price target or arbitrary expensive/cheap badge. |
| Research Picture | Defined research methodology, input selection and interpretation boundaries; no arbitrary aggregate weights or mandatory numerical score. |
| Evidence Confidence | Defined evidence-quality methodology independent of research attractiveness; not an invented percentage or profit probability. |
| Stock/IPO scenarios | Deterministic modeled outputs from approved baselines and assumptions with explicit windows; no probabilities unless separately method-defined. |
| What Changed | Deterministic comparison of compatible versioned snapshots; causal interpretation requires supporting events. |
| Broad market and sector aggregates | Defined membership, timing, units and aggregation basis; no unsupported additive causal decomposition. |
| Peer/comparison metrics and discovery membership | Reuse the same deterministic metrics, reporting bases and approved membership/category rules; editorial membership has explicit canonical rationale. |

All assessment and scenario methodologies are **required before implementation**; this PRD supplies no weights or financial formulas. Stored synthetic observations, computed outputs, modeled scenarios and AI explanation stay separate under the [data contract](../data/SYNTHETIC_DATA_CONTRACT.md#stored-inputs-derived-outputs-and-interpretation). Persisted outputs must remain reproducible from versioned inputs/methods. A missing method produces explicit unavailability during a slice, not an assessment copied from a design. Final completion requires a supported, tested method for each required research family; leaving an entire promised capability unavailable is not a complete release. Legitimate record-specific missingness remains supported.

## Security and engineering scope

### PRD-009 User data boundary

Release 1 has no authentication, personal profile, payments, broker connections, financial account data or portfolio imports. Public research is read-only. Search/filter/route selections and local disclosures are transient research interaction; Ask conversations live only in current session memory and are not stored as account history. Dataset creation/migration/seed operations are developer-controlled, not public editing features. No browser-held credentials or client authority over canonical research. [NFR security and privacy](NON_FUNCTIONAL_REQUIREMENTS.md) defines verification and operational limits.

### PRD-010 Engineering scope control

These are capability decisions, not vendor selection, database design or permission to install software. Reconsider only for a demonstrated requirement.

| Choice | Release-1 classification | Rationale |
| --- | --- | --- |
| PostgreSQL or equivalent relational database | NEEDED | Coherent structured data, relationships, historical state and reproducible setup; product requires actual persistence. Engine/vendor selected later. |
| ORM/query layer | NEEDED | Small typed query boundary. An ORM package is optional; choose the simplest adequate implementation later. |
| REST-style route handlers / server actions | NEEDED | Validated server request handling for search/retrieval and actual AI. Choose mechanism per need later; neither duplicate APIs nor an endpoint per component is required. |
| GraphQL | NOT NEEDED | One bounded application; no demonstrated client/query complexity. |
| Redis | NOT NEEDED | No measured distributed cache need. Abuse controls must still be designed without assuming Redis. |
| Kafka | NOT NEEDED | No event-stream ingestion. |
| Background job queue | NOT NEEDED | Offline developer-run seed/calculation workflow and bounded requests suffice. |
| Microservices | NOT NEEDED | One application and logical domain boundaries. |
| Docker | RECONSIDER LATER | Only if the chosen local/deployment setup needs container parity; not a release feature. |
| Kubernetes | NOT NEEDED | No orchestration requirement at this scale. |
| Authentication | NOT NEEDED | Public read-only research and session-only Ask. |
| Authorization roles | NOT NEEDED | No user/admin product roles; server write restrictions and deployment credentials still apply. |
| WebSockets | NOT NEEDED | No live collaboration or exchange feed. |
| Realtime streaming | NOT NEEDED | Bounded request/response with honest pending states meets Ask; no streaming requirement. |
| Elasticsearch | NOT NEEDED | Small canonical searchable universe. |
| Vector database | NOT NEEDED | Structured ID/intent/evidence retrieval meets the bounded corpus need; grounding does not require vector search. |
| Object storage | NOT NEEDED | Readable canonical source content suffices; downloadable assets are deferred. |
| Email service | NOT NEEDED | No accounts or notifications. |
| Analytics platform | NOT NEEDED | Manual evaluations and basic diagnostics provide release evidence. |
| Feature flags | NOT NEEDED | Authorized slices and ordinary route/control exposure suffice; no remote flag platform. |

## Dependencies and release evidence

### PRD-011 Visual and architecture prerequisites

The five required [Gate 2.5 references](../design/DESIGN_SYSTEM.md#gate-25-reference-handoff) are recorded, not created:

| Missing reference | Relevant frontend work requiring it |
| --- | --- |
| Pro Stock mobile dense section | Dense Stock research/financial/evidence presentation and mobile Pro disclosure composition. |
| Pro Ask AI mobile answer | Pro answer, comparison/evidence density and follow-up composition. |
| Explore mobile Filters sheet | Mobile filter group layout, applied/draft presentation and sheet composition. |
| Context Help desktop popover | Desktop help placement and interactive content composition. |
| Context Help mobile bottom sheet | Mobile help content, scrolling and close/control composition. |

These block their relevant frontend presentation work, not independent data/method/backend planning. Existing behavioral and accessibility requirements remain binding while references are pending. Whole Normal-mode screen sets are not required. Before implementation, separately approve data identities/timeline, methodology, relational model, server/API and AI architecture. This baseline does not supply tables, columns, keys, indexes, ORM models or API endpoints.

### PRD-012 Success and definition of done

Release 1 is complete only when all of the following have recorded evidence, linked through [requirement traceability](REQUIREMENT_TRACEABILITY.md). Correct-looking screens alone do not pass.

- **Functionality:** all eight route patterns and all agreed MUST capabilities work; all six Stock views, six Decision questions/summary, IPO statuses and four Ask capabilities are exercised. Visible controls work on direct entry, refresh and relevant history paths. Record inclusion or omission of each SHOULD refinement; exclusions stay unexposed.
- **Data:** the agreed universe is populated and validated; relationships, statements, offer amounts/ownership and chronology reconcile. Repeating seed/setup reproduces stable identities and inputs. Expected deterministic outputs match independently reviewed calculations, including missing and invalid inputs. What Changed compares compatible snapshots; cross-screen and cross-level outputs agree.
- **AI:** real retrieval and generation work for the supported question set; claim-linked references correspond to actual supporting records. Partial/unsupported/failure states are honest. A static answer showcase does not pass. Removing actual AI requires a deliberate documented scope change before implementation, not a last-minute completion waiver.
- **UX:** a beginner can explain the main finding, main concern and supporting source in the primary journeys without relying on unexplained jargon. Record a task-based walkthrough with someone unfamiliar with the interface and address blocking comprehension failures. Normal/Pro retain the meaning; mobile and keyboard checks, required references, focus, safe areas, 320px reflow and 200% zoom pass the existing acceptance contracts.
- **Quality and operations:** applicable [NFRs](NON_FUNCTIONAL_REQUIREMENTS.md) pass; loading/error/empty/no-result/partial/unavailable states are exercised. Lint, production build, type checks, relevant automated tests and CI pass. Database migration/seed and deployed application setup are reproducible from documentation. Security/privacy and AI resource controls are verified. Deployment occurs only when separately authorized.
- **Evidence and claims:** final documentation describes actual implemented scope, methods, setup and limitations. README/CV claims link to demonstrable code, tests, architecture decisions and a working deployment; no unsupported performance or AI accuracy claims. No unresolved defect that prevents a MUST journey, corrupts research, exposes secrets or defeats required accessibility remains open.

## Risks and remaining decisions

The chief risk is content/method quality, not record volume: 184 compact source documents still require coherent periods and real claim support. Mitigate with shared inputs, reconciliation checks and a small manual review set before expanding. Twelve companies and four offers are sufficient; additional entities are not a release-success measure.

Grounded generation may be slow, costly or unsupported by available hosting. Evaluate one real supported workflow early after authorization, then set practical resource budgets. Do not substitute prewritten answers and retain a full-stack AI claim. Public AI access also requires abuse controls despite the absence of accounts.

Remaining architecture decisions: calendar/reporting conventions, fictional identities, concept selection, exact methods and peer metrics, database/query/request mechanisms, AI context/output validation and provider retention constraints, representative hosting/performance budgets. These are bounded next-gate decisions rather than permission to design schemas now. The five missing boards remain relevant frontend prerequisites.

Future ideas include richer evidence content and optional review boards first. Persistent personal features, expanded analytics, extra charting and infrastructure remain deferred; no future idea is a promised Release-1 capability. Any time-driven reduction to the accepted core needs an explicit product-scope amendment with consequences recorded in the governing contracts.
