# UI feature pipeline — portable agent workflow

The **canonical executable procedure** is [Vanya UI agent skill](../../skills/vanya-ui/SKILL.md). For package consumers use [explicit SemVer/SHA release policy](../versioning.md); the portable workflow never bumps or deploys a dependency without an explicit decision. The [portable CLI](../../scripts/ui-pipeline.mjs) and [local bootstrap](../../scripts/bootstrap-ui-pipeline.mjs) work on any machine with Node.js 20+ and folders containing the design system and target project. No Git/GitHub access, cloud browser or CI runner is required.

## Run locally

```sh
# UI library and target may live anywhere on disk:
node /path/to/vanya-ui/scripts/bootstrap-ui-pipeline.mjs --project /path/to/project
node /path/to/vanya-ui/scripts/ui-pipeline.mjs inspect --project /path/to/project
node /path/to/vanya-ui/scripts/ui-pipeline.mjs check --project /path/to/project
node /path/to/vanya-ui/scripts/ui-pipeline.mjs verify --project /path/to/project --package app
```

The CLI reads files, not git diffs. `inspect` returns source/library files to read and available local scripts. `check` verifies the base policy/dependency/import/script contract and reports observed version/CSS wiring warnings. It does not certify component selection or layout. `verify` executes build and browser scripts **locally** with npm/pnpm/yarn/bun; it never installs packages, uses secrets, deploys or assumes internet. In new React UI use `--mode react`; in monorepos specify `--package`. `--json` provides machine-readable status, `--dry-run` reports planned commands as NOT_RUN.

## Agent lifecycle

1. Read local canonical source, exports and pattern docs.
2. Define user action, screen composition, scroll owners, URL/breadcrumbs and UI states.
   Use [role-specific hover/focus/pressed/selected contract](interaction-states.md) for every clickable icon, text link, menu row, tab and disabled action, rather than adding local one-off CSS.
3. Implement one coherent feature using real Vanya UI primitives/tokens, adapting to the project's stack.
4. Run local `check` and `verify`, fix failures, and rerun after the final edit.
5. Observe the actual browser at representative viewports, keyboard, zoom, history and error states. Record evidence or explicitly say NOT VERIFIED.
6. Report independently: static contract, build, browser tests, visual QA and any deployment.

Build success cannot certify layout. Playwright passing does not automatically prove every visual requirement. The skill defines the complete acceptance contract.

## Task acceptance receipt

The scope is explicit: `feature` (one change), `screen` (one surface/flow), or `migration` (explicitly named product surfaces). Do not expand a feature into a product-wide migration. Preserve unaffected surfaces and pinned dependencies unless the task requires a change.

```sh
node /path/to/vanya-ui/scripts/ui-pipeline.mjs plan --scope feature --task "Improve catalog filter" --target "/catalog" > ui-receipt.json
# Fill the same receipt after implementation, check/verify and real browser review.
node /path/to/vanya-ui/scripts/ui-pipeline.mjs review --receipt ui-receipt.json
```

The catalog lives in `scripts/ui-acceptance.mjs`; each stable ID includes a canonical source, acceptance condition and evidence method. UI-01 task, UI-02 components/version, UI-11 responsive/theme visual review and UI-14 privacy always apply. Migration also requires UI-03 composition, UI-04 typography, UI-06 interaction and UI-13 execution. UI-05 copy, UI-07 actions, UI-08 navigation/scroll, UI-09 dynamic geometry, UI-10 shortcuts and UI-12 identity/sources are evaluated for the task's actual surface. Other rows may be N/A with a concrete reason. A small task can have a narrow browser pass; a screen/migration needs review of the named complete surface and relevant shared boundaries.

Each row starts PENDING. For PASS, record evidence as e.g. `{"method":"browser","target":"/catalog","viewport":"390x844","theme":"dark","observation":"Filter stays visible; no page overflow; measured control width 40px","artifact":"local screenshot or log path"}`. Source evidence names files and concrete observations; command evidence also includes the actual executed `command` and result. N/A requires a scope-specific reason. FAIL/NOT_VERIFIED require a reason and block a complete receipt. PENDING blocks completion. Missing/duplicate/unknown IDs, mandatory exclusions and malformed evidence are rejected. UI-13 may be N/A for a genuine non-executable artifact outside migration. The validator checks structure and declared evidence only; it cannot authenticate observations, execute commands or approve aesthetics. `recorded` is not UI_VERIFIED. Review screenshots and actual outcomes independently; keep private evidence local. Existing inspect/check/verify remain independently usable.

## Actual Vanya UI browser gate

For changes to the library and showcase, run the [manual browser gate](../../browser-qa/README.md) as well as unit/build/TypeScript checks. Use explicit `--mode visual` for the library authoring repo (it does not consume itself). Install pinned Playwright in the isolated subpackage, run `npm run test:browser`, and inspect generated screenshots/traces; the gate hit-tests the slider and other controls, not merely their DOM presence. No GitHub Action is required, and `UI_VERIFIED` **must remain NOT_VERIFIED** until visual/keyboard sign-off. [Repair research](../research/ux-13-16-repair-loop-2026-11-23.md).

## Optional integrations

GitHub composite Action and [manual-only example](../examples/ui-contract-action.md) are **optional wrappers**, not prerequisites. Keep any existing GitHub UI workflow `workflow_dispatch` only, without push, PR or schedule triggers. The legacy `scripts/install-ui-contract.mjs` installs that optional provider-specific wrapper and is **not part of the normal agent path**.

See [DESIGN.md](../../DESIGN.md), [list-detail composition](list-detail-composition.md), [scroll ownership](../research/workspace-scroll-composition-2026-11-21.md) and [browser navigation](browser-navigation.md).
