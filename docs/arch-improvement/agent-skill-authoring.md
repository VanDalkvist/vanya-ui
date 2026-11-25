# Agent skill authoring — #30

Baseline e4adeaae23c26059ed07cf986744407b63ed0d02 (0.4.2, Cloudflare build PASS, 122 Vitest + 30 Node). Owner approved audit-driven changes.

Sources consulted 2026-11-25: [Agent Skills specification](https://agentskills.io/specification) (frontmatter, compatibility and progressive disclosure); [Anthropic authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) (concise workflow, conditional references, real usage); [OpenAI skill evals](https://developers.openai.com/blog/eval-skills) (explicit/implicit activation and outcome-based evals); [OpenAI progressive disclosure](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra). Local design decisions are our own; no upstream skill text copied.

## Findings and decisions

- P1: vague discovery metadata and absent new-product path. Explicit trigger and compatibility, new scope, empty React target inspection and pinned setup recipe. No forced stack for non-React visuals.
- P1: duplicate detailed component rules and overbroad verification. Compact governing procedure, conditional routing to existing docs; preserve canonical acceptance IDs and actual component API. Scope feature/screen/migration/new; audit-only stays read-only.
- P1: UI-13 can be excluded for React features; detached receipt cannot establish target applicability. Project-bound plan + current inspect, UI-13 required for executable targets, matching successful actual verify JSON. Legacy detached review remains structure-only with explicit marker. Evidence is not authenticated, source freshness not cryptographically checked, no fabricated visual approval.
- P2: skill folder alone cannot resolve library references. State full source requirement and locate via local pointer. Bootstrap preserves custom policy; manual pointer update if moved. No extra dependencies, CI or provider coupling.
- Version 0.4.3 (compatible CLI addition); verified component release remains v0.4.1. No runtime UI changes or consumer updates.

## Behavior scenarios (agent evals, not executed)

| Prompt | Expected result |
| --- | --- |
| Create a new Vanya UI catalog in empty repo | new + react; scaffold, pinned package, tokens/fonts, real build/browser, bound receipt |
| Fix card spacing | feature; keep other routes/pin; composition and adjacent visual checks |
| Redesign workspace screen | screen; width/hierarchy/scroll ownership, shared header and states |
| Fix tiny text | typography roles and computed/rendered evidence |
| Audit existing screen | inspect/read-only findings unless fixes requested |
| Add API method only | no activation |
| UI task without browser | NOT_VERIFIED / BLOCKED; no READY |

Deterministic tests cover new empty repo, executable N/A denial, project mismatch, missing/partial/planned verify result, real local fixture commands and static visual artifact. These are CLI tests, not live model evals; Codex/Claude explicit and implicit activation, task quality and token efficiency remain NOT_RUN. Exact-head build pending at commit.
