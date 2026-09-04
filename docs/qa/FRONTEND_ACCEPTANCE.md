# MARKET AI frontend acceptance

Approved baseline: 2026-09-04. These checks apply to separately authorized first-phase frontend implementation. A checklist entry does not authorize building a deferred screen, integration, fixture, or interaction.

Record the actual route, viewport, state, check method, and result for implemented scope. Mark deferred work as deferred with a reason, never as a passing implemented feature.

## Experience contract

- [ ] Implemented screen responsibilities, canonical section hierarchy, and interaction boundaries match [EXPERIENCE_CONTRACTS.md](../product/EXPERIENCE_CONTRACTS.md), the single owner of those specifications. Conflicting screenshot content does not override it, and section presence does not authorize missing fixtures or deferred interactions.

## Responsive and visual behavior

- [ ] Validate 360, 390, 412, 430, 768, and 1024+ CSS pixel widths, a wider desktop, and both sides of actual layout transitions.
- [ ] One responsive route/component system consumes the same research records; no separate desktop/mobile product logic or viewport-JavaScript initial branching.
- [ ] Inter, semantic colors, spacing, surfaces, and hierarchy follow [DESIGN_SYSTEM.md](../design/DESIGN_SYSTEM.md).
- [ ] Important financial labels and actions remain readable, generally at least 14px. No 8–9px critical text, clipped badges, fixed-height text overflow, or page-wide horizontal scroll.
- [ ] Long names, wrapped labels, enlarged text, 200% zoom, and 320px effective-width reflow remain usable. Intrinsically two-dimensional tables may scroll in their own labeled region.
- [ ] Mobile disclosures retain risks, confidence, scenarios, and source access. DOM, visual, keyboard, and screen-reader reading order agree; Overview precedes Quick View.

## Cross-screen financial consistency

