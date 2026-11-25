---
name: vanya-ui
description: Create, redesign, migrate, implement and review products, screens, components and visual artifacts using the Vanya Arc design system. Use for UI tasks in Vanya UI projects or when Vanya UI is requested, including new apps, layout, typography, navigation, interaction, accessibility, design audits and explicit contributions of reusable components or rules to Vanya UI. Skip backend-only, CLI-only and infrastructure tasks.
compatibility: Requires a local Vanya UI source tree, a target project folder and Node.js 20+. Browser verification requires the target toolchain and browser access. Package installation may require network access. Contributor verification requires the library's existing development toolchain.
---

# Vanya UI

Deliver the requested visual change, using the actual installed component API and canonical design rules. Keep unrelated surfaces and pinned dependencies unchanged unless the task explicitly covers them.

## 1. Locate and scope

Find the full local Vanya UI source tree through the project pointer or user-provided path. It must contain this skill, DESIGN.md, src, docs and scripts. A copied skill alone is insufficient; locate the source tree or report BLOCKED. Do not invent unavailable API or instructions. No fixed paths, git checkout, CI or hosting provider are required.

If the task explicitly brings reusable code, rules or tests into Vanya UI, use the [contributor workflow](../../docs/patterns/contributing.md) within this same harness. Read it and follow the contributor path instead of consumer adoption. Otherwise keep consumer work local. Both paths work with an ordinary source directory; use existing project scripts for verification.

CLI discovery: `vui --help`, `vui <command> --help`, `vui --version` (equivalent installed name: `vanya-arc-ui`). Use the executable from the selected immutable package revision, e.g. `./node_modules/.bin/vui`; check that it supports the requested operation. The direct `node "$UI/scripts/ui-pipeline.mjs"` form below works with a matching ordinary source folder and is the portable fallback. For contributors, read the contributor guide and run `vui contribute --project <library> --dry-run` then execute the real checks; follow the contributor guide through submission and stop there.

Choose one scope for consumer work:

| Scope | Use when |
| --- | --- |
| new | Create a new product or app from scratch. |
| feature | Make one focused UI change or audit a component. Default. |
| screen | Create, redesign or audit a named screen/flow. |
| migration | Explicitly adopt or upgrade Vanya UI across named existing surfaces. |

Identify the primary user action, affected routes/components/states, requested result and preserved boundaries. For an audit-only request, inspect and report; implement fixes only if requested. Backend-only work skips this skill.

Run the following commands with actual absolute paths; for monorepos specify the target package with `--package`. Set MODE=react for React apps (including an empty new repo), MODE=visual for non-React visual artifacts and for the library's own showcase; use auto for established targets. Create the empty target directory if necessary. Keep receipts in a task-local ignored directory.

~~~sh
UI="/actual/path/to/vanya-ui"
APP="/actual/path/to/project"
MODE=react
node "$UI/scripts/ui-pipeline.mjs" inspect --project "$APP" --mode "$MODE"
node "$UI/scripts/ui-pipeline.mjs" plan --project "$APP" --mode "$MODE" --scope feature --task "Requested result" --target "/affected-route" > ui-receipt.json
~~~

