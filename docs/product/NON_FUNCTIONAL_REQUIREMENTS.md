# MARKET AI non-functional requirements

Product Baseline Gate: 2026-09-15. These requirements define the quality bar for the [Release-1 PRD](PRD.md), not present implementation claims or permission to build. Each requirement is specified; implementation and verification remain outstanding. Existing [design](../design/DESIGN_SYSTEM.md), [responsive](../design/RESPONSIVE_RULES.md), [interaction](INTERACTION_CONTRACTS.md) and [data](../data/SYNTHETIC_DATA_CONTRACT.md) contracts retain their detailed authority. Record actual evidence and limitations in [traceability](REQUIREMENT_TRACEABILITY.md).

## Performance and accessibility

### NFR-001 Responsive operation

Render initial research server-first with narrow client interactions; do not ship the entire synthetic corpus to every page or call AI on each keystroke. Slow research/AI work must not prevent typing, local help dismissal or navigation. Pending requests have visible affected-region feedback and duplicate-submit prevention under INT-017. Rapid query changes cannot render stale results as current.

Before release, measure cold and warm page loads, route transitions, search/filter response and submitted AI response separately on the chosen low-cost hosting configuration, documenting device, network, dataset, cache state and any host wake-up behavior. Inspect representative Home, dense Stock and Ask journeys. Set and record numeric page/interaction budgets during the next architecture milestone once that environment is known; repeat measurements against those budgets before release. A meaningful research shell and recovery must not wait on AI. No latency/SLA achievement is claimed now, and an indefinite spinner is not acceptable. This gate deliberately does not invent an environment-independent latency promise.

Verification: production measurements against the agreed budgets, delayed-response interaction checks and bundle/network inspection. Budget selection is outstanding, not waived by a passing documentation gate.

### NFR-002 Keyboard and assistive access

Every visible control must be keyboard-operable, meaningfully named and visibly focused. Verify semantic landmarks/headings, form labels, reading order, table relationships, result/error announcements and no hidden responsive focus targets or duplicate IDs. Chart values require keyboard access and a table alternative. Desktop nonmodal help and mobile modal help/readers follow their different INT-006/INT-007 focus contracts; Decision remains a page, without modal trapping. Respect reduced motion and never rely solely on color for meaning.

Verification: keyboard-only primary journeys plus screen-reader spot checks for all shared control families, source reading, charts, errors and Ask. Automated accessibility checks supplement manual checks; do not claim full WCAG certification from a scanner result.

### NFR-003 Readability and reflow

Verify 320px effective width, 200% zoom, 360/390/412/430/768/1024+ widths, a wide desktop and both sides of actual layout transitions. No page-wide horizontal scrolling or global overflow hiding; genuinely two-dimensional tables and approved rails may scroll in labeled bounded regions. Important touch targets should generally be at least approximately 44px; any exception needs a documented usable alternative. Preserve safe areas, sticky clearance and reachable search/Ask controls with the on-screen keyboard open.

