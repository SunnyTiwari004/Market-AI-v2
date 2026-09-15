# MARKET AI frontend acceptance

Approved baseline: 2026-09-04. These checks apply to separately authorized first-phase frontend implementation. A checklist entry does not authorize building a deferred screen, integration, fixture, or interaction.

Record the actual route, viewport, state, check method, and result for implemented scope. Mark deferred work as deferred with a reason, never as a passing implemented feature.

## Experience contract

- [ ] Implemented screen responsibilities and canonical section hierarchy match [EXPERIENCE_CONTRACTS.md](../product/EXPERIENCE_CONTRACTS.md), the single owner of those specifications; detailed behavior and depth follow their separate contracts. Conflicting screenshot content does not override it, and section presence does not authorize missing fixtures or deferred interactions.

## Responsive and visual behavior

- [ ] Validate 360, 390, 412, 430, 768, and 1024+ CSS pixel widths, a wider desktop, and both sides of actual layout transitions.
- [ ] One responsive route/component system consumes the same research records; no separate desktop/mobile product logic or viewport-JavaScript initial branching.
- [ ] Inter, semantic colors, spacing, surfaces, and hierarchy follow [DESIGN_SYSTEM.md](../design/DESIGN_SYSTEM.md).
- [ ] Important financial labels and actions remain readable, generally at least 14px. No 8–9px critical text, clipped badges, fixed-height text overflow, or page-wide horizontal scroll.
- [ ] Long names, wrapped labels, enlarged text, 200% zoom, and 320px effective-width reflow remain usable. Intrinsically two-dimensional tables may scroll in their own labeled region.
- [ ] Mobile disclosures retain risks, confidence, scenarios, and source access. DOM, visual, keyboard, and screen-reader reading order agree; Overview precedes Quick View.

## Cross-screen financial consistency

