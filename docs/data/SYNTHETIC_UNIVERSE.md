# MARKET AI synthetic universe

Synthetic Universe Design Gate, 2026-09-17. Status: DATA/METHOD SPECIFIED; IMPLEMENTATION NOT STARTED. This is the canonical human-readable world blueprint, not generated financial records. [PRD](../product/PRD.md), [data invariants](SYNTHETIC_DATA_CONTRACT.md), [logical model](DATA_MODEL.md) and [research methodology](../research/RESEARCH_METHODOLOGY.md) remain authoritative. [SEED_BLUEPRINT.md](SEED_BLUEPRINT.md) owns the future generation and validation handoff. No numerical statements, prices, research classifications or scenario results are assigned here.

## Premise and bounded scope

An original Indian-market-inspired educational world of operating businesses, INR reporting, public research and simulated offers. All companies, reports, publishers and events are fictional. Use **College Project · Simulated financial data**. The venue display is **Market AI Simulated Market**, explicitly not an actual exchange, regulator or verification service. Do not borrow real financial histories, logos, articles, company assessments or exchange holiday schedules.

The final universe has 15 issuers: 11 established listings, one recent listing that also owns the Listed IPO, and three IPO-only issuers. Exactly 12 listings, four sectors, four offers and 108 Stock snapshots. Retain the PRD's **two themes, two collections, six concepts, 32 articles and 184 non-article documents**. The prompt's suggested larger discovery ranges are optional; the approved smaller baseline already exercises those journeys.

The financial/price narratives below are input-design intentions, not precomputed Strong/Mixed/Weak or valuation assignments. Numerical authoring must express the business story and then accept the engine's actual result. No equal distribution of categories is required.

## Version and identity

Initial dataset identity: **market-ai-synthetic-v1**. Method identity: **research-method-v1**. Initial seed specification: **seed-blueprint-v1**. The dataset remains unpublished until separately authorized generation and validation. Real generation timestamps and Git commits are audit metadata, never the sole dataset identity or financial clock. Released content changes require a new dataset version; calculation changes follow the existing methodology-version rule.

The opaque keys below are deliberately allocated registry keys, not row positions, ticker derivations or assessments. Freeze them when the catalog is approved; reordering this document never reassigns keys. Later stable IDs derive from a fixed namespace, entity kind and immutable key under the seed blueprint. Dataset-version + stable ID is physical identity. Symbols/slugs remain lookup attributes.

Listed symbols use 3–8 uppercase ASCII letters; Stock URL symbols are their lowercase forms. Issuer slugs use lowercase kebab-case and are unique across all 15 issuers. Offer slugs append -ipo to the issuer slug; no ticker is assigned to an IPO-only business. Initially supported aliases are canonical name, short name and listed symbol only; a later nickname needs an explicit catalog change. Ambiguity always returns choices.

Names are original design proposals, not a claim of trademark clearance or global uniqueness. No web collision search was performed. Final public-release collision checking is a release-preparation task; renaming must preserve stable identity.

## Sectors and peer groups

| Key | Sector / slug | Listed peer group | Economic contrast and applicability |
| --- | --- | --- | --- |
| s-6f2a | Digital Operations Services / digital-operations-services | TAVREN, NERALITH, ORYNTEL | Contract software operations and implementation services; employee-cost margins, low physical capital needs, renewal/growth differences. No lending, insurance or financial balance sheets. |
| s-1b9c | Household Products / household-products | VELMORA, SUDRAVA, PARNEX | Branded reusable household goods; manufacturing/distribution inventory, pricing pressure and turnaround variation. No retailer-bank hybrid. |
| s-8e4d | Industrial Components / industrial-components | DHARVEX, KELMIRA, ROVANTA | Business-to-business mechanical components; capacity cycles, machinery capex, order timing and borrowing. Similar operating-accounting basis. |
| s-3a7f | Facility Equipment / facility-equipment | AVENQOR, TALVESSA, MERUVAN | Thermal, water-handling and building-control equipment with maintenance services; project cash cycles and different equipment maturity. No infrastructure concession, utility tariff or finance-company exception. |

Three listed issuers per sector gives each two potential peers, not two automatically valid P/E observations. Different product mixes remain an explicit relative-valuation limitation. Banks/insurers and capital-heavy project-financing businesses were rejected because the accepted leverage, OCF and operating-margin rules are for ordinary non-financial operators.

## Issuer identity catalog

Dates are synthetic listing admissions, not evidence of real offers. Established admissions precede covered prices; no additional historical IPO records are created for them.

| Key | Canonical name | Short name | Issuer slug | Symbol | Sector key | Status / listing date |
| --- | --- | --- | --- | --- | --- | --- |
| i-7d2a | Tavren Systems Limited | Tavren Systems | tavren-systems | TAVREN | s-6f2a | Listed / 2020-06-01 |
| i-c4b8 | Neralith Digital Limited | Neralith Digital | neralith-digital | NERALITH | s-6f2a | Listed / 2022-04-04 |
| i-2e9f | Oryntel Services Limited | Oryntel Services | oryntel-services | ORYNTEL | s-6f2a | Listed / 2019-07-01 |
| i-a3c6 | Velmora Home Products Limited | Velmora Home | velmora-home-products | VELMORA | s-1b9c | Listed / 2018-04-02 |
| i-9f1d | Sudrava Consumer Limited | Sudrava Consumer | sudrava-consumer | SUDRAVA | s-1b9c | Listed / 2021-06-07 |
| i-5b8e | Parnex Household Limited | Parnex Household | parnex-household | PARNEX | s-1b9c | Listed / 2020-09-07 |
| i-e6a2 | Dharvex Motion Limited | Dharvex Motion | dharvex-motion | DHARVEX | s-8e4d | Listed / 2017-07-03 |
| i-1c7b | Kelmira Components Limited | Kelmira Components | kelmira-components | KELMIRA | s-8e4d | Listed / 2022-07-04 |
| i-8a4e | Rovanta Precision Limited | Rovanta Precision | rovanta-precision | ROVANTA | s-8e4d | Listed / 2019-04-01 |
| i-b2f5 | Avenqor Thermal Limited | Avenqor Thermal | avenqor-thermal | AVENQOR | s-3a7f | Listed / 2018-07-02 |
| i-4d9c | Talvessa Water Systems Limited | Talvessa Water | talvessa-water-systems | TALVESSA | s-3a7f | Listed / 2021-04-05 |
| i-f7a1 | Meruvan Controls Limited | Meruvan Controls | meruvan-controls | MERUVAN | s-3a7f | Formerly IPO; Listed / 2026-05-29 |
| i-6c3e | Elarven Workflow Limited | Elarven Workflow | elarven-workflow | — | s-6f2a | IPO-only / Upcoming |
| i-d8b4 | Nivora Kitchenware Limited | Nivora Kitchenware | nivora-kitchenware | — | s-1b9c | IPO-only / Open |
| i-3f6a | Kavreth Fabrication Limited | Kavreth Fabrication | kavreth-fabrication | — | s-8e4d | IPO-only / Closed |

