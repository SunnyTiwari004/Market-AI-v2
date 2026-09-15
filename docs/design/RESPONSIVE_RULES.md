# MARKET AI responsive rules

Approved baseline: 2026-09-04. One responsive application shares routes, domain data, research conclusions, and business logic across all widths. See [ADR 0001](../architecture/adr/0001-responsive-nextjs-architecture.md).

## Widths and initial rendering

Validate **360, 390, 412, 430, 768, and 1024+ CSS pixels**, plus widths immediately around actual layout transitions. Include a wider desktop such as 1440px to check maximum measures. These are test widths, not a separate layout for each device.

Use content-driven CSS grid/flex layouts and media queries. Starting thresholds are below 640px for compact layouts, around 640px for optional two-column groups, around 768px for tablet groups, and around 1024px for full desktop navigation and sidebars. Components may change at different thresholds when readability requires it.

Do not use viewport JavaScript, user-agent detection, or `window.innerWidth` to choose the initial render tree. Server output and hydration must agree. Browser measurement after mount may support an interaction only when needed; it must not select a different financial dataset, reset progress, or replace the product tree.

## Shell and navigation

The shared shell has **standard** and **focused** presentations, selected by route composition before rendering. Keep one navigation definition and one outline icon mapping.

| Destination | Public route |
| --- | --- |
| Home | `/` |
| Explore | `/explore` |
| Stocks | `/stocks` |
| IPOs | `/ipos` |
| Ask AI | `/ask` |

Desktop shows the five destinations in the top navigation with a blue active underline and semantic current-section indication. Mobile shows exactly these five destinations in bottom navigation, with visible labels. Stock detail belongs to Stocks; IPO detail belongs to IPOs. Do not add a sixth primary destination.

Below the desktop navigation threshold, retain usable compact navigation, including at tablet widths. Show only the applicable navigation presentation to sighted users and assistive technology; hidden links must not remain keyboard-focusable. Separate navigation markup may share one data definition without duplicating product state.

Use one mobile explanation dropdown pattern on Home, Explore, Stock, IPO, and Ask AI. Stock decision inherits its explanation level. Account/profile behavior is deferred; the reference profile affordance does not authorize authentication or a misleading account action.

## Safe areas, scrolling, and keyboards

Configure the viewport for the intended iOS edge-to-edge safe-area behavior when implementing the shell. Where that behavior requires `viewport-fit=cover`, use Next.js's dedicated viewport metadata mechanism: a static `viewport` export, typed with `Viewport` from `next`, on the Server Component root layout with `viewportFit: 'cover'`. Use `generateViewport` only if viewport values actually need to be dynamic; do not export both or place viewport settings in the general `metadata` object. Preserve zoom accessibility.

This follows the bundled `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-viewport.md` guide and the installed `Viewport` type. Verify the resulting viewport meta tag during implementation, then apply the insets at the owning shell boundaries below. This is a documentation requirement only; no viewport code is added in this phase.

- Respect `env(safe-area-inset-top)` at the top shell boundary and `env(safe-area-inset-bottom)` at bottom navigation or focused-flow controls. Apply insets once at the owning boundary.
- Reserve content space for the bottom navigation's actual height, the bottom inset, and a comfortable final gap. The last source link or action must be fully visible and focusable above it.
- Keep the full mobile stock header, price, controls, and tabs in document flow. A compact identity strip may be sticky if it does not obscure content.
- Use appropriate scroll offsets for sticky headers so anchor targets and focused elements remain visible.
- Check on-screen keyboard opening in search and Ask AI: the input, submit control, and current content remain reachable. Avoid fixed-height layouts that trap the composer under the keyboard.
- Focused decision pages omit ordinary bottom navigation. Their own Back/Next controls still need bottom inset and content clearance.
- Do not hide scrollbars or rely on invisible horizontal overflow for discovery. If a list scrolls horizontally, expose enough affordance and keep it keyboard-accessible.

## Responsive presentation classifications

**A — Reflow:** one semantic component changes layout through CSS.

**B — Shared meaning, different presentation:** small presentation variants share data, selection, and business logic.

**C — Separate implementation:** requires a demonstrated need and an explicit architecture review; no current major feature needs it.

