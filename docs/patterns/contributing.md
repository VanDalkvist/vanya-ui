# Contributor mode — Vanya UI Harness

Use for an explicit contribution of a component, interaction, composition pattern, design rule, token, fix or test to the library. Ordinary UI work remains in the consumer workflow.

## 1. Discover and decide

Read DESIGN.md, actual exports in src/index.ts and applicable pattern documents. Inspect the candidate and its use case. Compare existing primitives, tokens and guidance. Choose reuse, a focused extension, a new reusable component/rule, or keep the implementation local. Explain the generic problem and why the chosen approach belongs in the library. Do not create a second implementation of an existing contract without a concrete reason.

## 2. Prepare a reusable contribution

Before substantive visual or behavior edits, read [Regression Gate](regression-gate.md) and record the baseline identity, protected journeys and intended differences. Capture actual baseline evidence before editing; record unavailable evidence as NOT_VERIFIED. Use the skill's applicable reading routes before making design decisions.

For components: keep a focused API, portable inputs/outputs, existing visual tokens and shared primitives, accessible names, applicable states and keyboard behavior. Add representative synthetic examples to the existing showcase when useful. Preserve public exports and defaults unless a breaking change is separately approved.

For patterns and rules: describe applicability, concrete constraints, exceptions and a representative example. Update the canonical reference and existing publication mapping if needed. A new rule should solve a demonstrated recurring problem or prevent a concrete defect; prefer clarifying existing canon.

For tokens: identify the semantic role, use the existing palette and scales, check light/dark and affected components. Avoid duplicate tokens.

Use the existing rights and [publication safety](publication-safety.md) rules. Approved public technical references may remain. Keep domain behavior and unapproved source material in the originating project. Do not update consumer pins automatically.

## 3. Verify

From the library directory with its existing dependencies installed, use `vui contribute --project . --help` to discover options when the CLI is installed. The portable direct invocation is:

~~~sh
node scripts/ui-pipeline.mjs contribute --project . --dry-run
node scripts/ui-pipeline.mjs contribute --project . --json
~~~

The operation runs the actual library test, typecheck, build and lint:design:pilot scripts in order; failure stops the sequence. The existing build checks generated Markdown and compiled UI. The existing library design-lint pilot scans src/showcase and src/components; canonical token definitions retain their owner scope. The existing showcase debt baseline stays unchanged; new findings block the gate. No Git checkout, credentials or private dictionary is needed. The frozen lint toolchain retains its normal installation requirements. The CLI does not install application dependencies or publish. CI remains unchanged. Agents without a shell may prepare the candidate and report commands as NOT_RUN; the maintainer CI supplies execution evidence.

For component/visual changes select applicable criteria from the existing UI-01–UI-14 catalog. Test real behavior and verify actual showcase rendering in supported themes and representative viewports, accessibility and interactions as applicable. Run the library browser suite for changed behavior/scroll/keyboard per AGENTS.md. Document actual observations separately from the machine report. For rules-only changes verify the canonical documentation, examples and relevant deterministic checks; do not invent visual evidence. Contributor command output is machine evidence, not a consumer verify receipt or a visual approval.

## 4. Review and submit

Use the existing contribution template. Include the generic problem, chosen reuse/extension, compatibility, canonical reference, executable checks and applicable visual evidence. Record missing checks honestly. Keep the candidate within task scope; a maintainer accepts the change, and package publishing/adoption follows the existing versioning policy.

Optional discovery: `bun scripts/extract-from-repo.ts /explicit/source/directory` lists repeated control styles. Review results locally; the script copies nothing and creates no PRs. Prefer reading actual source and existing exports for a targeted contribution.

Skill routing uses progressive disclosure and explicit trigger cases. See [Agent Skills specification](https://agentskills.io/specification) and [outcome-based skill evals](https://developers.openai.com/blog/eval-skills). Live-model eval runs are separate from CLI regression tests.


### Local maintainer acceptance

From an up-to-date checkout with the existing dependencies installed, run `npm run verify:local`. It invokes the canonical contributor pipeline, then the existing consumer smoke and the full source/test TypeScript diagnostic (`npm run typecheck:tests`). It stops at the first failing stage and preserves the native exit code. This diagnostic currently uses the existing `tsconfig.json`; the production typecheck contract remains unchanged while test type errors are triaged. For visual or interactive changes, the separate existing `npm run test:browser` and explicit baseline/candidate procedure remain mandatory as applicable. This local entrypoint installs nothing and publishes nothing.
