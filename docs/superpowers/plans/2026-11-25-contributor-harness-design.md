# Contributor mode — design proposal and bounded implementation plan

Status: APPROVED FOR IMPLEMENTATION (owner, 2026-11-25). Merge/release remains separate. S7 author review completed; independent implementation verification remains required.

## Context and invariants

The existing portable UI pipeline remains the entrypoint for consumers and contributors. A contributor is a human or coding agent bringing a reusable component, pattern, rule, token, fix or test into the public library. Useful extracted components and existing runtime defaults are preserved. Their consuming-service names, URLs, repository paths, screenshots, domain records, adoption metrics and provenance remain outside the public tools. Generic domain vocabulary and public third-party references are allowed subject to rights and actual reuse; a component may serve a specialized use case. No service registry or product-specific denylist in public code or documentation.

Brand owns identity grammar, UI owns reusable implementation and design rules; consumers own their individual assets, domain behavior and private extraction history. Consumer dependencies remain pinned; no automatic migrations, API breaking changes, new official artwork, new GitHub workflows or releases in this slice. Resolve outstanding identity reviews in their respective PRs before merge, including compatibility and version guidance.

## S0–S2 — architecture context

- Stage: MVP capability inside an existing deployed public library. Branch: feat/product-identity-family, PR #38, inspected head 5490dc5aeb72c22c5cb9b58aa3eb71e7246f7d21. Brand companion PR #1.
- Sources: AGENTS.md, DESIGN.md, skills/vanya-ui/SKILL.md, docs/patterns/ui-feature-pipeline.md, docs/patterns/publication-safety.md, docs/arch-improvement/memory.md, existing cycle 8 plan and ledger. Architecture baseline and loop pinned as in cycle 8.
- Active path: scripts/ui-pipeline.mjs -> ui-acceptance.mjs / ui-contract.mjs / design-harness.mjs; package test/build scripts, sync.ts, check-llm-publication.mjs, production compiled dist and existing CI. Existing extract-from-repo.ts scans JSX/TSX patterns but has an implicit external checkout default and reports origin paths. Existing authoredInventory excludes docs, tests, nested packages and hidden files; deliberately unsuitable as publication inventory.
- Critical gates: AP-020 responsibility boundaries, AP-074 explicit injected config, AP-075 minimal walking skeleton, AP-076 behavioral assertions, AP-019 bounded modules. Existing lessons: actual package/run path, negative controls, real compiled artifacts and exact revision evidence. No service/API/DB runtime or new provider.
- Verification: Node CLI and fixture integration tests, existing Vitest/typecheck/build/design lint, compiled dist inventory; manual semantic/visual review. Independent reviewer and product reviewer not yet available. S3 owner approval remains open.

## S3 proposed design

One additional operation in existing CLI: contributor preflight. Proposed names:
- `node scripts/ui-pipeline.mjs contribute --phase preflight --project . --policy /private/path/policy.json --base <explicit-local-base-ref>`
- `node scripts/ui-pipeline.mjs contribute --phase source --project .` (CI source snapshot)
- `node scripts/ui-pipeline.mjs contribute --phase built --project .` (CI actual dist)
- `--json` same convention as existing CLI. No new agent runtime. Contributor-only Git adapter is explicitly documented: consumers remain Node-only/offline; contributor preflight needs a local Git checkout and already available base ref. No fetch, network, writes, hooks or push. Base must be an ancestor and the range must be nonempty or an explicit staged change; invalid inputs fail closed. Inspect current outgoing commits, staged snapshot, and uncommitted candidates intended for publication. Preflight reports exact checked scope; final outgoing check rerun after commit before push. No claims about already-public history.
- Use one canonical public contributor guide routed from current skill and AGENTS.md; optional section in existing /agents/ after flow is proven. Reuse existing UI-01–UI-14 for applicable UI change, with contributor-specific review questions within guide (reuse/rights, API, publication). Existing acceptance schemas/scopes unchanged initially. Documentation-only contribution applies source checks, existing doc publication validation, and appropriate tests; no fake visual evidence. Component contribution also runs real component tests, typecheck, build, design lint and visual checks. Existing UI-14 remains evidence of review rather than proof of secrecy.
- Private policy schema v1: explicit list of literal identifiers and precise paths/URL prefixes, case handling documented; stored outside both public checkout and build inputs. No private policy content, matching value, absolute origin path, raw matched text, or dictionary in any public output. Local diagnostic details only via explicit local-only mode if needed; default output uses rule ID and counts (no matched path when path may leak). Policy absent/invalid in owner preflight => BLOCKED. Generic CI operates without owner dictionary and reports this limitation. Do not provide private policy or secrets to untrusted PR build code; if later needed, trusted maintainer runner only. CI after push protects deployment, not prior disclosure. Agent must review PR text, commit metadata, issue text and attachments before publishing; tool does not publish or edit GitHub.
- Stable checks: PUB-01 inventory/coverage (source filenames and text incl. docs, tests, hidden tracked files; reject unsupported symlinks, path escape or unreadable content; explicit binary classification); PUB-02 owner identifiers (private policy preflight only; scan paths and content, commit messages and outgoing snapshots; no remote history rewrite); PUB-03 portability (relative import escapes, absolute machine paths, suspicious external project dependency refs; generic third-party dependencies allowed; review computed imports/links); PUB-04 compiled public output (actual dist exists, scan text files/paths, HTML/Markdown/JS/CSS/map, never treat missing output as pass); PUB-05 semantic publication (manual: rights, generic examples, images/metadata, PR/issues, domain coupling).
- Machine checks report per-check PASS/FAIL/BLOCKED/NOT_APPLICABLE and overall result with coverage, target/snapshot and policy scope. No PASS for absent dictionary in CI; generic source/built pass can still permit CI, and owner preflight remains separate. No public certification of privacy. Avoid raw matching strings in logs. Existing LLM publication validation remains responsible for completeness/drift, scanner handles forbidden content. Static analyzers remain responsible for design.
- Source inventory adapter uses Git index/commit object snapshots for contributor preflight and tracked checkout for CI; compiled inventory is a separate bounded local filesystem walk. Test explicit nested directories, dots, whitespace, unicode paths, symlink escape, binary policy, invalid refs, oversized/unreadable input. Do not add a generic recursive directory crawler to consumer lint. Pure policy matching accepts entries and config; CLI composition root loads filesystem/Git adapters explicitly. No global state.
- Rights: no copying private data or unlicensed third-party artifacts. Record reusable reason and public rights in PR; source-specific evidence stays with originating project. No separate receipt server, registry, extraction engine, auto-copy, PR bot or broad API comparator. For existing exports use targeted actual behavior regression and existing package smoke; full API-diff tooling deferred until needed. Fix extract utility explicit source path, no import side effect; its raw output is local-only and must not be committed.