## Business and evidence archetypes

Size is relative within this fictional corpus, not a market-cap classification. Evidence archetypes describe provenance/availability, never financial attractiveness. Standard reports means complete readable current-period coverage under the publication calendar, with fewer eligible quarters at C1. No cross-holdings, subsidiaries or related-party transactions between the 15 issuers are modeled; thematic overlap does not establish a customer/supplier relationship.

| Issuer | Business description / revenue model | Maturity / size | Profitability / leverage / growth / cash-flow intention | Evidence and peer context |
| --- | --- | --- | --- | --- |
| TAVREN | Runs contract-based software operations for regional businesses, earning recurring service and implementation fees. | Mature / larger | Profitable compounder; low debt; steady expansion; dependable OCF and positive FCF. | Standard reports; renewal dependence disclosed; other Digital Operations listings are peers. |
| NERALITH | Builds configurable workflow deployments, earning project fees followed by support subscriptions. | Scaling / medium | Profitable high growth; low leverage; hiring constrains cash conversion; price may outpace earnings. | Standard reports; customer concentration and delivery costs disclosed; Digital Operations peers. |
| ORYNTEL | Maintains older business applications on renewable support contracts. | Mature / medium | Still profitable but slowing/declining demand; modest debt; stable cash generation despite weaker growth. | Standard reports; renewal risk fully sourced; Digital Operations peers. |
| VELMORA | Manufactures reusable storage and cleaning products sold through distributors. | Mature / larger | Profitable, slowly growing cash generator; low debt; stable margins with packaging sensitivity. | Standard reports; distributor inventory context; Household peers. |
| SUDRAVA | Sells design-led household organizers through distributors and direct channels. | Scaling / medium | Profitable growth with margin pressure; moderate leverage; inventory absorbs OCF; investment-heavy FCF. | Standard reports; no invented missing evidence to hide cash concerns; Household peers. |
| PARNEX | Manufactures everyday household containers while replacing an underperforming product range. | Restructuring / smaller | Losses through FY2026 followed by a profitable quarterly recovery; elevated but manageable debt; cash recovery lags sales. | Standard reports support losses as clearly as profits; Household peers; transitional TTM applicability. |
| DHARVEX | Produces drive assemblies for factory machinery under customer orders and service contracts. | Mature cyclical / larger | Profitable but leveraged cycle; debt reduction underway; variable orders and improving OCF. | Standard reports; annual versus later quarterly debt dates kept distinct; Industrial peers. |
| KELMIRA | Produces precision housings on repeat manufacturing contracts. | Expanding / medium | Profitable growth; moderate debt; heavy equipment capex produces negative FCF without implying an operating loss. | Standard reports; capex rationale visible; Industrial peers. |
| ROVANTA | Supplies replacement industrial fittings and custom low-volume components. | Mature / smaller | Profitable margin-pressure business; moderate leverage; flat sales, erratic collections and weaker cash conversion. | Standard reports with order-delay context; Industrial peers. |
| AVENQOR | Supplies compact thermal-control equipment and recurring maintenance for commercial premises. | Mature / medium | Profitable, low leverage, healthy cash generation; quality business with slowing growth. | Standard reports; contract-renewal limits disclosed; Facility peers. |
| TALVESSA | Manufactures water-handling skids and earns installation and maintenance fees. | Established / medium | Profitable project business; moderate debt; uneven receivables, moderate growth and variable FCF. | Standard reports; project acceptance versus cash receipts explained; Facility peers. |
| MERUVAN | Makes building-control modules and sells commissioning and maintenance services. | Recently listed emerging / smaller | Positive earnings history with fast expansion; IPO-funded equipment investment; short, potentially volatile price history. | Delayed standalone Q4 publication and subsequent catch-up, openly dated; Facility peers AVENQOR/TALVESSA. |
| Elarven Workflow | Provides document-routing software implementation and annual support to small organizations. | Pre-listing scaling / smaller | Positive historical earnings, modest debt, growing contracts and reinvestment. | Standard financial/offer reports; compare with eligible Digital Operations listings. |
| Nivora Kitchenware | Makes durable kitchen storage accessories for distributor channels. | Pre-listing established / smaller | Profitable, moderate debt and inventory-led cash needs; expansion with packaging sensitivity. | Standard financial/offer reports; current Household peer viability checked, not assumed. |
| Kavreth Fabrication | Makes fabricated machine enclosures on batch contracts. | Pre-listing capital-intensive / medium | Profitable but cyclical; material leverage and capex; uneven cash conversion. | Standard financial/offer reports; compare with eligible Industrial listings. |

