# Market AI

Beginner-first, evidence-backed financial research college / portfolio project.

MARKET AI teaches financial research through a permanently synthetic, fictional financial universe. Companies, prices, statements, articles, filings, IPOs, evidence, and scenarios are simulated for educational/demonstration use. The canonical disclosure is **College Project · Simulated financial data**. Content must not imply live exchange information, real-source verification, or investment advice.

Current project status: **Implementation Milestone 1 — verified core data vertical slice.** PostgreSQL/Drizzle schema and generated migration, a deterministic three-company seed builder, research calculations, 27 snapshots, server-only queries and a bounded Stock Overview are implemented. Live migration, seed replay, persisted-data validation, all 27 query contexts and populated Stock routes have been verified against isolated local PostgreSQL 18.6. There is no production fallback dataset.

The intended application has real frontend/backend implementation, database, APIs, routing, search/filtering, calculations, research engine, historical snapshots, What Changed logic, eventual AI integration, accessibility, testing, CI/CD, and deployment. Each implementation milestone requires explicit authorization. The synthetic dataset is the final project data strategy; commercial market-data licensing/integration is not planned. Fictional identities and chronology are now specified in the synthetic-universe blueprint; numerical generation now covers only the authorized three-company development slice. Real-company Stitch examples remain design references only.

Technology baseline: Next.js App Router, TypeScript, React, Tailwind CSS, and pnpm. [package.json](package.json) and [pnpm-lock.yaml](pnpm-lock.yaml) own dependency versions.

## Getting started

