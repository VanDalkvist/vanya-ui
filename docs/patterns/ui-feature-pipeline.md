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

The CLI reads files, not git diffs. `inspect` returns source/library files to read and available local scripts. `check` verifies the base policy/dependency/import/script contract and requires a literal canonical tokens.css import in React source and reports matching paths, version and explicit Tailwind @source warnings. The bounded scan is a source precondition; confirm the actual global entry and built CSS separately. See [static enforcement research](../arch-improvement/static-design-enforcement.md). It does not certify component selection or layout. `verify` executes build and browser scripts **locally** with npm/pnpm/yarn/bun; it never installs packages, uses secrets, deploys or assumes internet. In new React UI use `--mode react`; in monorepos specify `--package`. `--json` provides machine-readable status, `--dry-run` reports planned commands as NOT_RUN.

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

The scope is explicit: `new` (create an app), `feature` (one change), `screen` (one surface/flow), or `migration` (explicitly named product surfaces). Do not expand a feature into a product-wide migration. Preserve unaffected surfaces and pinned dependencies unless the task requires a change.

```sh
node /path/to/vanya-ui/scripts/ui-pipeline.mjs plan --project /path/to/project --scope feature --task "Improve catalog filter" --target "/catalog" > ui-receipt.json
# After implementation/check, save the real machine result and perform browser review.
node /path/to/vanya-ui/scripts/ui-pipeline.mjs verify --project /path/to/project --json > ui-verification.json
node /path/to/vanya-ui/scripts/ui-pipeline.mjs review --receipt ui-receipt.json --verification ui-verification.json
```

The catalog lives in `scripts/ui-acceptance.mjs`; each stable ID includes a canonical source, acceptance condition and evidence method. UI-01 task, UI-02 components/version, UI-11 responsive/theme visual review and UI-14 privacy always apply. New and migration also require UI-03 composition, UI-04 typography, UI-06 interaction and UI-13 execution. UI-05 copy, UI-07 actions, UI-08 navigation/scroll, UI-09 dynamic geometry, UI-10 shortcuts and UI-12 identity/sources are evaluated for the task's actual surface. Other rows may be N/A with a concrete reason. A small task can have a narrow browser pass; a screen/migration needs review of the named complete surface and relevant shared boundaries.

Each row starts PENDING. For PASS, record evidence as e.g. `{"method":"browser","target":"/catalog","viewport":"390x844","theme":"dark","observation":"Filter stays visible; no page overflow; measured control width 40px","artifact":"local screenshot or log path"}`. Source evidence names files and concrete observations; command evidence also includes the actual executed `command` and result. N/A requires a scope-specific reason. FAIL/NOT_VERIFIED require a reason and block a complete receipt. PENDING blocks completion. Missing/duplicate/unknown IDs, mandatory exclusions and malformed evidence are rejected. UI-13 may be N/A only for a genuine non-executable artifact outside new/migration. Project-bound review inspects the target again and requires matching successful build/browser verify JSON for executable targets. Detached receipts from older CLI versions remain structurally reviewable; their result is marked DETACHED and cannot establish project-specific acceptance. The JSON is a local execution record, not a signed proof or freshness guarantee; rerun after final edits. The validator checks structure and declared evidence only; it cannot authenticate observations, execute commands or approve aesthetics. `recorded` is not UI_VERIFIED. Review screenshots and actual outcomes independently; keep private evidence local. Existing inspect/check/verify remain independently usable.

## New product setup

1. Identify the requested product, user action, initial routes and data states. Keep product architecture and hosting within the user's request. Create the target folder. Inspect with `--mode react` for an intended React app even before package.json exists; a failed base check is expected before setup. Plan with `--project` and `--scope new`; record the intended mode/package.
2. Use the requested stack, or a minimal TSX-capable React 18/19 + Tailwind 4 setup if the stack is open. For a non-React visual artifact use visual mode and the canonical tokens without forcing React. Preserve any existing project configuration.
3. Choose a verified immutable release from [versioning](../versioning.md), install its source distribution and commit the actual lockfile according to project policy. For a new React app prefer the verified source tarball. Inspect installed exports; align the component API with the chosen version. The local guide may be newer than the installed package.
4. In the global CSS entry import `@vanya/ui/tokens.css` and register the installed source directory with Tailwind `@source` relative to that CSS file. Wire the theme through the real package/brand contract; load only the font families/weights used, including Manrope and optional JetBrains Mono/Spectral. Confirm rendered fonts and active theme. Use [typography](typography.md) and actual tokens, not guessed CSS.
5. Run bootstrap once to create missing local agent pointers. Preserve existing AGENTS.md and user policy; add a canonical skill pointer when necessary. Bootstrap does not install the package or change CI. If the library moves, update existing pointers manually; rerunning bootstrap preserves them.
6. Implement the requested complete initial surface with actual exports and truthful loading/empty/error states where applicable. Add runnable production build and meaningful browser tests (user action and observable result; no placeholder success script). Execute check, verify, browser observation and receipt review. No deploy or remote provider setup unless requested.

