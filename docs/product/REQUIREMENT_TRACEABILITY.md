# MARKET AI requirement traceability

Product Baseline Gate: 2026-09-15. System Design Gate 1 mapping: 2026-09-16. This map links requirements to conceptual dependencies, likely ownership and intended verification. The original map does not duplicate their definitions or design a schema/API; dated implementation evidence is recorded separately below. Requirement IDs have one definition in their linked owner documents.

## Reading the map

Route aliases: Home = `/`; Explore = `/explore`; Stocks = `/stocks`; Stock = `/stocks/[symbol]`; Decision = `/stocks/[symbol]/decision`; IPOs = `/ipos`; IPO = `/ipos/[slug]`; Ask = `/ask`. **All** means all eight route patterns, including applicable shared controls. Data dependencies name concepts, not database tables, columns or API endpoints.

**S** means likely server ownership for canonical selection, validation, calculations, retrieval and initial rendering; **C** means client/browser interaction or local state. Split ownership does not imply a Client Component page. Developer/operator entries describe future setup/verification work, not public editing or account roles. The linked System Design Gate 1 documents now specify these boundaries; full-release implementation remains outstanding; the partial slice is recorded below.

Every row is **SPECIFIED**. The tables retain their baseline design/prerequisite statuses; the dated implementation evidence below overrides the original **IMPLEMENTATION NOT STARTED** state only for the explicitly listed partial scopes. No entire Release-1 requirement is complete. The final column records specification progress or a remaining prerequisite; it is not an implementation pass. **DATA/METHOD SPECIFIED** means the logical model/method is documented, not that records or calculations exist. **ARCHITECTURE SPECIFIED** means the server boundary is documented, not that hosting/provider configuration or code exists. Actual dataset content and operational budgets remain outstanding. **DESIGN REFERENCE REQUIRED** identifies relevant missing presentation evidence. Multiple prerequisites can apply: the [visual dependency map](PRD.md#prd-011-visual-and-architecture-prerequisites) applies to every affected row, not just those displaying that status.

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

The five required visual references remain outstanding for their specified frontend areas. The technical documents below now specify logical data, research methods, server boundaries and grounding validation. Fictional identities/calendar and evidence-content slots are now specified in the Synthetic Universe Design Gate below. Numerical records, actual source bodies, physical schema implementation, hosting/provider selection and operational budgets remain outstanding. At that gate no row claimed a populated dataset, executed methodology or implemented interface. PostgreSQL/Drizzle were recorded design recommendations; no cloud or AI vendor is selected.

## System design verification sources

These links supplement the original acceptance sources without copying physical entity names into product requirements. Each row names conceptual design coverage; the original design mapping is preserved, with partial implementation evidence recorded below.

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

## Synthetic universe verification sources

Synthetic Universe Design Gate, 2026-09-17: these resolve identity, calendar, content-inventory and seed-policy dependencies only. All 50 original requirement definitions and statuses remain valid; implementation was still IMPLEMENTATION NOT STARTED at that gate. Its mapping did not claim generated records or passing implementation tests.

| Requirements | New specification | Verification handoff |
| --- | --- | --- |
| PRD-001, PRD-002, PRD-003, NFR-007, NFR-008, INT-018 | [Universe and fixed timeline](../data/SYNTHETIC_UNIVERSE.md) | Exact issuer/listing/offer overlap, common calendars, eligible evidence and reproducible simulated clock. |
| PRD-004, PRD-007, INT-006, INT-007, INT-008, INT-010, INT-011, INT-012, INT-014, INT-015 | [Evidence corpus](../data/SYNTHETIC_UNIVERSE.md#evidence-corpus-inventory), [discovery membership](../data/SYNTHETIC_UNIVERSE.md#themes-and-collections), [concepts](../data/SYNTHETIC_UNIVERSE.md#six-concept-records-and-ask-grounding) | Bounded source coverage and identity routing for required views and four Ask capabilities; no actual source bodies or AI calls yet. |
| PRD-008, EXP-001, EXP-003, EXP-004, INT-013, NFR-010 | [Scenario assumptions](../data/SEED_BLUEPRINT.md#scenario-assumption-blueprint), [historical stories](../data/SYNTHETIC_UNIVERSE.md#what-changed-storylines-and-continuity) | Same future calculation authority across depth/horizon; input intentions never substitute for executed classifications. |
| PRD-005, PRD-011, PRD-012, NFR-012 | [Publication validation](../data/SEED_BLUEPRINT.md#publication-blocking-validation-contract), [first slice](../data/SEED_BLUEPRINT.md#smallest-future-implementation-slice) | Distinguish blocking integrity/full-release obligations from nonblocking category diversity and explicitly partial development slices; visual prerequisites unchanged. |

## Implementation Milestone 1 evidence — 2026-09-18

**PARTIAL RELEASE-1 IMPLEMENTATION; CORE SLICE LIVE DATABASE VERIFICATION PASSED.** The authorized Digital Operations Services development slice covers three companies, not the final Release-1 universe. Dataset `market-ai-core-slice-v1`, methodology `research-method-v1`; cutoffs 2026-08-01, 2026-08-31 and 2026-09-30. Evidence applies to Windows/Node 24 local verification, not deployment or release certification. See [setup and limitations](../../README.md#core-data-slice-setup).

| Requirements | Implemented partial scope | Verification and remaining work |
| --- | --- | --- |
| PRD-002, PRD-003, NFR-007, NFR-008 | Deterministic three-company financial/history/evidence builder and 27 snapshot outputs | [Research tests](../../tests/research.test.ts) and offline seed validation cover reconciliation, chronology, provenance and reproducibility. PostgreSQL insertion and persisted validation now pass for this slice; final-universe coverage remains outstanding. |
| PRD-005, PRD-008, EXP-003, NFR-013 | Pure Decimal methodology, versioned assumptions, horizon-specific research and compatible What Changed | Independent formula/boundary tests and typed module separation. No claim that every route or research domain is implemented. |
| PRD-001, EXP-002, EXP-004, INT-007, INT-012, INT-018 | Simple Stock Overview, source bodies, scenario disclosure and simulated-data labels | Route compiles; service/render tests exercise the bounded view. Live populated route verification now passes for all three companies; other Stock views and explanation levels remain outstanding. |
| INT-001, INT-003, INT-004, INT-005, INT-017, NFR-009 | Working GET cutoff/horizon selection, local disclosures and controlled missing/failure paths | [Overview tests](../../tests/overview.test.ts) cover input validation and failure handling. No unfinished navigation/CTA is exposed. Full cross-route browser acceptance remains outstanding. |
| PRD-009, NFR-004, NFR-006, NFR-011 | Server-only database access; no authentication, persistent user data or raw driver-error logging | Static boundary inspection and sanitized service-error test. Operational deployment/role verification remains outstanding. |
| NFR-002, NFR-003 | Semantic Overview controls, native modal, visible focus, readable responsive layouts | Isolated populated test fixture checked at 320px and desktop: no page/dialog overflow, 44px controls, source-dialog Escape and focus return. Full assistive-technology and broader browser acceptance remain outstanding. |
| NFR-010, NFR-012 | Test runner, generated migration, seed scripts, documented environment/setup and production compilation | Offline automated suite/lint and Webpack build verified. Default Turbopack also passed the completion audit; the earlier host restriction is not currently reproducible. PostgreSQL integration now passes; CI, clean-host reproduction and deployment remain outstanding. |

All other implementation scopes remain **IMPLEMENTATION NOT STARTED**. No grounded AI, full dataset, final-release completion or approval of the five missing visual references is implied. Original requirement definitions and the 50-ID inventory remain unchanged.

Completion audit, 2026-09-18: 87 offline tests and lint pass, including direct peer-deduplication, previous-session, content-digest and contextual-status checks. No database URL, PostgreSQL service/installation, psql or Docker installation was found. Live database checks and commit/landing remain blocked; no additional requirement is marked complete.

Live completion verification, 2026-09-19: isolated local PostgreSQL 18.6; generated migration, persisted-data reconciliation, exact canonical valuation comparison, all 27 repository contexts, all-table seed replay, three populated routes and live source dialogs passed. Controlled failure used a separate app process with an unavailable local connection; actual database access was preserved. 88 unit/component and 2 explicit PostgreSQL integration tests pass. Lint and both production compilers pass. Earlier blocked entries are historical and superseded for this slice only; no full Release-1 requirement is marked complete.

## Implementation Milestone 2 evidence — 2026-09-20

Full-universe data/storage implementation is live-validated under `market-ai-synthetic-v1`; the milestone verification gate is **PASS** under the authorized Release-1 Webpack build policy. The final unchanged Turbopack attempt reproduced the host-specific Windows CSS-worker process-launch denial (error 5); this diagnostic is non-blocking. [The milestone report](../data/MILESTONE_2_REPORT.md) records exact inventories, regression fingerprints, transition policy, coverage and limitations.

PRD-002/003 and NFR-007/008 now have verified 15-issuer/12-listing/four-offer data, 165 statement periods, complete 5,842-close history, full evidence/concept corpus, 108 Stock snapshots, 36 Stock scenario sets, four IPO evaluations/scenario sets, events and discovery memberships. Broad/sector indexes derive from the persisted price universe with tested new-listing entry. PRD-008/EXP-003 retain the unchanged methodology; original three-company results match pre-change fingerprints. INT-012's existing generic Simple Overview resolves all 12 listings with actual sector identity. IPO-only Stock contexts remain not-found. These advances do not complete the corresponding full-release features.

NFR-010/012 verification: 98 unit/component tests and four explicit PostgreSQL integration tests pass, including complete-table seed replay and Meruvan continuity. Lint and canonical `pnpm build` (Next.js Webpack) pass; all twelve production Stock pages pass HTTP checks. The dataset digest remains unchanged. No dependencies, framework versions or Windows security controls changed during build-policy finalization. No full Release-1 completion, new UI journey, AI integration or deployment is claimed.

## Implementation Milestone 3 evidence — 2026-09-23

**Stock six-view implementation verified locally; partial Release 1.** [Milestone report](../qa/MILESTONE_3_REPORT.md) records the unchanged dataset digest, scope, checks and limitations. PRD-004/INT-012 now cover Overview, Financials, Chart, News, Peers and Filings for all 12 listings (72 production routes). EXP explanation-level coverage uses shared facts in Simple/Normal/Pro; existing horizon methodology and Overview research outcomes remain unchanged. INT-007 source bodies and INT navigation/state/share behavior have working local interactions. Financials uses actual annual/quarterly statements; Chart uses stored closes; Peers enforces compatible canonical sector research; News/Filings read actual local content.

NFR-002/003 evidence includes all six views at 320/360/390/412/430/768/1024/1440px, contained financial-table scrolling, keyboard chart inspection, and reader focus/Escape/return. The user accepted reduced-width reflow checks in place of native 200% zoom, which remains untested; physical touch and full screen-reader certification remain outside the verified environment. Per user clarification, unfinished primary destinations remain hidden instead of exposing dead mobile navigation.

NFR-007/008/009/010/012: 113 unit/component and six PostgreSQL integration tests pass, unchanged live dataset validation passes, all 72 production view routes pass, and lint/canonical Webpack build pass. Separate unavailable-database checks retain honest recovery without substituted data. No dependencies, migrations, dataset/methodology changes or deployment. Remaining Release-1 journeys and operational certification remain outstanding; original requirement definitions are unchanged.

## Implementation Milestone 4 evidence — 2026-09-27

Home, Explore, Stocks directory and IPO directory now consume the existing PostgreSQL universe. PRD-001/002/004/008, EXP-001/002/004 and INT-001/008/014/018 have local discovery evidence: all 12 listings, four offers, four sectors, two themes and two collections; shared stored research snapshots; sourced context; deterministic identity matching; and only four working primary destinations. IPO detail and Ask handoffs remain deferred under No Dead UI. This is partial Release 1.

INT-002/003/004 and the Explore filter contracts are covered by URL validation, push/replace history, draft-only modal edits and Reset, Apply, Escape/close cancellation, native modal inertness, keyboard wrapping and focus restoration. Research Picture defaults to Any. Company filters apply only to Stocks. Tests cover repository/read models, lifecycle dates, no-results, empty data and sanitized database errors. See [Milestone 4 report](../qa/MILESTONE_4_REPORT.md) for precise verified scope and limitations.

NFR-002/003/007/008/009/010/012: 124 unit/component tests and eight PostgreSQL integration tests; unchanged live digest; discovery route variants and 72 Stock views; lint and canonical Webpack build. Browser reflow checks cover 320/360/390/412/430/768/1024/1440px and 720px equivalent reduced-width reflow. Native 200% zoom, physical touch and full assistive-technology certification are not claimed. No dependency, migration, dataset/methodology change or deployment.
