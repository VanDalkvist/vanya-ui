# Agent entrypoint — Vanya Arc / UI

**For any UI/visual feature in this or another project:** read [the canonical portable skill](skills/vanya-ui/SKILL.md) first, then inspect actual exports in `src/index.ts` and patterns in `DESIGN.md`.

Provider-independent local commands (Node.js 20+, no Git or GitHub):

```sh
node scripts/ui-pipeline.mjs inspect --project .
node scripts/ui-pipeline.mjs check --project . --mode visual
node scripts/ui-pipeline.mjs verify --project /path/to/consumer --package app
```

For consumer project setup use `node scripts/bootstrap-ui-pipeline.mjs --project /path/to/consumer`. This only installs local agent pointers. All visual changes require browser observation beyond automated tests; report NOT VERIFIED if unable to inspect.

GitHub Actions, if present, are optional **manual-only** adapters. Never add push/PR/schedule triggers to UI contract workflows, and never require CI to execute the agent workflow.

Respect `DESIGN.md`, all license/source/publication policies and actual component source; never leak private project data into this public repo.

For any package-version change, follow [release policy](docs/versioning.md). Update changelog, run `node scripts/check-release.mjs` and full tests. Do not treat a Cloudflare site deploy as a released package; consumers remain pinned to verified SHA. Tags are manual, not Actions.
