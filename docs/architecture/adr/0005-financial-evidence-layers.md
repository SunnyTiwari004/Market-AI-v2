# ADR 0005: Separate financial evidence and interpretation layers

## Status

Accepted in part; scope assumptions superseded by [ADR 0006](0006-synthetic-financial-universe.md) on 2026-09-12. The four-layer separation remains accepted. Real-evidence migration assumptions and canonical Tata assessment fixtures are superseded by the permanent synthetic universe.

The body below records the historical 2026-09-04 decision, including its Tata/mock fixtures and real-evidence expectations. **[ADR 0006](0006-synthetic-financial-universe.md) and [SYNTHETIC_DATA_CONTRACT.md](../../data/SYNTHETIC_DATA_CONTRACT.md) own the current dataset strategy.** Historical statements below do not authorize those fixtures or plan future real-source ingestion. Links to the data contract resolve its active successor.

System Design Gate 1 (2026-09-16) specifies the retained separation through [the deterministic methodology](../../research/RESEARCH_METHODOLOGY.md) and [backend validation boundary](../BACKEND_ARCHITECTURE.md#provider-and-validation-boundary). These are design specifications, not executed research or AI completion. The historical body below remains superseded where already noted.

## Date

2026-09-04

## Context

A reported fact, a deterministic ratio, a modeled outcome, and an explanation have different evidentiary meaning. Mixing them makes it easy to imply a forecast is observed, a fixture is calculated, or generated language has verified a claim. MARKET AI must retain traceability as real evidence and AI are introduced in separately approved future work.

## Decision

Maintain four conceptually distinct layers:

| Layer | Required meaning |
| --- | --- |
| Observed data | Supplied facts with source/provenance, units, period, and availability. |
| Deterministic calculations | Results with compatible input references, approved method/version, units, and missing-input behavior. |
| Modeled scenarios | Assumptions, baseline, explicit scenario horizon, modeled outcomes, and limitations. |
| AI interpretation | Explanations referencing structured research, without inventing facts, sources, or scores. |

Mock origin is independent of layer. A mock record representing an observation remains mock; it does not become a real observation. The approved Tata Research Picture and comparison values are assessment fixtures whose methodology is not implemented. Do not misclassify them as executed calculations or AI-produced research.

Keep research context, scenario horizon, and comparison period explicit. A Long-term 3–5 year research context may contain a 30-day scenario. Model outcomes are possibilities, not guarantees or unsupported probabilities.

Future factual claims must connect to supporting evidence. Calculations and scenarios must retain their inputs/assumptions; interpretation must preserve the distinction between support and uncertainty. No real financial API, calculation engine, model service, or AI integration is authorized by this decision.

## Alternatives considered

- One undifferentiated research/answer object: rejected because it hides provenance and the difference between facts and explanations.
- Treating every displayed number as observed data: rejected because fixtures, calculations, and modeled outputs have different origins.
- Allowing AI prose to generate or revise scores: rejected because it severs the link between research methods and conclusions.
- Separate deployed services for each layer now: deferred because conceptual/type boundaries are sufficient for the approved mock frontend.

## Consequences

Components can present meaning first while preserving the route back to underlying evidence and assumptions. Confidence, source counts, score scales, and outcome probabilities cannot be substituted for one another. No unsupported precision is introduced merely to complete a visual design.

Static demo answer copy can demonstrate interpretation presentation while remaining explicitly mock. It does not imply that a model was called. Missing inputs and sources remain visible under the [synthetic data contract](../../data/SYNTHETIC_DATA_CONTRACT.md).

## Risks

Prose can overstate evidence, source chips can imply verification, and scenario graphics can imply probabilities or continuous coverage that the model does not supply. Maintain explicit layer/provenance metadata and validate copy and graphics against their actual supporting records.

## Revisit conditions

Revisit the detailed contracts when approved calculation methods, real source ingestion, scenario methodology, or AI explanations are introduced. Preserve the conceptual separation even if storage or execution mechanisms change. Any score method requires explicit inputs and methodology approval before a fixture is described as calculated research.
