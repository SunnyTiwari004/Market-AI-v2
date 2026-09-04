# ADR 0002: Server Components by default with narrow client boundaries

## Status

Accepted

## Date

2026-09-04

## Context

Most MARKET AI content is research prose, financial displays, comparisons, and source relationships. Interaction is concentrated in controls, search, help, and focused flows. Making every page a Client Component would ship unnecessary JavaScript and encourage independent browser-held financial state.

## Decision

Use Server Components by default for pages, shell composition, data selection, view-model construction, and research displays. Add narrow Client Component boundaries for state, event handlers, browser APIs, and focus management that actually require them.

Resolve the installed Next.js version's asynchronous route `params` and page `searchParams` at the page boundary. Pass validated level, horizon, and active-section context explicitly; shared layouts must not assume fresh query state on navigation. Follow the bundled guides identified in [FRONTEND_ARCHITECTURE.md](../FRONTEND_ARCHITECTURE.md#app-router-and-rendering-boundaries).

Keep client imports small and props limited to required serializable data. Compose server-rendered content through props/children when appropriate. Prefer native links, forms, and disclosures where they meet the interaction need. No server data service, API route, AI integration, or authentication is implied by server rendering.

## Alternatives considered

- Entirely client-rendered feature pages: rejected because they broaden bundles and duplicate data/state ownership.
- Browser-only rendering for responsive behavior: rejected because initial output must be consistent and CSS can express layout.
- Strictly server-only interaction: rejected where search suggestions, modal help focus, or transient drafts need client behavior.

## Consequences

Initial research is rendered from coherent centralized data with less client JavaScript. URL-driven research controls may trigger server navigation and request-time rendering. Client context does not directly change Server Component research output; addressable changes use the route-state boundary.

Page composition remains thin, and business/data transformation logic stays outside presentation. Future credentials must remain server-side and must never be serialized into client props; no credentials are introduced now.

## Risks

A client import can unintentionally pull a large subtree or fixture catalog into the bundle. Stale layout query assumptions can desynchronize explanations. Excessive boundary fragmentation can add complexity. Mitigate with meaningful component responsibilities, explicit page-derived props, and limited serialization.

## Revisit conditions

Revisit a boundary when an approved interaction demonstrates a need for more local state or when measured rendering/bundle behavior warrants adjustment. Offline-first operation, static-export requirements, real-time collaboration, or streaming would require separate architecture review; do not prebuild them.