## Fixed clock and market calendar

**SIMULATION_CURRENT_DATE = 2026-09-30**; reference timestamp **2026-09-30T18:00:00+05:30**. This fictional clock does not advance with real time. All financial timestamps carry an explicit offset and are stored as equivalent UTC instants; date-only periods remain date-only. “Today” means this simulation date.

Calendar key **cal-4e8b**, policy **weekday-calendar-v1**: Monday–Friday only; no extra holidays in Release 1. This deliberately simple synthetic calendar is not a reproduction of an exchange calendar. Scheduled session close is 15:30 Asia/Kolkata. Only completed sessions at or before cutoff are eligible. Weekend cutoffs select Friday's scheduled close; they do not create weekend observations. Publication is allowed on weekends and is independently timestamped.

Ordinary price coverage is **2024-09-30 through 2026-09-30 inclusive**, a two-year anniversary interval with 523 scheduled closes per established listing. MERUVAN begins **2026-05-29**, with 89 scheduled closes through current date and 124 elapsed calendar days. Its first index return is the interval 2026-05-29 → 2026-06-01, not the preceding interval. Before entry the broad index has 11 members and Facility Equipment has two; thereafter they have 12 and three. The other sectors have three throughout covered history.

Published seed histories have every expected positive close, no random holes or pre-listing padding. Missing expected eligible closes block publication; error fixtures live outside the canonical dataset. Base 100 and all interval/sector calculations follow methodology. Covered history needs no prices from the established issuers' original admission dates.

## Research cutoffs

Research cutoffs are **as-of timestamps**, not necessarily trading-session dates. For any cutoff T, market-derived values use the latest scheduled synthetic trading session whose close is at or before T; an intraday cutoff before 15:30 uses the previous completed session. Financial/source eligibility separately requires publication timestamps at or before T, alongside the existing observation-time checks. No future close, observation or publication may leak into research. Thus Saturday 2026-08-01 maps to Friday 2026-07-31; the 18:00 cutoffs on 2026-08-31 and 2026-09-30 map to their own weekday sessions. The three research timestamps remain unchanged.

| Key | Research timestamp | Price endpoint | MERUVAN closes available | Interpretation |
| --- | --- | --- | --- | --- |
| C1 | 2026-08-01T18:00:00+05:30 | 2026-07-31 | 46 | Current minus 60 calendar days; weekend cutoff is intentional. Its 20-session Direction can work; 60-session Risk/Direction and 252-session Direction cannot. |
| C2 | 2026-08-31T18:00:00+05:30 | 2026-08-31 | 67 | Current minus 30 calendar days; June-quarter publication is now eligible. MERUVAN can support 60-session windows. |
| C3 | 2026-09-30T18:00:00+05:30 | 2026-09-30 | 89 | Fixed current state shared by Home and current-market Ask. MERUVAN still cannot support 252 sessions. |

All 12 listings exist at all three cutoffs. Exactly **12 × 3 × 3 = 108** Stock snapshot identities, even where a result is unavailable. Compatible adjacent comparisons are C1→C2 and C2→C3 per listing/horizon: 72 comparison pairs, calculated on request, not separate authored change records. C1 has no earlier Stock snapshot in this release. Same-cutoff scenarios are shared across horizons; no calendar interval is relabeled a trading-session return.

## Common fiscal and publication calendar

All 15 issuers use one **April 1–March 31** full fiscal year, quarters ending June 30, September 30, December 31 and March 31. This familiar structure supports comparability without introducing different calendars. Fiscal year labels use their ending year. INR whole-unit amounts with the model's decimal precision; single-company standalone ordinary-share reporting, no subsidiaries, minority interests, preference shares, FX translation or bank/insurer rules. No calendar exception or restatement in this version.

| Coverage | Periods stored at C3 | Standard publication policy |
| --- | --- | --- |
| Three annual reports per issuer | FY2024: 2023-04-01–2024-03-31; FY2025: 2024-04-01–2025-03-31; FY2026: 2025-04-01–2026-03-31 | June 15 after each March end, 18:00 +05:30 (76 calendar days). All three are eligible at C1/C2/C3. |
| Eight discrete quarters per issuer | 2024-07-01–09-30; 2024-10-01–12-31; 2025-01-01–03-31; 2025-04-01–06-30; 2025-07-01–09-30; 2025-10-01–12-31; 2026-01-01–03-31; 2026-04-01–06-30 | End +45 calendar days, 18:00 +05:30, except the Facility Equipment March-quarter convention and MERUVAN catch-up below. No year-to-date totals disguised as discrete quarters. |

Thus standard June-2026 reports publish 2026-08-14; seven quarters are eligible at C1, eight at C2/C3. The September-2026 quarter has just ended at C3 and is not yet published or part of the eight-quarter stored window. Earlier annual reports remain valid standalone source inputs where their quarters are outside coverage; do not add out-of-scope quarters simply to complete every annual sum. Reconcile all overlaps, including the full FY2026 quarter set.

**Facility Equipment year-end publication convention:** AVENQOR and TALVESSA publish their March discrete-quarter reports on June 15 alongside the annual package (76 days after period end), in each covered fiscal year. Their other quarters follow +45 days. This sector reporting cadence reflects year-end project-acceptance reconciliation and ensures all three Facility issuers use the December-2025 trailing window at the historical May-2026 IPO evaluation; there is no peer-calendar or method exception.

**MERUVAN publication exception:** its March-2026 discrete-quarter package publishes **2026-08-15T18:00:00+05:30**, and June-2026 on **2026-08-28T18:00:00+05:30**. Its migration to a separately presented quarterly reporting package delays those publications; the already-published annual report is not restated. The March-quarter report explains the delayed presentation. Do not backsolve a not-yet-published quarter from annual totals. At C1 its latest quarterly end is 2025-12-31, 213 calendar days old; at C2/C3 the June quarter is eligible. The exception is a deliberate chronology story, not corrupt or unreadable evidence.

