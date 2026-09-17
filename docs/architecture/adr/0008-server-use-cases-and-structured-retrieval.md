# ADR 0008: Direct server use cases and structured AI retrieval

## Status

Specified recommendation for System Design Gate 1 review. Extends ADR 0002/0004 server and state boundaries; does not supersede them. No implementation is authorized.

## Date

2026-09-16

## Context

The bounded dataset supports server-rendered research and a small number of interactive browser requests. An HTTP endpoint per entity or a vector database would add separate mechanisms without a required consumer. ADR 0005/0006 already own deterministic research versus AI interpretation; this decision applies those boundaries, not a competing research-authority model.

## Decision

Use one modular monolith. Server Components call application/query functions and repositories directly. Search uses a compact server-provided safe identity index with local matching shared with submitted server search; it needs no HTTP endpoint. Browser HTTP boundaries are explicit Ask submission and conditional lazy source readers (only when full content is omitted from the page) as defined in [the server contract](../API_CONTRACT.md). No public CRUD/write API, no server loopback HTTP, no required Server Actions or token streaming.

Ask resolves canonical identity, eligible snapshot, deterministic outputs and linked evidence with ordinary relational retrieval. No vector database, embeddings pipeline or internet retrieval is needed for the approved corpus. One narrow provider adapter returns explanation candidates; application-owned claim/source validation controls publication. No provider/model is selected. Session-only conversation remains under INT-014.

## Alternatives and tradeoffs

Universal REST would duplicate validation/serialization for server reads. Client-side financial research catalogs risk stale truth; the compact versioned identity index contains no financial values and is replaced with its pinned context. Vector retrieval may help an unbounded unstructured corpus but cannot replace cutoff/identity/source checks. Streaming would complicate validating unsupported output before exposure; complete validated answers satisfy Release 1.

## Consequences and revisit conditions

Share use cases between page reads and browser handlers; contract-test both paths. Failure in AI does not replace or change canonical research. Reconsider a boundary only for a real client need, measured performance issue or explicit product expansion. Larger semantic retrieval needs require separate approval and evidence, not speculation.