## Reference routing

Use canonical sources on demand. Read the relevant sections; a new/whole-screen task generally needs the broad composition and typography checks. For a focused feature only read affected patterns plus baseline DESIGN.md. UI IDs remain stable; every receipt row is assessed, with justified exclusions.

| If the task touches | Read | Concrete exit check |
| --- | --- | --- |
| UI-02 package/API | [versioning](../versioning.md), actual exports/props and tokens | Pin, lockfile, CSS entrypoint and actual available props agree. |
| UI-03 layout, header, dividers | [working surfaces](../composition/working-surfaces.md), [list-detail](list-detail-composition.md), [header hierarchy research](../research/header-identity-hierarchy-loop-2026-11-22.md) | Available width, intended content hierarchy, one boundary owner, quiet utility group; no duplicate header. |
| UI-04 text roles/fonts | [typography](typography.md) | Computed size, tracking and rendered Cyrillic/Latin glyphs match roles; editorial serif only for reading. |
| UI-05 first screen/copy | [writing](writing-and-editorial.md) | Primary action and concrete facts clear; compare counts/status with source. |
| UI-06 controls/focus | [interaction states](interaction-states.md), [actual components](../../src/index.ts) | Native semantics, focus/keyboard, selected/hover/disabled/contrast. Filters are aria-pressed groups; real tabs need linked panels and controlled fallback; menu Tab leaves composite focus. CraftCard false disables whole-card action in 0.4.0+; independent controls use passive card/native actions. |
| UI-07 actions | [action feedback](action-feedback.md) | Press then actual pending/result/error, no duplicate activation; caller owns true result. |
| UI-08 URLs/scroll | [navigation](browser-navigation.md), [list-detail](list-detail-composition.md) | Direct routes/reload/history; independent scroll owners and stable shared header where present. |
| UI-09 loading/dynamic geometry | [loading](loading-states.md), [working surfaces](../composition/working-surfaces.md) | Compare actual ready/loading/empty/error states, preserve unaffected anchors, no fabricated data. |
| UI-10 shortcuts | [keyboard shortcuts](keyboard-shortcuts.md) | Visible alternative, IME/input exclusions, disable character shortcuts. |
| UI-11 browser/layout | [DESIGN](../../DESIGN.md), applicable pattern | Measure actual width/overflow/hit targets and inspect supported themes. For full surfaces cover 1440/1024/390/320 CSS px and applicable native zoom 200%; smaller tasks cover affected breakpoints and regressions. |
| UI-12 identity/sources | [brand](../identity/brand.md), [sources](sources-and-attribution.md), [licenses](../../LICENSING.md) | Approved brand assets, provenance and rights; retain required notices. |
| UI-13 execution | [browser-qa](../../browser-qa/README.md) for the library; target test scripts for products | Actual build and applicable browser/unit results; JSON execution record. |
| UI-14 publication | [safety](publication-safety.md) | Changed source and relevant built output contain no unauthorized private data or secrets; record requested deployment readback. |

## Actual Vanya UI browser gate

For changes to the library and showcase, run the [manual browser gate](../../browser-qa/README.md) as well as unit/build/TypeScript checks. Use explicit `--mode visual` for the library authoring repo (it does not consume itself). Install pinned Playwright in the isolated subpackage, run `npm run test:browser`, and inspect generated screenshots/traces; the gate hit-tests the slider and other controls, not merely their DOM presence. No GitHub Action is required, and `UI_VERIFIED` **must remain NOT_VERIFIED** until visual/keyboard sign-off. [Repair research](../research/ux-13-16-repair-loop-2026-11-23.md).

## Optional integrations

GitHub composite Action and [manual-only example](../examples/ui-contract-action.md) are **optional wrappers**, not prerequisites. Keep any existing GitHub UI workflow `workflow_dispatch` only, without push, PR or schedule triggers. The legacy `scripts/install-ui-contract.mjs` installs that optional provider-specific wrapper and is **not part of the normal agent path**.

See [DESIGN.md](../../DESIGN.md), [list-detail composition](list-detail-composition.md), [scroll ownership](../research/workspace-scroll-composition-2026-11-21.md) and [browser navigation](browser-navigation.md).
