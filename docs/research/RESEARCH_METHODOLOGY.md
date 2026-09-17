# MARKET AI research methodology

System Design Gate 1, 2026-09-16. Proposed executable specification **research-method-v1** for the approved Release-1 synthetic universe. No calculations, dataset records, company values, assessment results or scenario outputs are generated in this document. Constants below define educational rules, not invented company data.

This is a transparent educational heuristic, not a scientifically validated investment model, forecast, recommendation or probability of gain/loss. Thresholds are deliberately coarse and chosen for understandable software behavior; they are not claimed to be empirically calibrated. Dataset review must test balanced cases and edge cases rather than reverse-engineer inputs to reproduce historical screenshots. [PRD](../product/PRD.md), [data invariants](../data/SYNTHETIC_DATA_CONTRACT.md), [logical model](../data/DATA_MODEL.md) and [explanation levels](../product/EXPLANATION_LEVELS.md) remain binding.

## Common calculation contract

Each result has method/rule key, value or category, units, period/window, input references, evidence references, availability and reason codes. Availability is available, partial, unavailable or not-applicable. Partial means a specific supported result with explicitly incomplete coverage, never guessed inputs. No data and neutral outcome are different.

At cutoff T, use only observations and source publications at or before T. Select the latest completed published annual period A0 and preceding comparable A1/A2; quarters are discrete periods, not year-to-date totals. Fiscal ends, reporting basis, currency, unit and revision policy must match. Annual pillar metrics use latest published annual results, whose reporting end must be within 550 calendar days of T. Valuation uses trailing twelve-month (TTM) earnings from exactly four consecutive, non-overlapping published fiscal quarters ending at the latest eligible quarter, whose end must be within 200 calendar days of T. Sum their ordinary net income; divide by their day-weighted average ordinary shares (sum of quarterly weighted shares times calendar days in that quarter / total days). Require all four complete quarters under the declared fiscal calendar and common reporting basis. This is a historical calculation, not an estimate, sum of quarterly EPS or annual fallback. Missing/stale/incompatible inputs make dependent results unavailable; historical reports remain readable.

