# MARKET AI experience contracts

Approved baseline: 2026-09-04. This document specifies approved screen responsibilities and canonical section hierarchy for the six canonical experiences and two directories. It is the single owner of their approved screen hierarchy; it does not authorize application implementation, invented financial values, or undefined interactions.

Scope reset: 2026-09-12. All financial experiences represent the shared simulated timeline, including “today” and “current.” Real-company/index names in the design examples below are historical visual/product-structure references only, not final dataset entities or approved financial content. Fictional identities and mapping will be defined in a later data-design milestone. The disclosure is **College Project · Simulated financial data**; placement is owned by [interaction contracts](INTERACTION_CONTRACTS.md#int-018-release-exclusions-and-trust).

Data values remain governed by [SYNTHETIC_DATA_CONTRACT.md](../data/SYNTHETIC_DATA_CONTRACT.md), and terminology remains governed by [TERMINOLOGY.md](TERMINOLOGY.md). Layout details remain governed by the selected Stitch references and [DESIGN_SYSTEM.md](../design/DESIGN_SYSTEM.md), subject to the documented authority order. When screenshots conflict with this contract, this contract wins. Responsive presentations must retain the approved meaning and hierarchy.

Gate 2.5 accepted update: 2026-09-13. [INTERACTION_CONTRACTS.md](INTERACTION_CONTRACTS.md) owns observable behavior; [EXPLANATION_LEVELS.md](EXPLANATION_LEVELS.md) owns depth. This document remains the hierarchy/responsibility owner.

## Home / Market Today

Role: **What is happening in the market today?**

Canonical content hierarchy:

1. Understand what’s happening today
2. Search
3. Market in Simple Words
4. Why is the market moving?
5. What Matters Today
6. Sector Picture
7. Worth Researching
8. Recent / Biggest Research Changes
9. IPO Watch
10. Ask Market AI

Home is a briefing experience. It must not become a generic stock screener, a recommendation leaderboard, or another Explore page. Current market content resolves the shared centralized market-day fixture. Section presence does not authorize missing market figures, drivers, sources, or company records.

## Explore

Role: **What is worth researching, and why?**

Canonical content hierarchy:

1. Find something worth understanding
2. Search
3. Discovery filters
4. Research Horizon
5. Worth Researching
6. Recent Research Changes
7. Sector Research Picture
8. Themes Driving the Market
9. Curated Collections
10. IPO Watch / Pipeline
11. Ask Market AI

Simple-mode discovery filters are **Research Picture**, **Price vs Value**, **Risk**, **Recent Change**, and **Research Horizon**. Raw-ratio filters are not a Release-1 consequence of Normal/Pro; later expansion requires a separate product decision and approved data.

Preserve **Why It Stands Out** and **Needs Attention** as complementary concepts. Allowed example curated collection labels are Established Companies, Strong Financial Health, Research Picture Improving, and Quality at Reasonable Prices. These labels do not approve collection membership or ranking calculations.

Avoid the recommendation/ranking language listed in the [prohibited-term table](TERMINOLOGY.md#prohibited-or-stale-terms). Mobile may initially expose fewer research preview cards than desktop, but both resolve the same centralized records.

## Stock research

Role: **What should I understand about this company?**

Historical design entity: **Tata Motors / TATAMOTORS / NSE**. It is not a canonical demonstration entity; no historical price, assessment, or source count is approved for the fictional dataset.

Canonical structure:

1. Stock identity/header
2. Current price and explicitly labeled daily movement
3. Research status / risk context
4. Explanation Level
5. Research Horizon
6. Stock navigation: Overview, Financials, Chart, News, Peers, Filings
7. Overview
8. Quick View
9. What Looks Good
10. Needs Attention
11. Research pillars: Business Health, Growth Potential, Financial Health
12. Supported Deep Research
13. What Changed?
14. Possible 30-Day Outcomes
15. Evidence / source access, also available contextually alongside claims
16. Decision CTA: **Thinking of investing in {company name}?** → **Help Me Think It Through**, resolving the selected fictional company name.

Quick View contains **Research Picture**, **Evidence Confidence**, **Risk**, **Price Direction**, and **Price vs Value**. **Overview comes before Quick View.**

Deep Research may include approved presentations such as Chart Interpretation and Earnings Call Breakdown. Do not create unapproved financial content merely because a tab or section exists. Missing deeper content remains unavailable or deferred under the data contract. Research context, daily movement, comparison period, and the explicit 30-day scenario window remain distinct.

The Decision CTA follows the major research/evidence/scenario context on both desktop and mobile; it must not interrupt the explanation before the pillars.

### Final Release-1 Stock views

| View | Responsibility |
| --- | --- |
| Overview | Meaning, Quick View, findings, pillars, deeper research, changes, scenarios, evidence and Decision entry in the order above. |
| Financials | Supported statement groups and annual/quarterly periods, explained changes, units and evidence. |
| Chart | Stored synthetic closing-price history, supported ranges and accessible value inspection/table alternative. |
| News | Canonical simulated articles and full source-backed reading. |
| Peers | Canonical comparable peer measures, trade-offs and contextual comparison entry. |
| Filings | Simulated reports/announcements with type/period discovery and source access. |

The [six bounded view contracts](INTERACTION_CONTRACTS.md#int-012-stock-and-six-view-contracts) own functional detail. All six are the final Release-1 target, not a requirement to build all six in the first coding milestone. Verified vertical slices expose only functioning views. Missing records inside an implemented view may be unavailable; an unimplemented view must not be exposed as a placeholder.

## Help Me Think It Through

Role: **Neutral stock decision framework.**

Use `/stocks/[symbol]/decision` with exactly six questions, in this order:

1. Is the business healthy?
2. Does the current price look attractive?
3. Is the price moving in a healthy direction?
4. What could go wrong?
5. Is the possible reward worth the downside?
6. What should I check before deciding?

Mobile shows one question at a time, **Question X of 6**, **Back**, and **Next**. Question 5 uses **Weak**, **Base**, and **Strong** when approved scenario fixtures exist. The question does not authorize new scenario numbers.

Desktop uses a dedicated route with a focused modal-style panel presentation. Do not create actual modal semantics or intercepted routing. Both presentations share the same question model, research state, and explanation level; ordinary mobile bottom navigation is absent in this focused flow.

The final section is **YOUR RESEARCH SUMMARY**, followed by the primary CTA **View Full {company name} Research**, resolving the selected fictional entity. The summary is not a seventh question. The summary combines the same research findings, risks, scenarios and watchpoints without a new assessment. It is directly addressable, with no completion gate. A navigable question index and step behavior follow [the Decision interaction contract](INTERACTION_CONTRACTS.md#int-013-decision-flow). Secondary summary actions remain deferred. Do not issue transaction recommendations; the prohibited recommendation terms remain defined in [TERMINOLOGY.md](TERMINOLOGY.md#prohibited-or-stale-terms).

## IPO research

Role: **What should I understand about this IPO?**

Historical fictional design example: **ABC Technologies**, an enterprise software / technology company. Inclusion in the final universe and all offer terms await data design under the [synthetic data contract](../data/SYNTHETIC_DATA_CONTRACT.md#ipo-data).

Canonical information architecture:

1. Offer identity
2. Offer dates / price band / minimum application, only when approved fixtures exist
3. Market AI 60-Second Overview
4. Research Picture
5. What Looks Good
6. Needs Attention
7. Where is your money going?
8. Fresh Issue vs Offer for Sale (OFS)
9. Who is selling?
10. Promoter/owner holding before and after, only when approved fixtures exist
11. Who wants shares?
12. Beginner investor categories: Large Professional Investors (QIB), Large Individual Investors (NII), Regular Individual Investors
13. Price vs Value
14. Listing scenarios: Weak, Base, Strong
15. Evidence / source access, also available alongside claims

The Release-1 IPO Decision CTA block is removed. The IPO-specific framework and `/ipos/[slug]/decision` remain deferred and unexposed; never repurpose the six Stock questions.

Explain OFS neutrally: money from OFS goes to the existing owners selling shares, not to the company’s bank account. Avoid the emotional proceeds wording identified in [TERMINOLOGY.md](TERMINOLOGY.md#prohibited-or-stale-terms). Listing scenarios are modeled possibilities, not guarantees. All unapproved offer, ownership, demand, valuation, and scenario details remain unavailable; their place in the hierarchy does not supply a fixture.

## Ask AI

Role: **I have a question — answer it.**

The entry experience asks **What do you want to understand?** and includes a question composer and useful suggestions.

Include exactly four capability cards on both desktop and mobile, accessible in the entry experience rather than only buried showcase links:

1. Understand a Stock
2. Compare
3. Explain Something
4. Understand the Market

For the contextual stock answer, preserve this hierarchy, resolving the selected fictional company name:

1. Researching {company name}
2. The 60-Second Answer
3. Key Drivers
4. Is This Serious?
5. What Changed?
6. What Should I Watch Next?
7. Sources
8. Deeper Workflow / Open Full Research
9. Follow-up composer

Do not introduce response-type tabs. The three named showcase answer archetypes are:

| Archetype | Approved example and presentation boundary |
| --- | --- |
| COMPARISON | {Company A} vs {Company B}, resolving two fictional companies from the synthetic universe and presented as a mini comparison table/matrix. The archetype does not authorize missing comparison metrics. |
| CONCEPT | Illustrative example: ₹300 share price ÷ ₹10 annual earnings per share = 30× P/E. These are explicitly supplied teaching values, not an observed company quote or earnings result; any frontend fixture remains centralized under the data contract. |
| MARKET | Explain a simulated market-index decline through clearly labeled contribution/context graphics. Do not imply an additive causal decomposition unless such methodology exists. |

The three archetypes do not replace the contextual stock-answer format. Current-market answers resolve the same market-day fixture as Home. A separate falling-market example must be clearly labeled as an example/demo scenario, rather than contradicting the current demo state.

Until AI integration is implemented, unsupported questions return an honest demonstration limitation state rather than fabricated AI research. No actual AI integration, new evidence, or undefined deeper workflow is authorized by these answer structures.

## Stocks directory

Role of `/stocks`: find a fictional company and enter research. Include introduction, company/symbol search, sector choice, result count and shared cards with identity, research meaning, reason, caution and simulated date. Offer zero-result recovery and explicit contextual Ask links. This is a bounded directory, not a professional screener or score leaderboard.

## IPO directory

Role of `/ipos`: discover simulated offers by name and status, then enter research. Include search, supported status groups, dates, summary and available offer terms. Status follows the simulated clock; All is the grouped default. No application, watchlist or IPO Decision action.

Both directories may render the complete bounded supported dataset. Pagination is reconsidered only if final dataset size justifies it. [Directory interactions](INTERACTION_CONTRACTS.md#int-015-ipo-and-directory-contracts) own controls and recovery.

## Release-1 exclusions

The [single exclusion inventory](INTERACTION_CONTRACTS.md#int-018-release-exclusions-and-trust) governs all experiences. Account/profile, watchlist/star, Watch IPO, persistent Recent Questions, Ask answer sharing, IPO Decision and artifact-less downloads are deferred/unexposed. Customize Columns, hamburger, fake verification/live labels, placeholder links, unsupported candlestick and investment-action wording are removed. Stock/IPO Share, evidence access, contextual Ask, supported horizons and all six functioning Stock views remain in the final target. Section names such as IPO Watch mean editorial previews, not a personal Watch IPO feature.

## What Changed

**What Changed** is a signature reusable MARKET AI concept: previous research state versus current research state over an explicit comparison period. No historical Tata numerical state is canonical; snapshot integrity is governed by the [synthetic data contract](../data/SYNTHETIC_DATA_CONTRACT.md#research-snapshots-and-what-changed).

All presentations resolve the same compatible snapshot references. The intended application will execute real What Changed comparisons on synthetic snapshots; this documentation-only milestone does not implement the engine. Section labels do not authorize additional history, causes, metrics, or calculations.

## Contextual education

Contextual education accompanies research without changing its conclusions. [Context Help](INTERACTION_CONTRACTS.md#int-006-context-help-profile-h) owns behavior and focus; [responsive rules](../design/RESPONSIVE_RULES.md) and [design system](../design/DESIGN_SYSTEM.md) own adaptation and presentation.