For new products follow the [harness quickstart](../../docs/patterns/design-harness-quickstart.md), use `--scope new` and follow [new product setup](../../docs/patterns/ui-feature-pipeline.md#new-product-setup) before implementation. For existing projects inspect declared pin, installed version, real exports and CSS wiring. Follow [versioning](../../docs/versioning.md); upgrade only within explicit scope. Use bootstrap to create missing discovery pointers; it preserves existing instructions and installs nothing. After installing a verified harness-capable package and identifying all authored UI source directories, run `node "$UI/scripts/ui-pipeline.mjs" adopt --project "$APP" --sources src --css-output dist` (adjust comma-separated directories, compiled artifact path and --package). The command writes only the selected package's canonical lint script, config and managed AGENTS.md block; it refuses conflicting existing setup. Existing products retain their pinned dependency until explicit upgrade is approved.

## 2. Select the applicable canon

Read [DESIGN.md](../../DESIGN.md), the receipt's applicable canonical references and the relevant installed component source/props. The [routing table](../../docs/patterns/ui-feature-pipeline.md#reference-routing) maps task characteristics to detailed patterns. Read only relevant sections. Use the receipt's stable UI-01–UI-14 rows to plan concrete checks before editing. Mark genuinely unrelated rows N/A with a task-specific reason; leave applicable checks pending. Core scope, components/tokens, visual review and privacy always apply; new/migration additionally require composition, typography, interaction and execution. New apps also require UI-12 source evidence for identity applicability (official identity or independent/unbranded with source/rights observation). Executable projects require UI-13 even for focused changes.

For a new official Vanya Arc service or a branding task, read [brand identity integration](../../docs/identity/brand.md) and its pinned brand procedure. The wave is the generative principle; every service has a distinct purpose-derived mark and matching favicon. Parent/UI retain the approved V→A. Inspect existing identity, propose directions for owner approval, save approved product assets outside the public library and use the installed `productMark` slot only if the pinned version supports it. Until approval use `showMark={false}` for an explicitly temporary text-only lockup and report UI-12 pending; preserve other services. Check the actual logo and favicon in both themes, monochrome and at 16/24/32 px. Respect package pin and licensing.

## 3. Implement

Build the requested surface with real shared components and tokens. Keep product state, domain behavior and routes in the product. Preserve unrelated geometry/scroll/focus and avoid invented APIs, unnecessary local lookalikes or mass redesign. For a missing reusable primitive, propose or implement a focused library change within the task's authorization, with example and tests.

## 4. Verify and observe

After the final code edit run the local machine checks. Use the same project, mode and package selection as the receipt.

~~~sh
node "$UI/scripts/ui-pipeline.mjs" check --project "$APP" --mode "$MODE"
node "$UI/scripts/ui-pipeline.mjs" verify --project "$APP" --mode "$MODE" --json > ui-verification.json
~~~

Check real execution results and fix failures. For React targets the literal canonical token import is mandatory; inspect the actual global CSS entry and compiled output to confirm wiring. For React, canonical lint:design and vanya-ui.config.json are required. The CLI verify runs the installed package's frozen design lint before build, checks actual compiled CSS before browser tests and binds its execution receipt to current source/policy. A failed check prevents later commands. Use `node --input-type=module -e "import '@vanya/ui/lint'"` before build and `node --input-type=module -e "import '@vanya/ui/check-built'"` after build in existing CI before deploy; never create automatic GitHub Actions or change hosting implicitly. New projects start strict. For explicitly approved existing-product adoption only, run `node "$UI/scripts/ui-pipeline.mjs" baseline --project "$APP"` (same --package), inspect and commit the resulting product-owned debt file. The command refuses recapture; new or changed findings fail. On changed policy, explicitly run baseline --migrate only after review; it accepts a non-growing subset of prior findings. New products remain strict. Never capture debt just to make a new feature green. Apply canonical constraints and review justified exceptions. The CLI runs existing build/browser scripts on the current machine; install dependencies/browser only through the project's permitted setup. No automatic Actions, deployment or dependency upgrade. The lint toolchain uses isolated npm ci from the installed Vanya UI tool lock. For static artifacts without runnable build, justify UI-13 N/A only when genuinely inapplicable. For the library itself use [browser-qa](../../browser-qa/README.md).

Open the actual result in a browser/renderer. Exercise the requested action and applicable states, check narrow/wide and supported themes, and inspect surrounding regressions. Use the receipt and [reference routing](../../docs/patterns/ui-feature-pipeline.md#reference-routing) for concrete checks; measure relevant computed styles and geometry, verify real fonts/data and keyboard behavior. New/screen/migration review the entire named surface; feature review the changed behavior and adjacent shared boundaries. Do not force master/detail, editor fonts, shortcuts or unrelated states onto a task. Record route, actual dimensions/theme, action and observation; retain screenshots/logs locally when available.

## 5. Close with evidence

Complete every receipt row: PASS, FAIL, N/A or NOT_VERIFIED. PASS requires a concrete observation with the prescribed method; browser rows include viewport/theme, command rows include the executed command. Explain exclusions and failures. For UI-13 of executable projects supply the actual `verify --json` output; skipped, planned or failed results cannot satisfy it.

~~~sh
node "$UI/scripts/ui-pipeline.mjs" review --receipt ui-receipt.json --verification ui-verification.json
~~~

For a genuinely non-executable artifact omit the verification argument and justify UI-13 N/A. For blocked checks report FAIL or NOT_VERIFIED; never fabricate results. The validator checks recorded evidence and machine-result consistency, with visual truth assessed through actual observation. Review the final diff and publication boundary, including relevant built output. Fix applicable failures and repeat affected checks after edits. Report scope, reused components, executed commands, concrete observations, justified exclusions and blockers; if deploying was requested, report live readback separately. READY requires all applicable checks passed, observed rendering and actual user outcome verified. A dry run, build-only pass or structurally complete receipt is insufficient on its own.