Apply the existing contrast thresholds: 4.5:1 normal text, 3:1 qualifying large text and meaningful control/graphic boundaries. Important financial text/actions generally remain at least 14px; 12px is supporting metadata, not essential meaning. Long labels must wrap without clipping. Verification: responsive/manual focus and contrast review using the [frontend acceptance checks](../qa/FRONTEND_ACCEPTANCE.md#responsive-and-visual-behavior), including dense Pro content. Missing boards must be completed before the relevant frontend presentation work.

## Security and privacy

### NFR-004 Server trust and secret handling

Keep database/AI/deployment credentials server-side in environment configuration, never committed, serialized to client props or bundled into client code. Validate URL, search, filter, entity and submitted AI input at server boundaries, including unsupported/repeated parameters and resource limits defined during architecture. Public users cannot write canonical financial data. Use deployment-controlled credentials with only the permissions each operation needs; lack of user accounts is not permission for anonymous dataset mutation.

Verification: tracked-file and client-output secret checks, invalid/adversarial input tests and public write-boundary tests. No sensitive personal financial information is necessary or solicited by the product.

### NFR-005 Safe content and affordable requests

Render question text, generated answers and source content without executable markup or unsafe links; avoid arbitrary HTML execution. Treat retrieved source text and user prompts as untrusted content, not instructions to override the research boundary. Do not allow arbitrary URL retrieval or canonical writes through Ask. Validate references and financial claims against retrieved context before presenting them as supported.

Before public deployment, define enforced input/context/output bounds, request timeouts and anonymous abuse/cost controls appropriate to the selected AI/hosting environment. Reject over-limit input with an actionable message; preserve Unicode and never silently truncate. No exact input/token/pricing limit is established in this pass. Review dependency/security advisories during implementation, preserve the lockfile and justify added packages; resolve exploitable release-impacting issues before publishing.

Verification: injection/unsafe-markup/link cases, unsupported citations, repeated submissions, timeout/resource-limit cases and dependency review. No new service or dependency is mandated solely to implement these controls.

### NFR-006 Minimal retention

No accounts, profiles, payments, broker credentials, financial-account data or portfolio uploads. Keep Ask draft/conversation in current session memory only; no application database history, persistent browser conversation storage, Recent Questions panel or prompt analytics. Refresh restores safe URL context, not an earlier answer. Search/filter selections follow existing URL contracts; arbitrary Ask text never goes in URLs.

Server processing of a submitted question is transient. Before AI integration, document any provider/platform prompt processing, logging and retention, and choose/configure a policy compatible with this boundary; do not claim third parties retain nothing without evidence. Standard hosting access logs may contain IP/path/query metadata: minimize/redact where possible, document actual retention/access and avoid application-level identifiers or raw query logging. No analytics platform is required. Do not promise complete anonymity merely because no account exists.

Verification: inspect browser storage, server persistence and logs after primary journeys and refresh. Confirm actual provider/platform settings before deployment. If they cannot satisfy the chosen privacy policy, resolve that architecture constraint before integrating.

## Integrity and resilience

### NFR-007 Canonical integrity

Enforce conceptual identity uniqueness, valid relationships and transactional consistency where related records must change together; exact database constraints await schema design. Canonical input values have declared units, precision, period, currency, reporting basis and availability. Derived outputs reproduce approved methods over unrounded compatible inputs; stored results retain their input/method versions. Missing is never zero, empty or unchanged by substitution.

Verification: dataset-wide identity/reference, financial-statement and IPO reconciliation checks; independently reviewed calculation expectations including invalid denominators, mixed units/periods and missing inputs; compare rendered/AI values with the same canonical outputs. No screen-specific financial copies may diverge.

### NFR-008 Reproducible time and history

The same seed, generator version and simulated clock must reproduce identities, relationships, inputs and chronology. Historical research uses only evidence available at its cutoff; preserve prior snapshot versions. What Changed compares compatible same-entity/horizon snapshots under defined method/basis rules. Market and IPO status use simulated time, separately from actual generation metadata.

Verification: two clean seed runs produce equivalent canonical content; history/cutoff and method-mismatch cases pass; all levels/routes resolve the intended same current snapshot. Do not use uncontrolled randomness or wall-clock dates for financial truth.

### NFR-009 Honest failure and recovery

Database/API/network failures must be distinguishable from empty data or zero search results. Preserve drafts and requested context; mark retained results as stale/updating when appropriate. Apply the localized or route-level feedback/retry contracts of [INT-017](INTERACTION_CONTRACTS.md#int-017-reusable-states). A failed database operation cannot silently substitute another entity or unrelated snapshot.

AI unavailability produces an honest failure/retry or supported-scope limitation, never an invented successful answer or a static answer presented as generated. A failure of AI must not make already supported research and evidence inaccessible. Share cancellation is neutral; clipboard failure has manual recovery.

Verification: inject database, request, offline, AI and Share failures into relevant journeys, including retry and stale-response ordering. No enterprise uptime SLA, multiregion failover or enterprise RTO/RPO is required.

## Engineering and operations

### NFR-010 Repeatable verification

Use stable canonical IDs and deterministic expected outputs for research calculation, reconciliation, search/filter, route validation and snapshot tests. Test boundary/failure behavior rather than mirroring implementation. Grounded-AI evaluation compares factual claims, source support and level consistency, not verbatim wording or unsupported accuracy percentages. Record seed/method versions with results.

Verification: unit checks for deterministic logic, integration checks for data/server boundaries, and browser checks for primary journeys and failure states. CI must run lint, type checks, relevant tests and a production build before release; keep manual accessibility and comprehension evidence alongside automated results. Do not treat this documentation pass's omitted build as a later release waiver.

### NFR-011 Basic diagnostics

Provide enough server-side diagnostics to distinguish validation, database, calculation, retrieval and AI failures: operation category, correlation reference, duration and sanitized error context where useful. Record dataset/method versions for reproducibility. Do not log secrets, raw Ask conversations or unnecessary user identifiers. User-visible failures remain understandable and do not expose stack traces or credentials.

Verification: deliberately trigger each major failure class, locate a useful sanitized diagnostic and confirm user-facing recovery. Document log access and actual retention at deployment. No enterprise monitoring stack or analytics platform is required.

### NFR-012 Reproducible low-cost delivery

Preserve the verified framework/package-manager foundation and lockfile. Before release, document clean installation, environment-variable names/purposes without secrets, production build/start, database migration and deterministic seeding, validation and deployment verification. Distinguish developer-only data setup from public request operations. Schema/migrations and hosting selection belong to separately authorized work.

Use a free/low-cost hosting approach that supports the required server/database/AI behavior; document real costs/quotas and cold-start limitations after selection, without promising free AI. Record a practical recovery procedure for a failed deployment or dataset setup; no elaborate disaster-recovery stack. Verify a clean setup and deployed primary journeys using the documented process. Final deployment requires explicit authorization.

### NFR-013 Maintainable boundaries

Keep strict TypeScript, shared responsive components, centralized tokens and typed canonical research. Separate data access, deterministic methods, presentation transformations and AI interpretation. Follow server-first rendering and narrow client boundaries in the accepted [frontend architecture](../architecture/FRONTEND_ARCHITECTURE.md). Avoid duplicated desktop/mobile business logic, heavy global state and speculative infrastructure.

Verification: architecture/code review against the PRD engineering classification and accepted ADRs, plus cross-route consistency checks. Document demonstrated reasons for any dependency or architecture change; do not change the verified dependency versions merely to follow an older example.
