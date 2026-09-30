# Implementation Milestone 4

Verification: 2026-09-27; final acceptance and landing: 2026-09-30. Environment: Windows, Node 24.19.0, pnpm 11.19.0, Next.js 16.3.4, React/React DOM 19.2.8, local PostgreSQL and Codex in-app browser.

## Baseline and scope

Starting local main and fetched origin/main: `85ee6b812983a8771244936f1ed5badce64578f4` (`feat: complete stock research experience`). Tracked tree was clean. Implementation branch: `feat/home-explore-directories`.

Implemented `/`, `/explore`, `/stocks`, `/ipos`, responsive four-destination application navigation, compact Home identity suggestions, submitted directory search, categorical discovery scope and stock filters, addressable sections and memberships, offer status selection, source-reader reuse, loading/error/empty/no-match recovery, and global not-found handling. Stock changes are limited to integration with navigation, focus/skip destinations and the What Changed anchor; the six-view experience and methodology remain intact.

The approved desktop/mobile compositions and version-3 `Market-AI-Explore-Mobile-Filters.zip` were inspected outside the repository before frontend implementation. Their hierarchy and composition inform the UI; prototype JavaScript and financial values were not copied. On narrow screens Research Picture uses two columns to keep selected labels readable with their checkmarks. No drag affordance is exposed.

## Data and architecture

Dataset: `market-ai-synthetic-v1`. Before/after live digest:

`f219f0f94ecca8f565f1ffb6ebc8a4fb1cfee490e653512084e4d6694d50d607`

Coverage: 12 listed fictional companies, four offers, four sectors, two themes, two collections; 108 research contexts. The simulation clock comes from the published dataset, not the host clock. IPO statuses at the simulation cutoff are Elarven Upcoming, Nivora Open, Kavreth Closed and Meruvan Listed. Meruvan appears as both an actual listing and a historical offer through the existing identity model.

Server-only repository/service modules read PostgreSQL and reuse stored research snapshots, compatible What Changed, Decimal-safe market indexes and offer-term domain logic. Worth Researching applies the documented picture/risk/confidence and sourced-positive/sourced-concern checks; it is not a ranking. Sector picture uses complete-coverage strict majority. Daily movement is explicitly distinguished from documented event context. Client islands receive compact identities or control choices rather than the full dataset. Database errors never substitute fixtures. Test fixtures remain test-only.

## Verification

| Gate | Result and evidence |
| --- | --- |
| Unit/component | `pnpm test`: 124/124, nine files; existing 113 retained plus 11 discovery tests. |
| PostgreSQL integration | `pnpm test:integration`: 8/8; discovery identities/index/lifecycle and horizon/filter checks added to the existing six. Full-table immutable replay passes. |
| Live validation | `pnpm db:validate --live`: PASS; exact digest, inventories and all 108 contexts. |
| Routes | `node --import=tsx scripts/verify-routes.ts`: four discovery routes and 11 search/filter/status variants; all 12 directory destinations; 72/72 Stock views; six IPO-only not-found/noindex probes; Meruvan historical state and global unknown route. |
| Lint | `pnpm lint`: PASS. |
| Build | `pnpm build`: PASS, canonical Webpack production path. |
| Type checking | TypeScript check and production build type phase: PASS. |
| Turbopack | Not run in this milestone; optional diagnostic only. Previously documented Windows error-5 limitation is not reclassified. |
| Whitespace | `git diff --check`: PASS. |

Windows sandbox restrictions initially prevented esbuild configuration access and one Node user-info call. The authorized commands passed outside that sandbox without changing security settings. One earlier full-dataset test timed out during concurrent heavy verification; the isolated rerun and final suite passed without changing assertions or timeouts.

Browser checks used the production server with real PostgreSQL. Home, Explore, Stocks and IPOs were measured at 320, 360, 390, 412, 430, 768, 1024 and 1440 CSS pixels: no page-wide horizontal overflow. A further 720px viewport checked equivalent reduced-width reflow for a 1440px view. This is **not native 200% browser zoom**, which was not tested. Desktop/mobile screenshots were manually inspected outside the repository. Category rails scroll within their own bounds. The filter sheet was inspected at all five mobile widths; its body scrolls independently and its Reset/Apply footer remains in the viewport. CSS includes safe-area padding and reduced-motion behavior.

