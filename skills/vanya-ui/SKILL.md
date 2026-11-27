---
name: vanya-ui
description: Design, implement, migrate or audit UI with Vanya Arc / UI. Use for UI changes in adopting projects or explicit design-system contributions. Skip backend-only and infrastructure tasks.
compatibility: Requires the full local Vanya UI source tree, a target project folder and Node.js 20+. Executable verification needs the target toolchain and browser; installation may require network.
---

# Vanya UI

Follow the applicable workflow and produce evidence of the requested result. Explicit user scope and project policy govern changes. Keep unrelated surfaces and pinned dependencies unchanged.

## 1. Locate and scope

Locate the full local library tree (this skill, DESIGN.md, src, docs, scripts) and target folder using the project pointer or supplied paths. If any required file is unavailable, report BLOCKED for that step. A copied skill requires the matching source tree. Online references are discovery aids; resolve exact component behavior against the installed immutable pin.

Use the installed `vui --help`, `vui <command> --help` and `vui --version` when supported, or the portable local Node script below.

For an explicit library contribution, **read [contributing.md](../../docs/patterns/contributing.md) first** and follow its discovery, planning and verification path. Apply the applicable reading and regression steps in section 2 before editing. Use contributor checks instead of consumer adoption and receipt commands.

For consumer work, **read [UI feature pipeline](../../docs/patterns/ui-feature-pipeline.md)** for scope, setup and receipt policy. Select new (new app), feature (focused change/audit, default), screen (named flow) or migration (explicit adoption/upgrade). Identify user action, affected routes/states and preserved boundaries. Audit-only tasks report findings; implement fixes only with authorization.

Run with actual paths; use the same `--package` for monorepos, `--mode react` for intended React apps, `visual` for non-React artifacts or library showcase, and `auto` for established targets.

~~~sh
UI="/actual/path/to/vanya-ui"
APP="/actual/path/to/project"
MODE=react
node "$UI/scripts/ui-pipeline.mjs" inspect --project "$APP" --mode "$MODE"
node "$UI/scripts/ui-pipeline.mjs" plan --project "$APP" --mode "$MODE" --scope feature --task "Requested result" --target "/affected-route" > ui-receipt.json
~~~

