# MARKET AI design system

Approved baseline: 2026-09-04. These are documentation specifications for later token implementation, consolidated from the approved analysis. No tokens, fonts, packages, or components are installed by this baseline.

## Visual character

Use a light cool-neutral background, white surfaces, subtle borders, restrained blue actions, and clear research hierarchy. Avoid neon, excessive gradients, glowing AI treatments, robot imagery, money bags, rockets, and decorative financial urgency.

The [product principles](../product/PRODUCT_PRINCIPLES.md) govern meaning; the [responsive rules](RESPONSIVE_RULES.md) govern adaptation. Selected screenshots inform composition, not literal production font sizes. Do not copy historical Stitch `DESIGN.md` rules or generated HTML.

## Selected reference set

The approved analysis used `Market-Final.zip` for desktop and `market-Final(Mobile).zip` for mobile. These are the selected folder pairs; later implementation must apply this baseline's corrections to their visual intent.

| Experience | Desktop folder | Mobile folder |
| --- | --- | --- |
| Home | `market_today_definitive_briefing_final_polish` | `market_today_mobile_briefing` |
| Explore | `market_ai_explore_canonical_polish` | `market_ai_explore_mobile` |
| Stock | `market_ai_tata_motors_stock_research_surgical_polish` | `market_ai_tata_motors_mobile_header_polish` |
| Stock decision | `market_ai_help_me_think_it_through_canonical_framework` | `market_ai_decision_flow_mobile` |
| IPO | `market_ai_ipo_in_60_seconds_balanced_layout_rhythmic_spacing` | `market_ai_ipo_research_mobile` |
| Ask AI | `market_ai_ask_ai_wide_showcase_archetypes` | `market_ai_ask_ai_mobile` |

Exclude the older `market_ai_tata_motors_mobile` folder. Cropped exports do not limit required content, and compact exported image dimensions do not establish production typography. Reference-only values and unresolved interactions remain subject to the data contract and product decisions.

## Semantic color tokens

| Token | Value | Purpose |
| --- | --- | --- |
| background | `#F7F8FA` | Page background. |
| surface | `#FFFFFF` | Primary cards and panels. |
| surface-secondary | `#F1F5F9` | Insets and quiet supporting regions. |
| border | `#E2E8F0` | Non-interactive separators and card outlines. |
| border-control | `#64748B` | Control boundaries where contrast is needed. |
| text-primary | `#0F172A` | Headings, values, primary copy. |
| text-secondary | `#475569` | Supporting text and readable metadata. |
| brand | `#315CF4` | Brand, actions, information, Base scenario. |
| brand-hover | `#2548D0` | Primary action hover. |
| brand-subtle | `#EEF2FF` | Informational and selected backgrounds. |
| positive / positive-subtle | `#047857` / `#ECFDF5` | Positive, healthy, Strong. |
| warning / warning-subtle | `#92400E` / `#FFFBEB` | Caution, medium, mixed. |
| negative / negative-subtle | `#B42318` / `#FEF3F2` | Negative, weak, expensive. |
| neutral / neutral-subtle | Alias text-secondary / surface-secondary | Neutral and secondary states. |

Centralize these tokens and reuse semantic aliases. Do not assign unrelated shades to the same meaning on different pages. Every financial color treatment needs a text label or other non-color cue. Distinguish a price decline from a research change through labels and periods.

Validate actual foreground/background pairs in implementation: normal text at least 4.5:1, qualifying large text at least 3:1, and meaningful control boundaries and graphics at least 3:1. The subtle card border is not a sufficient control outline by itself. A token table does not establish the accessibility of every composition.

## Typography

Inter is the canonical typeface, with a system sans-serif fallback. Use Next.js font support when implementing. The choice between supplied local Inter assets and a build-time font download remains an implementation environment decision; neither is introduced here.

