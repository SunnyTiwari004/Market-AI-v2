# MARKET AI frontend architecture

Approved baseline: 2026-09-04. This records the accepted architecture and intended implementation boundaries. It does not create or authorize product screens, routes, fixtures, dependencies, or infrastructure.

## Foundation and scope

Use one responsive Next.js App Router application with strict TypeScript. The current baseline is pnpm **11.19.0**, Next.js **16.3.4**, and React and React DOM **19.2.8**. [package.json](../../package.json) and [pnpm-lock.yaml](../../pnpm-lock.yaml) are authoritative for dependency versions. This phase does not authorize changing those versions or the Next.js/Tailwind configuration. Avoid `any` unless clearly justified.

Routine reviewed dependency/security upgrades with a demonstrated technical reason do not require replacing ADR 0001 unless they materially change its architectural decision. Exact patch versions are not permanent architectural constraints. Major framework migrations or changes to App Router/responsive architecture require a new or revised architecture decision; see [ADR 0001](adr/0001-responsive-nextjs-architecture.md).

Use Server Components by default, narrow Client Component interaction boundaries, centralized typed synthetic data, small selectors/view-model transformations, and shared semantic research components.

The repository currently has the foundation and documentation; product backend, API routes, database, research engine, and AI integration are not implemented. The intended college application includes real backend/database/APIs, calculations, historical snapshots, What Changed, and eventual AI integration in explicitly authorized milestones. This document preserves frontend boundaries and does not design the backend. The synthetic universe remains the intended data source; licensed market feeds are not the next state. Do not introduce heavy global state, speculative caching, libraries, or infrastructure without a demonstrated requirement and task authorization.

## Accepted decisions

| ADR | Decision |
| --- | --- |
| [0001](adr/0001-responsive-nextjs-architecture.md) | One responsive App Router application. |
| [0002](adr/0002-server-first-client-islands.md) | Server Components by default, narrow Client Component boundaries. |
| [0003](adr/0003-centralized-research-domain-model.md) | Centralized typed research domain; data scope partially superseded by 0006. |
| [0004](adr/0004-prototype-state-strategy.md) | URL state, local transient interaction, server-derived financial state. |
| [0005](adr/0005-financial-evidence-layers.md) | Four evidence layers retained; real-evidence migration assumption superseded by 0006. |
| [0006](adr/0006-synthetic-financial-universe.md) | Permanent fictional synthetic universe with real application logic. |