TTM uses exactly four consecutive published quarters, sums ordinary net income and divides by day-weighted average ordinary shares as the accepted method requires. The latest quarter must be within 200 days. At C1 for the other 14 issuers the window ends March 2026; at C2/C3 it ends June 2026. MERUVAN's C1 TTM is stale and unavailable, not replaced by annual EPS. Actual period dates, reporting basis, currency and cutoff session establish peer comparability. No future evidence or quarter-label substitution.

## IPO identities and lifecycle

Offer open time is 09:00 and close time 17:00 +05:30 on the stated dates. Terms publish at 18:00 unless specified. Expected listings are plans, never actual listings or extra Stock entities. Current states below are derived at C3, not editable status fields.

| Offer key / slug | Issuer | Terms published | Opens | Closes | Expected listing | Actual listing | Current status / evaluation |
| --- | --- | --- | --- | --- | --- | --- | --- |
| o-8c2f / elarven-workflow-ipo | i-6c3e | 2026-09-25 | 2026-10-12 | 2026-10-14 | 2026-10-21 | None | Upcoming; evaluate at C3 |
| o-1a9e / nivora-kitchenware-ipo | i-d8b4 | 2026-09-18 | 2026-09-28 | 2026-10-02 | 2026-10-09 | None | Open; evaluate at C3 |
| o-6d3b / kavreth-fabrication-ipo | i-3f6a | 2026-09-14 | 2026-09-21 | 2026-09-23 | 2026-10-06 | None | Closed; evaluate at C3 |
| o-b7e4 / meruvan-controls-ipo | i-f7a1 | 2026-05-11 | 2026-05-18 | 2026-05-20 | 2026-05-29 | 2026-05-29T09:00:00+05:30 | Listed; historical evaluation 2026-05-29T08:59:59+05:30 |

MERUVAN uses the same i-f7a1 issuer for IPO and Stock. Its historical IPO valuation uses the last completed peer session (2026-05-28), December-2025 TTM and published final issue price; the FY2026 annual report published in June is excluded. AVENQOR and TALVESSA provide its two possible listed peers at that historical cutoff. Its own first closing price is later that day and is never an IPO input. Only FY2024/FY2025 annual reports are published at this pre-listing evaluation, so three-annual-period CAGR and the dependent IPO synthesis may legitimately be unavailable; supported TTM valuation/scenarios and evidence remain accessible. Do not leak the June-published annual report backward.

| Offer | Structure / purpose / proceeds | Holders and investor coverage | Evidence, valuation and scenario rationale |
| --- | --- | --- | --- |
| Elarven | Fresh issue plus OFS; company net proceeds for deployment tooling, staff training and working capital; OFS to selling owners. | Founder group retains shares; early-capital group partly sells; modeled new public allottee pool. All three approved investor reservation categories, no subscription observations before opening. | Offer sections cover business, financial references, shares, planned proceeds and ownership. Upper band only at C3. Digital Operations peers; listing-day sensitivities discuss contract delivery and peer-multiple uncertainty. |
| Nivora | Fresh issue only; packaging equipment and distribution inventory; OFS quantity and selling proceeds genuinely zero. | Founder and early-capital groups do not sell; dilution arises from fresh shares. All three categories have positive reserved quantities and current observed demand. | Offer plus lifecycle update observed 2026-09-30T16:00 and published 17:00. Upper band; no final price yet. Household peers; sensitivities discuss inventory cash needs and pricing pressure. |
| Kavreth | Fresh issue plus OFS; net fresh proceeds for machinery and debt repayment. | Founder group sells a portion, early-capital group retains; new public pool. All three categories with final-close demand observed 2026-09-23T17:00. | Lifecycle update published 2026-09-24T18:00 records final demand and final issue price. Industrial peers; sensitivities discuss capacity utilization and financing pressure, not guaranteed debt-funded returns. |
| Meruvan | Fresh issue plus OFS; commissioning tools, equipment capacity and working capital. | Founder group retains; early-capital group partially sells; public allottee pool receives fresh and transferred shares. All three categories with final demand observed 2026-05-20T17:00. | Lifecycle update published 2026-05-22T18:00 records final price/demand and expected listing. Actual listing confirmed by the 2026-05-29 announcement. Separate pre-listing sensitivities cover equipment delivery and peer multiples; Stock has its own 30-day assumptions. |

Holder groups are offer ownership categories, not additional operating issuers or user accounts. Offer terms contain fixed share quantities/reservations and planned post-offer ownership; non-Listed offers label that ownership pro-forma. No final allotment assertion before evidence. No rupee/share quantities or allocation fractions are locked in this pass. Later arithmetic must reconcile gross fresh/OFS/expenses/net fresh, purpose fractions, reservations and holder before/after shares. Issue proceeds never automatically increase historical income. Final price is usable only after publication, otherwise upper-band illustration. No future subscriptions, price or actual listing records for the three IPO-only issuers.

## Financial statement blueprint

Direction across A24→A25→A26 and the eight listed quarters guides later independent input authoring. The quarterly column covers the entire eight-quarter sequence, not just the newest result. Shares remain stable for the 11 established companies; no splits, buybacks or dividend adjustments. All narratives must reconcile typed statements; exact figures and resulting categories remain unassigned.

