# ADR 0006: Synthetic fictional financial universe with real application logic

## Status

Accepted. Partially supersedes [ADR 0003](0003-centralized-research-domain-model.md) and [ADR 0005](0005-financial-evidence-layers.md) as specified below. [ADR 0004](0004-prototype-state-strategy.md) remains accepted.

## Date

2026-09-12

## Context

The earlier frontend baseline used real-company mock assessments and anticipated later real financial evidence. The user has permanently reset MARKET AI to a college / portfolio project. Commercial financial-data licensing and misleading research about real companies would add unsuitable cost, scope, and trust problems.

## Decision

MARKET AI's financial universe is synthetic and fictional, while application architecture and behavior are real. This is the intended dataset strategy, not a temporary step toward licensed market feeds.

The intended application includes real frontend, backend, database, APIs, routing, search/filtering, calculations, research engine, historical snapshots, What Changed comparisons, eventual AI retrieval/grounding, accessibility, testing, CI/CD, and deployment. Implement these only through explicitly authorized milestones; this decision authorizes documentation changes only.

Use fictional companies and one canonical synthetic dataset. Real-company Stitch references are visual/product-structure examples only. A later data-design milestone defines fictional identities and mapping; this decision approves no financial rows, mass UI renames, schemas, or methodologies.

Use **College Project · Simulated financial data** as the canonical disclosure. Financial content is educational/demonstration material, not live exchange information or investment advice. Placement was deferred at this decision date; the accepted Gate 2.5 [interaction trust contract](../../product/INTERACTION_CONTRACTS.md#int-018-release-exclusions-and-trust) now specifies it without large repeated disclaimers. Prohibit real-publisher/exchange/regulator/company-filing impersonation and invented URLs to real financial publishers or exchanges.

Synthetic inputs must feed real, defined calculations when implemented. Reuse canonical inputs and derived outputs across routes and prose. The [synthetic data contract](../../data/SYNTHETIC_DATA_CONTRACT.md) governs stable identity, precision, simulated time, evidence, snapshots, scenarios, availability, and reproducibility.

## Relationship to earlier decisions

- ADR 0001 and ADR 0002 remain accepted: one responsive Next.js application, server-first rendering, narrow client boundaries.
- ADR 0003 retains centralized typed domain ownership, selectors, domain/presentation separation, and cross-screen consistency. Its canonical Tata assessments, temporary prototype disclosure, and eventual real-evidence transition are superseded. Its local-data implementation boundary was phase-specific; real database/backend work is now intended when explicitly authorized.
- ADR 0004 remains accepted: URL research state, local drafts, server-derived financial state, and the distinction from unresolved authenticated preference persistence still apply. “Prototype” describes that initial state strategy, not a permanent frontend-only project scope.
- ADR 0005 retains the four evidence/interpretation layers and traceability. Its anticipated real-evidence migration and approved Tata assessment fixtures are superseded. Input observations now represent synthetic observations; genuine calculations and eventual grounded AI operate on those synthetic records.
- Historical ADR bodies remain as decision history, with explicit status notes linking here. They cannot authorize obsolete fixtures, disclosures, or market-data integrations.

## Alternatives considered

- Commercial or licensed real-market feeds: rejected for this college scope because of cost, licensing dependencies, and integration demands.
- Invented assessments attached to real companies: rejected because they can mislead users about real-company research.
- Independent hardcoded screen fixtures: rejected because they undermine consistency and fail to exercise real data/calculation behavior.
- Frontend-only static demonstration: rejected as the final scope because the project is intended to exercise full-stack, data, and AI engineering.

## Consequences

The project avoids commercial financial-data licensing dependencies, prevents misleading real-company assessments, supports deterministic/reproducible demonstrations, and keeps scope and cost appropriate for a student. It still exercises real full-stack, data, and AI engineering as those capabilities are implemented.

No backend/database/AI completion is implied. Data design and methodology remain future work. Previously supplied design values and source counts are no longer canonical; unavailable content stays unavailable.

## Risks

The application is not suitable for real investment decisions. A successful synthetic demonstration is not evidence of commercial market-feed ingestion or live normalization capability. Realism depends on dataset quality and internal coherence. Reproducible inputs, traceability, and consistency validation are essential to credible demonstrations.

## Revisit conditions

Reconsider the synthetic-universe decision only if the user explicitly changes scope from a college simulation to a real financial-data product. New implementation milestones within the simulation do not authorize commercial market-data integration.