| Feature | Class | Required adaptation |
| --- | --- | --- |
| Navigation | B | Top links and bottom destinations share definitions, state, and icons. |
| Home introduction and briefing | A | Centered/wider desktop composition becomes an ordered mobile stack. |
| Stock header and Quick View | A | Wrap controls and stack the same research concepts without shrinking critical text. |
| Research previews | A | Grid or readable horizontal list using the same preview records. |
| Research pillars and findings | A | Stack related meaning; retain concerns as well as strengths. |
| Scenarios and What Changed | A | Reflow labeled outcomes/comparisons with periods and units intact. |
| Stock decision framework | B | Desktop focused panel and mobile one-question flow share one six-question model. |
| Ask AI comparison/concept/market content | A | Reflow prose and graphics; preserve table relationships and units. |
| Context help | B | Desktop anchored help and mobile sheet share content and one interaction state. |
| IPO proceeds and ownership content | A | Side-by-side desktop groups become ordered mobile sections. |
| Sector research | B | Desktop matrix and compact mobile summary/disclosure resolve the same records. |

Prefer A. For B, keep one semantic instance when practical. If separate markup is necessary, use unique IDs, remove the hidden presentation from focus/accessibility, and keep one state owner. Do not copy an entire desktop page into a mobile file.

## Stock decision presentation

Use the public route `/stocks/[symbol]/decision` on all widths. Desktop renders a focused modal-style panel as a dedicated page; it does not require a background Stock page, intercepted routing, or an actual modal focus trap. Mobile renders one question at a time with **Question X of 6**, Back, and Next, then **Your Research Summary**.

The shared decision model, question order, research snapshot, selected step, and conclusion survive resizing. The summary is not a seventh question. Provide a deterministic return link to full stock research so direct entry works without browser history. Do not introduce `/ipos/[slug]/decision` in the initial phase.

## Information retention and accessibility

Mobile may progressively disclose supporting detail, but must not silently remove risk, confidence, source access, scenario assumptions, or sector concerns. Use consistent DOM reading order; CSS visual reordering must not produce a conflicting keyboard or screen-reader sequence. Stock Overview comes before Quick View.

A single semantic comparison table may scroll within a labeled region when its relationships require two dimensions. Page-wide horizontal scrolling is unacceptable. Preserve table headings, units, and accessible names. Do not compress essential labels to fit a screenshot.

Check text enlargement, 200% zoom, and reflow at a 320px effective width. Targets should generally be around 44px or larger. Use accessible button/link semantics, visible focus, meaningful status text, and reduced-motion behavior. Keep the canonical **College Project · Simulated financial data** disclosure perceptible across financial routes, including focused pages; placement follows [INT-018](../product/INTERACTION_CONTRACTS.md#int-018-release-exclusions-and-trust).

## Gate 2.5 interaction adaptation

Bound horizontal scrolling to labeled chip rails, compact discovery rails, Stock navigation and genuinely wide tables. Show continuation and keep keyboard-focused items visible. Never apply global overflow-x hiding to conceal a layout defect. Preserve table headers/units; Pro density uses disclosure or a bounded table rather than smaller critical text.

Test 320 effective reflow alongside the standard widths, landscape, tablet, 200% zoom and long labels. Fixed/sticky regions remain compact; full Stock financial context stays in document flow. Bottom navigation includes safe-area clearance and cannot cover the composer or Send when the keyboard opens. Restore list scroll and focused content without hiding them beneath sticky elements.

The mobile Explore Filters trigger remains outside its horizontal category rail. Its modal sheet supports readable groups, draft/apply/cancel/reset, internal scroll, keyboard and safe areas under [INT-009](../product/INTERACTION_CONTRACTS.md#int-009-filter-profile-f-and-bounded-lists). Mobile Ask exposes all four entry capabilities. Mobile sectors retain reason and concern; disclosures cannot silently remove meaning.

Desktop help keeps focus on its trigger; mobile modal help moves/traps/restores focus under [INT-006](../product/INTERACTION_CONTRACTS.md#int-006-context-help-profile-h). Resizing uses the same content/state and never strands focus. The five visual prerequisites are tracked in [design handoff](DESIGN_SYSTEM.md#gate-25-reference-handoff), without prescribing their unfinished compositions here.