| Symbol | Three-year revenue / margins / earnings | Eight-quarter trajectory | Debt / OCF / FCF | Share and accounting notes |
| --- | --- | --- | --- | --- |
| TAVREN | Steady growth / stable healthy margins / positive rising earnings | Gradual expansion with modest seasonality; June 2026 broadly continues trend | Low debt; consistently cash-backed income; positive FCF | Stable ordinary shares; no hidden capitalized operating costs |
| NERALITH | Strong growth / healthy then moderating margin / rising positive earnings | Scaling deployments; hiring cost rises in last two quarters | Low debt; OCF positive but conversion fluctuates; reinvestment reduces FCF | Stable shares; support revenue and project receipts separated in rationale |
| ORYNTEL | Flat then declining / gradually compressing / lower but positive earnings | Successive renewal weakness, no fabricated abrupt collapse | Modest debt; cash release supports OCF; positive but slowing FCF | Stable shares; declining growth can coexist with positive cash |
| VELMORA | Slow growth / stable / consistently profitable | Seasonal distribution peaks, modest overall expansion | Low debt; strong OCF; maintenance capex leaves positive FCF | Stable shares; inventory changes reconcile cash |
| SUDRAVA | Growing / compressing / positive earnings with reduced growth | Early expansion then inventory accumulation and margin squeeze | Moderate debt; uneven OCF; capex-heavy FCF | Stable shares; no profitability boost from inventory cash use |
| PARNEX | Decline then stabilizing revenue / negative-to-less-negative / losses through A26 | Losses narrow before March 2026; June 2026 returns to profit after product reset | Elevated debt; weak OCF improving later; FCF recovering from negative | Stable shares. Story aims for nonpositive March TTM and positive June TTM through genuine quarterly recovery; numerical feasibility must be reviewed, never forced by changing methods |
| DHARVEX | Cyclical revenue recovery / recovering margin / positive earnings | Uneven early demand, stronger later batches; June report captures debt repayment | High borrowing followed by deleveraging; OCF improves; FCF mixed | Stable shares; June debt change must not overwrite March annual balance |
| KELMIRA | Rising / stable profitable operations / rising positive earnings | Repeat orders and commissioning expenses, continued June growth | Moderate debt; positive OCF; negative FCF during machinery build | Stable shares; investment-heavy cash use is not automatically poor business quality |
| ROVANTA | Flat to slightly lower / compressing / still positive earnings | Mixed batches, delayed deliveries and collections, modest June weakness | Moderate debt; uneven OCF; weak/variable FCF | Stable shares; receivables and cash movement reconcile |
| AVENQOR | Rising but slowing / healthy stable margin / positive earnings | Mature maintenance base with slowing new equipment orders | Low debt; dependable OCF and positive FCF | Stable shares; quality does not guarantee high growth |
| TALVESSA | Moderate growth / project-mix variation / positive earnings | Lumpy project recognition, uneven receipts across all eight quarters | Moderate debt; variable OCF and FCF, collections watchpoint | Stable shares; no revenue recognized just because cash arrives |
| MERUVAN | Rising / developing profitable margin / positive earnings | Expansion through pre-listing quarters; June includes funding and commissioning costs | Fresh issue increases cash/equity; equipment investment affects capex; OCF distinct from financing | Fresh shares issued 2026-05-29; June weighted shares day-weight pre/post counts; OFS changes owners only. Annual FY2026 and earlier shares stay pre-offer |

IPO-only issuers also need all three annual/eight quarterly reports, not just a narrative: Elarven grows profitable service revenue with hiring pressure and stable pre-offer shares; Nivora grows profitable sales with inventory-heavy OCF and stable pre-offer shares; Kavreth has cyclical positive earnings, equipment capex and borrowing with stable pre-offer shares. Their pending fresh shares enter pro-forma offer calculations only, not pre-offer historical statements.

## Price history blueprint

Profiles guide deterministic seeded paths, not category promises or copied markets. Research 20/60/252-session Direction and Risk's 60-return volatility/61-close drawdown must be calculated on exact windows. No choice of profile changes thresholds. All paths remain positive and fully scheduled; no price rows exist yet.

| Symbol | Intended path and window coverage |
| --- | --- |
| TAVREN | Gradual low-variability upward history; exercise longer upward context and possibly Flat short windows. |
| NERALITH | Strong early appreciation followed by a pause; compare short/medium versus long Direction and richer relative valuation. |
| ORYNTEL | Slow downward drift with short plateaus; exercise falling long context without automatically extreme volatility. |
| VELMORA | Low-variability sideways-to-gently-rising path; natural Flat windows and low drawdown. |
| SUDRAVA | Drawdown then uneven stabilization; exercise 60-session drawdown and short recovery versus weaker long movement. |
| PARNEX | Volatile decline then recovery around new evidence; exercise divergent 20/60/252 windows without assigning a guaranteed result. |
| DHARVEX | Cyclical drawdown/rebound; leverage risk remains distinct from price recovery. |
| KELMIRA | Moderate upward path with commissioning-related pauses; exercise non-adverse direction with capex concerns. |
| ROVANTA | Moderately volatile downward episodes and flat intervals; cash concerns need their own evidence. |
| AVENQOR | Stable mature path with mild correction; test quality versus growth/price distinctions. |
| TALVESSA | Sideways swings around project periods; exercise volatility/drawdown independently from endpoint return. |
| MERUVAN | Independent first close followed by a short volatile discovery period; only 46/67/89 closes at C1/C2/C3. No 252-session return; C1 Risk/60-session Direction unavailable. First close is not fitted to IPO scenario results. |

## Peer viability and unavailable coverage

Digital Operations and Industrial Components are designed with positive comparable TTM earnings across all cutoffs. Household Products deliberately has a transition: if PARNEX's March TTM is nonpositive as intended, its valuation is unavailable and VELMORA/SUDRAVA each have only one eligible profitable peer at C1. This temporary sector-wide loss of P/E coverage is disclosed; June recovery is intended to restore three comparable profitable members at C2/C3. If natural numerical authoring cannot substantiate that recovery, report the coverage limitation rather than force it.

