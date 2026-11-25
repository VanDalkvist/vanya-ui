# Contributor mode — simplified design and implementation plan

Owner approved the UI-focused simplification on 2026-11-25. Supersedes the earlier publication-scanning proposal. The earlier implementation and review remain in PR history.

## Architecture context and review

Existing Vanya UI Harness is the single entrypoint (skills/vanya-ui/SKILL.md, scripts/ui-pipeline.mjs, package scripts, design rules, public reference generator). Contributors bring reusable components, rules, tokens, patterns or fixes. Existing components, consumer APIs, presets, identity and approved historical technical references remain unchanged. The canonical library must remain usable independently. Standard publication/rights rules apply to every contribution.

Arch review: AP-020, AP-074, AP-075, AP-076, AP-019. Existing publication scanner introduces Git/environment dependencies and a private policy that prevents normal agent workflows. Owner chose to remove the subsystem. No replacement scanner, no Git history analysis, no policy files, no new security infrastructure. Keep existing documentation consistency validation and standard CI. No new CI workflow or consumer changes.

## Approved design

One contribution route in the existing skill with a short detailed guide. Agent decides whether a candidate deserves inclusion, checks actual exports and rules, prepares a portable API or precise rule, demonstrates applicable behavior and verifies it. A contribution may be declined or kept local.

One thin CLI operation: `node scripts/ui-pipeline.mjs contribute --project . [--json] [--dry-run]`. It validates the selected library package and required scripts, then reuses the existing runScript runner and manager detection to execute test, typecheck, build and lint:design:pilot in the same order as existing maintainer CI. Browser/visual evidence remains explicitly separate. Missing script/invalid target blocks execution; failed task stops subsequent tasks. No Git, network credentials or mandatory private policy. Does not install app dependencies, publish, create PRs or deploy. The existing frozen lint toolchain retains its normal installation requirements. Existing consumer commands stay unchanged.

Use existing UI acceptance criteria as applicable for visual/interactive contributions. A contributor execution report is machine evidence only, not an automatic approval or a consumer verify receipt. For rule-only changes, verify documentation, executable implications and public consistency; visual review only when applicable. No forced component or token additions.

## Bounded implementation slices

- [ ] Write CLI regression cases: ordinary temporary directory with no Git; actual package scripts execute in order and produce marker output; failed task prevents later scripts; dry-run writes nothing; incorrect target and missing script block before execution. Existing consumer tests preserved.
- [ ] Replace privacy operation with thin library verification route using existing runner; restore original build/test commands and add the existing TypeScript invocation as a package script. Delete three scanner modules and scanner-specific tests.
- [ ] Update current skill, guide, PR template, help, README, canonical publication docs, release note, generated doc links and eval scenarios. Preserve existing publication safety policy, extract helper and approved references. Remove stale requirements for external policy and Git preflight.
- [ ] Run existing CI, inspect exact revision evidence and changed sources. Verify real no-Git fixture execution. Record observed results and limitations; independent reviewers and live agent evals must remain NOT_VERIFIED/NOT_RUN until executed.

S7 plan review: reuse actual existing scripts and runner; no new acceptance schema, source crawler or fake verification. No hidden source installation or Git operations. Defer identity-specific remaining review findings to their separate scope. No merge until separately approved.