- [ ] Home, Explore, Stock, Decision, and current-state Ask AI agree with every approved Tata field in [MOCK_DATA_CONTRACT.md](../data/MOCK_DATA_CONTRACT.md#canonical-tata-motors-current-demo-fixture).
- [ ] The approved price and daily percentage appear without an absolute rupee daily change or inferred previous close.
- [ ] All current What Changed views resolve the same approved 30-day previous/current snapshot pair. No conflicting score baseline or extra historical metric is invented.
- [ ] Daily weakness, longer-term business health, absolute valuation, and relative attractiveness have clear, compatible contexts.
- [ ] Home and current-market Ask AI agree on the centralized market day. A different market archetype is visibly a separate example scenario.
- [ ] ABC Technologies is explicitly fictional enterprise software/technology content. No factory proceeds story or unapproved exact IPO values.
- [ ] Financial values, financial copy, source counts, and scenario outputs come from centralized typed records or explicitly approved deterministic transformations, not component literals.

## Explanation and time context

- [ ] Controls expose exactly Simple, Normal, Pro and default to Simple. Mobile uses one consistent dropdown pattern; Decision inherits level.
- [ ] Switching explanation level preserves quotes, assessments, confidence, risk, valuation, source relationships, and conclusions. Missing deeper content stays unavailable.
- [ ] Research horizons are exactly SHORT / Short term / Next 30 days; MEDIUM / Medium term / Next 12 months; LONG / Long term / 3–5 years. Default is LONG.
- [ ] Research Horizon, Scenario Horizon, and What Changed comparison period remain distinct. A 30-day scenario stays 30-day within a Long-term context.
- [ ] Selecting a horizon without an approved assessment shows the missing state rather than rescaling or relabeling a score.

## Navigation and focused decision flow

- [ ] Standard navigation has exactly Home, Explore, Stocks, IPOs, Ask AI, with valid routes, one icon mapping, visible labels, and correct active-section semantics.
- [ ] `/stocks` and `/ipos` remain limited entry/directory experiences. Unknown stock/IPO entities have a real not-found result.
- [ ] Dynamic entity routes, approved views, source links, and primary research actions work on direct entry, refresh, and Back/Forward. No fake hash destinations or misleading dead controls.
- [ ] Validated URL state preserves applicable explanation level, horizon, and entity context. Invalid/repeated values resolve safely; financial values cannot be overwritten through URL parameters.
- [ ] `/stocks/[symbol]/decision` uses one six-question model. Desktop is a focused modal-style panel on a dedicated route; mobile is a focused one-question page with Question X of 6, Back, and Next.
- [ ] The decision summary follows six questions, derives from the shared research state, and returns to full entity research without requiring browser history. Resizing preserves progress.
- [ ] Ordinary bottom navigation is absent in the focused flow. No intercepted-route modal or initial IPO decision route has been introduced.
- [ ] Unsupported Ask AI prompts receive an honest demo limitation state; no simulated claim of a real AI response or fabricated financial answer.

## Safe areas and input behavior

- [ ] The dedicated Next.js viewport metadata mechanism configures the intended iOS edge-to-edge behavior, including `viewportFit: 'cover'` producing `viewport-fit=cover` where required. Verify the rendered viewport meta tag and retain zoom accessibility.
- [ ] `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)` are applied once at their owning shell boundaries without double padding.
- [ ] Bottom navigation and focused-flow controls reserve adequate content clearance. The last action/source link and every focused element remain visible.
- [ ] Sticky headers do not consume the mobile screen or cover anchor targets. Full stock price/header content remains in document flow.
- [ ] Search and Ask AI remain usable with the on-screen keyboard open. Input, submit actions, and results remain reachable.
- [ ] Text entry respects multiline and IME composition behavior; submitting does not accidentally interrupt text composition.

## Keyboard and accessibility

- [ ] Every control is keyboard-operable with a visible focus state and a meaningful accessible name. Links navigate; buttons act. Touch targets are generally around 44px or larger.
- [ ] One main landmark, logical headings, labeled form controls, semantic lists/definition lists, and tables with correct headers are present.
- [ ] Hidden responsive presentations contain no reachable focus targets or duplicate accessible content/IDs. Resizing an open help experience does not strand focus.
- [ ] Context help opens on click/tap/keyboard. Actual modal sheets have names, initial focus, contained focus, Escape, visible close, and focus return. The dedicated decision page does not trap focus as a modal.
- [ ] Native disclosures or accessible expanded/control relationships work. Addressable route tabs are links; local tab panels, if needed, implement the appropriate keyboard behavior.
- [ ] Text contrast meets 4.5:1 for normal text or 3:1 for qualifying large text; meaningful control/graphic boundaries meet 3:1. Status meaning is not color-only.
- [ ] Financial values have understandable spoken equivalents, including currency, units, direction, and score scale. A score is not announced as confidence or a profit probability.
- [ ] Meaningful pending/result changes have concise accessible feedback, and reduced-motion preferences are respected.

## Source integrity and mock honesty

- [ ] Mock provenance exists in the model. One restrained application-level **Prototype · Demo research data** indication remains perceptible on every financial route, including focused flows, without per-component badge noise.
- [ ] Tata's Evidence Confidence: High is treated as an approved qualitative demo assessment, not an implemented methodology or real-source verification. Infer no source count or percentage. Detailed source chips, counts, and claim-level evidence resolve a separately approved synthetic catalog with stable IDs, categories, and mock provenance, or appear as unavailable under the [source contract](../data/MOCK_DATA_CONTRACT.md#source-count-integrity-and-missing-information). The High assessment remains covered by the application-level prototype indication until a real evidence system exists.
- [ ] No mock content claims live data, verification, real-time updates, or exchange verification. Documentation/build time is not a fabricated observation time.
- [ ] Source counts derive from distinct resolved records supporting the relevant claim/section. Preview versus total scope is clear; absent catalogs are unavailable, not invented evidence.
- [ ] Source details expose actual provenance and availability. Synthetic identities and metadata come only from a separately approved mock catalog; no real publisher, URL, filing title, date, or verification is invented, and no unsupported source count appears.
- [ ] Missing data is distinct from zero/no change/no results. Exact scenario outcomes, confidence percentages, score calculations, and historical values are not invented.
- [ ] Observed, calculated, modeled, and AI interpretation layers remain distinct. Approved assessment fixtures are not presented as executed calculations or verified research.
- [ ] Product strings and accessible labels follow [TERMINOLOGY.md](../product/TERMINOLOGY.md). Search for every prohibited/stale table entry; rejection examples may appear only in that documentation table, never in product copy.

## Engineering and validation gates

- [ ] Strict TypeScript, small server/client boundaries, centralized domain/mock data, and specific view-model transformations follow the accepted ADRs.
- [ ] No unapproved dependency/version/configuration change, backend, real data API, AI integration, authentication, or deployment is included.
- [ ] For meaningful implementation milestones, run `pnpm lint` and `pnpm build` as required by AGENTS.md, reporting actual outcomes and any known environment limitation. Target behavioral checks to consistency, navigation, sources, and other concrete risks.
- [ ] Review the Git diff against the authorized phase. Do not include unrelated changes or commit without authorization.

For this **documentation-only baseline**, review document contradictions, stale terms, internal links, ADR structure/date, and the documentation-only diff, then run `pnpm lint`. The user explicitly excludes rerunning the known Codex Turbopack build in this task. Do not treat that exclusion as a build pass or as a permanent waiver for future implementation.