Use the pnpm version declared in `package.json`. Install the locked dependencies and start the development server:

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Open [localhost:3000](http://localhost:3000).

Run `pnpm lint` to lint the project and `pnpm build` to create a production build. After a successful build, use `pnpm start` to start the production server.

## Documentation

- [Repository instructions](AGENTS.md)
- [Product principles](docs/product/PRODUCT_PRINCIPLES.md)
- [PRD and Release-1 scope](docs/product/PRD.md)
- [Non-functional requirements](docs/product/NON_FUNCTIONAL_REQUIREMENTS.md)
- [Requirement traceability](docs/product/REQUIREMENT_TRACEABILITY.md)
- [Experience contracts](docs/product/EXPERIENCE_CONTRACTS.md)
- [Explanation levels](docs/product/EXPLANATION_LEVELS.md)
- [Interaction contracts](docs/product/INTERACTION_CONTRACTS.md)
- [Terminology](docs/product/TERMINOLOGY.md)
- [Design system](docs/design/DESIGN_SYSTEM.md)
- [Responsive rules](docs/design/RESPONSIVE_RULES.md)
- [Frontend architecture](docs/architecture/FRONTEND_ARCHITECTURE.md)
- [Synthetic data contract](docs/data/SYNTHETIC_DATA_CONTRACT.md)
- [Synthetic universe](docs/data/SYNTHETIC_UNIVERSE.md)
- [Deterministic seed blueprint](docs/data/SEED_BLUEPRINT.md)
- [Logical data model](docs/data/DATA_MODEL.md)
- [Research methodology](docs/research/RESEARCH_METHODOLOGY.md)
- [Backend architecture](docs/architecture/BACKEND_ARCHITECTURE.md)
- [Server and API contract](docs/architecture/API_CONTRACT.md)
- [Frontend acceptance](docs/qa/FRONTEND_ACCEPTANCE.md)
- [Architecture decision records](docs/architecture/adr/)

## Requirements handoff before implementation

The following paragraphs record the historical documentation gates. Current implementation status and setup are recorded below.

Gate 2.5 audit accepted; the 2026-09-13 contracts record product behavior and explanation depth. The 2026-09-15 [Product Baseline](docs/product/PRD.md) now defines final Release-1 scope and coverage, with [NFRs](docs/product/NON_FUNCTIONAL_REQUIREMENTS.md) and [traceability](docs/product/REQUIREMENT_TRACEABILITY.md). This is specification completion, not implementation readiness. Before application implementation, separately establish fictional identities/timeline, numerical records, approved research methodologies, the synthetic data model, backend/API and AI architecture, and environment-based performance/resource budgets. Existing experience and interaction contracts remain the functional mechanics authority; no large duplicate FSD is needed. No schema, numerical dataset or backend implementation is created in this pass.

The five [required visual references](docs/design/DESIGN_SYSTEM.md#gate-25-reference-handoff) are needed before their relevant frontend implementation. Final Release 1 includes all six Stock views; separately authorized development can proceed through verified vertical slices without exposing unfinished views as completed functionality.

System Design Gate 1 (2026-09-16) now specifies the logical model, deterministic educational research methods, modular backend and browser server interfaces linked above. PostgreSQL/Drizzle are design recommendations, not installed dependencies. Remaining work includes design review, actual fictional identities/calendar/content, physical schema/migrations in an authorized implementation milestone, hosting/provider/resource decisions and the relevant visual references. No records, migrations, APIs or first-slice implementation are created by this gate; the earlier baseline paragraph records that milestone's handoff.

Synthetic Universe Design Gate (2026-09-17) defines the 15 fictional issuers, four sectors, fixed 2026-09-30 clock, evidence/content inventory and future seed-validation workflow. The linked blueprint resolves identity/calendar design, not numerical generation or implementation. The methodology remains unchanged; statement values, price paths, source bodies, scenario inputs and all application/database work are still outstanding. Earlier handoff paragraphs record their original milestone boundaries.

## Core data slice setup

Verified locally with Node.js 24.19.0 and pnpm 11.19.0. Node 24 typings describe the tested runtime; they do not impose a new runtime engine requirement. The installed Vite toolchain supports Node 20.19+ or 22.12+; other supported runtimes have not been verified here. This slice covers Tavren Systems (TAVREN), Neralith Digital (NERALITH) and Oryntel Services (ORYNTEL), in Digital Operations Services. Per company the builder produces three annual periods, eight quarters, 523 weekday closes and 14 simulated sources. Three cutoffs times three horizons times three companies produce 27 snapshots; nine shared scenario sets remain independent of horizon. The dataset is `market-ai-core-slice-v1`, with methodology `research-method-v1`.

Copy [.env.example](.env.example) to a private `.env.local` and supply `DATABASE_URL` for an existing, explicitly designated development PostgreSQL database. Do not put it in a public environment variable or commit credentials. No database service, cloud account or vendor is provisioned here. Migration/seed credentials need schema/write privileges; use a SELECT-only database role for the running application. Published datasets and methods are immutable through the seed workflow: identical reruns are no-ops, conflicting digests fail, and changed published content requires a new version. Direct database administrator writes are outside that application boundary.

`tsx` runs the TypeScript database scripts; `server-only` enforces the application import boundary. Scripts enable the React server condition so they can import that boundary outside Next.js. They load `.env.local`, or `.env` if the former is absent. A process environment variable takes precedence. Values never enter the client bundle.

```bash
pnpm db:validate  # Offline: generate, reconcile and validate the entire slice
pnpm db:validate --live  # Compare persisted records and all 27 query contexts
pnpm test:integration  # Explicit local PostgreSQL suite; never part of unit tests
pnpm test         # Pure methodology, integrity and service/render tests
pnpm lint
pnpm db:generate  # Generate SQL only after an intentional schema change
# Review the generated SQL before applying it to your development database:
pnpm db:migrate
pnpm db:seed
pnpm build
pnpm start
```

The checked-in [first migration](drizzle/0000_serious_silvermane.sql) was generated by Drizzle Kit. The workflow never uses destructive schema push or resets. Seeding validates before insertion and publishes all related records in one transaction. Method specification and implementation digests reject silent methodology replacement. Database numerics cross the server boundary as decimal strings; arithmetic uses Decimal before display formatting.

After applying the migration and seed, open `/stocks/tavren`, `/stocks/neralith` or `/stocks/oryntel`. Use the horizon and cutoff controls to retrieve the matching stored snapshot. The route exposes Simple Overview, working source dialogs, scenario assumptions and compatible What Changed comparisons. It does not expose unfinished Stock tabs, explanation-level switches, Share, Decision or Ask controls. Unknown symbols return not-found when the database can establish their absence; absent database configuration shows an honest retry state. The home route remains the foundation page.

Earlier Windows verification encountered native SWC/Rolldown restrictions. In this completion audit, the ordinary `pnpm build` Turbopack build passed; the earlier failure is not currently reproducible. The compatible Vitest 4.1.11/Vite 7.3.6 toolchain is retained without version churn. `pnpm build --webpack` remains a separately verified production-build option. No Windows protections or canonical build scripts were changed.

The live verification database is isolated local `market_ai_v2_dev` on PostgreSQL 18.6. This is a development verification environment, not a production hosting decision. Integration tests require that exact local database and role; constraint probes always run in transactions that roll back. The `pnpm-workspace.yaml` change approves only esbuild installation for the approved tooling.

The dataset digest covers generated content, with sorted object keys and deterministic, intentionally ordered arrays. Version/generator/seed/profile metadata is validated separately. It is an integrity/reproducibility check, not authentication. The seed policy is insert-once in a transaction, identical version/digest rerun as a no-op, and conflicting version content rejected. No delete or global reset is performed. The existing development dataset ID remains `market-ai-core-slice-v1`; the completion prompt's replacement example does not trigger a rename or deletion.

Live verification completed: 27 application tables migrated; 3 issuers/listings, 33 financial periods, 1,569 closes, 42 sources, 27 snapshots and 9 scenarios matched canonical generation. Seed replay preserved every table count and content fingerprint. PostgreSQL uniqueness, foreign keys, nullability and numeric definitions passed integration checks. Browser verification used actual database-backed pages and source bodies, including Escape/focus return, URL state, not-found and a separate unavailable-connection process; normal access remained intact. Unit/component tests: 88 passed. Explicit integration tests: 2 passed. Lint, default Turbopack and Webpack production builds passed. No deployment, AI integration, full universe, Home/Explore/IPO/Ask journey or complete Release 1 is claimed. The five existing visual dependencies remain outstanding.

## Development rules

Follow AGENTS.md and the approved architecture and product contracts. They take precedence over Stitch-generated markup; historical design files do not override them. Keep shared research logic and data consistent across responsive presentations.

Use approved canonical typed synthetic inputs, calculate derived values through defined application logic, preserve simulated provenance, and show missing information as unavailable. Do not invent screen-specific values, supporting sources, research scores, or probabilities. Respect the authorized phase: application code, integrations, dependencies, staging, commits, and deployment require the relevant task authorization.
