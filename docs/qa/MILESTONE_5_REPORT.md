# Implementation Milestone 5

Verification: 2026-10-01. Windows, Node 24.19.0, pnpm 11.19.0, Next.js 16.3.4, React/React DOM 19.2.8, local PostgreSQL and Codex in-app browser.

## Baseline and scope

Starting local main and fetched origin/main: `2688421e87f98f3a56bb51747ec0e0382c6e9ffa`. Tracked tree was clean. Implementation branch: `feat/complete-ipo-research`. The older prototype was not used.

Implemented all four `/ipos/[slug]` routes in Simple, Normal and Pro. The page includes identity, simulated lifecycle, offer dates and price basis, minimum application, 60-Second Overview, Research Picture, Evidence Confidence, What Looks Good, Needs Attention, Fresh Issue/OFS, Use of Proceeds, Selling Holders/Ownership, investor categories/subscription, relative Price vs Value, Weak/Base/Strong listing-day scenarios, local evidence readers and Share. Existing Home/Explore previews, Home identity search and IPO directory destinations now open research. Primary navigation remains Home, Explore, Stocks and IPOs.

| Canonical route | Verified behavior |
| --- | --- |
| `/ipos/elarven-workflow-ipo` | Upcoming at the dataset clock; upper-band illustration; unavailable demand remains unavailable, not zero. |
| `/ipos/nivora-kitchenware-ipo` | Open; fresh-only offer with actual zero OFS; net allocation and timestamped category demand. |
| `/ipos/kavreth-fabrication-ipo` | Closed; published final issue price; mixed financial findings remain visible in every level. |
| `/ipos/meruvan-controls-ipo` | Listed; historical pre-listing snapshot, incomplete financial coverage and unavailable Research Picture remain explicit. Expensive relative valuation is retained. Actual listing continuity opens `/stocks/meruvan` through the same issuer. |

## Data and architecture

Dataset: `market-ai-synthetic-v1`. Live validation before and after implementation returned the exact required digest:

`f219f0f94ecca8f565f1ffb6ebc8a4fb1cfee490e653512084e4d6694d50d607`

The existing universe remains 15 issuers, 12 listings, four offers, 108 Stock research contexts, four IPO evaluations/scenario sets and their persisted evidence. No schema, seed, methodology, observation or scenario assumption was changed.

Server-only Drizzle repository and service modules read published identities, offer records, statements, peer prices, stored assessments, assumptions and evidence. A typed presentation model reuses Decimal-based offer and peer methods. No financial calculation is implemented in JSX. Scenario outputs and assessments remain the stored canonical results; source publication cutoffs and assumption compatibility prevent later evidence from rewriting historical research. Financial amount/count formatting is presentation-only. Client islands own explanation selection, shared Help, the existing reader and Share.

Fresh funding, OFS transfers, issue expenses, net proceeds, documented allocation and ownership denominators reconcile against canonical inputs. Subscription uses a single compatible observation and timestamp. Price vs Value identifies its historical earnings window, peer eligibility and upper-band/final-price basis; it is relative valuation, not intrinsic value. Scenario disclosure identifies the separate listing-day window and authored earnings/multiple assumptions, with no probability or subscription-derived premium. Simple hides deeper values behind working disclosures while preserving concerns, evidence and all underlying outcomes.

Unknown or malformed slugs are not-found. Missing snapshots, ownership, proceeds, valuation, demand, assumptions or source bodies remain explicit. A separate production process with an intentionally unavailable local DB connection showed a sanitized unavailable page and a working retry; the real connection configuration was not changed and fixtures were never substituted.

## Context Help references and behavior

Only `screen_a_desktop_context_help_popover_2` was used for desktop Context Help. **Desktop variant 1 was explicitly rejected and was not inspected or used.** The mobile reference was `screen_b_mobile_context_help_bottom_sheet`. Approved desktop/mobile IPO research compositions were also inspected outside the repository. Screenshot values, entities and prototype JavaScript were not copied.

Shared deterministic Help covers Evidence Confidence, Fresh Issue, OFS, investor categories/subscription and Price vs Value. Confidence uses the five canonical conceptual checks: finding provenance, financial-period coverage, recency, eligible price/IPO evidence coverage, and source readability/reproducibility.

Desktop uses a 360px native nonmodal popover, anchored to its trigger, with no dimming, inert page or focus trap. Trigger toggle, Escape, close, outside dismissal, one-open-at-a-time and synchronized `aria-expanded` were exercised. Escape/close restore trigger focus; an outside interaction keeps its natural focus destination. Keyboard Tab can leave the popover. Placement was checked at 768, 1024 and 1440px, with all edges inside the viewport. An initial positioning problem was corrected and rechecked: bounded scrolling now keeps the trigger uncovered.

Mobile uses native `showModal()` bottom sheets. At 320, 390 and 430px the named trigger, initial close-button focus, native modal inertness, body scroll lock, Tab/Shift+Tab wrap, Escape, backdrop cancellation, close button and trigger focus restoration passed. The Got it action was also exercised. Header/footer remain visible while long help content scrolls; safe-area padding is applied and no nonfunctional drag affordance appears.

## Verification

