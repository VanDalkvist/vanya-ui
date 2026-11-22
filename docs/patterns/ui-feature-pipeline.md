# UI feature pipeline — portable agent workflow

The **canonical executable procedure** is [Vanya UI agent skill](../../skills/vanya-ui/SKILL.md). The [portable CLI](../../scripts/ui-pipeline.mjs) and [local bootstrap](../../scripts/bootstrap-ui-pipeline.mjs) work on any machine with Node.js 20+ and folders containing the design system and target project. No Git/GitHub access, cloud browser or CI runner is required.

## Run locally

```sh
# UI library and target may live anywhere on disk:
node /path/to/vanya-ui/scripts/bootstrap-ui-pipeline.mjs --project /path/to/project
node /path/to/vanya-ui/scripts/ui-pipeline.mjs inspect --project /path/to/project
node /path/to/vanya-ui/scripts/ui-pipeline.mjs check --project /path/to/project
node /path/to/vanya-ui/scripts/ui-pipeline.mjs verify --project /path/to/project --package app
```

The CLI reads files, not git diffs. `inspect` returns source/library files to read and available local scripts. `check` verifies policy and actual component use. `verify` executes build and browser scripts **locally** with npm/pnpm/yarn/bun; it never installs packages, uses secrets, deploys or assumes internet. In new React UI use `--mode react`; in monorepos specify `--package`. `--json` provides machine-readable status, `--dry-run` reports planned commands as NOT_RUN.

## Agent lifecycle

1. Read local canonical source, exports and pattern docs.
2. Define user action, screen composition, scroll owners, URL/breadcrumbs and UI states.
3. Implement one coherent feature using real Vanya UI primitives/tokens, adapting to the project's stack.
4. Run local `check` and `verify`, fix failures, and rerun after the final edit.
5. Observe the actual browser at representative viewports, keyboard, zoom, history and error states. Record evidence or explicitly say NOT VERIFIED.
6. Report independently: static contract, build, browser tests, visual QA and any deployment.

Build success cannot certify layout. Playwright passing does not automatically prove every visual requirement. The skill defines the complete acceptance contract.

## Optional integrations

GitHub composite Action and [manual-only example](../examples/ui-contract-action.md) are **optional wrappers**, not prerequisites. Keep any existing GitHub UI workflow `workflow_dispatch` only, without push, PR or schedule triggers. The legacy `scripts/install-ui-contract.mjs` installs that optional provider-specific wrapper and is **not part of the normal agent path**.

See [DESIGN.md](../../DESIGN.md), [list-detail composition](list-detail-composition.md), [scroll ownership](../research/workspace-scroll-composition-2026-11-21.md) and [browser navigation](browser-navigation.md).