Facility Equipment has the recent-listing exception: MERUVAN's C1 TTM is stale, so AVENQOR/TALVESSA also have only one eligible comparable peer then. Timely June reporting restores candidate viability at C2/C3. At the historical MERUVAN IPO cutoff, AVENQOR/TALVESSA's December-2025 TTM is published and within 200 days, giving the required two peers without MERUVAN being listed. Never substitute another sector, older mismatched windows or a positive invented EPS.

Latest supported C3 research should therefore have broad potential P/E coverage, with clear earlier-cutoff unavailable examples. Verification checks actual signs, fiscal dates and price eligibility; these intentions are not calculated outputs or a promise of attractive valuation.

## Source and publisher system

| Identity / key | Role and typical content | Provenance and consumers |
| --- | --- | --- |
| Each issuer's reporting desk | Annual/quarterly statements, one selected listed-company announcement, offer/lifecycle reports | Company-issued simulated evidence; Financials, Filings, findings, scenarios, Decision and Ask. Not independent verification. |
| Ledger Grove Review / p-4a8c | Fictional business publication; service and household company context | Original simulated articles; News, drivers and Ask; claims link to issuer reports when using reported facts. |
| Workshop Meridian / p-9d2e | Fictional industry publication; components and facility-equipment context | Same citation discipline; no exchange/regulator affiliation. |
| Commonfield Research Bulletin / p-2f7b | Fictional research bulletin; bounded market/sector observations | Four original contextual articles for Home/market Ask; qualitative evidence, not measured causal price contributions. |

Document titles follow {Issuer} Annual Report — FY{year} — Simulated; {Issuer} Quarterly Report — {period end} — Simulated; {Issuer} Announcement — {topic} — Simulated; {Issuer} Offer Document — Simulated; {Issuer} Lifecycle Update — {observation date} — Simulated. Article attribution always identifies its fictional publisher and simulated provenance. No external source URLs or downloadable artifacts are fabricated. Reports contain readable compact statements and notes, not replicas of statutory documents.

## Evidence corpus inventory

| Family | Exact planned count | Content and reference policy |
| --- | --- | --- |
| Annual reports | 15 × 3 = 45 | One per issuer/annual period, covering all three statement groups; same publication calendar. |
| Quarterly reports | 15 × 8 = 120 | One per issuer/discrete quarter, all three statement groups; publication eligibility independent of stored existence. |
| Listed-company announcements | 12 | Exactly one per listed issuer, corresponding to the event inventory below. |
| Offer documents | 4 | Business/financial references, offer terms, ownership/selling-holder sections, net-proceeds uses, reservations and scenario-relevant risks in one readable document per offer. No separate document per section. |
| Lifecycle updates | 3 | Nivora current demand, Kavreth final demand/price, Meruvan final demand/price/expected listing. Dated section locators; actual Meruvan listing confirmation is its company announcement. |
| Non-article total | **184** | 165 statement reports + 19 other documents. Count each source ID once. |
| Company articles | 24 | Two per listed issuer: event-context article and June-quarter interpretation, even if order of publication differs. |
| IPO articles | 4 | One per offer; distinct from company articles, including MERUVAN's historical offer article. |
| Market/sector articles | 4 | One per market event below. |
| Article total | **32** | Original bodies deferred; existing report/event evidence supports material factual statements. |
| Concepts | **6** | Separate teaching evidence, not company reports or duplicated financial source counts. |

Source planning handles referential cycles: reserve stable document identities first; generate financial inputs and readable report content together from one source owner. Never independently invent conflicting document numbers. The 165 reports are complete/readable at C3. Historical missing coverage is publication-based, not source destruction. No optional presentation/transcript is needed; conditional earnings-call content stays absent. Every material financial finding links to exact reports/inputs; a chart's source may be its canonical simulated price series without a fictitious publisher document.

## Company events and article slots

Each row specifies one company announcement/event (occurred and published on the date at 12:00 +05:30) and its event-context article slot A1, published the following calendar day at 12:00. A2 for each issuer interprets its June-quarter report: publish 2026-08-15T12:00 for standard issuers and 2026-08-31T12:00 for MERUVAN. No A2 may cite later A1/announcement content. Stable source keys are derived from issuer registry key plus announcement, article-A1 or article-A2 role; these are planning slots, not generated records.

| Event key | Date | Issuer | Event / original evidence topic | Cutoff relevance |
| --- | --- | --- | --- | --- |
| ev-a6d1 | 2026-07-10 | TAVREN | Renewal of a multi-year software-operations contract, with delivery obligations | Present at C1; future receipts not recognized as current revenue merely from announcement. |
| ev-f2b8 | 2026-09-04 | NERALITH | Additional implementation hiring as project pipeline expands | New at C3; watch delivery costs, not an automatic current earnings adjustment. |
| ev-7c3e | 2026-07-16 | ORYNTEL | A support contract renews with narrower service scope | Present C1; informs growth concern, no copied real customer identity. |
| ev-2a9f | 2026-07-20 | VELMORA | Packaging redesign to reduce material use | Present C1; planned efficiency is not booked margin improvement. |
| ev-b8e4 | 2026-09-07 | SUDRAVA | Distributor inventory replenishment is slower than planned | New C3; evidence of caution, not a backdated June-quarter change. |
| ev-4f1c | 2026-09-09 | PARNEX | Refreshed household range reaches additional distributors | New C3; compare with independently published June recovery. |
| ev-d3a7 | 2026-07-24 | DHARVEX | Review of debt repaid during the June quarter | C1 announcement describes completed action; C2 quarter supplies exact statement inputs; annual leverage remains March-based. |
| ev-9e6b | 2026-09-14 | KELMIRA | A new component-testing line enters commissioning | New C3; capex/commissioning risk and future capacity, not guaranteed sales. |
| ev-5b2d | 2026-07-22 | ROVANTA | A customer reschedules a component delivery batch | Present C1; explain timing uncertainty without asserting price causality. |
| ev-c7f3 | 2026-07-14 | AVENQOR | Maintenance contract expansion offsets slower equipment orders | Present C1; balanced maturity story. |
| ev-1d8a | 2026-09-16 | TALVESSA | Project acceptance review highlights uneven collection timing | New C3; receivables context, not an invented accounting restatement. |
| ev-e4c9 | 2026-05-29 | MERUVAN | Actual admission to the simulated market following the completed offer | Current Stock may cite it; historical IPO cutoff excludes this later announcement and article. |