| Gate | Result and evidence |
| --- | --- |
| Unit/component | `pnpm test`: 138/138 across ten files. The previous 124 checks remain, with obsolete assertions that forbade IPO links updated for the authorized destination. Fourteen IPO checks cover reads, reconciliation, missingness, chronology, identity, levels, error handling, safe URLs, Help markup and prohibited actions. |
| PostgreSQL integration | `pnpm test:integration`: 9/9. The new test verifies all four persisted detail contexts, actual source records, offer reconciliation and Meruvan continuity; existing immutable replay and discovery/Stock checks remain. |
| Live validation | `pnpm db:validate --live`: PASS before and after; exact digest, inventory and all 108 contexts. |
| Routes | `node --import=tsx scripts/verify-routes.ts`: PASS for 12 IPO/level routes, 15 discovery/search/filter states, discovery handoffs, 72 Stock views, six IPO-only Stock not-found/noindex cases, unknown IPO/global routes and Meruvan historical state. |
| Lint | `pnpm lint`: PASS. |
| Build | `pnpm build`: PASS, canonical Webpack path. |
| TypeScript | `node node_modules/typescript/bin/tsc --noEmit`: PASS, plus production-build type checking. The Windows `pnpm exec tsc` shim could not find the command; the installed compiler was invoked directly. |
| Turbopack | Not rerun; optional diagnostic only. The previously documented Windows error-5 host limitation was not reclassified as an application failure. |
| Whitespace | `git diff --check`: PASS. Git's LF/CRLF notices are line-ending warnings, not whitespace failures. |

The Windows sandbox initially blocked esbuild configuration access and a Node user-info call. Required commands passed with the authorized execution permission; no security settings or dependency versions were changed.

## Browser, responsive and regression evidence

Browser acceptance used the production Webpack server with real PostgreSQL. All four IPOs in Simple and Pro were measured at 320, 360, 390, 412, 430, 768, 1024 and 1440 CSS pixels, plus 720px equivalent reduced-width reflow: **72 populated checks, no page-wide overflow**. An initial batch included loading screens and was discarded; every accepted measurement explicitly waited for the populated Overview. Desktop and mobile screenshots of offer identity, historical missingness, findings, zero OFS, ownership, demand, valuation, scenarios, sources and Help were inspected. Normal level was also exercised on the production page.

Equivalent reduced-width reflow: **PASS**. Native browser 200% zoom: **NOT TESTED**. This is not physical-device touch or screen-reader certification. Semantic headings, named controls, native dialog semantics, keyboard focus, live status, color-independent category labels and bounded source content were inspected. Existing global focus and reduced-motion styles are reused; browser zoom is not disabled.

Explanation changes update the canonical URL without inventing new query state and survive refresh. App Back opens `/ipos` with the applicable level; browser Back/Forward preserve real history. The IPO status filter narrows to Open and opens Nivora. Home keyboard search distinguishes Meruvan Stock and IPO results and opens the selected IPO in Pro; Explore's IPO section opens Elarven. Meruvan's current Stock link retains Pro and the real issuer. Search/filter/category/section membership regressions are also covered by the retained discovery tests and live route variants.

The existing source reader was exercised on IPO and Stock pages: actual simulated title/publisher/body, initial close focus, bounded content, Escape and trigger focus return. Shared Share preserves the exact IPO or Stock URL in its selectable fallback. Native/clipboard/cancel/manual branches remain unit-tested; the embedded browser's permission wait exercised the manual fallback, not a claim of successful native sharing.

Stock regression includes all six views for all 12 listings in live route verification, including Tavren, Neralith and Meruvan. Browser checks exercised Tavren Pro and Short horizon, source reader, shared Share and the Explore What Changed anchor. No Stock research calculation or route ownership changed. Browser console error inspection returned no client errors on the tested populated route.

## No Dead UI and repository hygiene

IPO links, explanation controls, app Back, peer/scenario disclosures, Help, source buttons and Share all have defined behavior. The obsolete directory-only/deferred-IPO wording was removed. No Ask, Decision, IPO Decision, apply, subscribe, watchlist, account, brokerage or investment action is introduced. Missing content has an honest unavailable state rather than a placeholder action. No arbitrary scores, profit probabilities, recommendation language or fake external provenance was added.

No dependencies, framework changes, migrations, dataset/methodology changes, secrets, DB dumps, ZIPs, reference screenshots, `.next` output or temporary/debug files are included. `.env.local` and `.next` remain ignored. Server database access stays behind `server-only`; no database credentials enter client components. Existing untracked `market-ai-documentation-scope-reset.zip` and `market-ai-v2-gate-2-5-contracts-upload.zip` remain untouched. No deployment was performed.

## Change inventory and landing identity

New: IPO repository/service/model/state/controls/view, `/ipos/[slug]` page/loading/error/not-found, shared Context Help content/component, shared Share component, IPO fixture/tests and this report. Updated: discovery destinations/copy, Stock Share re-export, source-body unavailable fallback, global CSS, integration/route verification, README and requirement traceability.

Final feature commit subject: `feat: complete ipo research experience`. The exact commit is the one introducing this report; resolve it without a self-referential hash using `git log --diff-filter=A -1 --format=%H -- docs/qa/MILESTONE_5_REPORT.md`. The delivery response records the literal hash and verified equality of local main/origin/main. Landing is allowed only after all gates pass and a fresh fetch confirms origin/main still equals the starting baseline; use a fast-forward merge and normal push only.

Ask AI, Decision, IPO Decision, authentication, deployment and full Release-1 certification remain deferred. No commercial data integration or new financial truth is introduced.