Adjust scope/task/target to the request. Create the empty target folder for new products. Keep receipts task-local and ignored. For new apps or approved adoption/migration, **read [quickstart](../../docs/patterns/design-harness-quickstart.md), [new product setup](../../docs/patterns/ui-feature-pipeline.md#new-product-setup) when new, and [versioning](../../docs/versioning.md)** before installing, bootstrapping or adopting. Follow the documented commands and verify the actual pin, lockfile, exports and CSS wiring. A feature in an already configured project uses its existing setup.

## 2. Read required sources before implementation

**Always read** [DESIGN.md](../../DESIGN.md) (applicable sections and mandatory boundaries), [publication safety](../../docs/patterns/publication-safety.md), actual pinned [exports](../../src/index.ts), relevant component implementations and [tokens](../../src/tokens.css). For substantive design/review, **read [reference canon](../../docs/research/design-reference-canon-2026-11-27.md)** before making design decisions; consult relevant primary references. Record exact source/version used.

For each applicable condition below, open the named file and read the relevant sections before editing. Multiple conditions require all corresponding readings. These links route to the owners of the rules.

| When the task touches | Required reading |
| --- | --- |
| Layout, headers, dividers, cards, responsive geometry | [working surfaces](../../docs/composition/working-surfaces.md) |
| List/detail, scroll, breadcrumbs or inspector | [list-detail](../../docs/patterns/list-detail-composition.md), [reading inspectors](../../docs/composition/reading-inspectors.md) |
| Links, routes and browser history | [browser navigation](../../docs/patterns/browser-navigation.md) |
| Controls, focus, selections, metadata, disclosure | [interaction states](../../docs/patterns/interaction-states.md), DESIGN Interaction and Inline size grid |
| Actions, pending/success/error and keyboard activation | [action feedback](../../docs/patterns/action-feedback.md) |
| Text roles, fonts, zoom | [typography](../../docs/patterns/typography.md) |
| Product copy and editorial content | [writing](../../docs/patterns/writing-and-editorial.md) |
| Loading, empty/error states and dynamic layout | [loading states](../../docs/patterns/loading-states.md), [working surfaces](../../docs/composition/working-surfaces.md#11-stable-geometry-during-ordinary-workspace-interaction) |
| Keyboard accelerators | [shortcuts](../../docs/patterns/keyboard-shortcuts.md) |
| New official service or branding | [brand integration](../../docs/identity/brand.md) and its pinned brand procedure |
| External assets, claims, attribution or licensing | [sources](../../docs/patterns/sources-and-attribution.md), [LICENSING.md](../../LICENSING.md) |
| Upgrade or incompatible contract | [versioning](../../docs/versioning.md), [CHANGELOG.md](../../CHANGELOG.md) |
| New/existing consumer configuration, execution or CI gates | [quickstart](../../docs/patterns/design-harness-quickstart.md) |
| Library contribution execution | [contributing.md](../../docs/patterns/contributing.md), [browser-qa](../../browser-qa/README.md) |

For branding follow the actual approval procedure; use temporary text-only identity only as documented and record pending UI-12. For new/screen/migration cover the named surface and relevant shared boundaries; focused features read only applicable sections.

**Before any substantive layout or behavior edit, read [Regression Gate](../../docs/patterns/regression-gate.md).** Record the exact baseline identity, affected and neighboring journeys, intended differences and actual baseline evidence before edits. For a genuinely new surface record that no prior surface exists and identify any shared surroundings to protect. For an existing surface with unavailable evidence, record the blocker and retain NOT_VERIFIED.

Use the UI-01–UI-14 receipt and [reference routing](../../docs/patterns/ui-feature-pipeline.md#reference-routing) to select concrete checks; record required readings and source decisions in task-local notes. Keep applicable checks pending. N/A needs a task-specific reason; follow the pipeline's mandatory scope rules including UI-12 for new products and UI-13 for executable projects.

## 3. Implement

Apply the read canonical rules and actual pinned APIs. Build the requested surface with shared components and tokens. Keep product state, category identity, behavior and routes in the product. Preserve unrelated geometry, scroll, focus and navigation. For a missing reusable primitive, use the contribution path only within explicit authorization. Do not invent API, local lookalikes or unrelated redesign.

## 4. Verify and observe

For library contributions follow the actual contributor checks and browser guide. For consumers run the local commands after the final edit, with the same project/mode/package as the receipt.

~~~sh
node "$UI/scripts/ui-pipeline.mjs" check --project "$APP" --mode "$MODE"
node "$UI/scripts/ui-pipeline.mjs" verify --project "$APP" --mode "$MODE" --json > ui-verification.json
~~~

Read the [quickstart](../../docs/patterns/design-harness-quickstart.md) for the installed lint, compiled CSS, build, browser and approved debt migration contract. Follow the [pipeline](../../docs/patterns/ui-feature-pipeline.md) for execution and receipts. Fix actual failures and rerun. Preserve CI, dependencies and hosting unless explicitly in scope. New projects remain strict; baseline capture for existing debt requires explicit adoption approval and cannot grow silently.

Open the actual result in a browser/renderer. Exercise the requested action and applicable states; check supported themes and narrow/wide viewports, adjacent regressions, computed geometry/fonts, navigation and keyboard. Compare the earlier baseline with the candidate using the Regression Gate. Record route, dimensions/theme, action and observed outcome; keep artifacts locally. If browser or execution is unavailable, report NOT_VERIFIED or FAIL as applicable.

## 5. Close with evidence

Complete every receipt row using its prescribed evidence method: PASS, FAIL, N/A or NOT_VERIFIED. PASS requires a concrete observation (actual command/result or browser viewport/theme/outcome). For executable UI-13 supply actual successful `verify --json` output. For a genuinely non-executable artifact justify UI-13 N/A and omit verification argument. Contributor mode uses its separate machine report and visual evidence.

~~~sh
node "$UI/scripts/ui-pipeline.mjs" review --receipt ui-receipt.json --verification ui-verification.json
~~~

Review final diff and publication boundary, including relevant built output. Fix applicable failures and repeat checks after edits. Report scope, reused components, read sources, executed commands, actual observations, exclusions and blockers. When deployment is requested, record live readback separately. READY requires all applicable evidence and observed user outcome; planned or skipped checks cannot establish acceptance.