| Role | Desktop | Mobile | Weight | Line height |
| --- | --- | --- | --- | --- |
| Display | 36px | 28px | 700 | 1.15–1.2 |
| Page title | 30–32px | 24px | 700 | 1.2–1.3 |
| Section title | 20px | 18px | 600–700 | 1.35 |
| Card title | 16px | 16px | 600 | 1.4 |
| Body | 16px | 16px | 400 | 1.55–1.65 |
| Small body | 14px | 14px | 400–500 | 1.5 |
| Label | 14px | 14px | 500–600 | 1.4 |
| Metadata | 12px | 12px | 400–500 | 1.5 |

Implement sizes in rem and allow wrapping and container growth. Important prices, status, risk, confidence, scenario labels, and actions should generally be at least 14px. Do not reproduce 8–9px financial text. Reserve 12px for supporting metadata, including a readable simulation disclosure, not essential financial meaning.

Use tabular numerals for aligned financial values. Use weight and spacing before adding font sizes. Avoid excessive uppercase headings. Give scores and prices prominence without letting them overpower their explanation.

## Spacing, radii, borders, and surfaces

Spacing scale: **0, 4, 8, 12, 16, 24, 32, 40, 48, 64px**. Use an eight-point rhythm, with 4px and 12px for compact relationships.

| Relationship | Starting value |
| --- | --- |
| Icon to label | 8px |
| Related labels and values | 8–12px |
| Mobile card padding | 16px |
| Desktop card padding | 24px |
| Related groups | 16–24px |
| Major sections | 32–48px |
| Large introduction spacing | 48–64px where space permits |

Radius scale: **6px** for small badges/insets, **8px** for controls, **12px** for cards/panels/dialogs. Fully rounded shapes are for pills and circular icon containers only.

Use 1px borders by default. Ordinary research cards generally need no shadow. Reserve elevation for overlays or restrained sticky-header separation. Distinguish page, primary surface, and supporting inset without stacking multiple near-identical shadows.

Avoid card soup: one fact does not require one bordered card. Use semantic sections, lists, definition lists, rows, and separators to group related findings. A shared surface style is not a reason to combine unrelated financial concepts into one oversized component API.

## Layout measures

| Area | Starting measure |
| --- | --- |
| Standard page | Maximum 1200px |
| Ask AI answer frame | Approximately 880–960px |
| Long prose | Approximately 60–72 characters per line |
| Ask AI comparison breakout | Up to the standard page width |
| Focused desktop decision panel | Approximately 880–920px |
| Desktop outer gutters | At least 24px |
| Mobile horizontal gutters | 16px; optionally 20–24px at wider compact widths |

These constrain readable content; they do not create separate mobile page templates or fixed heights. Reflow groups according to content and the acceptance widths in [RESPONSIVE_RULES.md](RESPONSIVE_RULES.md).

## Icons and controls

Use **one outline icon family**. **Lucide React** is the approved implementation candidate; install it only in a separately authorized implementation phase. Do not use Material Symbols, mixed families, or a robot Ask AI icon. Choose one canonical non-robot outline icon per navigation destination and reuse that mapping everywhere.

Normal interface icons are approximately 18–20px, inside touch targets generally around 44px or larger. Hide decorative icons from assistive technology. Give icon-only controls accessible names. Prefer individual SVG icon imports over an external icon font.

Use real links for navigation and buttons for actions. Provide a clearly visible focus outline, approximately 2px with an offset; hover is not a substitute for focus. Status badges carry text, and controls may grow vertically as labels wrap.

## Accessibility and progressive disclosure

Use semantic headings, one main landmark, correctly labeled inputs, and a reading order that remains logical across widths. Provide textual equivalents for financial graphics. Keep source access and important concerns available on mobile and in Simple mode.

Help must open through keyboard, click, and tap; hover can supplement it. Modal sheets need a name, appropriate initial focus, contained focus, Escape, a visible close action, and focus return. A dedicated decision page styled like a panel remains a page and must not be given false modal semantics.

Respect reduced motion, enlarged text, zoom, safe areas, and visible focused content. The canonical **College Project · Simulated financial data** disclosure must cover standard and focused financial experiences. Exact placement belongs to the later interaction/design pass; do not add large repeated disclaimers.