The [product principles](../product/PRODUCT_PRINCIPLES.md#documentation-authority) define documentation authority. [EXPERIENCE_CONTRACTS.md](../product/EXPERIENCE_CONTRACTS.md) is the single owner of approved screen responsibilities, hierarchy, and interaction boundaries. [SYNTHETIC_DATA_CONTRACT.md](../data/SYNTHETIC_DATA_CONTRACT.md) owns synthetic data integrity; UI specifications must not create alternative versions.

## App Router and rendering boundaries

Root layout responsibilities are document structure, metadata, fonts, and global styles. Thin Server Component pages resolve route/query state, select approved synthetic records, build a small view model, and compose the shared shell and feature content.

Use official Next.js App Router documentation during future implementation and review, following the conventions supported by the currently installed version.

In this installed version, page `params` and `searchParams` are asynchronous. Resolve and validate them at the page boundary. Shared layouts do not receive fresh query state on navigation, so page-derived level and horizon must be passed explicitly to page composition. Do not put mutable URL research state in a stale layout assumption.

| Server by default | Client interaction only where needed |
| --- | --- |
| Page and shell composition, navigation links, research prose, identity, quote, metrics, scenarios, changes, sources, comparisons | Immediate level/horizon controls, search suggestions, filter drafts, context-help opening/focus, decision navigation enhancements, Ask AI draft/demo submission |

Native links, forms, and `details` may provide behavior without custom client state. Do not mark a whole research page as client-rendered because it contains one interactive control. A client module's imports enter its client module graph; keep imports narrow. Server-rendered content can be composed into client wrappers through props/children without importing the server subtree there.

Pass only required serializable data to client boundaries. Do not send the entire synthetic dataset or all explanation variants to every interaction. Never expose future credentials in client props or code. No secrets, API keys, or real integrations belong in this phase.

## Public route architecture

| Public route | Responsibility and first-phase boundary |
| --- | --- |
| `/` | Home / Market Today briefing. |
| `/explore` | Cross-category discovery with understandable research filters. |
| `/stocks` | Limited stock directory/entry experience; full product specification pending. |
| `/stocks/[symbol]` | Shared stock entity page; fictional instances await data design. |
| `/stocks/[symbol]/decision` | Shared six-question stock decision experience. |
| `/ipos` | Limited IPO directory/entry experience; full product specification pending. |
| `/ipos/[slug]` | Shared IPO entity page; fictional instances await data design. |
| `/ask` | Demo research answers and approved comparison, concept, and market archetypes. |

Map URL symbols/slugs to explicit entity and listing records. Canonical stock URLs use lowercase symbols while display retains uppercase tickers. A ticker alone is not a globally unique company/listing identity. Unknown entities return a proper not-found result; never substitute another entity for an unknown symbol.

The [Stock experience contract](../product/EXPERIENCE_CONTRACTS.md#stock-research) owns stock navigation labels and section order. If an approved view is implemented, addressable navigation may use `view`; navigation styled as tabs remains links. Do not invent financial detail for unprovided views. Use explicit unavailable states or defer the view until its content is approved.

Do not create `/ipos/[slug]/decision` in the initial phase. Its framework is deferred. Reference CTAs do not authorize reusing stock questions or creating a dead destination. Full `/stocks` and `/ipos` designs also remain deferred; keep their initial scope to useful entry links to approved entities.

## Shared shell and decision experience

An `AppShell` accepts explicit active section, explanation context, and standard/focused mode from the page. It owns landmarks, navigation space, and the canonical simulation disclosure; its exact placement is defined in the later interaction/design pass. `PageContainer` handles measures and gutters without introducing a second main landmark. One navigation definition feeds desktop and mobile presentations.

Do not place the entire stock header in a parent layout that automatically wraps the decision route. The decision page selects focused mode before rendering and hides ordinary mobile bottom navigation. Desktop is a dedicated route with a focused modal-style panel; mobile is a dedicated page showing one question at a time. No intercepted-route modal architecture is approved. The desktop panel remains a page, without a fake background Stock screen or modal focus trap.

One ordered stock question model supplies both presentations. The [decision experience contract](../product/EXPERIENCE_CONTRACTS.md#help-me-think-it-through) owns the six questions, sequence, summary, and CTA text. The summary derives from the same research snapshot rather than a new recommendation score. Its return-to-research action must work on direct entry, preserve level/horizon, and not depend on previous browser history.

Question progress, content, and research logic have one owner. Resizing must not reset them. Additional summary actions or a question index are introduced only when their behavior is defined.

## State ownership

| State | Owner | Rule |
| --- | --- | --- |
| Entity | Route segment | Resolve explicit listing/entity identity. |
| Explanation level | URL | `level=simple`, `normal`, or `pro`; missing/invalid values resolve to Simple. |
| Research horizon | URL | `horizon=short`, `medium`, or `long`, mapped to SHORT/MEDIUM/LONG; default LONG. |
| Applied Explore filters, submitted entity-search query | URL | Only approved, validated filter/query values. |
| Stock view | URL | Validate against implemented, approved views; default Overview. |
| Decision step | URL | Question 1–6 or summary; missing/invalid step resolves to question 1. |
| Selected demo answer/context | Safe URL identifier where useful | Reference an approved entity/scenario; arbitrary text must not become an answer fixture. |
| Filter draft, help open state, disclosures | Native/local | Canceling a draft does not apply filters. |
| Ask AI draft and unsubmitted follow-up text | Local | Do not put free-form drafts in URLs. |
| Quote, score, risk, confidence, valuation, changes | Server-derived | Resolve centralized records; never editable URL/UI state. |

Parse URL values once through a small shared helper. Reject unsupported or ambiguous repeated values using documented defaults. Preserve applicable level, horizon, and entity context across navigation; drop unrelated page-specific filters. Back/Forward and refresh must reconstruct addressable state. Do not create competing URL, context, cookie, and local-storage owners.

Research Horizon is distinct from a scenario's own window and a change comparison period. A missing horizon-specific assessment remains unavailable; changing a label cannot manufacture new research.

URL explanation state is a prototype decision, not final authenticated preference architecture. Account persistence, cross-device synchronization, cookies/local-storage precedence, watchlist persistence, and conversation history are deferred. A small page-scoped help coordinator may be added if demonstrated reuse requires it; it must not become a global financial store.

## Domain, selectors, and view models

Data flows from canonical synthetic records through selectors into page/feature view models and then semantic components. Domain types describe identities, quantities, research, claims, sources, comparisons, and scenarios without JSX, CSS classes, or page-specific layout assumptions.

Selectors resolve entity/snapshot/source references and availability. Small pure view-model transformations choose explanation depth, format approved values, and compose the data needed by a page. They do not invent financial facts or compute an unapproved research score. Deterministic calculations need explicit inputs, units, and an approved method separate from formatting.

Keep company identity separate from exchange listing and quote; keep quote movement separate from research assessments. Synthetic provenance is independent of the four evidence layers. The [data contract](../data/SYNTHETIC_DATA_CONTRACT.md) defines those invariants in detail.

The signature [What Changed concept](../product/EXPERIENCE_CONTRACTS.md#what-changed) uses compatible previous/current snapshot references and an explicit comparison period. The intended application will execute comparisons over these synthetic snapshots; this documentation-only milestone does not implement the engine or design its service/storage layer.

## Intended initial directory strategy

This is an intended structure, not scaffolding to create now:

```text
src/
  app/
  components/
    ui/
    shell/
    research/
    evidence/
  features/
  domain/
  data/
    synthetic/
  lib/
  styles/
```

| Area | Responsibility |
| --- | --- |
| app | App Router entry points, layouts, and route composition as each route becomes necessary. |
| components/ui | Small reusable primitives such as buttons, badges, headings, and disclosures. |
| components/shell | Shell, header, navigation presentations, and page container. |
| components/research | Reused semantic displays: identity, price, Research Picture, pillars, findings, scenarios, changes, previews. |
| components/evidence | Simulation disclosure, claim/source connections, source lists, provenance displays. |
| features | Page-specific composition, interaction, and small view-model transformations; create feature folders only when used. |
| domain | Shared typed business concepts and explicitly approved pure domain rules. |
| data/synthetic | Initial canonical typed synthetic inputs, approved copy, provenance, and small selectors; future authorized storage must preserve this single ownership. |
| lib | Specific shared formatting, route-state, and navigation helpers. |
| styles | Centralized design tokens integrated with the existing styling setup when implemented. |

Do not pre-create every future component, feature, type file, loading/error boundary, or component category. Additional categories need demonstrated reuse. Keep feature-specific Ask AI archetypes and IPO displays in their feature until reuse warrants extraction. Avoid a generic `lib` dumping ground or a speculative repository/service abstraction. Real backend and storage design belong to separately authorized milestones.

## Component architecture, rationale, and tradeoffs

Share semantic components such as Research Picture, research findings, scenarios, What Changed, sources, identity, and price. Risk, confidence, and valuation can compose a common visual badge while retaining distinct typed meanings. A metric need not have a card border. Route links and interactive tab panels have different semantics and should not be conflated.

This design reduces contradictory data and duplicated mobile/desktop logic. It requires disciplined view-model boundaries and sometimes separate small presentation variants. Prefer a few purposeful variants over dozens of page-specific boolean props or one universal financial card.

Server-first rendering reduces shipped JavaScript and keeps initial research coherent. URL-driven controls can require server navigation and request-time rendering; that tradeoff is accepted for the initial research experience. It does not require adding a data-fetching library. CSS-driven layouts avoid hydration mismatch but require checking reading order and hidden focusable content.

Protect real risks through the [acceptance checklist](../qa/FRONTEND_ACCEPTANCE.md). Use small HTML/SVG financial graphics initially; defer chart libraries, virtualization, streaming, and complex caching until real requirements justify them.

## Unresolved product decisions and deferred work

- Full Stocks/IPOs landing specifications and the scope/content of deeper stock views.
- IPO-specific decision questions and behavior; no initial IPO decision route.
- Exact IPO amounts, dates, year, status timeline, offer terms, demand, ownership, valuation, and listing scenarios.
- Additional company, sector, comparison, pillar, technical, scenario, source-document, and explanation-depth fixtures. The fictional universe, timeline, and design-example mapping are still to be defined; historical company and market-day values are not approved inputs.
- Complete question-level supporting content, any question-index shortcut, and optional decision-summary actions beyond the return to full research.
- Unapproved supporting content within the canonical stock hierarchy and any remaining reference/export omissions. The approved section order is now owned by the experience contract.
- Profile, watchlist, sharing, unsupported controls, and persistent preference/history behavior. These require defined behavior before presentation as working features.

These gaps do not prevent documenting or implementing a separately authorized narrow foundation. They do prevent filling missing content with invented financial precision or presenting undefined interactions as complete.
