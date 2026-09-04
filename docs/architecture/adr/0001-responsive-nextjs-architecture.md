# ADR 0001: One responsive Next.js App Router application

## Status

Accepted

## Date

2026-09-04

## Context

MARKET AI has selected desktop and mobile references for the same research experiences. Independent implementations would allow financial values, conclusions, navigation, and accessibility behavior to drift. The canonical repository already has an approved Next.js, React, pnpm, and strict TypeScript foundation.

## Decision

Build one responsive Next.js App Router application using shared routes, domain records, research logic, and semantic components. Use CSS-driven reflow by default and small presentation variants only when the interaction requires them. Do not branch the initial render by viewport JavaScript.

Use dynamic stock and IPO entity routes. Keep `/stocks` and `/ipos` as limited entry experiences until their full specifications are approved. `/stocks/[symbol]/decision` is a dedicated route: a focused modal-style panel on desktop and a one-question-at-a-time page on mobile, sharing one six-question stock model. No intercepted-route modal or initial `/ipos/[slug]/decision` is approved.

The current baseline is pnpm 11.19.0, Next.js 16.3.4, and React and React DOM 19.2.8. [package.json](../../../package.json) and [pnpm-lock.yaml](../../../pnpm-lock.yaml) are authoritative for dependency versions. This ADR does not authorize changing the current versions during the present phase. These exact versions record the current baseline, not a permanent architecture decision.

Document the intended small directory structure; create directories/components only when used. This decision does not authorize implementation, a backend, integrations, authentication, or deployment.

## Alternatives considered

- Separate desktop/mobile applications: rejected because they duplicate research logic, state, and validation.
- Whole-page viewport-switched templates: rejected because they invite hydration mismatch and two sources of product truth.
- A single rigid layout: rejected because mobile and focused interactions need meaningful responsive adaptation.
- Intercepted-route desktop decision modal: deferred because dedicated-route behavior meets the approved need with simpler direct-entry and refresh semantics.

## Consequences

One data and route model supports every width. Responsive variants require deliberate focus, reading-order, and information-retention checks. The desktop decision panel is a page presentation, not an actual modal requiring a background page or focus trap.

Validation includes 360, 390, 412, 430, 768, and 1024+ widths, safe areas, and transition boundaries. The small initial structure avoids empty architecture scaffolding.

## Risks

CSS-hidden duplicate markup can create duplicate accessible content or focus targets. Dense financial content may become unreadable if compressed to match screenshots. Mitigate through one semantic instance where practical and the [responsive rules](../../design/RESPONSIVE_RULES.md).

## Revisit conditions

Revisit if an explicitly approved native/offline platform, materially different workflow, or demonstrated rendering constraint cannot be met through responsive presentation. A screenshot difference alone is not sufficient. Changes to decision routing require explicit navigation requirements and an updated decision record.

Routine reviewed dependency/security upgrades with a demonstrated technical reason do not require replacing this ADR unless they materially change the architectural decision. Major framework migrations or changes to App Router/responsive architecture require a new or revised architecture decision.
