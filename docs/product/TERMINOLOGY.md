# MARKET AI terminology

Approved baseline: 2026-09-04. Apply these terms across routes, controls, accessible names, explanation copy, and mock answer content.

## Canonical vocabulary

| Term | Meaning and usage |
| --- | --- |
| MARKET AI | Canonical product branding. |
| Research Picture | Research assessment, with its scale when a score is available. Not an AI-generated recommendation or probability of profit. |
| Evidence Confidence | Assessment of supporting evidence. A qualitative value must not be converted into an invented percentage. |
| Business Health | Simple-mode explanation of the business's condition. |
| Growth Potential | Simple-mode explanation of potential growth; not interchangeable with competitive moat. |
| Financial Health | Simple-mode explanation of financial strength and constraints. |
| Price vs Value | Valuation context, with absolute assessment distinct from relative change. |
| Price Direction | Price movement with an explicit period; separate from business health. |
| Risk | Potential downside and uncertainty, described in plain language. |
| What Looks Good / Needs Attention | Balanced research findings and concerns. |
| Why It Stands Out | Discovery rationale, without transaction advice. |
| Worth Researching | Neutral discovery framing. |
| What Changed? | Comparison of identified previous/current research snapshots over a stated period. |
| Weak / Base / Strong | Canonical Simple-mode scenario labels; possibilities, not guarantees. |
| Help Me Think It Through | Neutral stock decision experience. |
| Your Research Summary | Final summary of the six-question stock framework. |
| The 60-Second Answer | Ask AI answer heading. |
| Researching Tata Motors | Context label for the Tata Motors Ask AI experience. |
| Market AI 60-Second Overview | IPO overview heading. |
| Jaguar Land Rover (JLR) | Expand on first mention in each independently entered context; use JLR afterward. |
| Large Professional Investors (QIB) | Beginner IPO investor category label. |
| Large Individual Investors (NII) | Beginner IPO investor category label. |
| Regular Individual Investors | Beginner IPO investor category label. |
| Fresh Issue | Newly issued shares; proceeds go to the company. |
| Offer for Sale (OFS) | Existing owners sell shares; proceeds go to those selling owners, not to the company's bank account. |
| Prototype · Demo research data | Single application-level prototype indication. |

## Explanation level

Display exactly **Simple**, **Normal**, and **Pro**. Default to **Simple**. The uppercase names in AGENTS.md describe the same three concepts, not additional modes. Levels change explanation depth while preserving the underlying conclusions.

## Research horizons

| Domain key | Display label | Meaning |
| --- | --- | --- |
| SHORT | Short term | Next 30 days |
| MEDIUM | Medium term | Next 12 months |
| LONG | Long term | 3–5 years |

Default: **LONG**, presented as **Long term · 3–5 years**.

Research Horizon and Scenario Horizon are different concepts. A Long-term 3–5 year research context may contain **Possible 30-Day Outcomes**. Changing research context must not silently relabel or stretch that scenario window. The What Changed comparison period is a third, independent period.

## Tata Motors interpretation

Use **Weaker today / Mixed short-term picture** for the approved daily/short-term interpretation and **Healthy / Mostly unchanged** for the longer-term business picture. **Fairly Valued** is the absolute Price vs Value assessment. **More Attractive after decline** is the relative interpretation only where its comparison context is shown. These statements can coexist without contradiction.

All numerical values and comparison records are owned by the [mock data contract](../data/MOCK_DATA_CONTRACT.md).

## Prohibited or stale terms

The strings in this table are rejection examples, not approved product copy. Stale-term search matches are permitted only in this clearly labeled table.

| Prohibited or stale term | Required replacement or handling |
| --- | --- |
| Clarified; Clarified Intelligence; Clarified Financial Research | MARKET AI. |
| AI Score; AI Research Score; Market AI Score; Buy Score | Research Picture. |
| Data Confidence | Evidence Confidence. |
| BUY; SELL; HOLD; STRONG BUY; Strong Buy; INVEST NOW | Do not use as authoritative recommendations or transaction instructions. Explain research and risks. |
| 60-Second Verdict; Verdict | Use the canonical Ask AI answer or IPO overview heading for the relevant context. |
| Independent AI; Independent AI synthesis | Do not imply independent verification or a running AI system. Describe the actual research provenance. |
| Active Research Session | Use plain entity context, such as Researching Tata Motors. |
| High Net-worth; Retail | Use the approved beginner IPO investor labels as primary labels. |
| Bear; Bull; Worst Case; Best Case | Use Weak / Base / Strong as primary Simple-mode scenario labels. |
| Top Picks; Best Picks; High Conviction; Scanner; research scanners | Use neutral discovery language and explain why something is worth researching. |
| Growth Moat used as a synonym for Growth Potential | Explain growth potential and competitive advantage as different concepts. |
| Guaranteed Sales Ahead; income is secure | Avoid guarantees; use qualified, supported explanations. |
| cashing out | Describe selling shareholders and proceeds neutrally. |
| Live; Verified; Real-time; Exchange verified; Live NSE; Research verified | Prohibited claims for mock content. Use the prototype indication and honest provenance. |
| smart_toy; robot Ask AI icon; Material Symbols | Use one outline icon family, with a non-robot Ask AI icon. Lucide React is the approved implementation candidate. |
| Clarity Check used instead of Is This Serious? | Retain the canonical Ask AI answer hierarchy when implementing that section. |

## Copy integrity

In Simple mode, explain abbreviations and concepts such as basis points, support, momentum, operating leverage, and institutional rebalancing before exposing technical detail. Do not replace one financial concept with another merely to shorten its name.

Do not embed independent copies of fixture values inside prose. Compose the displayed numbers from the same research records used by metrics and comparisons. Offer status, relative dates, and freshness language require an approved demo timeline.