## S4–S5 review and proposed triage (author, awaiting S3 confirmation)

- P1 public references inherited in canon, code, tests, docs/research filenames and ledger: fix-now by generalization/redaction and neutral renames, preserve reusable facts and runtime. Historical identifiers stay private; no rewrite or deletion of historical Git objects or remote discussion without separate approval.
- P1 current public policy allows consumer links: fix-now, explicitly prohibit actual consumer identity and provenance even if independently public; preserve approved general third-party references and own brand/UI names.
- P1 publication checks currently verify freshness, not boundary; fix-now with preflight and source/built gates.
- P2 existing extraction tool has implicit origin directory and raw local output: fix-now by explicit path and local-only contract. No automated copying.
- P2 identity compatibility and older pin mismatch: separate outstanding review fixes, keep outside contributor runtime slice; do not merge PR until resolved.
- P3 inherited domain-specific defaults: log-only, preserve APIs and behavior, generalize descriptions. No redesign or forced migration.
- Blocked: full Git history cleanup, private policy availability on all agent environments, independent visual/semantic reviewer. No private dictionary committed or transmitted to untrusted CI.

## S6 proposed bounded plan (execution only after approval and S7)

### Slice 0 — walking skeleton (AP-075)
- [ ] Add pure policy matcher, explicit inventory adapter and one CLI branch within current pipeline; test via actual Node invocation. Use synthetic identifiers only.
- [ ] Fixture clean source + build passes generic checks. Synthetic identifier in tracked markdown/path causes owner preflight nonzero; malformed/missing policy causes BLOCKED; generated artifact leak and missing dist fail. Assert output redaction (no sensitive literal/path), actual exit code, unchanged source and no network/write side effects.
- [ ] Wire source gate before build/sync and built gate after Vite/prerender to existing package build, preserving CI triggers and lint pipeline. Prove negative fixture reaches the actual build gate (not only direct function tests); source and built checks are distinct. CI status scope must accurately reflect absent private policy.

### Slice 1 — cleanup and contributor workflow
- [ ] Audit tracked text, filenames and relevant binary screenshots; generalize known product references in docs, comments, demos, fixtures, tests and filenames; fix all internal links and generated docs. Preserve useful generic research; private origin notes remain outside public repo. No source product identifiers in commit messages or reviews.
- [ ] Narrow public policy and add contributor route in existing skill/AGENTS.md. Add concise contributor guide and PR template; update existing doc publication mapping and freshness tests if exposed publicly.
- [ ] Remove implicit checkout default from extract utility, add explicit source path and direct-entry guard. Test no-argument failure and synthetic local extraction; no raw report in public artifacts.
- [ ] Preserve components, palette, existing acceptance IDs and exports; actual existing regression tests run unchanged except generic names/copy.

### Slice 2 — verification
- [ ] Run complete existing tests/typecheck/build/lint and exact-SHA package smoke for changed public package.
- [ ] Exercise fresh agent contribution journey on a synthetic reusable component or rule; source->preflight->build->compiled gate->review, with positive/negative outputs. No real consumer repo mutations.
- [ ] Inspect final diff, tracked files, generated output, package packlist, public discussion draft and changed visual assets. Record coverage and limitations without identifiers. S9 architecture and black-box product review require independent artifacts or explicit unresolved status. Record ledger and memory only with actual evidence.

## S7 preliminary plan review

Avoid two registries or duplicate acceptance schemas. Keep matcher pure and adapters explicit; one CLI operation, no new dependencies. The owner dictionary must never be public or sent to an untrusted build. Pre-push is the confidentiality boundary; CI is a deployment gate. Test real exit and build wiring, including outgoing intermediate commits, and redact all outputs. Verify scope rather than claiming exhaustive confidentiality. Product-specific provenance, historic cleanup, new API-diff suite, browser automation expansion and UI marketing are parked. Await owner review before implementation.

## Execution clarification
Use a single contributor command, three explicit phases, no consumer acceptance schema changes. CI source checks tracked checkout; owner preflight scans outgoing commits, index and current tracked/nonignored candidate files with the external policy. Binary content is explicitly manual. Scope limits fail closed; no automatic private policy injection. Add tests before implementation in the change set; do not claim observed RED unless executed. Preserve existing components.
