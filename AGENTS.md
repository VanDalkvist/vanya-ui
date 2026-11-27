# Agent entrypoint — Vanya Arc / UI

## Active development policy

For approved library refactoring, remove obsolete public names, duplicate implementations and compatibility-only branches as part of the same change. Migrate in-repository callsites and current docs/tests. Prefer a coherent current architecture; preserve actual user outcomes and verification. SemVer applies at production checkpoints. Other consumer repositories and their immutable pins are outside the library-only refactor unless explicitly included.

**For any UI/visual feature in this or another project:** read [the canonical portable skill](skills/vanya-ui/SKILL.md) first, then inspect actual exports in `src/index.ts` and patterns in `DESIGN.md`.

CLI: `vui` when installed. Run `vui --help`, `vui <command> --help` or `vui --version`. With a source folder or an older package pin, use the direct Node entrypoint below (Node.js 20+, no Git or GitHub):

```sh
node scripts/ui-pipeline.mjs inspect --project .
node scripts/ui-pipeline.mjs check --project . --mode visual
node scripts/ui-pipeline.mjs verify --project /path/to/consumer --package app
```

For changes to Vanya UI component behavior/scroll/keyboard, run the **manual real-browser gate** in [browser-qa](browser-qa/README.md) plus tests and build; never equate unit tests with visual verification. The [repair loop](docs/research/ux-13-16-repair-loop-2026-11-23.md) records #13–16 decisions. No automatic GitHub workflows or unsolicited consumer updates.

For consumer project setup use `node scripts/bootstrap-ui-pipeline.mjs --project /path/to/consumer`. This installs local agent pointers. After installing the verified harness-capable package and creating authored source roots, run `node scripts/ui-pipeline.mjs adopt --project /path/to/consumer --sources src` (select all authored directories, use --package for a monorepo). The strict consumer contract requires canonical lint:design and configuration; follow [consumer quickstart](docs/patterns/design-harness-quickstart.md) for direct installed-package CI gates before and after build. All visual changes require browser observation beyond automated tests; report NOT VERIFIED if unable to inspect.

GitHub Actions, if present, are optional **manual-only** adapters. Never add push/PR/schedule triggers to UI contract workflows, and never require CI to execute the agent workflow.

For a new official Vanya Arc service or an identity change, read [identity integration](docs/identity/brand.md) and the canonical brand procedure. Propose an individual wave-derived mark and matching favicon, obtain owner approval, and use the installed `productMark` slot when supported; older pins retain existing behavior and use explicit text-only or existing approved assets; parent/UI retain V→A. Record UI-12 evidence and pending approval. Preserve existing approved product marks.

For explicit contributions to the library, follow [the contributor workflow](docs/patterns/contributing.md). Run the existing library verification via `node scripts/ui-pipeline.mjs contribute --project .`; inspect applicable rendered states and review the actual contribution. Preserve existing components and generic presets; keep unapproved consumer identities and private provenance out of public artifacts; retain explicitly approved technical references when relevant.

Respect `DESIGN.md`, all license/source/publication policies and actual component source; never leak private project data into this public repo.

## Primary design references (mandatory routing)

For visual design and UI composition consult Linear and Apple Human Interface Guidelines first; for design-system engineering, component anatomy, accessible primitives, registry, CLI and documentation consult shadcn/ui. The [reference canon](docs/research/design-reference-canon-2026-11-27.md) contains primary URLs, roles, local interpretations and acceptance checks. For each substantive design decision record the relevant source and its application to Vanya UI; preserve local brand, tokens and accessibility. Use the live reference if available; disclose offline or visual-evidence limits. No upstream asset or code copying is implied.

## Mandatory SemVer at every substantive production checkpoint

Before each intentional production deployment that changes shipped UI, behavior, public API, tokens, CLI, or published documentation, compare against the last successfully deployed commit and bump `package.json.version` using SemVer. This includes bug fixes, visual refinements and Arch Loop repair batches. PATCH = backward-compatible fixes and refinements; MINOR = backward-compatible public features or APIs; MAJOR = incompatible public contract changes. Use the highest required increment for the batch. Never deploy two distinct substantive successful checkpoints with the same version. Group intermediate commits into one version per checkpoint; a retry of a failed, unpublished candidate may retain its version if its release scope is unchanged. Ledger-only and internal test-only changes with no production impact do not require a bump.

Update `CHANGELOG.md` in the same batch with the dated version and all substantive changes since the last deployed version. The existing header VersionLabel must read the actual package version at build time. Run `node scripts/check-release.mjs` and the existing full build gates; verify the terminal Cloudflare outcome and active deployment, then report version and SHA. If deployment is unconfirmed, report candidate status explicitly. Follow [release policy](docs/versioning.md). Package tags remain manual, verified and separate; consumers remain pinned to verified SHA.


## Intentional site release checkpoint (2026-11-26)

Commit and push coherent work freely. Production Cloudflare Builds on `main` watches `release/vanya-ui.trigger`. Create or update it with a short release description at an intentional release checkpoint after relevant verification and required approval, or explicitly start the existing trigger for the approved exact main SHA. First marker creation requests a build. Confirm terminal build outcome and active version separately. Native path filters may be bypassed for empty pushes, 20+ commits or 3000+ changed files. The site checkpoint preserves the package version/tag policy; non-main validation, consumer smoke, public artifact and licensing checks remain unchanged.

## Editorial consistency gate

For user-facing Russian copy, read `.agents/redpolitika.md` and the relevant original Sarycheva/Arkhipov editorial skill when required. Keep navigation labels and destination H2s derived from the same private section vocabulary; first-screen overview H1 names the product purpose. Verify rendered DOM label/heading parity and actual action/result semantics. When removing functionality, audit related copy and documentation. Avoid arbitrary decorative numbers and machine-generated abstract slogans; preserve verified facts and attribution.

## Canonical action and link API (owner decision, 2026-11-27)

For the Quiet visual action/link contract, backward compatibility with redundant styling variants is not required. Delete obsolete variants, duplicate feedback selectors and manual link markers when the canonical primitive covers their purpose. Migrate all in-repository specimens, tests, registry and current normative documentation in the same batch. ActionButton: text/accent/prominent. ActionLink: text/prose/accent. LinkChip composes ActionLink; no duplicate link feedback. Record incompatible API changes under a MAJOR SemVer. This scope does not authorize changes to consumer repositories or unrelated compatibility contracts.

## Regression Gate — mandatory for visual/behavioral refactors

For Composition and future substantive UI changes, read [Regression Gate](docs/patterns/regression-gate.md). Pin the last successful production or approved built baseline; capture actual affected and protected neighboring journeys before edits where possible. Compare the exact candidate using the existing Playwright suite and explicit baseline/compare snapshots; verify links (including real popup, hover and focus), layout and functional outcomes. No silent baseline refresh. Intentional changes require recorded diff review. Missing baseline or browser access is BLOCKED/NOT_VERIFIED, never a visual PASS. Existing CI gates and manual-only browser workflow remain. Do not close the Arch Loop until actual independent evidence or an explicitly recorded exception; do not deploy a broad cleanup while its regression gate is blocked without owner approval.
