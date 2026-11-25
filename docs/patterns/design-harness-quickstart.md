# Design-system harness — consumer quickstart

This is the canonical short path. Read [the skill](../../skills/vanya-ui/SKILL.md) and applicable [DESIGN.md](../../DESIGN.md) for design choices and visual acceptance.

## New React project
1. Select a **verified harness-capable immutable SHA** from [versioning](../versioning.md); install and lock `@vanya/ui`. A 0.4.x pin predates the harness. If a verified compatible release is unavailable, report BLOCKED; do not silently install a moving main.
2. Set up global CSS with `@import "@vanya/ui/tokens.css";` and Tailwind `@source` relative to the stylesheet. Use actual exported components; set up theme and fonts. Choose the full set of authored UI roots, not just an example folder.
3. From a local guide checkout, run:
~~~sh
node /path/to/vanya-ui/scripts/ui-pipeline.mjs adopt --project /path/to/app --sources src --css-output dist
node /path/to/vanya-ui/scripts/ui-pipeline.mjs plan --project /path/to/app --mode react --scope new --task "Create requested product" --target "/" > ui-receipt.json
~~~
For a monorepo add `--package <relative-package>` consistently. Source directories are comma-separated; generated and test directories are excluded from lint; supported authored React styles are CSS and JS/TS/JSX/TSX. Use the actual compiled CSS output path under dist, build, .next, .output or out (e.g. .next/static). New products remain strict.
4. Implement the requested product. In existing CI, run `node --input-type=module -e "import '@vanya/ui/lint'"` before build and `node --input-type=module -e "import '@vanya/ui/check-built'"` after build, before deploy. Keep existing provider and other gates. Local `npm run lint:design` is convenient; CI uses the installed entrypoint directly to validate the script binding.
5. Run `check` and `verify --json > ui-verification.json`, with the same project/package as the receipt. Verify runs lint, actual build, compiled CSS gate and applicable browser scripts. Review the real browser result, including wide/narrow, supported themes, meaningful actions and states; complete receipt and run `review`.
6. Keep evidence local. Source/policy fingerprint invalidates stale execution receipts for tracked authored files, tests, package metadata, lockfiles and harness rules. It is a local integrity check; actual visual observation remains required.

## Existing React project
Inspect current pin, actual UI roots, component usage, CSS entry and build output. Upgrade only within the approved adoption/migration scope. Run the same adopt command, then strict lint first. If explicit migration approval includes existing debt, run `baseline --project <app>` (same package selection) and review/commit the recorded CSS and JSX debt. Existing unrelated scripts and AGENTS instructions are retained.
When the policy changes, run `baseline --project <app> --migrate` explicitly after inspection; the operation accepts only a subset of exact prior findings. Fix new/changed debt first. Review the diff; automatic debt growth is prohibited. Do not change existing pins or deploy without authorization.