- [ ] Home, Explore, Stocks, Decision, and current-state Ask AI resolve the same fictional entity, dataset version, quote, metrics, research snapshot, risk, and valuation under the [synthetic data contract](../data/SYNTHETIC_DATA_CONTRACT.md#canonical-ownership-and-cross-screen-consistency).
- [ ] Daily changes derive from compatible canonical price endpoints with declared precision; rounded displayed percentages are not reverse-engineered into exact prices.
- [ ] What Changed views resolve the same compatible previous/current snapshot pair and calculate differences with correct units. Missing history and methodology changes are explicit.
- [ ] Daily movement, longer-term business health, absolute valuation, and relative attractiveness have clear, compatible contexts.
- [ ] Home and current-market Ask AI agree on the canonical simulated market day. A different market archetype has distinct identity and visible example context.
- [ ] Demonstration entities are fictional and approved through data design; real-company/index design examples and their financial values are not canonical dataset content.
- [ ] IPO terms, financial periods, articles, histories, and source relationships are coherent with their synthetic inputs and timeline.
- [ ] Financial values, copy, source counts, and scenario outputs use canonical typed records or defined deterministic calculations, never screen-specific literals or duplicated derived values.

## Explanation and time context

- [ ] Controls expose exactly Simple, Normal, Pro and default to Simple. Mobile uses one consistent dropdown pattern; Decision inherits level.
- [ ] Switching explanation level preserves quotes, assessments, confidence, risk, valuation, source relationships, and conclusions. Missing deeper content stays unavailable.
- [ ] Research horizons are exactly SHORT / Short term / Next 30 days; MEDIUM / Medium term / Next 12 months; LONG / Long term / 3–5 years. Default is LONG.
- [ ] Research Horizon, Scenario Horizon, and What Changed comparison period remain distinct. A 30-day scenario stays 30-day within a Long-term context.
- [ ] Selecting a horizon without an approved assessment shows the missing state rather than rescaling or relabeling a score.

## Navigation and focused decision flow

- [ ] Standard navigation has exactly Home, Explore, Stocks, IPOs, Ask AI, with valid routes, one icon mapping, visible labels, and correct active-section semantics.
- [ ] `/stocks` and `/ipos` satisfy their bounded directory contracts without mandatory pagination. Unknown stock/IPO entities have a real not-found result.
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

## Source integrity and simulation disclosure

- [ ] Synthetic provenance exists in the model. **College Project · Simulated financial data** is perceptible across financial experiences, including focused flows, using the INT-018 placement without huge repeated disclaimers.
- [ ] PASS: the canonical disclosure with educational/demonstration context. FAIL: “Live NSE,” “verified filings,” or real-exchange verification claims attached to simulated content. Any simulation-context wording must be unmistakably synthetic and cannot reasonably be mistaken for real data or investment advice.
- [ ] Synthetic publishers do not impersonate real publishers; synthetic filings do not impersonate NSE/BSE/SEBI or actual company filings. No invented URLs to real financial publishers/exchanges, fabricated real-source badges, or misleading unavailable links.
- [ ] Source details expose actual synthetic provenance and availability. Counts derive from distinct supporting source records in the stated scope; absent catalogs stay unavailable.
- [ ] Evidence Confidence and Research Picture are not copied from design examples or described as calculated without defined, executed methods. No inferred percentages or source counts.
- [ ] Dates, freshness, IPO status, and historical evidence cutoffs follow the simulated reference clock, not documentation/build time or the real clock.
- [ ] Missing data is distinct from zero/no change/no results; unsupported scenarios, historical fields, confidence percentages, and calculation methods remain unavailable.
- [ ] Synthetic input observations, real calculations, modeled scenarios, and AI interpretation stay distinct. Static demonstration copy does not imply an AI call; later AI answers must ground in canonical records.
- [ ] Money uses declared exact precision, calculations use compatible unrounded inputs, and histories/financial periods follow the data contract.
- [ ] If seed generation is implemented later, the same seed/generator version reproduces IDs, inputs, relationships, chronology, and demonstrations.
- [ ] Product strings and accessible labels follow [TERMINOLOGY.md](../product/TERMINOLOGY.md). Rejection phrases may appear in clearly labeled historical/prohibited documentation examples, not as product claims.

## Engineering and validation gates

- [ ] Strict TypeScript, small server/client boundaries, centralized domain/synthetic data, and specific view-model transformations follow the accepted ADRs.
- [ ] No unapproved dependency/version/configuration change, backend, API, database, AI integration, authentication, or deployment is included. Full-stack work is intended in explicitly authorized milestones; commercial market-data integration requires an explicit product scope change.
- [ ] For meaningful implementation milestones, run `pnpm lint` and `pnpm build` as required by AGENTS.md, reporting actual outcomes and any known environment limitation. Target behavioral checks to consistency, navigation, sources, and other concrete risks.
- [ ] Review the Git diff against the authorized phase. Do not include unrelated changes or commit without authorization.

For this **documentation-only baseline**, review document contradictions, stale terms, internal links, ADR structure/date, and the documentation-only diff, then run `pnpm lint`. The user explicitly excludes rerunning the known Codex Turbopack build in this task. Do not treat that exclusion as a build pass or as a permanent waiver for future implementation.

## Gate 2.5 requirement traceability

These are future implementation checks, not runtime-completion claims in this documentation pass. Record actual scope, method and result; unfinished vertical slices are not final Release-1 passes. Definitions have one owner in the linked contracts.

| Requirement | Acceptance check |
| --- | --- |
| [EXP-001](../product/EXPLANATION_LEVELS.md#exp-001-same-research-across-levels) | Compare all levels/widths for identical entity, snapshot, horizon, conclusions, financial values, sources and scenarios. |
| [EXP-002](../product/EXPLANATION_LEVELS.md#exp-002-meaning-first) | Simple leads with meaning; concerns and missing evidence stay available at every level. |
| [EXP-003](../product/EXPLANATION_LEVELS.md#exp-003-methodology-gated-assessments) | No Research Picture or Evidence Confidence assessment without defined/executed methodology; Pro never invents components. |
| [EXP-004](../product/EXPLANATION_LEVELS.md#exp-004-evidence-and-missingness) | Missing deeper evidence stays unavailable; original sources and provenance remain unchanged. |
| [EXP-005](../product/EXPLANATION_LEVELS.md#exp-005-component-presentation) | Verify the component depth matrix on Home, Explore, all six Stock views, IPO, Ask archetypes and Decision. |
| [EXP-006](../product/EXPLANATION_LEVELS.md#exp-006-ask-editorial-guidance) | Editorial word guidance never truncates conclusions/caveats and is not input validation. |
| [EXP-007](../product/EXPLANATION_LEVELS.md#exp-007-context-and-presentation-ownership) | One active level and inherited Decision context; no separate mobile research or persistent preference owner. |
| [INT-001](../product/INTERACTION_CONTRACTS.md#int-001-no-dead-ui-and-release-scope) | Exercise every visible control; reject placeholders/no-ops and enabled unfinished views. |
| [INT-002](../product/INTERACTION_CONTRACTS.md#int-002-navigation-and-focus-profile-n) | Links/buttons, accessible names, keyboard/touch, visible focus and destination-heading behavior work. |
| [INT-003](../product/INTERACTION_CONTRACTS.md#int-003-history-policy) | Push navigation/view/step/horizon/material result changes; replace level/normalization; transient controls add no history. Verify Back/Forward. |
| [INT-004](../product/INTERACTION_CONTRACTS.md#int-004-route-validation-and-profile-u) | Direct entry/refresh and invalid/repeated parameters restore valid state; unknown Stock/IPO and global 404 never substitute entities. |
| [INT-005](../product/INTERACTION_CONTRACTS.md#int-005-local-disclosure-profile-l) | Keyboard disclosures and expanded semantics work, without history mutation or placeholder content. |
| [INT-006](../product/INTERACTION_CONTRACTS.md#int-006-context-help-profile-h) | Desktop informational trigger retains focus without trap; interactive content reachable. Mobile initial/trapped focus, Escape/close/return and resize work. |
| [INT-007](../product/INTERACTION_CONTRACTS.md#int-007-source-reader-profile-s) | Citations/counts resolve actual deduplicated simulated records; reader loading/failure/close/focus work; no artifact-less download. |
| [INT-008](../product/INTERACTION_CONTRACTS.md#int-008-search-profile-q) | Verify all five searches, suggestions, empty/unknown/ambiguous input, stale results and explicit Ask handoff. |
| [INT-009](../product/INTERACTION_CONTRACTS.md#int-009-filter-profile-f-and-bounded-lists) | Draft/apply/cancel/reset/clear and zero results work; incompatible filters clear visibly. No mandatory paging before dataset justification. |
| [INT-010](../product/INTERACTION_CONTRACTS.md#int-010-shared-shell-and-home) | Home entities/sectors/View All/research changes/Ask reach specified destinations. |
| [INT-011](../product/INTERACTION_CONTRACTS.md#int-011-explore) | Explore scope/theme/collection/IPO links work; mobile preserves reason and concern. |
| [INT-012](../product/INTERACTION_CONTRACTS.md#int-012-stock-and-six-view-contracts) | Final Release 1 implements all six bounded Stock views; CTA follows research/evidence/scenarios at both widths. Stock detail app Back navigates to `/stocks`, preserving applicable level/horizon and discarding unrelated Explore filters, including on direct entry. Browser Back/Forward remains normal history. |
| [INT-013](../product/INTERACTION_CONTRACTS.md#int-013-decision-flow) | Exactly six steps plus summary; index/Back/Next/direct entry/refresh/history/exit work; missing evidence does not gate progression; no page modal or bottom nav. |
| [INT-014](../product/INTERACTION_CONTRACTS.md#int-014-ask-lifecycle) | Four capabilities on both widths; empty/ambiguous/unsupported/partial/pending/failure/retry paths, IME/context retention; no arbitrary input maximum or fake AI call. |
| [INT-015](../product/INTERACTION_CONTRACTS.md#int-015-ipo-and-directory-contracts) | Complete bounded directories, simulated IPO status/terms/source access, no IPO Decision CTA or compulsory Load More. IPO detail app Back navigates to `/ipos`, preserving applicable level without Stock horizon behavior, including on direct entry. Browser Back/Forward remains normal history. |
| [INT-016](../product/INTERACTION_CONTRACTS.md#int-016-share-profile-sh) | Native Share, cancel, clipboard success/failure and manual URL fallback work; safe state only, no Ask answer sharing. |
| [INT-017](../product/INTERACTION_CONTRACTS.md#int-017-reusable-states) | Distinguish populated/loading/empty/no-results/unavailable/partial/validation/action/success/not-found/Ask/network/Share states and recovery. |
| [INT-018](../product/INTERACTION_CONTRACTS.md#int-018-release-exclusions-and-trust) | Exclusions absent; disclosure perceptible; sources fictional and actual; dates simulated; no live/verification or investment-action claims. |

For INT-002, INT-006, INT-009 and EXP-005, verify 320 effective reflow, standard widths, landscape, 200% zoom, safe areas, keyboard opening and dense Pro tables against [responsive rules](../design/RESPONSIVE_RULES.md). No page-wide horizontal overflow or global overflow hiding. Verify required references before relevant frontend work.
