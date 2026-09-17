# MARKET AI server and API contract

System Design Gate 1, 2026-09-16. Interface specification only; no route handlers, APIs, schemas or integrations are implemented. [Backend architecture](BACKEND_ARCHITECTURE.md) owns execution boundaries. [INT contracts](../product/INTERACTION_CONTRACTS.md) retain UI/history/focus ownership. All public interfaces require **no user authentication**; public access still requires validation and resource controls.

## Shared contract

Read operations pin a published dataset version, allowed simulated cutoff and method; never trust caller-supplied financial values. Decimal quantities cross serialization as strings with explicit units/period/availability. Dates are ISO dates; timestamps are explicit instants. Every result identifies dataset/cutoff, with method/snapshot IDs where relevant. Actual response/generation time never replaces financial as-of time.

HTTP success envelope: data plus context (dataset version, cutoff, applicable method/snapshot IDs) and request correlation ID. Error envelope: stable code, safe message, optional field errors, retryable flag and correlation ID. No stack traces, database errors or credentials. An unavailable field within a successful known-entity response is typed availability, not a fabricated zero or an empty object.

Common HTTP outcomes: 400 invalid syntax/input; 404 unknown entity/source; 409 unsupported/expired context or conflicting request identity; 413 body/resource size limit; 429 admission limit with Retry-After when known; 503 data/provider unavailable; 504 controlled upstream timeout; 500 unexpected sanitized internal failure. Unsupported or ambiguous research questions are domain results, not transport errors. GET operations have no side effects and are idempotent. Unsupported methods return 405. No public financial CRUD interface.

## Server-rendered use cases

These are direct application calls, not additional HTTP API routes. They may be invoked by Server Components after page-boundary URL validation.

| Use case and caller | Inputs / validation | Output and failure semantics |
| --- | --- | --- |
| Read Home / Explore | Level, optional horizon, allowed category/scopes/query/filter enums; resolve active dataset/cutoff | Briefing, derived market/sector state, scoped discovery and IPO previews. Unsupported filter combinations normalize under INT-004/009; data failure is not zero results. |
| Read Stocks / IPOs directory | Trimmed query, sector or lifecycle status; level and Stock horizon only | Complete bounded result list/count, stable documented ordering. Unknown match returns a true no-result response; malformed URL normalized, no guessed entity. |
| Read Stock research | Canonical lowercase URL symbol, level/horizon/view and allowed view-specific period/range/filing filters | Identity, selected snapshot, view data, evidence metadata, selected bounded closing series where needed. Unknown listing is 404; missing known research is explicit unavailable. |
| Read Decision | Same listing/level/horizon; step 1–6 or summary | Same snapshot findings and question model; missing evidence does not disable navigation. Invalid step becomes 1. |
| Read IPO | Canonical slug and level | Current lifecycle status plus cutoff-labeled IPO research, terms, sources and scenarios. No Stock horizon or IPO Decision route. |
| Read Ask entry | Validated safe intent/entity/concept/comparison identifiers, level and applicable horizon | Supported entry context and capability suggestions; never auto-generate. Arbitrary draft text is local, not a URL parameter. |

All reads share canonical query services. They are idempotent, read-only and do not stream AI content. Ordinary server render loading boundaries are not AI token streaming. Refresh/browser history reconstruct addressable state under INT-003; local help/readers/selected chart point/session conversations are not persisted as URL state. App Back remains `/stocks` or `/ipos` with the existing context rules.

## Local search suggestions

**Search HTTP is not required.** The server supplies one compact safe index from canonical identities/memberships for the pinned dataset/cutoff, shared by search controls. Include only IDs, kind, display names, symbols, aliases, applicable scope memberships and validated canonical destinations; no financial results, source bodies or separate authored catalog. The bounded universe makes local matching simpler and removes per-keystroke network latency/failure.

Local matching and submitted server search share one pure matcher: trim, Unicode NFC normalization, case-insensitive matching with punctuation preserved; exact name/symbol/alias matches, then prefix, then substring; deterministic name/kind/ID tie order using a fixed comparator. Filter by Home/Explore/Stocks/IPOs/Ask scope and compatible type/sector/theme before matching; show all bounded matches grouped by kind. Ambiguous aliases retain each match for explicit selection. Empty input shows neutral guidance; no match is a real empty result. Preserve IME composition and keyboard/focus behavior under INT-008.

