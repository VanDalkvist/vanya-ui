---
name: vanya-ui
description: Repeatable offline Vanya Arc / UI workflow for any coding agent implementing a visible interface or visual artifact.
---

# Vanya Arc / UI — portable agent skill

**This is the canonical workflow.** It depends on local source files and Node.js ≥20, not Git, GitHub Actions, a specific agent harness, hosting platform or network. A local copy of this library may come from a zip, shared drive, clone or package archive.

## Trigger

For any UI feature, layout, component, form, navigation, loading/empty/error state, interface refactor, HTML page, interactive visual, SVG or visual report:

1. Locate the Vanya UI folder locally, using the current project agent pointer or the path supplied by the user. **Never assume** a fixed home directory, GitHub repository URL, git checkout, cloud computer or CI environment.
2. Run `node PATH_TO_VANYA_UI/scripts/ui-pipeline.mjs inspect --project PATH_TO_PROJECT`; add `--package app` for monorepos.
3. Read the returned local `DESIGN.md`, `src/index.ts`, `src/tokens.css`, relevant `src/components/*`, `docs/patterns/*` and research. Verify actual component exports and props in source.
4. If the consuming project lacks an agent entrypoint, run `node PATH_TO_VANYA_UI/scripts/bootstrap-ui-pipeline.mjs --project PATH_TO_PROJECT` once. It creates local pointers only. **No GitHub workflow, dependency or token is installed.**

## Phase 1 — model the task before coding

Identify: primary user action, screen/route, source of truth, required components, layout hierarchy, each vertical scroll owner, active context/breadcrumbs, Back/Forward, typography, breakpoints, loading/empty/error, keyboard focus, dark/light, source/legal links.

