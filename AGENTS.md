# Agent entrypoint — Vanya Arc / UI

**For any UI/visual feature in this or another project:** read [the canonical portable skill](skills/vanya-ui/SKILL.md) first, then inspect actual exports in `src/index.ts` and patterns in `DESIGN.md`.

Provider-independent local commands (Node.js 20+, no Git or GitHub):

```sh
node scripts/ui-pipeline.mjs inspect --project .
node scripts/ui-pipeline.mjs check --project . --mode visual
node scripts/ui-pipeline.mjs verify --project /path/to/consumer --package app
```

For changes to Vanya UI component behavior/scroll/keyboard, run the **manual real-browser gate** in [browser-qa](browser-qa/README.md) plus tests and build; never equate unit tests with visual verification. The [repair loop](docs/research/ux-13-16-repair-loop-2026-11-23.md) records #13–16 decisions. No automatic GitHub workflows or unsolicited consumer updates.

For consumer project setup use `node scripts/bootstrap-ui-pipeline.mjs --project /path/to/consumer`. This installs local agent pointers. After installing the verified harness-capable package and creating authored source roots, run `node scripts/ui-pipeline.mjs adopt --project /path/to/consumer --sources src` (select all authored directories, use --package for a monorepo). The strict consumer contract requires canonical lint:design and configuration; follow [consumer quickstart](docs/patterns/design-harness-quickstart.md) for direct installed-package CI gates before and after build. All visual changes require browser observation beyond automated tests; report NOT VERIFIED if unable to inspect.

GitHub Actions, if present, are optional **manual-only** adapters. Never add push/PR/schedule triggers to UI contract workflows, and never require CI to execute the agent workflow.

For a new official Vanya Arc service or an identity change, read [identity integration](docs/identity/brand.md) and the canonical brand procedure. Propose an individual wave-derived mark and matching favicon, obtain owner approval, and use the installed `productMark` slot when supported; older pins retain existing behavior and use explicit text-only or existing approved assets; parent/UI retain V→A. Record UI-12 evidence and pending approval. Preserve existing approved product marks.

For explicit contributions to the library, follow [the contributor workflow](docs/patterns/contributing.md). Run private preflight before public push, generic source/build gates in the existing CI, and review the actual publication candidate. Preserve existing components and generic presets; never include actual consuming-service identities or provenance in public artifacts.

Respect `DESIGN.md`, all license/source/publication policies and actual component source; never leak private project data into this public repo.

For any package-version change, follow [release policy](docs/versioning.md). Update changelog, run `node scripts/check-release.mjs` and full tests. Do not treat a Cloudflare site deploy as a released package; consumers remain pinned to verified SHA. Tags are manual, not Actions.
