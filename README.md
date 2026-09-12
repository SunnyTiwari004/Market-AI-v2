# Market AI

Beginner-first, evidence-backed financial research college / portfolio project.

MARKET AI teaches financial research through a permanently synthetic, fictional financial universe. Companies, prices, statements, articles, filings, IPOs, evidence, and scenarios are simulated for educational/demonstration use. The canonical disclosure is **College Project · Simulated financial data**. Content must not imply live exchange information, real-source verification, or investment advice.

Current project status: **Product and architecture recovery / specification phase.** The repository foundation and authoritative documentation exist; application product screens, backend, database, research engine, and AI integration are not yet implemented.

The intended application has real frontend/backend implementation, database, APIs, routing, search/filtering, calculations, research engine, historical snapshots, What Changed logic, eventual AI integration, accessibility, testing, CI/CD, and deployment. Each implementation milestone requires explicit authorization. The synthetic dataset is the final project data strategy; commercial market-data licensing/integration is not planned. Fictional company identities and datasets will be defined later; real-company Stitch examples remain design references only.

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
- [Experience contracts](docs/product/EXPERIENCE_CONTRACTS.md)
- [Terminology](docs/product/TERMINOLOGY.md)
- [Design system](docs/design/DESIGN_SYSTEM.md)
- [Responsive rules](docs/design/RESPONSIVE_RULES.md)
- [Frontend architecture](docs/architecture/FRONTEND_ARCHITECTURE.md)
- [Synthetic data contract](docs/data/SYNTHETIC_DATA_CONTRACT.md)
- [Frontend acceptance](docs/qa/FRONTEND_ACCEPTANCE.md)
- [Architecture decision records](docs/architecture/adr/)

## Development rules

Follow AGENTS.md and the approved architecture and product contracts. They take precedence over Stitch-generated markup; historical design files do not override them. Keep shared research logic and data consistent across responsive presentations.

Use approved canonical typed synthetic inputs, calculate derived values through defined application logic, preserve simulated provenance, and show missing information as unavailable. Do not invent screen-specific values, supporting sources, research scores, or probabilities. Respect the authorized phase: application code, integrations, dependencies, staging, commits, and deployment require the relevant task authorization.
