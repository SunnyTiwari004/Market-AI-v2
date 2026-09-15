# Market AI

Market AI is a beginner-first, evidence-backed financial research college / portfolio project. Its intended financial universe is permanently synthetic and fictional; it is not a commercial financial-data product.

It helps users understand stocks, IPOs, market movements, sectors, themes, and financial concepts through plain language, progressive disclosure, transparent evidence, and clearly identified sources.

# Canonical repository

- The only canonical implementation is `C:\Users\Sunny Tiwari\Documents\ChatGPT\market-ai-v2`.
- This repository starts clean. An older abandoned prototype exists elsewhere. Do not search for it, inspect it, import from it, copy from it, modify it, or use it as an architectural reference.
- Maintain the verified foundation: pnpm `11.19.0`, Next.js `16.3.4`, React and React DOM `19.2.8`. Do not downgrade or change these versions without a demonstrated technical reason.
- Use pnpm and preserve `pnpm-lock.yaml` as the dependency lockfile.

# Engineering principles

- Use TypeScript strictly.
- Avoid `any` unless clearly justified.
- Use Next.js App Router correctly.
- Prefer Server Components where appropriate.
- Use Client Components only where interaction requires them.
- Build shared reusable components.
- Do not duplicate whole components between pages.
- Centralize design tokens.
- Centralize typed synthetic data. Never hardcode screen-specific financial values.
- Keep business logic separate from presentation.
- Keep data transformation separate from UI components.
- Avoid unnecessary dependencies.
- Do not introduce Redux or another heavy global-state solution without a demonstrated need.
- Real backend, database, APIs, research calculations, historical snapshots, What Changed logic, search/filtering, and eventual AI integration are intended application capabilities. Implement each only when explicitly authorized; authentication also requires explicit authorization.
- Do not deploy unless explicitly requested.
- Consider frontend engineering, software architecture, maintainability, accessibility, performance, responsive design, security, financial-data integrity, AI reliability, product UX, future scalability, and developer experience before architectural decisions.
- Optimize for a maintainable real product, not quickly producing screenshots.

# UI principles

- Responsive web application, not separate desktop/mobile applications.
- Inter is the canonical typeface.
- Mobile financial information must remain readable.
- Do not use 8–9px text for important information.
- Maintain accessible contrast.
- Maintain visible focus states.
- Use semantic HTML.
- Interactive elements must have proper button/link semantics.
- Touch targets should generally be around 44px or larger.
- Support mobile safe areas.
- Never rely solely on color to communicate financial meaning.
- Use one consistent outline icon family.

# Semantic colors

- Blue: brand / action / information / base scenario.
- Green: positive / healthy / strong.
- Amber: caution / medium / mixed.
- Red: negative / weak / expensive.
- Grey: neutral / secondary.

# Explanation levels

Meaning first. Data second.

- SIMPLE: human meaning first, professional terminology secondary, raw metrics last.
- NORMAL: financial terminology with explanation.
- PRO: deeper ratios, evidence, metrics, and technical information.

These levels change depth of explanation. They must explain the same underlying research and must not produce contradictory conclusions.

# Financial terminology

Simple mode must prioritize understandable language.

Examples:

- Business Health
- Growth Potential
- Financial Health
- Price vs Value
- Evidence Confidence

Use Weak / Base / Strong for scenarios in Simple mode.

Avoid Bear / Bull terminology as the primary Simple-mode language.

Market AI is not a brokerage, trading terminal, automated trading bot, stock-tip application, or guaranteed prediction system. Do not introduce authoritative BUY, SELL, HOLD, STRONG BUY, or INVEST NOW language.

# Financial-data integrity

Use one canonical, typed synthetic dataset for fictional companies, prices/history, financial statements, articles, filings, IPOs, market conditions, evidence records, scenarios, and historical events. This is the intended college-project dataset, not a temporary substitute for licensed market data. No real-market-data licensing or integration is required; do not add commercial market-data integrations unless the user explicitly changes scope.

The demonstration universe must use fictional entities. Tata Motors, HDFC, ICICI, HAL, Reliance, and other real-company references in Stitch are visual/product-structure references only. Their values, ratios, assessments, articles, and source counts are not canonical data. A later data-design milestone will define fictional entities and the design-example mapping; do not mass-rename UI content now.

Use the canonical disclosure **College Project · Simulated financial data**. Financial content is simulated for educational/demonstration use, not live exchange information or investment advice. Placement follows [the interaction trust contract](docs/product/INTERACTION_CONTRACTS.md#int-018-release-exclusions-and-trust); keep disclosure perceptible across financial experiences without huge repetitive disclaimers.

Synthetic inputs do not mean arbitrary application behavior. Calculate derived metrics from canonical stored inputs whenever that is the intended behavior, using defined methods, units, and missing-input handling. All screens and answer prose resolve the same entity/snapshot records; do not duplicate derived values in presentation copy. Never silently invent missing values, scores, probabilities, confidence percentages, or supporting evidence.

The [synthetic data contract](docs/data/SYNTHETIC_DATA_CONTRACT.md) governs identity, precision, time, provenance, and consistency. Missing or unavailable information remains explicit.

# AI principles

AI will eventually explain structured research through real retrieval/grounding workflows when implemented. Static demonstration answers must not imply an AI call occurred.

AI must not arbitrarily invent research scores. Synthetic input observations, deterministic research calculations, modeled scenarios, and AI interpretation remain conceptually separable. Research Picture and Evidence Confidence require defined methodology before being represented as calculated assessments.

# Sources

Every research claim must trace to supporting canonical synthetic evidence or calculation inputs, with simulated provenance visible. Source categories may represent financial statements, annual reports, investor presentations, articles, and simulated filings or announcements.

Synthetic publishers must not impersonate real publishers. Synthetic filings must not impersonate NSE/BSE/SEBI or actual company filings. Invented URLs to real financial publishers or exchanges are prohibited. Counts derive from distinct supporting source records; absent evidence stays unavailable.

# Security

- Never commit secrets.
- Never hardcode API keys.
- Use environment variables when integrations begin.
- Do not expose server-side credentials to client components.

# Product terminology

Canonical brand: MARKET AI.

Never introduce these names into product branding or copy:

- Clarified
- Clarified Intelligence
- Clarified Financial Research

# Workflow

Before major architectural changes:

- explain the rationale
- identify tradeoffs
- prefer the simplest maintainable solution

Run `pnpm lint` and `pnpm build` after meaningful implementation milestones, and report their actual results.

Respect the requested phase and scope. An audit or initialization task does not authorize product screens, placeholder components, dependency additions, or deployment.

Read the relevant bundled Next.js guide before writing code and preserve the generated guidance below.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