Modal verification: named native `showModal()` dialog, browser top-layer inertness, body scroll lock, initial close-button focus, Tab and Shift+Tab wrapping, Escape and close cancellation, backdrop cancellation, and trigger focus restoration. Draft selection leaves URL and committed result count unchanged. Reset returns draft defaults without committing. Apply commits URL state and updates results/count. Research Picture defaults to **Any**. Applied-chip removal, browser Back/Forward and refresh use committed state. Selected options expose `aria-pressed` and checkmarks, not color alone.

Search verification: whitespace/case matching, exact/prefix/substring ordering, grouped Stock/IPO ambiguity for Meruvan, keyboard arrow/Enter selection, no-results recovery, and canonical Stock destination. Home IPO suggestions explicitly identify the working offer directory because IPO detail is deferred. Source readers show actual simulated documents and return focus on Escape. Stock Pro level, Short horizon, source-reader and Share fallback were exercised after navigation changes; the Share fallback preserves the exact research URL. Automated route regression includes Tavren, Neralith and Meruvan across all six views.

Semantic headings, labels, fieldsets/legends, live result status, skip link, visible focus and approximately 44px controls were inspected. These checks are local browser acceptance, not full screen-reader certification or physical-device touch testing.

## No Dead UI and repository hygiene

Only Home, Explore, Stocks and IPOs appear in primary navigation. No Ask, account, watchlist, IPO detail, Decision, brokerage or investment action is exposed. Informational offer/event content is not styled as a whole-card action. Source controls, membership disclosures, submitted searches, filters, scope clearing and section links have defined behavior. The What Changed anchor resolves to the actual Overview section.

The requested bad-pattern scan found no prohibited new production-UI patterns. `href="#"` appears only in negative test assertions; the skip and What Changed fragments identify real targets. Existing canonical event prose uses “Order planning” in a business context, not a trading action. No commercial publisher/exchange impersonation, random financial values or zoom-disabling meta configuration was added.

No dependencies, framework-version changes, migrations, synthetic-data changes, methodology changes, DB dumps, secrets, reference ZIPs, screenshots or build output are included. `.env.local` remains ignored. Existing untracked `market-ai-documentation-scope-reset.zip` and `market-ai-v2-gate-2-5-contracts-upload.zip` remain untouched. No deployment was performed.

## Change inventory

Created: `src/features/discovery/{state.ts,model.ts,controls.tsx,views.tsx,page.tsx,focus.tsx,retry.tsx}`, `src/server/{discovery-repository.ts,discovery.ts}`, `src/components/application-navigation.tsx`, `src/app/{explore,ipos,stocks}/page.tsx`, global loading/error/not-found pages, `tests/discovery-fixture.ts`, `tests/discovery.test.tsx`, and this report.

Modified: Home page, application layout/global CSS, Stock shell/controls/Overview and Stock unavailable/loading/error/not-found main landmarks, `tests/integration/postgres.integration.ts`, `scripts/verify-routes.ts`, README and requirement traceability.

## Boundaries and commit identity

Ask AI, IPO Research, Decision, accounts, personal storage and deployment remain deferred. This milestone does not certify full Release 1, production hosting, real-market integration, native zoom, physical touch, or complete assistive-technology coverage. The current small universe is read on the server; a larger universe would require separate performance work rather than shipping the dataset to clients.

Final feature commit subject: `feat: implement home explore and directories`. The exact final commit is the Git commit that introduces this report; resolve it without a self-referential hash using `git log --diff-filter=A -1 --format=%H -- docs/qa/MILESTONE_4_REPORT.md`. The delivery response records that literal hash and the verified equality of main/origin/main. Landing is conditional on all gates and origin/main still matching the starting commit; no force push is authorized.