The index identifies its version/cutoff. On navigation/context replacement discard old matches and install the new index; unavailable index shows an honest unavailable/retry state, not no results. A loaded index needs no network to match, but destination loading still needs the server. Submitted search validates scope/identity again against canonical server data; client suggestions are never authority. No query logging, query endpoint, extra persistent cache or browser financial dataset. Reconsider HTTP only if measured payload or scope growth warrants it.

## GET /api/sources/{evidenceId}

**Conditional boundary:** a reader whose full content is already included in the server-rendered payload opens locally without HTTP. Only when full bodies are deliberately omitted to reduce initial payload does the citation reader use this lazy-loading interface. The following contract applies to that case; it is not mandatory for every source or a new product page. Both paths use the same canonical evidence selector and cutoff/context checks.

Inputs: stable evidence ID, dataset version, cutoff and invoking context identifier (Stock/IPO snapshot, market cutoff or concept). Validate the ID exists in that dataset, is actually eligible/relevant to the invoking context and published by cutoff. IDs are not authorization tokens; this check prevents wrong-source/time association in a public dataset. References from a source-count list use the same canonical set and deduplication.

Output: evidence kind, title, full available body, fictional publisher/issuer attribution, simulated provenance, reporting/publication metadata, stable section locators and availability. Source meaning/content is never rewritten for level. Missing body in a known metadata record returns 200 with explicit unavailable reason and no fake download. Unknown ID is 404; invalid context relation is 409; DB failure is 503 with local Retry. Do not accept external URLs or provide a fetch proxy.

Caching: immutable version/cutoff/content-digest response supports ETag with Cache-Control no-cache (revalidate before reuse); 304 only after valid context checks. Error responses no-store. Client discards responses after context/route changes. Idempotent GET, no streaming or authentication. UI focus, close and retry follow INT-007; opening never changes route/history.

## POST /api/ask

Purpose/caller: explicit browser Ask submission or contextual follow-up. Never called automatically by capability cards, chips, mounting or level changes. No Server Component loopback request. No user account/session history resource.

Input fields: client request ID, question, one of the four intents, validated selected issuer/listing pair or concept/market identifiers as appropriate, dataset version/cutoff, level, optional Stock horizon, and optional bounded recent conversation context. Compare requires two distinct supported listed entities. Market context resolves the same Home cutoff. Context fields contain no authoritative prices/scores or arbitrary retrieval URLs.

