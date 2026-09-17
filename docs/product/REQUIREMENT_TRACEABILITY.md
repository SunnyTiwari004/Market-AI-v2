# MARKET AI requirement traceability

Product Baseline Gate: 2026-09-15. System Design Gate 1 mapping: 2026-09-16. This map links requirements to conceptual dependencies, likely ownership and intended verification. It does not duplicate their definitions, design a schema/API or claim implementation. Requirement IDs have one definition in their linked owner documents.

## Reading the map

Route aliases: Home = `/`; Explore = `/explore`; Stocks = `/stocks`; Stock = `/stocks/[symbol]`; Decision = `/stocks/[symbol]/decision`; IPOs = `/ipos`; IPO = `/ipos/[slug]`; Ask = `/ask`. **All** means all eight route patterns, including applicable shared controls. Data dependencies name concepts, not database tables, columns or API endpoints.

**S** means likely server ownership for canonical selection, validation, calculations, retrieval and initial rendering; **C** means client/browser interaction or local state. Split ownership does not imply a Client Component page. Developer/operator entries describe future setup/verification work, not public editing or account roles. The linked System Design Gate 1 documents now specify these boundaries; implementation remains outstanding.

Every row is **SPECIFIED** and **IMPLEMENTATION NOT STARTED**. The final column records specification progress or a remaining prerequisite; it is not an implementation pass. **DATA/METHOD SPECIFIED** means the logical model/method is documented, not that records or calculations exist. **ARCHITECTURE SPECIFIED** means the server boundary is documented, not that hosting/provider configuration or code exists. Actual dataset content and operational budgets remain outstanding. **DESIGN REFERENCE REQUIRED** identifies relevant missing presentation evidence. Multiple prerequisites can apply: the [visual dependency map](PRD.md#prd-011-visual-and-architecture-prerequisites) applies to every affected row, not just those displaying that status.

## Verification sources

- EXP and INT rows use the ID-specific [Gate 2.5 QA matrix](../qa/FRONTEND_ACCEPTANCE.md#gate-25-requirement-traceability), supplemented by the named checks below.
- PRD rows use the linked requirement and [release evidence gate](PRD.md#prd-012-success-and-definition-of-done); data checks also use the [synthetic data contract](../data/SYNTHETIC_DATA_CONTRACT.md).
- NFR rows use the verification clause in the linked requirement, with [frontend acceptance](../qa/FRONTEND_ACCEPTANCE.md) for UI checks.
- These are verification specifications, not existing test files or completed runs. Future records must include requirement ID, route/state, dataset/method version where relevant, environment, check method, evidence location and result. Mark only actually verified scope complete in a later authorized update.

## PRD coverage

| Requirement owner | Experience / route | Conceptual dependency | Likely ownership | Verification method | Design status / prerequisite |
| --- | --- | --- | --- | --- | --- |
| [PRD-001](PRD.md#prd-001-product-and-trust-boundary) | All | Evidence/source, simulated context | S + C | Trust review; QA source-integrity checks | DATA/METHOD SPECIFIED |
| [PRD-002](PRD.md#prd-002-bounded-coverage) | Home, Explore, Stocks, IPOs, Stock, IPO, Ask | Company/listing, sector, IPO, article, statement, concept | S | Dataset inventory and coverage audit | DATA/METHOD SPECIFIED |
| [PRD-003](PRD.md#prd-003-historical-coverage) | Home, Stock, Decision, IPO, Ask | Price history, financial statements, snapshot, event | S | Seed chronology and snapshot compatibility tests | DATA/METHOD SPECIFIED |
| [PRD-004](PRD.md#prd-004-release-feature-boundary) | All | All conceptual research dependencies | S + C | Route/view inventory and primary-journey tests | DATA/METHOD SPECIFIED |
| [PRD-005](PRD.md#prd-005-development-slices) | All; development process | Approved data/method baseline | S + C; developer | Slice evidence reviewed against final release gate | ARCHITECTURE SPECIFIED |
| [PRD-006](PRD.md#prd-006-explanation-and-interaction-parity) | All | Shared snapshot, evidence, level/horizon | S + C | QA EXP/INT matrix and cross-level comparisons | DESIGN REFERENCE REQUIRED |
| [PRD-007](PRD.md#prd-007-grounded-ai-release-contract) | Ask; contextual entry from research | AI grounded context, concept, snapshot, evidence | S retrieval/generation; C session | Question-set factual/citation evaluation and failure tests | DATA/METHOD SPECIFIED |
| [PRD-008](PRD.md#prd-008-deterministic-research-boundary) | Home, Explore, Stock, Decision, IPO, Ask | Statements, prices, methods, snapshot, scenarios | S | Independent expected-output and reconciliation tests | DATA/METHOD SPECIFIED |
| [PRD-009](PRD.md#prd-009-user-data-boundary) | All; public server boundary | Public synthetic data; transient Ask text | S + C | Privacy/storage and public write-boundary checks | ARCHITECTURE SPECIFIED |
| [PRD-010](PRD.md#prd-010-engineering-scope-control) | All; architecture planning | Relational research and evidence persistence | S; developer | Architecture review against scope classifications | ARCHITECTURE SPECIFIED |
| [PRD-011](PRD.md#prd-011-visual-and-architecture-prerequisites) | Stock, Ask, Explore; Context Help throughout | Presentation of canonical research | C presentation; S data | Five reference reviews and architecture handoff | DESIGN REFERENCE REQUIRED |
| [PRD-012](PRD.md#prd-012-success-and-definition-of-done) | All; release process | Entire versioned demonstration dataset | S + C; developer | Release evidence checklist and NFR verification | ARCHITECTURE SPECIFIED |

## EXP coverage

| Requirement owner | Experience / route | Conceptual dependency | Likely ownership | Verification method | Design status / prerequisite |
| --- | --- | --- | --- | --- | --- |
| [EXP-001](EXPLANATION_LEVELS.md#exp-001-same-research-across-levels) | All | Same entity/snapshot/horizon, values, sources | S + C | Cross-level and cross-width research comparison | DATA/METHOD SPECIFIED |
| [EXP-002](EXPLANATION_LEVELS.md#exp-002-meaning-first) | All | Reviewed meaning, concerns and terminology | S presentation; C disclosures | Beginner walkthrough and copy review | SPECIFIED |
| [EXP-003](EXPLANATION_LEVELS.md#exp-003-methodology-gated-assessments) | Home, Explore, Stock, Decision, IPO, Ask | Assessment methods/outputs, evidence quality | S | Method gate and calculation checks | DATA/METHOD SPECIFIED |
| [EXP-004](EXPLANATION_LEVELS.md#exp-004-evidence-and-missingness) | All financial routes | Evidence/source and explicit availability | S + C | Missing-data and source-original tests | DATA/METHOD SPECIFIED |
| [EXP-005](EXPLANATION_LEVELS.md#exp-005-component-presentation) | All | Component research/evidence view | S + C | Depth-matrix and dense responsive review | DESIGN REFERENCE REQUIRED |
| [EXP-006](EXPLANATION_LEVELS.md#exp-006-ask-editorial-guidance) | Ask | Supported answer and citation context | S generation; C presentation | Editorial review without caveat truncation | DATA/METHOD SPECIFIED |
| [EXP-007](EXPLANATION_LEVELS.md#exp-007-context-and-presentation-ownership) | All; focused Decision | Validated level and selected research | S parse; C select/history | Context/refresh/history and resize checks | SPECIFIED |

## INT coverage

| Requirement owner | Experience / route | Conceptual dependency | Likely ownership | Verification method | Design status / prerequisite |
| --- | --- | --- | --- | --- | --- |
| [INT-001](INTERACTION_CONTRACTS.md#int-001-no-dead-ui-and-release-scope) | All | Only supported destination/content dependencies | S + C | Visible-control inventory and exposure audit | SPECIFIED |
| [INT-002](INTERACTION_CONTRACTS.md#int-002-navigation-and-focus-profile-n) | All | Destination entity and relevant context | S routes; C focus | Keyboard/touch and heading-focus checks | SPECIFIED |
| [INT-003](INTERACTION_CONTRACTS.md#int-003-history-policy) | All | Validated addressable selection | S parse; C history | Push/replace/local and Back/Forward tests | SPECIFIED |
| [INT-004](INTERACTION_CONTRACTS.md#int-004-route-validation-and-profile-u) | All | Canonical identity and valid selection options | S validation; C controls | Direct-entry, refresh, invalid parameter and 404 tests | DATA/METHOD SPECIFIED |
| [INT-005](INTERACTION_CONTRACTS.md#int-005-local-disclosure-profile-l) | All disclosures | Available supported section content | S content; C local state | Expanded semantics and route-reset checks | SPECIFIED |
| [INT-006](INTERACTION_CONTRACTS.md#int-006-context-help-profile-h) | Context Help on financial routes | Reviewed concept/help content | S content; C focus | Desktop/mobile help, close and resize checks | DESIGN REFERENCE REQUIRED |
| [INT-007](INTERACTION_CONTRACTS.md#int-007-source-reader-profile-s) | Stock, IPO, Ask; citations throughout | Evidence/source, article, provenance | S reader data; C reader focus | Actual source/count and local failure tests | DATA/METHOD SPECIFIED |
| [INT-008](INTERACTION_CONTRACTS.md#int-008-search-profile-q) | Home, Explore, Stocks, IPOs, Ask | Company/IPO identity, aliases, scope, safe intent | S index/submitted matching; C local suggestions | All five searches, ambiguity and stale-response tests | DATA/METHOD SPECIFIED |
| [INT-009](INTERACTION_CONTRACTS.md#int-009-filter-profile-f-and-bounded-lists) | Explore; bounded directories | Membership, research categories, sector/status | S filtering; C draft/apply | Filter lifecycle, scope and no-result tests | DESIGN REFERENCE REQUIRED |
| [INT-010](INTERACTION_CONTRACTS.md#int-010-shared-shell-and-home) | Home; shared standard shell | Market, sector, company, changes, IPO | S content; C search/navigation | Home control inventory and route checks | DATA/METHOD SPECIFIED |
| [INT-011](INTERACTION_CONTRACTS.md#int-011-explore) | Explore | Themes, collections, sector, research, IPO | S selection; C filters | Discovery scopes, membership and handoff tests | DATA/METHOD SPECIFIED |
| [INT-012](INTERACTION_CONTRACTS.md#int-012-stock-and-six-view-contracts) | Stock: all six views | Company, prices, statements, article, peers, filings, snapshots | S research; C selection/help | Six-view acceptance, app Back, evidence and CTA checks | DATA/METHOD SPECIFIED |
| [INT-013](INTERACTION_CONTRACTS.md#int-013-decision-flow) | Decision | Same Stock snapshot, six-question content | S research; C step navigation | Six questions/summary, direct entry and resize tests | DATA/METHOD SPECIFIED |
| [INT-014](INTERACTION_CONTRACTS.md#int-014-ask-lifecycle) | Ask | Grounded context, evidence, session exchange | S AI; C local session | Four capabilities, pending/follow-up/retry and IME tests | DATA/METHOD SPECIFIED |
| [INT-015](INTERACTION_CONTRACTS.md#int-015-ipo-and-directory-contracts) | Stocks, IPOs, IPO | Company, offer, lifecycle, evidence | S data; C selection/help | Directory status/order, IPO terms and app Back tests | DATA/METHOD SPECIFIED |
| [INT-016](INTERACTION_CONTRACTS.md#int-016-share-profile-sh) | Stock, IPO | Safe route state only | C browser APIs; S valid destination | Native/cancel/clipboard/manual fallback tests | SPECIFIED |
| [INT-017](INTERACTION_CONTRACTS.md#int-017-reusable-states) | All | Availability, failure and requested context | S failure boundary; C feedback | State matrix with controlled failures | SPECIFIED |
| [INT-018](INTERACTION_CONTRACTS.md#int-018-release-exclusions-and-trust) | All financial routes | Simulated provenance, clock and sources | S content; C presentation | Exclusion/disclosure and no-impersonation review | DATA/METHOD SPECIFIED |

## NFR coverage

| Requirement owner | Experience / route | Conceptual dependency | Likely ownership | Verification method | Design status / prerequisite |
| --- | --- | --- | --- | --- | --- |
| [NFR-001](NON_FUNCTIONAL_REQUIREMENTS.md#nfr-001-responsive-operation) | All; Home/Stock/Ask measurements | Bounded research payload and AI context | S + C; deployment | Production measurements, pending interaction and bundle review | ARCHITECTURE SPECIFIED |
| [NFR-002](NON_FUNCTIONAL_REQUIREMENTS.md#nfr-002-keyboard-and-assistive-access) | All | Semantic controls, table/source content | C focus; S semantic output | Keyboard, screen-reader and automated accessibility checks | SPECIFIED |
| [NFR-003](NON_FUNCTIONAL_REQUIREMENTS.md#nfr-003-readability-and-reflow) | All; dense Stock/Ask and sheets | Same financial meaning at each width | S + C presentation | Widths, zoom, safe areas, contrast and keyboard-open review | DESIGN REFERENCE REQUIRED |
| [NFR-004](NON_FUNCTIONAL_REQUIREMENTS.md#nfr-004-server-trust-and-secret-handling) | All server boundaries | Validated identity/input; server credentials | S; C untrusted input | Secret, invalid-input and write-boundary tests | ARCHITECTURE SPECIFIED |
| [NFR-005](NON_FUNCTIONAL_REQUIREMENTS.md#nfr-005-safe-content-and-affordable-requests) | Ask, readers; public requests | Untrusted content, grounded references, resource policy | S validation; C safe rendering | Injection/markup/resource/timeout and dependency checks | ARCHITECTURE SPECIFIED |
| [NFR-006](NON_FUNCTIONAL_REQUIREMENTS.md#nfr-006-minimal-retention) | All; Ask session | Transient draft/conversation; operational metadata | C memory; S transient processing | Storage/log inspection and provider-retention review | ARCHITECTURE SPECIFIED |
| [NFR-007](NON_FUNCTIONAL_REQUIREMENTS.md#nfr-007-canonical-integrity) | All research consumers | Canonical values, relationships, calculations | S | Reconciliation, exact expected outputs and cross-screen checks | DATA/METHOD SPECIFIED |
| [NFR-008](NON_FUNCTIONAL_REQUIREMENTS.md#nfr-008-reproducible-time-and-history) | Home, Stock, Decision, IPO, Ask | Seed version, simulated clock, historical snapshots | S; developer | Repeat seed and cutoff/mismatch tests | DATA/METHOD SPECIFIED |
| [NFR-009](NON_FUNCTIONAL_REQUIREMENTS.md#nfr-009-honest-failure-and-recovery) | All; Ask and Share failures | Requested context and availability | S errors; C recovery | Injected database/network/AI/Share failures | SPECIFIED |
| [NFR-010](NON_FUNCTIONAL_REQUIREMENTS.md#nfr-010-repeatable-verification) | All; CI | Seed, stable IDs, methods, evaluation cases | S + C; developer | Unit/integration/browser tests and CI evidence | DATA/METHOD SPECIFIED |
| [NFR-011](NON_FUNCTIONAL_REQUIREMENTS.md#nfr-011-basic-diagnostics) | All server operations | Sanitized operation/version metadata | S; operator | Failure diagnosis and log-redaction review | ARCHITECTURE SPECIFIED |
| [NFR-012](NON_FUNCTIONAL_REQUIREMENTS.md#nfr-012-reproducible-low-cost-delivery) | All deployed routes; setup | Versioned data and environment configuration | S; developer/operator | Clean setup, build, migration/seed and deployed smoke checks | ARCHITECTURE SPECIFIED |
| [NFR-013](NON_FUNCTIONAL_REQUIREMENTS.md#nfr-013-maintainable-boundaries) | All; architecture | Typed canonical domain and narrow view models | S + C | Architecture/code and dependency review | ARCHITECTURE SPECIFIED |

## Coverage and handoff

Coverage: **12 PRD + 7 EXP + 18 INT + 13 NFR = 50 defined requirements**, each mapped once above. References elsewhere do not create new definitions. EXP/INT IDs and meanings remain unchanged. The six Stock views share the bounded INT-012 definition and are individually scoped in PRD-004; no invented extra EXP/INT IDs are needed.

The five required visual references remain outstanding for their specified frontend areas. The technical documents below now specify logical data, research methods, server boundaries and grounding validation. Actual fictional identities/calendar/content, physical schema implementation, hosting/provider selection and operational budgets remain outstanding. No row claims a populated dataset, executed methodology, implemented interface or permission to implement. PostgreSQL/Drizzle are recorded design recommendations; no cloud or AI vendor is selected.

## System design verification sources

These links supplement the original acceptance sources without copying physical entity names into product requirements. Each row names conceptual design coverage; all original requirement rows remain implementation-not-started.

| Requirements | Design source | Verification handoff |
| --- | --- | --- |
| PRD-001, PRD-009, INT-018, NFR-004, NFR-006 | [Server security](../architecture/BACKEND_ARCHITECTURE.md#security-observability-and-cost) | Public read-only boundary, disclosure, retention and secret checks. |
| PRD-002, PRD-003, NFR-007, NFR-008 | [Logical model](../data/DATA_MODEL.md) | Coverage, identity overlap, precision, cutoff and reconciliation tests. |
| PRD-004, PRD-005, PRD-011, PRD-012 | [First slice and dependencies](../architecture/BACKEND_ARCHITECTURE.md#first-vertical-slice) | Slice limitations, visual prerequisites and final-release evidence gate. |
| PRD-006, EXP-001, EXP-002, EXP-004, EXP-005, EXP-006, EXP-007 | [Research outputs](../research/RESEARCH_METHODOLOGY.md#common-calculation-contract), [server reads](../architecture/API_CONTRACT.md#server-rendered-use-cases) | Same result references across depth/width; accepted EXP matrix unchanged. |
| PRD-007, INT-014, NFR-005 | [Ask contract](../architecture/API_CONTRACT.md#post-apiask), [provider validation](../architecture/BACKEND_ARCHITECTURE.md#provider-and-validation-boundary) | Canonical retrieval, constrained claims, rejected references and failure handling. |
| PRD-008, EXP-003 | [Methodology](../research/RESEARCH_METHODOLOGY.md) | Exact formulas, categories, missingness and version tests. |
| PRD-010, NFR-013 | [Backend decisions](../architecture/BACKEND_ARCHITECTURE.md) | Modular monolith, database/query recommendation and excluded infrastructure. |
| INT-001, INT-002, INT-003, INT-004, INT-005, INT-006, INT-013, INT-016, NFR-002, NFR-003 | [Page/server boundary](../architecture/API_CONTRACT.md#server-rendered-use-cases) | Preserve Gate 2.5 navigation, focus, local state and no-dead-UI checks; missing boards remain prerequisites. |
| INT-007 | [Source reader](../architecture/API_CONTRACT.md#get-apisourcesevidenceid) | Actual source identity, cutoff eligibility and safe local reading. |
| INT-008, INT-009, INT-010, INT-011, INT-015 | [Suggestions](../architecture/API_CONTRACT.md#local-search-suggestions), [discovery calculations](../research/RESEARCH_METHODOLOGY.md#market-sector-and-discovery-calculations) | Same matching/filter categories, membership and current context on every route. |
| INT-012 | [Research and history](../data/DATA_MODEL.md#research-and-historical-outputs), [methods](../research/RESEARCH_METHODOLOGY.md) | Six-view inputs, same snapshot, chart, peer and evidence integrity. |
| INT-017, NFR-009 | [Error contract](../architecture/API_CONTRACT.md#shared-contract) | Transport failure distinct from supported missing/empty/partial results. |
| NFR-001, NFR-011 | [Cache/freshness](../architecture/BACKEND_ARCHITECTURE.md#cache-and-freshness), [resource policy](../architecture/API_CONTRACT.md#resource-and-security-policy) | Version pinning, sanitized diagnostics and later hosting measurements. |
| NFR-010, NFR-012 | [Method tests](../research/RESEARCH_METHODOLOGY.md#verification-before-implementation-completion), [publication transactions](../architecture/BACKEND_ARCHITECTURE.md#transactions-and-publication) | Reproducible setup, known outputs, rollback and immutable published versions. |
