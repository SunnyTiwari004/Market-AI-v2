# Market AI

Market AI is a beginner-first, evidence-backed financial research product.

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
- Centralize typed mock data.
- Keep business logic separate from presentation.
- Keep data transformation separate from UI components.
- Avoid unnecessary dependencies.
- Do not introduce Redux or another heavy global-state solution without a demonstrated need.
- Do not add APIs, databases or authentication until explicitly requested.
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

Never silently invent stock prices, ratios, company results, news, filings, source counts, financial statements, research scores, scenario probabilities, or confidence percentages.

During frontend implementation, all financial information must come from centralized, typed, explicitly labelled MOCK DATA. Make the mock status visible wherever financial information is presented; do not present mock content as live or verified evidence. Do not embed financial fixtures directly in UI components.

Real financial evidence will replace mocks later, when explicitly requested. Missing or unavailable information must remain clearly identified rather than being filled with invented values.

# AI principles

AI will eventually explain structured research.

AI must not arbitrarily invent research scores.

Observed data, deterministic research calculations, modeled scenarios, and AI interpretation must remain conceptually separable.

# Sources

Every factual research claim in the future real-data system must be traceable to evidence.

Potential source categories include:

- company filings
- exchange announcements
- quarterly results
- annual reports
- investor presentations
- market data
- reputable financial news

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
