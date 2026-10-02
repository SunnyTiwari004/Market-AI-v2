# MARKET AI — Final College Project Handoff

**College Project · Simulated financial data**

The financial universe is synthetic and is not live exchange information or investment advice. Market AI is an educational research project, not a live trading platform.

## Project and implementation

Market AI explains fictional stocks, market context, sectors, and IPOs with plain-language summaries, progressively deeper research, and traceable simulated evidence. This is a substantial but partial Release-1 implementation; it is not deployed or certified as a complete release.

Implemented experiences include:

- Home, Explore, Stocks, and IPO directories with working search, URL-backed filters, and research destinations.
- Stock research for all 12 fictional listings: Overview, Financials, Chart, News, Peers, and Filings. Each view supports Simple, Normal, and Pro explanations while retaining the same underlying research.
- IPO research for Elarven Workflow, Nivora Kitchenware, Kavreth Fabrication, and Meruvan Controls. It covers offer structure, proceeds, ownership, demand where available, relative valuation, scenarios, evidence, and Simple/Normal/Pro levels.
- Local simulated-source readers, Share with a usable URL fallback, shared Context Help, research disclosures, URL/history navigation, unknown-route handling, and honest unavailable states.
- Meruvan continuity: its historical pre-listing IPO research and current Stock research resolve to the same fictional issuer. IPO-only symbols return Stock not-found pages.

Main destinations:

| Experience | Route |
| --- | --- |
| Home | `/` |
| Explore | `/explore` |
| Stocks directory | `/stocks` |
| Stock Research | `/stocks/[symbol]` |
| IPO directory | `/ipos` |
| IPO Research | `/ipos/[slug]` |

Examples: `/stocks/tavren` and `/ipos/kavreth-fabrication-ipo?level=pro`. Explanation level and supported research controls can be represented in the URL.

## Technologies and architecture

The project uses pnpm 11.19.0, Next.js 16.3.4 App Router, React/React DOM 19.2.8, TypeScript, Tailwind CSS 4, PostgreSQL, Drizzle ORM, `decimal.js`, and Vitest. The verified local environment was Windows, Node.js 24.19.0, and PostgreSQL 18.6.

One Next.js application renders server pages and owns typed server-side research reads; small Client Components provide interactive controls, dialogs, Share, and Context Help. PostgreSQL stores canonical synthetic records and versioned research outputs. Drizzle owns the typed relational schema and migrations. Database access is server-only. `DATABASE_URL` belongs in the ignored `.env.local`; migrations and seed setup run from the command line. The published dataset is immutable under the seed workflow, and validation reconciles stored records against canonical generation.

## Synthetic data and research

The canonical dataset is `market-ai-synthetic-v1`, with verified digest:

`f219f0f94ecca8f565f1ffb6ebc8a4fb1cfee490e653512084e4d6694d50d607`

It contains 15 fictional issuers, 12 listings, four IPO offers, 45 annual and 120 quarterly statements, 5,842 stored closing prices, 184 simulated documents, 32 simulated articles, 108 Stock research snapshots, and four IPO evaluations. Meruvan has 89 stored closes from its listing date; history is not fabricated before listing. Publishers and evidence are fictional and do not impersonate real financial outlets or exchanges.

Research uses deterministic, versioned `research-method-v1` rules. Derived metrics use canonical stored inputs and decimal arithmetic; observations and sources are restricted to the selected research cutoff. Business Health, Growth Potential, Financial Health, Risk, relative peer valuation, Evidence Confidence, and Research Picture follow explicit availability and evidence rules. Listing-day scenarios are educational cases, not probabilities. Simple, Normal, and Pro change explanation depth, not research outcomes. The methodology is a teaching heuristic, not a validated forecast or recommendation.

## Deferred work and limitations

Ask AI, Decision, live NSE/BSE or other market feeds, live indexes or gold, global news, screener expansion, options/open interest, brokerage, authentication, payments, watchlists, notifications, and deployment are deferred. The application needs a locally running PostgreSQL database to serve research; no public internet URL exists.

The universe is deliberately small and fictional. Meruvan has shorter price history and explicitly incomplete IPO financial coverage; unavailable inputs stay unavailable. Browser checks used responsive viewport and equivalent reduced-width reflow. Native 200% browser zoom, physical touchscreen use, and full screen-reader certification were not verified.

## Final verification

| Gate | Result |
| --- | --- |
| `pnpm test` | PASS — 138 tests across 10 files |
| `pnpm test:integration` | PASS — 9 PostgreSQL tests |
| `pnpm db:validate --live` | PASS — expected dataset digest; all 108 Stock contexts reconciled |
| `node --import=tsx scripts/verify-routes.ts` | PASS — 15 discovery/search/filter states, 12 IPO/level routes, 72 Stock view routes, six IPO-only Stock not-found probes, unknown routes, and Meruvan historical continuity |
| `pnpm lint` | PASS |
| `pnpm build` | PASS — Next.js Webpack production build |
| `git diff --check` | PASS before final commit |

The live database validation reported 15 issuers, 12 listings, four offers, 5,842 closes, and the expected unchanged digest. Existing browser acceptance also covered source-reader behavior, Share fallback, Context Help, keyboard/focus behavior, and responsive reflow. No application code, data, methodology, dependencies, migrations, or framework versions were changed during this finalization pass.

## Run locally on Windows

Use an existing local PostgreSQL installation and start its service separately; this project does not install PostgreSQL. On a first setup, open PowerShell or Command Prompt in the project folder, copy `.env.example` to `.env.local`, and set `DATABASE_URL` for your local development database. Install dependencies and initialize the schema/data:

```powershell
pnpm.cmd install --frozen-lockfile
pnpm.cmd db:migrate
pnpm.cmd db:seed
```

To run the app, ensure PostgreSQL is running, then double-click `START_MARKET_AI.bat` or run `pnpm.cmd dev --port 3100` from the project folder. Visit [http://localhost:3100/](http://localhost:3100/) in a browser. Example pages are [Stock Research](http://localhost:3100/stocks/tavren) and [Kavreth IPO Research · Pro](http://localhost:3100/ipos/kavreth-fabrication-ipo?level=pro).