Events and article text become evidence only when actual readable content is authored. Planned event dates alone cannot support financial claims. No automatic event-to-price equation or event-to-pillar vote exists. The generator's path narrative may be coherent with an event, but the UI must say the event provides context, not that the math proves causation.

## IPO and market event slots

One offer article per issuer publishes at 12:00 on: MERUVAN 2026-05-12, Kavreth 2026-09-15, Nivora 2026-09-19, Elarven 2026-09-26. Its material claims reference the already-published offer document. Publisher: Workshop Meridian for MERUVAN/Kavreth, Ledger Grove Review for Nivora/Elarven. These four articles explain funding versus owner sales, known financial basis and unresolved demand without predicting listing returns.

IPO lifecycle events use the four offer keys plus explicit stage keys (terms/open/close/final-price/listing) and the dates above. Only stages already occurred by the reference clock are observed events. Terms and declared timetable support scheduled open/close; lifecycle updates support demand/final price; MERUVAN announcement supports actual listing. Expected future stages remain plans, not completed events or extra records.

| Market event key | Occurred / published at 12:00 | Affected scope | Single supporting article / interpretation |
| --- | --- | --- | --- |
| ev-6e1b | 2026-07-27 | Digital Operations; broad-market context | Commonfield review of longer implementation acceptance cycles; discuss delivery/cash timing, not a market return forecast. |
| ev-3c8d | 2026-08-19 | Industrial Components; broad-market context | Commonfield fictional order-planning bulletin; uneven machinery delivery schedules may warrant watching order conversion. |
| ev-a9f2 | 2026-09-18 | Household Products | Commonfield packaging-cost briefing; original qualitative supplier observations provide cost-pressure context without a manufactured commodity index. |
| ev-7b4e | 2026-09-29 | Facility Equipment; broad-market context | Commonfield maintenance-budget briefing; service demand and project cash cycles are watchpoints, not additive causal contributions. |

The article itself is the primary simulated bulletin for these qualitative observations; no claimed external survey, missing study or extra report is implied. C1 briefing can cite the first bulletin; C2 can additionally cite August's; C3 can cite all four. MarketBriefing at each cutoff combines eligible events with calculated index/sector movement and research-category counts. “Why moving” language remains qualified context; no unsupported “X contributed −Y%” or assumed falling-market answer. The calculated direction determines the eventual wording.

## Themes and collections

Exactly two of each, preserving PRD scope. All memberships below are explicit, unranked and versioned; resolve to listing IDs and sort with canonical stable name ordering. Business-description/annual-report sections support membership at all three cutoffs; a later event is supplemental context, not retroactive evidence.

| Kind / canonical key / slug | Name and explanation | Listed memberships with individual rationale |
| --- | --- | --- |
| Theme / th-4c8a / connected-operations | Connected Operations — tools and equipment that help businesses coordinate routine operations | TAVREN: software operations; NERALITH: workflow deployments; KELMIRA: repeatable precision production; MERUVAN: building-control modules. |
| Theme / th-9e2b / everyday-resource-use | Everyday Resource Use — products and equipment whose design affects material, water or heat use | VELMORA: reusable containers; SUDRAVA: reusable organizers; AVENQOR: thermal-control equipment; TALVESSA: water-handling systems. No quantified environmental-performance claim. |
| Collection / co-6b1d / recurring-service-models | Recurring Service Models — compare businesses with a service-renewal element | TAVREN: operations renewals; ORYNTEL: application maintenance renewals; AVENQOR: equipment-maintenance contracts. Membership does not imply strong financial results. |
| Collection / co-2f7c / capacity-and-cash | Capacity and Cash — investigate how equipment expansion interacts with cash needs | DHARVEX: drive-assembly capacity and debt; KELMIRA: manufacturing machinery; MERUVAN: post-offer commissioning tools. Not a profitability or recommendation ranking. |

## Six concept records and Ask grounding

Keep six short reviewed concept modules with stable section locators; subtopics are bounded help sections, not new concepts or a textbook. Definitions/formulas refer to the accepted methodology. All six are published at 2024-09-30T08:00:00+05:30, allowing all research cutoffs to reference the same teaching version. No new illustrative financial values are assigned here.

| Key / concept | Bounded help sections and limitations |
| --- | --- |
| cn-8a2d / Earnings and growth | Revenue growth, ordinary EPS, meaningful EPS transitions, two-year CAGR and operating margin; reported periods versus forecasts. |
| cn-3e7b / Cash and financial capacity | OCF versus income, cash conversion, FCF/capex, debt/equity and interest coverage; loss/zero-denominator exceptions. |
| cn-5c9f / Relative valuation | P/E, four-quarter TTM, peer median, Price vs Value, two-peer minimum and illustrative scenario assumptions; no intrinsic-value claim. |
| cn-1b6e / Price movement and risk | Session returns, 60-session daily-return volatility, drawdown, historical windows and short-history limits. |
| cn-7f4a / Reading research and evidence | Three pillars, categorical Research Picture, separate Evidence Confidence, provenance and What Changed compatibility. |
| cn-9d3c / Understanding an IPO | Fresh Issue versus OFS, proceeds/expenses, dilution, investor categories and subscription multiples; listing-day sensitivity is not a probability. |

