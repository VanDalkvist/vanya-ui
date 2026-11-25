# Design-system harness — Arch Improvement Cycle 8 (#36)
Date: 2026-11-25. Approved design: portable existing CLI, mandatory deterministic lint/verification, strict new apps, explicit migration of existing apps. No real product changes.

## S0–S3: context and architecture
- Source: main 035346e7f67c8c3bcf09a4c148d2129b5f359bb1; isolated branch qa/design-system-harness. Remote git object editing; no local working tree. Project stage prod (published UI, consumers).
- Policy: AGENTS.md, DESIGN.md, versioning.md, docs/patterns/ui-feature-pipeline.md, existing ledger and memory.
- Baseline: [arch-rules](https://github.com/ai-meatbags/arch-rules/blob/9ab47728c6836dbcea951235fdeda227b525ebfb/arch-rules.md); [loop](https://github.com/VanDalkvist/arch-improvement-skills/blob/6d1442e675b2a3ecf8df995c2e5a434235db87aa/skills/arch-improvement-loop/SKILL.md).
- Critical: AP-011/012/020/021/025/027/032/042/044/046/074/075/076. Baseline: AP-010/014/018/019/028/051/054/056/057/068/069. AP-015 KISS/YAGNI. AP-064 shadcn stack guideline is addressed by product-owned Vanya UI foundation; no stack change. AP-063/065/066 apply to consuming web project, not this Node CLI slice. DB/auth/tenant/migration rules N/A (no server, identity or DB).
- Memory: verify compiled/public entrypoints, negative controls, exact source facts. Existing portable CLI remains offline for inspect/check/plan; lint/verify may need network to install frozen isolated tools. No implicit dependency updates or cloud deployment. Security: no secrets in lint subprocess, explicit project/source boundaries, fail on missing package or config.
- Design ownership: Vanya UI owns design rules, frozen tools, adapter CLI; consumer owns explicit source roots, existing CSS/entrypoints, package pin, legacy debt and CI. No generic plugin registry or new runtime. Keep existing CLI as composition root; direct call to package runner, no project-authored fake success script. CI adapter is a package bin invoking same runner. No duplicate rule configuration in products.

## S4–S5 findings
- [P1] Missing consumer execution: ui-pipeline verify currently invokes build/browser only. AP-068/075/076, fix-now.
- [P1] Missing persistent opt-in wiring: bootstrap only writes pointers; local arbitrary lint script can bypass canonical tool. AP-012/046, fix-now after slice 0.
- [P2] Runner resolves checkout tokens instead of installed consumer token source; assumes src, ignores other roots. AP-011/025/068, fix-now.
- [P2] Existing debt adoption policy absent in consumer, and no source baseline fingerprint. AP-028/046, fix-now next vertical slice; keep separate from strict path.
- [P2] Missing real compiled consumer and blind-agent outcome proof. AP-075/076, blocked until executable evidence.
- [P3] Existing large CLI/file sizes and cosmetics, log-only.

## S6–S7 plan (reviewed against AP-075/076)
### Slice 0 — walking skeleton: real consumer lint
- [ ] RED: executable Node test spawns public CLI lint for isolated React consumer, package symlink to actual checked-out distribution; valid CSS and JSX -> exit 0; insert actual raw color + arbitrary size -> exit nonzero; missing installed runner -> exit nonzero with actionable error. No mock lint adapter.
- [ ] Verify RED from Cloudflare nonproduction build; expected command missing.
- [ ] Implement minimal public lint command, thin installed-package resolution adapter; validate source roots and resolve brand/token sources through installed package; invoke the existing frozen runner. Explicit source roots in config/args, default src only when present; reject absent roots. Do not implicitly install design-system package.
- [ ] GREEN actual CLI happy path, invalid source and missing package; same production code, actual frozen tools, no mocks. Gate no secrets in logs. Record runtime result. 
### Slice 1 — adoption and execution
- [ ] RED: bootstrap/adopt on real package writes persistent project lint script and config without overwriting unrelated scripts/instructions. Check flags missing/changed binding. verify executes canonical lint even if user-authored script falsely returns success; failure blocks build/browser, receipt cannot accept removed lint result.
- [ ] Implement explicit command mutation, preserve package lock and dependency pin; idempotent; no provider changes. Expose package executable for CI, same underlying runner. Agent skill and README guide cold-start and existing-product flow. Make scope explicit: strict new; existing adoption only after explicit debt capture (slice 2).
- [ ] GREEN real process test and package tarball consumer-smoke. Provider-specific CI appends canonical command before deploy; no GitHub Actions triggers.
### Slice 2 — existing debt
- [ ] RED: capture explicit versioned source-based baseline, same findings pass, new/duplicated/modified finding blocks, invalid/removed baseline fails; no automatic rebaseline. Cover CSS and JSX, operational errors fail.
- [ ] Implement explicit baseline operation and review; product-owned debt, canonical rule IDs, no blanket disables.
- [ ] GREEN on isolated existing consumer; preserve unrelated source.
### S9 / S10 / S11
- [ ] Architecture semantic probes (traceability, runtime completeness, entrypoint, anti-gaming), diff review and targeted/full test evidence.
- [ ] Separate product review via public CLI: happy, cold-start, error, negative control, real built consumer. Independent reviewer availability must be reported; no invented verdict. Blind agent test and real browser test remain distinct from CLI fixture. 
- [ ] Ledger and durable lessons; no merge until scoped gates pass. Do not claim full harness before all slices.
