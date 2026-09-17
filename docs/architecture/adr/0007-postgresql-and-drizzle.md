# ADR 0007: PostgreSQL with a small Drizzle query layer

## Status

Specified recommendation for System Design Gate 1 review. Implementation, package installation, schema code and hosting selection are not authorized.

## Date

2026-09-16

## Context

The accepted product needs relational issuer/listing/offer identity, exact money, reproducible statement inputs and immutable research snapshots for a small synthetic universe. Backend technology was intentionally left open by the Product Baseline. The detailed comparison is owned by [backend architecture](../BACKEND_ARCHITECTURE.md#database-engine-decision).

## Decision

Recommend PostgreSQL and Drizzle. PostgreSQL provides relational constraints, exact decimal storage and explicit date/timestamp semantics for the documented financial calendar. Its durable client/server boundary fits deployed multi-request web use; versioned SQL migrations and same-engine integration tests support reproducible changes. These integrity, precision and deployment properties make it the stronger Release-1 fit than SQLite, despite the small dataset. Drizzle keeps TypeScript schema intent and reviewed SQL migrations visible. Use small use-case-specific query modules, runtime validation and deliberate decimal conversion. Drizzle provides TypeScript schema/query typing and straightforward PostgreSQL support with modest abstraction. It adds another dependency/toolchain; generated migrations still need review, and ORM typing never replaces database constraints. Parameterized raw SQL is appropriate where clearer, with deliberate result validation. Keep pure research functions independent of either tool.

No hosting vendor, engine/package version or driver is selected in this gate. The [logical model](../../data/DATA_MODEL.md) specifies relationships and invariants without executable schema. Current framework versions remain unchanged.

## Alternatives and tradeoffs

SQLite is capable of the read-heavy dataset and simpler locally, but durable file deployment and decimal discipline add choices this project can avoid with PostgreSQL. Prisma is a credible typed alternative but adds another modeling/tool workflow; direct SQL minimizes abstraction but needs more handwritten query typing/migration coordination. This decision is based on clarity and setup consistency, not an unsupported speed or scale claim.

## Consequences and revisit conditions

Local/integration-test setup needs PostgreSQL; do not substitute SQLite tests for PostgreSQL constraint/decimal behavior. Review generated migrations, verify package compatibility and database connection budgets during implementation. Revisit only if actual hosting constraints or demonstrated tooling incompatibility make the choice unsuitable. Do not add an ORM abstraction that supports imaginary interchangeable databases.