The dataset uses comparable non-financial operating businesses and one ordinary share class. Applying these leverage/profit rules to banks/insurers is unsupported and would require a new method. All arithmetic uses the [decimal contract](../data/DATA_MODEL.md#money-units-and-time). Formula percentages below multiply fractions by 100; thresholds expressed as percentages compare that same unit. No intermediate display rounding. Median means middle sorted value, or arithmetic mean of the two middle values; unavailable observations are not zeros. An explicitly inapplicable metric cannot be reintroduced to complete a composite.

## Base metrics

All inputs listed are required unless an explicit special case is stated. Missing/incompatible inputs produce unavailable with their precise reason. Higher/lower comments describe interpretation under this heuristic, not investment instructions.

| Metric | Formula, unit and period | Edge/comparison rules | Interpretation and consumer |
| --- | --- | --- | --- |
| Revenue growth | 100 × (R0/R1 - 1), percent; A0 vs A1 or quarter vs same quarter one year earlier | R1 > 0, R0 >= 0; zero baseline unavailable. Same reporting basis/duration. No quarter-to-annual percentage. | Higher generally supports growth; Financials, Growth Potential, Peers, Ask. |
| Revenue CAGR | 100 × (sqrt(R0/R2) - 1), percent per year over exactly two fiscal years | R0 > 0 and R2 > 0; A0/A1/A2 all present, consecutive full fiscal years with identical annual boundaries and exactly two fiscal years between endpoints. No shortened/extended or incompatible reporting lengths; leap-year calendar differences are permitted. Intermediate revenue remains relevant to annual growth/trend interpretation even though CAGR uses endpoints. Missing periods or zero/negative endpoints make CAGR unavailable. Decimal square root. | Long-window growth context; Growth Potential/Ask. Not a future growth prediction. |
| EPS | Ordinary net income / weighted-average ordinary shares, INR/share for the stated period | Shares > 0; negative EPS is valid. Do not divide by period-end shares or sum quarterly EPS into annual EPS. | Input to valuation, Financials/Peers/Ask. |
| EPS growth | 100 × (EPS0/EPS1 - 1), percent, annual or comparable year-ago quarter | Prior EPS > 0 and current EPS > 0 only; otherwise percentage unavailable and use the earnings-state table below. | Growth Potential/Financials/Ask; no misleading positive growth from two losses. |
| Operating margin | 100 × EBIT/revenue, percent, latest annual or selected financial period | Revenue > 0; negative EBIT gives a valid negative margin. Compare same basis/period. | Higher generally stronger operating profitability; Business Health, peers. |
| Net margin | 100 × ordinary net income/revenue, percent, same period | Revenue > 0; losses remain negative. No peer comparison across mismatched fiscal periods. | Business explanation, Financials and Ask; no extra composite weight. |
| ROE | 100 × annual ordinary net income / ((equity at A0 end + equity at A1 end)/2), percent | Both equity endpoints > 0; negative/zero equity makes ROE unavailable, not impressive. Annual only; negative income yields negative ROE. | Quality context, peers/Pro. High leverage can inflate it; not used as a second pillar vote. |
| Cash conversion | Annual OCF / annual ordinary net income, times | Net income > 0; negative OCF gives negative ratio. Zero/loss denominator unavailable, with OCF and loss disclosed independently. | Business Health; larger generally supports cash backing, not guaranteed quality. |
| Debt/equity | Gross interest-bearing debt / ordinary equity, times at latest annual end | Debt >= 0 and equity > 0. Nonpositive equity unavailable with explicit risk flag. Zero debt is a valid zero ratio. | Financial Health, Risk, peers; lower generally less leverage. |
| Net debt | Gross debt - cash, INR at the same annual balance-sheet date | Both nonnegative; negative result means net cash. No forward cash forecast. | Financials/financial-health explanation and Ask; lower generally less net borrowing. |
| Interest coverage | Annual EBIT / annual finance interest expense, times | Expense > 0 normally. If expense=0 and debt=0, report not-applicable (no interest burden), treated as passing coverage for Financial Health. Expense=0 with debt>0 is unavailable; never infinity. Negative EBIT with expense>0 is a valid negative ratio. | Financial Health/Risk; higher generally more ability to cover interest. |
| OCF | Stored operating cash flow for the selected period, INR | Can be negative or zero; comparisons use compatible periods. This is an observation, not an LLM estimate. | Financial Health, cash-flow table, Risk. |
| Free cash flow | OCF - capital expenditure outflow, INR for same period | Capex >= 0; negative result valid, not automatically a bad investment. Capital investment can consume cash. | Financial Health context, Financials/Ask; not treated as cash balance. |
| P/E | Selected cutoff close / comparable TTM EPS, times | EPS > 0 and close > 0; zero/loss EPS unavailable. Same exact four-quarter window and reporting scope for peers. | Price vs Value, Peers, Ask. Lower is cheaper relative to earnings, not inherently better. |
| Period price return | 100 × (last close / starting close - 1), percent | Strictly positive endpoints and complete expected sessions; n-session return needs n+1 closes. No gap interpolation or annualization. Daily return uses the preceding session. | Chart, Price Direction, market/sector, Ask. Historical upward movement is not a future signal. |
| 60-session daily-return volatility | For 60 daily percentage returns d_i = 100 × (P_i/P_(i-1) - 1), mean d = sum(d_i)/60; volatility = sqrt(sum((d_i - mean d)²)/59), in percentage points of daily return | Latest 60 scheduled-session intervals ending at the last scheduled session at/before cutoff require 61 consecutive valid positive closes. Not annualized; no gaps, interpolation, shorter sample or shifting to an older complete window. | Risk/Pro; thresholds 1.5% and 3% mean this unannualized daily-return dispersion, not loss probability. |
| Maximum drawdown | Positive magnitude: 100 × max_i(1 - P_i/max_(0<=j<=i)(P_j)), across the same 61 closes spanning 60 scheduled-session intervals | Running peak starts at the first close in the window; no pre-window peak. Require all 61 positive closes, no interpolation. Flat/rising series yields zero. | Risk/Ask; thresholds 10% and 20% use this positive magnitude; larger means deeper observed peak-to-trough decline. |

ROCE, current ratio, P/B, EV/EBITDA, moving averages, technical indicators, OHLC, volume and DCF are **not selected**. They would add inputs/interpretations without a required v1 journey. ROE supplies a limited profitability context; P/E supplies one comparable valuation measure. EPS variability is not a second risk statistic: annual loss transitions and the growth pillar already disclose it. Quarterly financial comparisons use the same growth/margin rules; they do not become extra composite votes.

### Earnings-state transitions

Compare compatible EPS observations before any percentage calculation. Missing/incompatible either endpoint gives unavailable. These states describe per-share earnings, not a forecast.

| Prior EPS | Current EPS | State / percentage |
| --- | --- | --- |
| Positive | Positive | Increased / unchanged / decreased earnings; ordinary EPS growth allowed. |
| Negative or zero | Positive | Turned profitable; no percentage. |
| Positive or zero | Negative | Turned loss-making; no percentage. |
| Negative | Negative, closer to zero | Loss narrowed; no percentage. |
| Negative | Negative, farther from zero | Loss widened; no percentage. |
| Negative | Same negative value | Loss unchanged; no percentage. |
| Positive | Zero | Earnings fell to break-even; no percentage. |
| Negative | Zero | Loss moved to break-even; no percentage. |
| Zero | Zero | Remained at break-even; no percentage. |

## Research pillars

Canonical output is **Strong / Mixed / Weak**, plus explicit unavailable. Each rule retains individual metric results and evidence. Strong means every stated strength test passes; Weak means at least one stated weakness test passes; Mixed covers the remaining fully evaluable cases. Evaluate known Weak triggers first: if one fires while another input is missing, return Weak with partial coverage and missing-input reasons. Otherwise, any required missing input makes the pillar unavailable, rather than Mixed. Zero boundaries follow the exact inequalities below.

| Pillar | Strong | Weak | Required inputs / rationale |
| --- | --- | --- | --- |
| Business Health | Operating margin >=10%, net income >0, cash conversion >=1 | EBIT <=0, net income <=0, or OCF <0 | Annual EBIT, revenue, income, OCF. Margin and cash backing provide two different views of business quality. Revenue=0 precludes Strong and leaves margin unavailable unless a known Weak trigger applies. The 10% rule is an educational cutoff, not sector-normalized quality. |
| Growth Potential | Annual revenue growth >=10%, two-year revenue CAGR >=5%, valid EPS growth >=0 | Annual revenue growth <0, CAGR <0, valid EPS growth <0, or earnings state turned loss-making, loss widened, or earnings fell to break-even | Three annual revenues and two annual income/weighted-share observations. Positive-to-positive EPS is Strong progression at growth >=0 and Weak at <0. Turned profitable, loss narrowed, loss moved to break-even, loss unchanged and remained at break-even give Mixed progression without a percentage. Such known states are evaluable, not missing; recovery cannot yield Strong. Missing observations remain unavailable unless a supported Weak trigger applies. |
| Financial Health | Debt/equity <=0.5, coverage >=4 or its zero-debt not-applicable case, OCF >0 and FCF >=0 | Equity <=0, debt/equity >1.5, coverage <1, or OCF <0 | Latest annual balance/income/cash flow. Mixed deliberately includes intermediate leverage/coverage or cash-consuming investment. Missing capex cannot yield a positive FCF. |

Overlap is deliberate and limited: Business Health uses OCF relative to profit as cash backing; Financial Health uses its sign and FCF for funding capacity. Earnings feed profitability and growth, but Growth compares progression rather than repeating a current-loss vote. Risk exposes warning conditions without numerical weighting. Metrics are not separate votes in Research Picture.

These constants separate obvious strength, intermediate conditions and explicit weakness without pretending to quantify business quality precisely. The dataset may demonstrate all outcomes; no output is specified before execution. Simple gives the condition's meaning and caveat, Normal names the inputs, Pro shows the exact rule, periods and evidence. All three explain the same result. A missing input is visible at every level.

## Risk

Risk is **Low / Medium / High** within the simulation, with a coverage flag; it is not a probability of loss. Stock risk uses the latest annual inputs and the trailing 60-return window (61 valid closes) at cutoff, independent of research horizon so the same immediate concern remains visible.

1. **High** if any known trigger holds: equity <=0; debt/equity >1.5; interest coverage <1; annual net income <=0; annual OCF <0; 60-session daily-return volatility >3%; maximum drawdown >20%. If other inputs are missing, retain High with partial coverage, never claim a complete risk check.
2. Otherwise **unavailable** if any required risk input/window is unavailable. Debt=0 and interest=0 is the declared coverage exception. Evidence/price gaps must not produce Low risk.
3. Otherwise **Low** only when debt/equity <=0.5, coverage >=4 or the exception, income >0, OCF >0, volatility <=1.5% and drawdown <=10%.
4. Otherwise **Medium**. Zero OCF is therefore Medium, not Low or High unless another trigger applies.

IPO Risk uses the financial triggers only and is labeled **financial risk only; no trading history assessed**. Apply steps above without volatility/drawdown inputs and never represent absence of pre-listing prices as low observed trading risk. Evidence Confidence is separate: missing evidence yields coverage warnings/unavailability and does not get averaged into a financial risk score. Exactly 3% volatility or 20% drawdown does not trigger High; exactly 1.5% volatility and 10% drawdown pass those Low tests. Other signals still determine the final category. A recent listing with fewer than 61 valid scheduled closes has unavailable price-risk inputs; a supported financial High trigger stays partial High, otherwise Risk is unavailable. The price thresholds are deliberately coarse stress bands for the synthetic demonstration, not empirically estimated risk tolerances.

## Price vs Value

Keep the beginner-facing heading **Price vs Value**, but define it as **relative valuation position against comparable synthetic peers**. No intrinsic/fair-value claim is made. Avoid the label Fair, which could imply an intrinsic valuation model.

Release 1 deliberately uses one common synthetic fiscal calendar across all issuers (a dataset-design constraint). Compare actual period start/end dates, not fiscal-quarter labels: the four-quarter trailing windows must match exactly in this bounded dataset, with the same accounting/reporting scope and INR currency. Different fiscal calendars are unsupported in v1; there is no implicit alignment tolerance or relabeling fallback.

Select all eligible same-sector listed peers excluding self, with strictly positive TTM EPS, a valid close at the same last scheduled session at or before cutoff, and the exact same four-quarter window/reporting basis/currency as the subject. The subject must also have strictly positive, complete comparable TTM EPS and that session close. A missing expected close is not replaced by an older close. Record the complete candidate set, accepted peer IDs/input references and exclusion reasons in snapshot provenance; this deterministic sector rule owns the canonical peer set. Require at least **two** peers. No cherry-picking, cross-sector fallback or use of future publications. Median peer P/E is M; subject P/E is E. Compute E/M using unrounded ratios.

- **Attractive (relative):** E/M <0.85.
- **In line:** 0.85 <= E/M <=1.15.
- **Expensive (relative):** E/M >1.15.

The symmetric 15% band creates a visible neutral region instead of relabeling every tiny difference; it is a teaching convention, not a mispricing estimate. Always expose earnings date, peer count, comparability and business/risk caveats. Growth and quality are adjacent context, not arbitrary multipliers adjusting P/E. A price decline only changes valuation through the current price and all other inputs; it does not by itself establish attractiveness. Missing/negative earnings, fewer than two qualifying peers or stale/mismatched statements make the assessment unavailable. The small peer set is an explicit limitation.

IPO valuation uses the same four-quarter TTM ordinary net income divided by **post-offer shares**, labeled pro-forma TTM per-share earnings; numerator is unchanged historical income, with no assumed return from proceeds. Use final issue price when published, otherwise the upper band with its basis label. Compare that P/E to eligible peers using the same period and two-peer minimum. Post-offer shares are pre-offer shares plus fresh shares; OFS does not change the denominator. For the Listed offer, use its historical pre-listing evaluation cutoff and do not reinterpret it using the current Stock quote.

## Price Direction and horizons

Price Direction describes observed movement, not projected movement. For n scheduled trading-session intervals, return = 100 × (latest close / close n scheduled trading sessions earlier - 1). The latest endpoint is the last scheduled session at or before cutoff. The **20/60/252-session** windows require respectively **21/61/253 valid positive closes**, including every scheduled close between endpoints. No calendar-day offsets, interpolation or backward shifting around a missing latest close. A missing required observation makes that window unavailable; other complete windows remain independently usable.

Return > +5% means **Up**; return < -5% means **Down**; otherwise **Flat**, including exactly +5% and -5%. Flat is the canonical category (plain-language prose may say broadly flat). Show actual dates/session count and the uncalibrated 5% tolerance. Daily quote movement remains separate. Never fabricate pre-listing prices or relabel a shorter series.

Short Research Picture consumes 20-session Direction; Medium consumes 60-session Direction. The 252-session Direction is supporting historical Pro information for Long, when available; **Long Research Picture consumes no Direction component**. Unavailable 252-session history does not mean Down and does not block Long synthesis if its own required components are complete.

## Research Picture

Use **categorical synthesis only: Strong / Mixed / Weak**, with explicit unavailable. No numerical score, hidden weight, manually authored overall result or LLM override. Price Direction and Price vs Value are contextual modifiers, not independent investment recommendations.

Every Stock horizon requires Business Health, Growth Potential, Financial Health and Risk. Additional requirements and non-adverse states are:

| Horizon | Required contextual components | Condition permitting Strong |
| --- | --- | --- |
| Short | 20-session Price Direction | Up or Flat (not Down). |
| Medium | 60-session Price Direction and Price vs Value | Up or Flat, and Attractive (relative) or In line (not Expensive). |
| Long | Price vs Value | Attractive (relative) or In line (not Expensive); no Direction input. |

Completeness means every required component satisfies its calculation/provenance rules with complete coverage. A partial component is incomplete for synthesis, even when a known trigger permits its individual category to be displayed. A supported partial High Risk remains visible as Risk but cannot override overall unavailability. Unsupported inputs are unavailable; the declared zero-debt interest-coverage exception is evaluable, not missing.

Evaluate in this exact order:

| Priority | Condition | Research Picture |
| --- | --- | --- |
| 1 | Any required component unavailable or partial | Unavailable, with coverage reasons. |
| 2 | Complete, and Risk High OR at least two of the three pillars Weak | Weak. |
| 3 | Complete, all three pillars Strong, Risk Low, and all required contextual components non-adverse as above | Strong. |
| 4 | Every other complete case | Mixed. |

Thus exactly one Weak pillar with Low/Medium Risk is Mixed; all Strong pillars with Medium Risk are Mixed; Down relevant Direction or Expensive valuation prevents Strong but does not alone force Weak. Flat Direction and In line valuation permit Strong fundamentals with Low Risk to remain Strong. No majority score or extra metric vote exists.

Required calculation inputs and cutoff-qualified provenance must satisfy the methodology before a category is produced. **Low Evidence Confidence does not make Research Picture Weak** and is not a synthesis input; it separately reports evidence quality/coverage. Critical integrity inconsistency blocks snapshot publication entirely. Explanation levels cannot change these results.

IPO Research Picture uses the same ordered completeness/Weak/Strong/Mixed rules with the three pillars, financial-only Risk and relative IPO valuation; Strong requires non-Expensive valuation. It has no Stock horizon or Direction component. It summarizes business/offer research, not listing-day performance; subscription demand is factual context, not a score boost. No IPO Decision framework is introduced.

## Evidence Confidence

Output High / Medium / Low with reasons, never a percentage. This describes coverage and internal consistency of simulated evidence, not independent verification or confidence in an investment outcome. A malformed/contradictory dataset cannot earn a low badge and be published: reconciliation and referential-integrity failures block publication.

For each snapshot compute these booleans:

- C1: every displayed material financial finding has available supporting sources/input provenance and valid cutoff-qualified references; unavailable claims are not displayed as facts.
- C2: three annual and eight quarterly complete reports are available by cutoff, with the reconciliation checks passing. Fewer reports at an earlier cutoff fails C2 without inventing history.
- C3: latest annual end within 550 days and latest quarter end within 200 days of cutoff; evidence dates otherwise valid.
- C4: every expected session since max(listing date, two-year coverage start) through cutoff has a valid close, with no gaps in that eligible interval. Natural pre-listing absence is not a gap; a recent listing can pass C4 while its 252-session signal is unavailable. For IPO evaluation without trading history, C4 means required offer terms, ownership/proceeds and lifecycle-appropriate subscription evidence are available; Upcoming demand is not-applicable and does not fail it.
- C5: every selected financial report and required lifecycle offer document has readable canonical source content, simulated attribution, publication metadata and valid input-to-source mapping; every displayed calculation or unavailability reason has reproducible method/input mapping. This tests evidence, not financial applicability. Complete loss reports, nonpositive equity and valid zero denominators do not fail C5 because a calculation is unavailable. Scenario-assumption availability is reported separately and does not alter this evidence badge.

**High** requires all five. **Medium** requires C1 and C3 plus at least two of C2/C4/C5. **Low** covers other valid, nonempty evidence sets. No available evidence yields unavailable, not Low. Show which conditions failed; different kinds of incompleteness are not hidden behind the category. This is an evidence-coverage heuristic, not a universal evidence-quality standard. Changing only financial outcomes while preserving coverage, recency and provenance must not change the badge. High can accompany Weak research or unavailable valuation. Original source content remains unchanged by explanation level.

## Scenarios

Use three point-valued **illustrative P/E price and percentage-change sensitivity cases**, Weak / Base / Strong. They are not probabilities, intrinsic valuation, forecasts or a continuous return range.

**Canonical assumptions:** separately seeded, inspectable StockScenarioAssumptions per listing/cutoff/method and IpoScenarioAssumptions per offer/evaluation-cutoff/method. Each has immutable dataset/version identity, explicit window, authored rationale, and three case inputs: earnings-change fraction g > -1 and peer-multiple multiplier m > 0. Each case describes the assumed business condition. Factual rationale links to actual cutoff-qualified evidence through typed joins; a discretionary stress assumption is labeled an authored educational assumption, never misrepresented as evidence. No global sector stress constants, automatic defaults, author-entered output prices or LLM-generated inputs. Actual values await authorized dataset design.

**Common engine:** EPS0 is positive comparable TTM EPS; M is the eligible median peer P/E under Price vs Value rules. Per case: assumed EPS = EPS0 × (1+g); assumed P/E = M × m; modeled price = assumed EPS × assumed P/E; modeled percentage change = 100 × (modeled price/reference price - 1). These are independent declared sensitivities, not estimated likelihoods. Validate all three cases, rationale/window and positive reference inputs. Require Weak price <= Base price <= Strong price; ties are allowed and disclosed. Invalid inputs make the entire scenario set unavailable with explicit reasons; no clipping, defaults or label sorting. Validation rejects malformed seeded assumptions or invalid calculated ordering and blocks snapshot publication. Missing/inapplicable prerequisites may be represented honestly as unavailable; never manufacture a case.

**Validity for every case:** EPS0 > 0, M > 0, 1+g > 0, m > 0 and reference price > 0; compatible valuation with at least two qualifying peers; a complete assumption record with the correct entity/cutoff/window; and identical dataset/method versions across assumptions, snapshot and inputs. Non-finite/invalid decimals are invalid. Use unrounded calculated inputs/intermediates for prices, percentage changes and ordering; display rounding is last. Canonical output serialization follows the precision contract and is never fed back as a rounded intermediate.

**Stock:** reference is the cutoff close; window is the next **30 calendar days**, shared across research horizons. All cases may lie above or below reference: Weak means the lowest modeled case, not a guaranteed loss boundary. The earnings change is an authored sensitivity, not a predicted report or annualized growth estimate. Decision question 5 cannot invent a reward/downside ratio when downside is zero or unsupported. **Scenario window is not research horizon.** Switching Short/Medium/Long at the same listing/cutoff/dataset/method retains the same assumptions, deterministic values and visibly labeled 30-day window. Surrounding explanation may change context/depth, never convert these outputs into a 3–5 year projection.

**IPO:** separate assumptions use the **listing-day** window, pro-forma TTM EPS based on post-offer shares, and cutoff-qualified final issue price or upper-band illustration as reference. Apply the common engine, not Stock's 30-day assumption set. No realized listing quote, current Stock quote or automatic subscription premium enters the model. Listed offers retain historical pre-listing evaluation. All common validity and ordering rules apply, including positive pro-forma TTM EPS, a positive valid offer-price basis, compatible positive peer median, g > -1, m > 0, matching versions and complete explicit listing-day assumptions. Post-offer shares = pre-offer shares + fresh shares; OFS does not change shares. No proceeds-driven earnings growth is silently added.

Persist calculated results with assumption identity/digest, method and exact financial/peer/price input references. Raw assumptions remain canonical; immutable outputs are their executed historical result. Simple explains case/condition, Normal adds results, Pro exposes these same inputs and multiplication. All retain the sensitivity limitation. No financial record or assumption value is created here.

## What Changed

Current means the selected published Stock snapshot at the requested dataset/cutoff/horizon. Previous means the **nearest earlier compatible snapshot** in that same version/horizon. The baseline's three cutoffs support current versus -30 days and -30 versus -60 days. No implicit comparison to wall-clock today or to another horizon.

Compatibility requires identical dataset version, issuer/listing, horizon, methodology version, metric definitions, currency, reporting scope, price-adjustment/calendar convention and scenario model/window. Advancing to a newly published fiscal period is a meaningful information change, not a comparability failure, if definitions/bases match; label the old/new period rather than imply like-for-like reported growth. v1 has no method migration adapter. Method mismatch or missing prior snapshot returns unavailable comparison with reason; never zero change.

Compare:

- Research Picture and pillar categories: Strong > Mixed > Weak is an ordinal reporting order only; report improved/weakened/unchanged category, never score points. Unavailable-to-available is newly available, not improved performance.
- Risk: Low < Medium < High; valuation: show the two relative-position categories and peer/period basis, not an unconditional improvement label.
- Metrics: exact current-minus-prior delta and unit; percent metrics use percentage points, ratios use times, prices use INR and separately computed percent change. Report input/reporting period changes. A metric available at only one endpoint is not subtracted.
- Evidence: added/removed IDs, changed availability, newly published event support, same-source deduplication. Unchanged immutable content cannot be described as revised without a new version.
- Risks/findings: compare stable rule/subject keys; added/resolved/continuing concerns. Scenario output changes compare the same labels/window/model with both baselines and assumptions visible, not realized returns.

All nonzero numeric deltas remain accessible in details; avoid arbitrary materiality rounding. Summary selection prioritizes changed risk triggers, category changes, then revenue/EPS growth, leverage, margins, valuation and scenarios in that fixed order, at most three headline items with full details available. No causal language from correlation: templates can say an input changed; a claimed cause requires a cutoff-qualified RecordedEvent and supporting evidence. Recent Change filters are Improving, Weakening, Unchanged and Newly available/Unavailable; category direction takes precedence, and within an unchanged category a material risk-category change determines direction. Other metric movement is detail, not an invented aggregate change score.

## Market, sector and discovery calculations

**Choice: retain a derived historical index.** Current-period means satisfy immediate Home/Explore movement cards, but PRD-002/003 explicitly require one broad index and supported two-year market/sector history. Retain a pure calculation over existing closes, without a separate index store, ingestion service or infrastructure. Current cards use the same daily-return calculation.

Use a **daily-rebalanced equal-weight synthetic index** with base **100.0** on the first covered common scheduled market session, provided all already-listed members have valid closes. For a listing entering within covered history, the seed must supply the valid official synthetic first close on its scheduled listing session; a missing initial close is an integrity failure, not a reason to delay membership silently. Established listings already eligible at the coverage start form the base membership; no out-of-coverage initial price is required. No issuer contributes before listing. At least one member is required for a supported base; a missing base is unavailable, not shifted forward to hide a gap.

For each consecutive common scheduled interval t-1 → t:

1. Fix eligible set E_t at interval start: base members plus new listings whose scheduled, validated first-close session is at or before t-1. Eligibility never depends on whether today's expected close is present.
2. Require valid positive P_i,t-1 and P_i,t for every eligible member. Compute fractional member return r_i,t = P_i,t / P_i,t-1 - 1.
3. Compute R_t = sum(r_i,t for i in E_t) / count(E_t), the arithmetic mean. Empty membership is unavailable.
4. Compute I_t = I_t-1 × (1 + R_t); displayed daily movement is 100 × R_t percent. No intermediate display rounding or market-cap weights.

A new listing first closing on T cannot contribute T-1 → T. It enters T → next scheduled session, when both required closes exist. An eligible member's missing expected close makes that interval unavailable; do not drop it, reweight, interpolate or fabricate zero. For the later dataset-validation milestone, published Release-1 seeded broad/sector index history must be contiguous over supported scheduled intervals. An unexpected missing eligible close in the canonical seed fails dataset validation/publication, even if an unavailable reason can be displayed; it is not an accepted permanent published-index gap. Runtime failures or deliberately incomplete test fixtures still return unavailable under these rules. Later chained index levels remain unavailable until a new validated dataset repairs the gap. Weekends and other non-session dates are not intervals or missing observations.

Sector indexes use exactly the same base normalization, interval math, eligibility, calendar and missingness rules over their sector membership. Sector daily/cumulative movement derives from that chain; separately labeled median same-window company return is a distinct statistic. No member means unavailable. The broad index is not the unweighted mean of sector returns when constituent counts differ. Period movement is 100 × (ending index/starting index - 1), requiring a complete supported chain; the base level itself is not a return. Display membership and coverage counts.

Home may explain latest index/current-period movement, sector movement and Research Picture category counts. A narrative cause (why markets moved) requires supporting cutoff-qualified synthetic events/evidence. Index math alone cannot establish causality; no additive causal contribution percentages are defined or permitted.

Sector Research Picture displays counts of Strong/Mixed/Weak/unavailable company snapshots at one cutoff and horizon. A summary category is the most common available category only with complete membership coverage and a strict majority; otherwise Mixed when coverage is complete, or unavailable when incomplete. No arithmetic median of qualitative research labels. Home defaults to Long; Explore uses its selected horizon. Market-current Ask shares Home's context.

Worth Researching is a neutral discovery list: eligible snapshots with Strong or Mixed Research Picture, not High Risk, at least Medium Evidence Confidence, and at least one sourced reason and concern. Stable name order, not a score ranking. A fully supported empty set is valid. Research changes use the comparison above; Biggest Changes orders categorical transition distance first, risk-category distance second, then name, explicitly as ordinal research changes, not return predictions. Sector/theme/collection scopes intersect canonical memberships. Filter values are the exact categories defined here; unavailable is explicit, never mapped to neutral. No raw ratio filters appear merely for Pro. Theme/collection editorial rationale and factual membership validation stay in the data model.

The peer-relative labels remain unchanged; “Lower / Near / Higher than peer valuation” would clarify relativity but changing approved presentation wording is outside this correction. Existing labels must always expose the relative basis and never imply future return potential.

## Versioning and missing data

research-method-v1 is still an unreleased design draft: these final corrections precede any implementation or generated snapshots and do not rewrite released results. Once finalized, it identifies this entire rule/formula/precision/comparability manifest. Any changed formula, threshold, period policy, aggregation, rounding that affects outputs or synthesis creates a new method version. Editorial wording that preserves meaning may have a separate template revision. Released snapshots keep original method/input/output digests. A deliberate dataset-version regeneration can rebuild all 108 Stock snapshots under a new method; it cannot silently rewrite released history. No complex migration engine is needed.

| Condition | Required result |
| --- | --- |
| Zero denominator / invalid decimal | Unavailable with reason; zero-debt interest exception only as defined. No NaN/infinity. |
| Negative earnings | Preserve loss and EPS; P/E and positive-base EPS-growth percentage unavailable; known loss triggers still work. |
| Negative equity | ROE/debt-equity ratio unavailable; explicit High risk/Weak Financial Health remains valid with reason. |
| Too few comparable peers | Valuation/scenarios unavailable; pillars and sources still work. No invented median. |
| Insufficient history / recent listing | Required return/volatility window unavailable; supported shorter Chart ranges remain usable and honestly dated. |
| Missing quarter | Missing cell and year-ago comparison unavailable; annual computations may still work if annual sources are complete. No quarter inferred by division. |
| Stale annual inputs | Historical records readable; dependent current assessments unavailable and cutoff explained. |
| Inconsistent source/statement | Reject draft dataset publication; unexpected runtime corruption fails affected results with diagnostics, not a fake low-confidence answer. |
| Missing scenario / question evidence | Display limitation; Decision navigation remains enabled under INT-013. |

## Verification before implementation completion

Implement pure calculation functions with explicit inputs, cutoff and method; no DB, clock or LLM inside the arithmetic. Use table-driven boundary cases for every threshold (below/equal/above), every category path, unavailable propagation and the zero-debt exception. Exact expected-value tests cover annual/TTM EPS and day weighting, permitted EPS growth and every earnings-state transition, margins, debt/equity, interest coverage and its exception, FCF, positive-only P/E, peer median and both inclusive valuation boundaries, offer reconciliation, n-session returns, both scenario output formulas, equal-weight returns/index compounding/sector aggregates and What Changed deltas. Each applicable formula needs normal, boundary, missing, zero-denominator and incompatible-basis cases with exact availability reasons. Decimal square-root tests cover CAGR/volatility with a declared precision tolerance of 1e-12 in canonical ratio units; category-boundary cases must assert the exact resulting category under the fixed precision policy.

Required table-driven acceptance cases before implementation completion:

| Family | Exact cases and expected behavior |
| --- | --- |
| Research Picture | All pillars Strong + Low Risk + non-adverse modifiers => Strong; one Weak + Low/Medium Risk => Mixed; two Weak or High Risk with complete inputs => Weak; adverse Direction/valuation alone prevents Strong => Mixed; any required missing/partial component takes precedence => unavailable, including partial High Risk. Low Confidence alone leaves the result unchanged. |
| Direction | Exactly +5% and -5% => Flat; above +5% => Up; below -5% => Down; insufficient or gapped 21/61/253-close window => unavailable for that window only. |
| Risk | Below/equal/above 1.5%/3% volatility and 10%/20% drawdown; 60 percentage returns and sample divisor 59; 61-close running peak; supported High plus missing price history => partial High; incomplete non-High => unavailable. |
| Scenarios | Exact common formula and percentage result; g <= -1, m <= 0, nonpositive EPS/reference, version mismatch or missing peers/assumptions => unavailable; invalid seeds/order block publication; ties preserved; same Stock outputs across horizons; separate IPO window/share basis. |
| Index | Two eligible members: interval return = (r1+r2)/2; verify exact compounded level. New listing enters only after first close; missing expected endpoint => unavailable, never reweight; weekends produce no interval. Apply identical sector rules. |
| Cash conversion | OCF/income for positive income, including negative OCF; zero income and loss => unavailable ratio, independent supported weakness retained. |
| CAGR | Three compatible full annual periods, positive endpoints => exact two-year formula within declared square-root tolerance; missing intermediate period, zero/negative endpoints or incompatible annual length => unavailable. |

Invariants: reconciliation, no future evidence, ordered scenario values for positive inputs, no generated source IDs, source deduplication, identical results across explanation levels, no change for identical compatible inputs, no favorable result caused by dropping a required input. Test index entry without pre-listing data, missing-session propagation, peer exclusion/self-exclusion, negative earnings/equity, eight-quarter gaps, snapshot incompatibility and explicit v1-versus-v2 rejection. Confidence tests hold evidence coverage constant while changing financial signs and assert the same badge; complete recent-listing coverage can be High despite unavailable long Price Direction. Scenario tests reject missing/invalid assumptions and future rationale evidence, preserve ties and distinguish Stock/IPO windows. Independently review expected seed outputs before publication; the LLM cannot verify deterministic math. This pass creates no test code or financial examples.

The first implementation slice may legitimately lack valuation peers and a prior snapshot. It must exercise explicit unavailable states instead of inventing those inputs; later authorized slices complete those families. See [slice plan](../architecture/BACKEND_ARCHITECTURE.md#first-vertical-slice). Final Release 1 still requires all agreed capabilities and the full bounded dataset.