**Mandatory interaction state pass:** inspect [the canonical hover/focus/pressed/selected contract](../../docs/patterns/interaction-states.md) before changing icon buttons, theme pickers, links, navigation, filtering or cards. Do not add app-specific hover animations when role styles already exist. Check state persistence, pointer fine/coarse, focus, disabled, light/dark and reduced motion. The public gallery has a [real interactive specimen](https://ui.vanya-arc.dev/#interaction-states).

**Header hierarchy pass:** compare default visual weight of nav labels, author/source links, icon-only utility actions and theme controls. Scope `--ui-feedback-icon-ink` to the utility group to match muted navigation text, instead of dimming every icon globally or changing active/hover colors. Don't add profile avatars to author attribution unless it serves a clear identification job. [Source research](../../docs/research/header-identity-hierarchy-loop-2026-11-22.md).

**APG and browser verification:** defaults and semantics matter: `SegmentedControl` filter choices are `aria-pressed` group buttons; actual `semantics="tabs"` requires `tabId/panelId` with panel DOM. Theme menu Tab/Shift+Tab must leave composite focus. For Vanya UI itself run [portable browser-qa](../../browser-qa/README.md) and inspect 390/1024/1440 px screenshots in both themes, geometry/hit targets, keyboard, zoom and history. `UI_VERIFIED` is NOT_VERIFIED without real evidence.

**Mandatory press-to-result pass:** read [action feedback contract](../../docs/patterns/action-feedback.md) when implementing any action. Test pointer-down, Space/Enter, onClick, pending/double-click protection, actual success/error, focus and mobile. Use caller-controlled `ActionButton.actionState` for async work; do not fabricate success or add auto-toast for every click. Check the [working demo](https://ui.vanya-arc.dev/#action-feedback).

**Stable geometry pass:** for dynamic workspaces, test unaffected control/plot/list anchors across loading, filtering, 0/1/many results, disclosures and refresh. Follow the [workspace geometry contract](../../docs/composition/working-surfaces.md#11-stable-geometry-during-ordinary-workspace-interaction); CLS alone does not cover interaction-induced shifts.

For multi-view workspaces, explicitly compare the **same global topbar geometry across home/overview/modules/catalogue**. Use `WorkspaceContextHeader` in that existing bar (including `breadcrumbSize="large"` when a 16px/14px reading scale is needed), never a detached duplicate. If the same project identity is relevant across many modules, keep a compact identity **outside** the reader scroll as its flex sibling; do not add another sticky toolbar. [Canonical recipe](../../docs/patterns/list-detail-composition.md#продолжительная-идентичность-fixed-context--masterdetail). Explain changes concisely in the work log/handoff.

Use `WorkspaceSplit`, `ScrollRegion`, `WorkspaceContextHeader`, `Skeleton`, semantic controls, and actual exports where applicable. Never invent library APIs. For versioned Vanya UI packages, pin a verified immutable source commit SHA and lockfile, never moving `main`. [Release policy](../../docs/versioning.md). For React UI use pinned `@vanya/ui` and `@vanya/ui/tokens.css`. For non-React SVG or host visuals apply tokens/rules without injecting React or global app CSS. Non-UI API/CLI/data changes skip the UI steps.

## Phase 2 — implement one complete feature

Make focused changes in the consuming project. For a missing generic primitive, improve Vanya UI in its own codebase with component test/example; do not create unnecessary lookalike components in each product. No automatic GitHub Actions, background jobs, repository secrets or remote runners are required.

## Phase 3 — run portable machine verification

```sh
node PATH_TO_VANYA_UI/scripts/ui-pipeline.mjs check --project PATH_TO_PROJECT [--package app]
node PATH_TO_VANYA_UI/scripts/ui-pipeline.mjs verify --project PATH_TO_PROJECT [--package app]
```

`check` validates actual files: local canonical policy, React dependency/imports and browser-test script. `verify` runs the target package's build and browser tests on **the current machine** via npm/pnpm/yarn/bun; it does not install packages, deploy, or query GitHub. Use `--mode react` if creating a new React UI, `--manager` to override auto-detection, `--json` for machine consumption and `--dry-run` to inspect commands without claiming they ran. In a monorepo use `--package RELATIVE_PACKAGE_PATH` rather than guessing.

Missing packages or browser binaries are explicit blockers. Do not hide them by running a remote GitHub job. Use the consuming project's installation instructions and obtain approval before any sensitive external access. Re-run both checks after the **last** code change.

## Phase 4 — inspect the rendered result

Automated tests are necessary but **do not prove visual quality**. In a real local browser/preview, record route, viewport, steps and evidence for:

- 1440×900: main hierarchy, adequate reader width, visible active context and breadcrumbs, correct independent scroll owners.
- Home → overview → module → catalogue: compare topbar bounding geometry; between modules compare project identity bounding geometry. Only the lower reader changes, including its scroll offset. Do not treat a build as visual proof.
- Long navigation plus long document: independently scroll, change item, confirm reader starts at its heading and list remains usable.
- Direct URL, reload, 3 selections, browser Back/Forward, keyboard focus, reduced motion.
- 1024×768, 390×844, 320×568 and 200% zoom: no overlapped controls or page horizontal overflow.
- Loading, empty, error, theme, typography, copy and third-party/source references.

Record screenshot or a concrete reproducible observation. If interactive browser access is impossible, report **NOT VERIFIED**; a green build or Playwright run does not substitute for reviewing the rendered interface.

## Phase 5 — close the whole loop

Check final diff and privacy constraints, fix failures, repeat machine checks and affected browser scenarios, then report the actual evidence. The handoff needs: components reused, commands executed, automated result, observed UI result, remaining blockers and deployment readback (if relevant). Never declare READY for an untested behavior.

## Portable operating contract

**Required:** local Vanya UI source folder, local target project folder, Node.js 20+. For automated UI browser tests also the project's installed toolchain and browser. Git is optional, a remote provider is optional, and no fixed absolute paths are needed. Copy folders to another machine and run the same CLI with new paths.

**Optional adapters:** `.github/actions/ui-contract` and `workflow_dispatch` are only wrappers; do not enable push/PR/schedule. GitHub checks cannot be the source of truth for execution or completion.

**Status language:** local contract PASS, build PASS and automated browser PASS are separate from visual review PASS. Final READY requires both automated and observed UI evidence. If either was not executed, say BLOCKED / NOT VERIFIED and explain why.
