# UI feature pipeline — Vanya Arc / UI

**Canonical procedure for every new or changed UI surface in any owned repo.** Source of truth: [DESIGN](../../DESIGN.md), [composition](list-detail-composition.md), [scroll](../research/workspace-scroll-composition-2026-11-21.md), [browser navigation](browser-navigation.md), [typography](typography.md).

## 1. Read before implementation
Read the project AGENTS and the current Vanya UI DESIGN.md, README.md, src/index.ts, src/tokens.css, and the source of the relevant exported components. Identify the pinned @vanya/ui version in the actual consumer package/lockfile. Never guess an API from memory.

## 2. Choose the UI boundary
For React web UI install a verified immutable commit of @vanya/ui, import real components and tokens. For static SVG, one-off visual reports and non-React host surfaces, use Vanya UI visual principles and token-compatible output without forcing React. Pure CLI, backend, APIs and data-only tasks are not UI changes and do not need an artificial dependency.

Map: user goal → visible view → reused canonical components → layout structure → scroll owners → breadcrumb path → loading/empty/error → responsive states. Record the contract in the project AGENTS or a short UI_CONTRACT.md linking back here; do not copy the whole design system.

## 3. Implement with reuse
Prefer WorkspaceSplit, ScrollRegion, WorkspaceContextHeader, SectionToolbar, ActionButton, NavLinks, Skeleton and the installed primitives. Implement project-specific arrangement only where the generic component intentionally does not own behavior. If a missing shared primitive is needed by multiple consumers, add it to this package with API, tests, and example, then pin its tested commit in consumers. Avoid one-off local lookalikes and unreviewed global CSS.

## 4. Prove the actual behavior
Run the changed-path unit tests, type/build checks, and real browser smoke tests. For workspace UI check:
- 1440×900: independent list and reader scrolling; no page scroll or disappearing selected title.
- After scrolling to the bottom: select another item; new reader begins at top, list position remains stable.
- Open direct URL, click three items, then Back/Forward; URL, selected item, breadcrumb and title agree.
- At 1024×768, 390×844, 320×568 and 200% zoom: visible focus and title, no horizontal overflow or blocked controls.
- Check loading/empty/error, keyboard, light/dark, reduced motion, component-level data provenance and source links.

Build and deployment success **do not** prove scroll, composition, visual correctness, or keyboard behavior. Mock API data in reproducible Playwright tests where the real app is behind authentication. If a real authenticated browser smoke was not performed, mark it NOT VERIFIED.

For a new or not-yet-enrolled repository, run `node ~/Projects/vanya-ui/scripts/install-ui-contract.mjs <project-root> <verified-commit-sha>`. The installer creates a **manual-only** GitHub workflow and canonical policy link; it never overwrites existing files. Add a project-specific browser-test job if appropriate.

## 5. Enforce locally; GitHub Actions run manually

The reusable composite action lives at [.github/actions/ui-contract](../../.github/actions/ui-contract/action.yml). Keep it pinned to a verified immutable Vanya UI SHA in the consumer repository. Its caller workflow must have **only `workflow_dispatch`** (no `push`, `pull_request`, `schedule` or dispatch from another workflow).

The agent must run the contract and real browser tests as part of implementing a UI change. For a React project, from that project's root:

```bash
VANYA_UI_MODE=react node ~/Projects/vanya-ui/.github/actions/ui-contract/check.mjs
npm run test:e2e # substitute the project's browser-test command
```

GitHub Actions are an optional **manual** verification path: Actions → Vanya UI contract → Run workflow, choose branch and optionally a comparison SHA. `react` mode checks the dependency, canon and test entrypoint even if the last commit is not visual. The contract action is static; the browser test must actually execute separately or in the manually triggered workflow.

Manual-only workflows do not automatically block PRs, run on push or prove browser correctness. Do not configure an auto-required PR status for this manual check. The agent's working procedure is the enforcement mechanism, not an automatic GitHub gate. The user may explicitly request a manual GitHub verification.

Consumer example: [manual workflow](../examples/ui-contract-action.md). Backends, CLI and data-only projects do not need an artificial UI dependency or a contract job.
## Definition of done
1. Canonical docs and current component source read; pinned version checked.
2. Component reuse or justified non-React visual mapping.
3. Intended scroll owner(s), current heading and breadcrumbs specified.
4. Unit/build and browser checks actually executed; findings fixed.
5. Commit, deployment and visible proof or explicit NOT VERIFIED. Never claim browser PASS from Cloudflare build status.
