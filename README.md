# Market AI

Beginner-first, evidence-backed financial research experience.

Market AI is a research and decision-support product, not a brokerage or trade-execution platform. Current financial content will use centralized demo/mock data. There are no real financial APIs or AI integrations yet.

Current project status: **Frontend architecture / prototype implementation phase.** The repository contains the foundation and approved documentation; product screens have not yet been implemented.

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
- [Mock data contract](docs/data/MOCK_DATA_CONTRACT.md)
- [Frontend acceptance](docs/qa/FRONTEND_ACCEPTANCE.md)
- [Architecture decision records](docs/architecture/adr/)

## Development rules

Follow AGENTS.md and the approved architecture and product contracts. They take precedence over Stitch-generated markup; historical design files do not override them. Keep shared research logic and data consistent across responsive presentations.

Do not invent financial values, source records, research scores, or probabilities. Use approved centralized typed mock fixtures, preserve their provenance, and show missing information as unavailable. Respect the authorized phase: application code, integrations, dependencies, staging, commits, and deployment require the relevant task authorization.