Validation: whitespace-only input invalid; preserve Unicode/punctuation; enforce the [resource policy](#resource-and-security-policy), reject malformed/repeated scalar structure, validate every entity against canonical scope and cutoff. Unknown real/live requests produce unsupported-domain results and supported alternatives. Ambiguous/entity-only questions can require clarification without provider generation. IPO-specific context is not silently interpreted as a listed company; unsupported intents disclose the narrower four-capability release boundary.

The server treats prior client messages as untrusted conversation, never evidence. Re-resolve canonical context and claim support for each request. Prior assistant text cannot create a new fact or source. Follow-ups retain the visible pinned snapshot; explicit context changes start a new context. Old retained dataset versions can complete consistently; unavailable versions return context-expired and invite a visible reset, not a silent move to current research.

Successful domain output is one of: answered, partially-supported, unsupported or clarification-required. Answered/partial includes constrained explanation blocks, canonical value/claim references, deduplicated actual citations, limitations, selected context and real generation metadata only when a provider call actually succeeded. Unsupported/clarification may be handled deterministically with generated=false. No fake call or progress percentage. The [application validation boundary](BACKEND_ARCHITECTURE.md#provider-and-validation-boundary) must accept every factual block before it is exposed.

Provider unavailable is 503; controlled timeout is 504; structurally invalid or ungrounded provider output is 502 with code ANSWER_VALIDATION_FAILED and Retry/Edit guidance. No stack trace or raw provider payload reaches the client. If supported portions cannot be safely isolated, fail rather than label the whole answer partially supported. Preserve draft/context on all failures. No shared cache: Cache-Control no-store. Return one complete JSON response, **no token streaming** in v1.

Idempotency: client request ID identifies a logical exchange for UI deduplication; while pending the submit action is disabled. Server process coalesces identical concurrent request ID + canonical-context/question digest within a short in-memory window; a reused ID with different content is 409. This is best-effort duplicate suppression, not a durable exactly-once/provider-billing guarantee across restart or multiple instances. Do not persist answers to pretend otherwise. Retry after a known failure uses the same exchange identity and replaces its failed attempt; a retry after unknown network completion may call the provider again, so no automatic retry loop. Client applies at most one successful response to that logical exchange. Clear failed in-flight entries; do not cache a failure as a permanent answer. Provider-specific idempotency, if available later, may reduce duplicate cost but is not assumed.

## Interfaces deliberately not created

| Operation | Mechanism |
| --- | --- |
| Chart range/data and point inspection | Server navigation returns the selected closing series/table; selected point is local. No chart endpoint. |
| Applied directory/Explore filters | URL navigation → direct server query; drafts local. No async-filter endpoint while navigation satisfies INT-009. |
| Financial periods / Filings filters / Stock views | Addressable server reads; no endpoint per tab or period. |
| What Changed / scenarios / Decision | Query the same published outputs/compatible comparisons, not a new HTTP calculation service. |
| Context Help | Reviewed small concept content supplied with relevant page or the source reader when opening full evidence. No separate help API. |
| Share | Browser native Share/clipboard/manual URL with safe state; no server share-record persistence. |
| Seed, migration, snapshot generation, IPO reconciliation | Developer-only command workflow with transactions. No public write/CRUD/admin endpoints. |

## Resource and security policy

These are application admission bounds chosen for short educational questions and the bounded corpus, not provider token budgets or performance SLAs. They become enforced constants only in authorized implementation and may be revised with a documented API-contract change after evaluation.

- Ask question: at most **4,000 Unicode code points**; request body at most **128 KiB** encoded bytes. At most **six prior turns**, each with bounded question/answer text, and no single prior text longer than **8,000 code points**. Oversize receives 413/field guidance, never silent truncation. Client offers an explicit new-context action if history will not fit.
- Context construction: at most **16 supporting evidence excerpts**, each up to **2,000 code points**, plus a fixed typed research/result bundle. Pick complete semantic excerpts and required caveats, not arbitrary cuts through a claim. If support exceeds the bound, narrow the question or return an explicit partial scope. Provider token/output budgets remain unresolved until a model is chosen; do not equate code points to tokens.
- No automatic provider retries. Controlled application deadline **45 seconds**, with provider timeout configured below it when chosen. This is a resource ceiling with failure recovery, not a promise to answer within an advertised latency. Hosting must support this deadline or the contract must be revised before deployment.
- Allow at most **one active Ask submission per browser conversation**; server-side admission additionally limits an anonymous network bucket to **five submissions per minute** and a deployment-wide provider concurrency/budget ceiling chosen before public enablement. Enforce at a trusted ingress or a demonstrably single active server process; in-memory counters across independent instances do not establish a global limit. If enforcement/cost ceiling is not configured, Ask generation stays honestly unavailable. No Redis service or accounts added solely for this.
- Anonymous buckets use short-lived keyed hashes of trustworthy network metadata; retain only counters for the current window plus expiry, never raw IP/question text as analytics. Document host logs separately under NFR-006. Shared-network limits may affect multiple learners; 429 must explain retry, not claim an account restriction.
- Same-origin browser POST policy, supported JSON content type, bounded parsing and parameterized queries. No auth middleware, permissive cross-origin generation, arbitrary URLs, raw HTML, model-executed SQL or hidden public writes. Validate provider IDs against the actual retrieved context, not just the source catalog.

## Verification and slice handoff

Contract checks cover valid and malformed inputs; ID/cutoff mismatch; Unicode/IME-safe client behavior; empty/no-result versus DB failure; stale local search-index results/reader responses; response decimal/date types; unknown/unsupported/partial Ask; missing/forged citations and prompt injection; timeout, resource admission and Retry; duplicate logical exchanges; no browser/server conversation persistence. Server query and HTTP paths call the same domain selectors to prevent drift. Do not use the LLM as the math oracle.

The [first vertical slice](BACKEND_ARCHITECTURE.md#first-vertical-slice) needs a direct Stock query and source reader, not every endpoint immediately. Local suggestions and actual Ask are later authorized slices; the first source reader needs HTTP only if its full body is not supplied with the page. This sequence does not reduce the final PRD scope or mark any interface implemented.
