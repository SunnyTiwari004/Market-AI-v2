# MARKET AI terminology

Approved baseline: 2026-09-04. Apply these terms across routes, controls, accessible names, explanation copy, and synthetic demonstration answer content.

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
| Researching {company name} | Context label resolved from the selected fictional entity. “Researching Tata Motors” is historical design wording only. |
| Market AI 60-Second Overview | IPO overview heading. |
| Expanded name (abbreviation) | Expand on first mention in each independently entered context. Jaguar Land Rover (JLR) is a historical design example, not a canonical synthetic entity. |
| Large Professional Investors (QIB) | Beginner IPO investor category label. |
| Large Individual Investors (NII) | Beginner IPO investor category label. |
| Regular Individual Investors | Beginner IPO investor category label. |
| Fresh Issue | Newly issued shares; proceeds go to the company. |
| Offer for Sale (OFS) | Existing owners sell shares; proceeds go to those selling owners, not to the company's bank account. |
| College Project · Simulated financial data | Canonical educational/demonstration disclosure for the synthetic financial universe; exact placement is defined later. |

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

## Interpretation integrity

Daily movement, longer-term business health, absolute valuation, and relative attractiveness describe different concepts and periods. They may coexist when supported by the same canonical synthetic state; they are not predetermined conclusions for any company.

Historical Tata Motors interpretations and design values are not approved dataset assessments. All numerical values and comparison records follow the [synthetic data contract](../data/SYNTHETIC_DATA_CONTRACT.md); the fictional universe and methodology await later data design.

## Prohibited or stale terms

The strings in this table are rejection examples, not approved product copy. Documentation may also retain clearly labeled historical or prohibited examples; these do not authorize product claims.

| Prohibited or stale term | Required replacement or handling |
| --- | --- |
| Clarified; Clarified Intelligence; Clarified Financial Research | MARKET AI. |
| AI Score; AI Research Score; Market AI Score; Buy Score | Research Picture. |
| Data Confidence | Evidence Confidence. |
| BUY; SELL; HOLD; STRONG BUY; Strong Buy; INVEST NOW | Do not use as authoritative recommendations or transaction instructions. Explain research and risks. |
| 60-Second Verdict; Verdict | Use the canonical Ask AI answer or IPO overview heading for the relevant context. |
| Independent AI; Independent AI synthesis | Do not imply independent verification or a running AI system. Describe the actual research provenance. |
| Active Research Session | Use plain entity context, resolved from the selected fictional company. |
| High Net-worth; Retail | Use the approved beginner IPO investor labels as primary labels. |
| Bear; Bull; Worst Case; Best Case | Use Weak / Base / Strong as primary Simple-mode scenario labels. |
| Top Picks; Best Picks; High Conviction; Scanner; research scanners | Use neutral discovery language and explain why something is worth researching. |
| Growth Moat used as a synonym for Growth Potential | Explain growth potential and competitive advantage as different concepts. |
| Guaranteed Sales Ahead; income is secure | Avoid guarantees; use qualified, supported explanations. |
| cashing out | Describe selling shareholders and proceeds neutrally. |
| Live; Verified; Real-time; Exchange verified; Live NSE; Research verified | Prohibited real-market claims for synthetic content. Use the canonical simulation disclosure and honest provenance; simulation-context wording must not reasonably imply real data. |
| smart_toy; robot Ask AI icon; Material Symbols | Use one outline icon family, with a non-robot Ask AI icon. Lucide React is the approved implementation candidate. |
| Clarity Check used instead of Is This Serious? | Retain the canonical Ask AI answer hierarchy when implementing that section. |

## Copy integrity

In Simple mode, explain abbreviations and concepts such as basis points, support, momentum, operating leverage, and institutional rebalancing before exposing technical detail. Do not replace one financial concept with another merely to shorten its name.

Do not embed independent copies of fixture values inside prose. Compose the displayed numbers from the same research records used by metrics and comparisons. Offer status, relative dates, and freshness language require an approved simulated timeline.
