# ADR 0004: URL research state, local interaction, server-derived financial state

## Status

Accepted

## Date

2026-09-04

## Context

Research choices should survive refresh, sharing, and browser navigation. Draft text, filter edits, and help visibility are temporary interactions. Quotes and research conclusions are data, not user-editable UI state. A browser-only explanation preference would not independently control Server Component rendering.

## Decision

Use URL state for addressable prototype choices: entity routes, explanation level, research horizon, approved applied filters/search, approved stock view, decision question/summary step, and safe demo-answer identifiers where useful.

Use exactly Simple, Normal, Pro, default Simple. Use exactly SHORT (Short term, Next 30 days), MEDIUM (Medium term, Next 12 months), and LONG (Long term, 3–5 years), default LONG. Research Horizon is independent of Scenario Horizon and What Changed comparison periods.

Parse and validate URL state at the page boundary through a shared small helper. The [frontend architecture state table](../FRONTEND_ARCHITECTURE.md#state-ownership) defines URL values and fallbacks. Preserve relevant level/horizon/entity context across research navigation and remove unrelated filters. Financial values and claims cannot be supplied or overridden through URL parameters.

Keep drafts, unsubmitted Ask AI text, filter-sheet edits, and help/disclosure state native or local. Derive quote, score, confidence, risk, valuation, and change displays from centralized approved records on the server. Do not introduce Redux, another heavy global store, or competing browser copies of research data.

**URL explanation state is a prototype strategy, not the final account preference persistence architecture. Long-term authenticated preferences, cross-device persistence, cookies/local-storage precedence, watchlist persistence, and conversation history are explicitly deferred.**

## Alternatives considered

- Global browser store for all state: rejected because it duplicates server research state and weakens addressability.
- Local component state for every research choice: rejected because refresh and shared links lose context.
- URL state for drafts and every open disclosure: rejected because temporary/free-form interaction does not need public addressability.
- Account/cookie/local-storage preference synchronization now: deferred because authentication and persistent preference behavior are outside scope.

## Consequences

Research context is reproducible through direct entry and browser history, while drafts remain local. Level/horizon controls may trigger server navigation; that cost is accepted for coherent initial rendering. A change of explanation level never creates a different financial conclusion.

Decision question progress has one URL owner and survives resizing. A scenario retains its own period even when research context changes. Missing horizon-specific assessments remain unavailable.

## Risks

Unvalidated or repeated parameters may create ambiguous states. Navigation helpers may accidentally drop context or preserve irrelevant filters. Overwriting history indiscriminately may break expected Back behavior. Validate values, define purposeful navigation behavior, and check direct entry, refresh, and Back/Forward during implementation.

## Revisit conditions

Revisit when authenticated preference behavior, persistent research sessions, privacy-sensitive stored context, or measured interaction latency is explicitly in scope. Define precedence and migration deliberately; do not silently promote this prototype URL decision into final account architecture.
