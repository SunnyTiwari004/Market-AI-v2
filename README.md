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
- [Explanation levels](docs/product/EXPLANATION_LEVELS.md)
- [Interaction contracts](docs/product/INTERACTION_CONTRACTS.md)
- [Terminology](docs/product/TERMINOLOGY.md)
- [Design system](docs/design/DESIGN_SYSTEM.md)
- [Responsive rules](docs/design/RESPONSIVE_RULES.md)
- [Frontend architecture](docs/architecture/FRONTEND_ARCHITECTURE.md)
- [Synthetic data contract](docs/data/SYNTHETIC_DATA_CONTRACT.md)
- [Frontend acceptance](docs/qa/FRONTEND_ACCEPTANCE.md)
- [Architecture decision records](docs/architecture/adr/)

## Requirements handoff before implementation

Gate 2.5 audit accepted; the 2026-09-13 contract pass records product behavior and explanation depth. This is documentation completion, not implementation readiness. Before application implementation, establish a concise baseline covering PRD / MVP scope, measurable NFRs where justified, requirement traceability, the synthetic data model, and backend/API architecture. Do not invent latency or reliability targets. Experience and interaction contracts already supply much of the functional specification; do not duplicate them into a large FSD without a genuine gap. No PRD/NFR documents, schemas, numerical datasets or backend design are created in this pass.

The five [required visual references](docs/design/DESIGN_SYSTEM.md#gate-25-reference-handoff) are needed before their relevant frontend implementation. Final Release 1 includes all six Stock views; separately authorized development can proceed through verified vertical slices without exposing unfinished views as completed functionality.

## Development rules

Follow AGENTS.md and the approved architecture and product contracts. They take precedence over Stitch-generated markup; historical design files do not override them. Keep shared research logic and data consistent across responsive presentations.

Use approved canonical typed synthetic inputs, calculate derived values through defined application logic, preserve simulated provenance, and show missing information as unavailable. Do not invent screen-specific values, supporting sources, research scores, or probabilities. Respect the authorized phase: application code, integrations, dependencies, staging, commits, and deployment require the relevant task authorization.
