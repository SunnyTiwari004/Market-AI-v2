# ADR 0003: Centralized typed research domain and mock data

## Status

Accepted

## Date

2026-09-04

## Context

The same company, quote, research assessment, and source relationships appear across Home, Explore, Stock, Decision, and Ask AI. The visual references contain conflicting financial values. Page-local literals would preserve those contradictions and make later evidence integration unreliable.

## Decision

Centralize typed entities, listings, quotes, research snapshots, claims, sources, scenarios, explanation copy, and mock provenance. Use the approved [mock data contract](../../data/MOCK_DATA_CONTRACT.md) as the authority for supplied values and unavailable fields. Financial literals belong in centralized fixtures, not components or separately maintained answer prose.

Small selectors resolve records and references; small view-model transformations shape approved data for presentation. Keep domain meaning separate from JSX and styling. Use explicit units, identities, and availability. Do not create an elaborate service/repository abstraction or every possible future type before a consumer exists.

All current Tata Motors displays resolve the same current quote/research references; What Changed resolves the same approved previous/current snapshot pair. Current-market Home and Ask AI resolve the same market-day fixture. Separate example scenarios carry distinct identity/context. Explanation levels share underlying conclusions.

Mock provenance belongs in the model. One persistent application-level prototype indication covers financial views, including focused routes, while source details expose their actual provenance and availability. Do not multiply loud component badges or imply real verification.

## Alternatives considered

- Financial literals and copy inside each page: rejected because they create contradictory research states.
- One untyped global JSON object: rejected because it obscures units, identities, availability, and evidence relationships.
- Per-page copies of typed fixtures: rejected because typing alone does not prevent cross-screen drift.
- A backend-shaped data service and comprehensive future schema: deferred because the approved frontend only needs small local selectors and the types its implemented consumers use.

## Consequences

Consistency can be verified through shared references instead of comparing independent hardcoded screens. Fixtures remain explicitly fictional, and missing fields remain unavailable. Source counts derive from actual distinct referenced records; an absent catalog cannot become an invented count.

The supplied Research Picture is an approved assessment fixture, not evidence of an implemented score method. No additional exact historical or IPO values are authorized by this structure.

## Risks

Overgeneralization can create a large financial object with unrelated optional fields. Embedded numbers in prose can silently reintroduce duplicate fixtures. Partial historical snapshots can be mistaken for complete historical records. Mitigate with focused typed concepts, shared interpolation, and explicit per-field availability.

## Revisit conditions

Revisit when approved real evidence sources, multiple listings, measured data scale, or new research methods require broader identity, storage, or validation contracts. Any replacement must preserve claim/source traceability, temporal context, units, and cross-screen consistency.
