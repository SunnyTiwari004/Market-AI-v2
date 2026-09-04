# MARKET AI experience contracts

Approved baseline: 2026-09-04. This document specifies approved screen responsibilities, canonical section hierarchy, and interaction boundaries for the six canonical experiences. It is the single owner of their approved screen hierarchy; it does not authorize application implementation, invented financial values, or undefined interactions.

Data values remain governed by [MOCK_DATA_CONTRACT.md](../data/MOCK_DATA_CONTRACT.md), and terminology remains governed by [TERMINOLOGY.md](TERMINOLOGY.md). Layout details remain governed by the selected Stitch references and [DESIGN_SYSTEM.md](../design/DESIGN_SYSTEM.md), subject to the documented authority order. When screenshots conflict with this contract, this contract wins. Responsive presentations must retain the approved meaning and hierarchy.

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

Simple-mode discovery filters are **Research Picture**, **Price vs Value**, **Risk**, **Recent Change**, and **Research Horizon**. Normal/Pro may later expose deeper filters such as P/E, P/B, and ROCE only when approved data exists.

Preserve **Why It Stands Out** and **Needs Attention** as complementary concepts. Allowed example curated collection labels are Established Companies, Strong Financial Health, Research Picture Improving, and Quality at Reasonable Prices. These labels do not approve collection membership or ranking calculations.

Avoid the recommendation/ranking language listed in the [prohibited-term table](TERMINOLOGY.md#prohibited-or-stale-terms). Mobile may initially expose fewer research preview cards than desktop, but both resolve the same centralized records.

## Stock research

Role: **What should I understand about this company?**

Canonical demo entity: **Tata Motors / TATAMOTORS / NSE**. Its exact financial fixture remains governed by [MOCK_DATA_CONTRACT.md](../data/MOCK_DATA_CONTRACT.md#canonical-tata-motors-current-demo-fixture).

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
11. Decision CTA: **Thinking of investing in Tata Motors?** → **Help Me Think It Through**
12. Research pillars: Business Health, Growth Potential, Financial Health
13. Deep Research
14. What Changed?
15. Possible 30-Day Outcomes
16. Source / filing access

Quick View contains **Research Picture**, **Evidence Confidence**, **Risk**, **Price Direction**, and **Price vs Value**. **Overview comes before Quick View.**

Deep Research may include approved presentations such as Chart Interpretation and Earnings Call Breakdown. Do not create unapproved financial content merely because a tab or section exists. Missing deeper content remains unavailable or deferred under the data contract. Research context, daily movement, comparison period, and the explicit 30-day scenario window remain distinct.

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

The final section is **YOUR RESEARCH SUMMARY**, followed by the primary CTA **View Full Tata Motors Research** for the canonical demo. The summary is not a seventh question. Secondary actions are deferred unless their behavior is approved. Do not issue transaction recommendations; the prohibited recommendation terms remain defined in [TERMINOLOGY.md](TERMINOLOGY.md#prohibited-or-stale-terms).

## IPO research

Role: **What should I understand about this IPO?**

Canonical fictional example: **ABC Technologies**, an enterprise software / technology company. Exact IPO numbers remain unapproved unless added later to [MOCK_DATA_CONTRACT.md](../data/MOCK_DATA_CONTRACT.md#abc-technologies).

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
15. Thinking of Applying?
16. Help Me Think It Through CTA presentation

The IPO-specific decision framework is deferred. Its CTA presentation must not lead to a fabricated stock-style IPO framework or an unapproved `/ipos/[slug]/decision` route. A functioning CTA requires separately approved behavior; the reference presentation alone does not define that behavior.

Explain OFS neutrally: money from OFS goes to the existing owners selling shares, not to the company’s bank account. Avoid the emotional proceeds wording identified in [TERMINOLOGY.md](TERMINOLOGY.md#prohibited-or-stale-terms). Listing scenarios are modeled possibilities, not guarantees. All unapproved offer, ownership, demand, valuation, and scenario details remain unavailable; their place in the hierarchy does not supply a fixture.

## Ask AI

Role: **I have a question — answer it.**

The entry experience asks **What do you want to understand?** and includes a question composer and useful suggestions.

Include exactly four capability cards:

1. Understand a Stock
2. Compare
3. Explain Something
4. Understand the Market

For the canonical Tata Motors contextual answer, preserve this hierarchy:

1. Researching Tata Motors
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
| COMPARISON | HDFC vs ICICI, presented as a mini comparison table/matrix. The example names do not authorize missing comparison metrics. |
| CONCEPT | Illustrative example: ₹300 share price ÷ ₹10 annual earnings per share = 30× P/E. These are explicitly supplied teaching values, not an observed company quote or earnings result; any frontend fixture remains centralized under the data contract. |
| MARKET | Explain a NIFTY decline through clearly labeled contribution/context graphics. Do not imply an additive causal decomposition unless such methodology exists. |

The three archetypes do not replace the contextual stock-answer format. Current-market answers resolve the same market-day fixture as Home. A separate falling-market example must be clearly labeled as an example/demo scenario, rather than contradicting the current demo state.

Unsupported questions in the mock frontend return an honest demo limitation state rather than fabricated AI research. No actual AI integration, new evidence, or undefined deeper workflow is authorized by these answer structures.

## What Changed

**What Changed** is a signature reusable MARKET AI concept: previous research state versus current research state over an explicit comparison period. Its canonical Tata numerical state is defined only in [MOCK_DATA_CONTRACT.md](../data/MOCK_DATA_CONTRACT.md#what-changed-approved-30-day-comparison).

All presentations resolve the same compatible snapshot references. The frontend architecture anticipates a future What Changed engine through those structured references, but this frontend phase does not implement that engine. Section labels do not authorize additional history, causes, metrics, or calculations.

## Contextual education

Use one semantic help system with responsive presentation. On desktop, click/tap opens contextual help; hover may supplement access but must never be required. On mobile, tap opens a bottom-sheet presentation. Preserve keyboard access, shared content, focus handling, and safe-area behavior under [RESPONSIVE_RULES.md](../design/RESPONSIVE_RULES.md) and [DESIGN_SYSTEM.md](../design/DESIGN_SYSTEM.md).