Understand a Stock resolves any supported listing/snapshot to metrics, findings and actual source links. Compare resolves two distinct listings with compatible windows, stating unavailable peer measures rather than declaring a winner. Explain Something resolves these modules/sections, not arbitrary financial topics. Understand the Market uses the same cutoff/index/sector/briefing context as Home. The structured corpus needs no vectors; no prompts, provider or generated answers are created now. Current IPO-only issuers cannot silently become ordinary Stock Ask entities; the accepted four-capability scope remains unchanged.

## Evidence-confidence and research-state coverage

Coverage targets are reports for later review, not manually assigned engine outputs. The five confidence checks remain C1 finding provenance, C2 three annual/eight quarterly reports, C3 recency, C4 eligible price/IPO evidence, C5 source readability/reproducibility. Critical inconsistencies are never allowed.

Standard listed issuers at historical C1 should have C1/C3/C4/C5 true and C2 false (seven eligible quarters), naturally satisfying Medium. MERUVAN at C1 has six eligible quarters and a 213-day-old latest quarter, so C2/C3 fail; valid nonempty evidence can produce Low while short history itself does not fail C4. At C2/C3 complete eligible reports and prices can produce High for all companies, including financially weak ones. No claim of executed confidence is made. Current-only Medium/Low is optional: do not remove mandatory readable reports or invent corruption merely to show all badges on today's directory.

| Research family | Target coverage and natural candidate stories | If unavailable naturally |
| --- | --- | --- |
| Business Health | Strong cash-backed operators, margin-pressure Mixed cases, PARNEX loss-based Weak | Unavailable is optional outside historical/negative fixtures; no random omissions. |
| Growth Potential | Growing services, mature slowing operators, declining/turnaround cases for Strong/Mixed/Weak possibilities | Recoveries must use earnings states; never fabricate positive-base growth. |
| Financial Health | Low debt/cash generation, capex-heavy midrange, leveraged/cash-stressed cases | Let supported rules decide; no forced category quotas. |
| Risk | Low/Medium/High opportunities from independent balance/price inputs | MERUVAN C1 price-risk unavailable; partial High only if an actual supported financial trigger exists. |
| Price vs Value | Attractive/In line/Expensive opportunities from compatible positive inputs; unavailable PARNEX/MERUVAN C1 and affected peers | Missing exact distribution is a coverage note, not a reason to alter thresholds. |
| Price Direction | Up/Flat/Down opportunities across paths/windows | MERUVAN 252 unavailable throughout; its 60 unavailable C1. |
| Research Picture | Strong/Mixed/Weak possibilities from actual components | C1 missing required valuation/Risk yields unavailable per horizon; no manual overall status. |
| Evidence Confidence | High/Medium/Low opportunities across current and historical cutoffs as above | Current all-High is acceptable if all evidence conditions actually pass. |

## What Changed storylines and continuity

| Issuer/story | C1 evidence/input state | C2 development | C3 development / guardrail |
| --- | --- | --- | --- |
| PARNEX recovery | Annual loss and March TTM; valuation may be inapplicable | Published June-quarter recovery may make TTM/valuation newly available | Product relaunch adds evidence; price-relative valuation changes independently. Newly available is not automatically improved Research Picture. |
| DHARVEX financing | Debt-repayment announcement known; latest annual leverage remains March | June-quarter statements substantiate lower later debt and cash use | Price/risks may change; do not claim annual Financial Health changed just from newer quarterly debt. |
| NERALITH growth/cost trade-off | Annual profitable growth and earlier price context | June report updates TTM and delivery-cost evidence | September hiring announcement adds a watchpoint; later price may imply richer valuation. Actual categories require calculation. |
| MERUVAN reporting catch-up | Stale discrete quarter and too little Risk history | March/June reports now available, longer price history, possible restored peer comparability | Full current evidence, still no 252-session Direction; original IPO inputs remain historical. |
| VELMORA stable business | Complete annual business inputs, packaging initiative | June report mostly continues the financial pattern; peer availability can change | No new annual result; unchanged findings coexist with price changes. Exact unchanged categories are a later coverage outcome. |
| SUDRAVA pressure | Annual margin/cash concerns | June-quarter inventory/TTM detail | September replenishment caution; deterioration claims require actual comparable outputs, not an event vote. |

Most annual pillar inputs are intentionally unchanged between cutoffs because all FY2026 annual reports publish before C1. Quarterly/TTM metrics, evidence, price risk and relative valuation can change. Do not manufacture an annual report revision to produce a preferred What Changed card. The stable case should preserve annual findings; exact composite transitions are engine-owned.

MERUVAN continuity is one identity: pre-listing reports and offer → May 18–20 offer → May 22 final terms/demand → May 29 pre-listing evaluation → May 29 actual listing and first close → June-quarter share/cash effects → C1/C2/C3 Stock research. Its IPO scenario remains a historical listing-day sensitivity; Stock scenarios use their own cutoff close and 30-day assumptions. Current quote, offer price and modeled scenario outputs are never substitutes for one another.

## Reference mapping and remaining work

The historical Tata stock/Decision composition can use DHARVEX as the initial fictional content reference, without inheriting any Tata metric, subsidiary, assessment or story. Historical generic IPO composition maps to Elarven's Upcoming research, with lifecycle-specific unavailable demand. Ask comparison can use TAVREN versus NERALITH; market composition resolves the broad simulated index. Real-company cards elsewhere map by the canonical catalog rather than a claimed one-to-one business equivalence; no UI/content replacement is performed in this gate.

Numerical inputs, seeded paths, share/offer quantities, actual evidence bodies, scenario g/m values and all computed outcomes remain later work. Public naming checks, physical implementation, hosting/provider decisions and the five required visual references are still outstanding. This blueprint neither changes accepted formulas nor authorizes generation, implementation, staging or publication.
