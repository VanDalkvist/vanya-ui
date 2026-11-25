# Contributor mode — Vanya UI Harness

Use when bringing a component, reusable interaction, design rule, token, fix or test into the public library. Ordinary consumer work stays within the existing consumer workflow. Explicit user task boundaries take precedence.

## 1. Discover and decide

Read DESIGN.md, actual exports and relevant canonical patterns. Inspect the candidate locally. Explain the reusable problem, existing shared alternatives, expected API or rule and a concrete synthetic use case. If an existing primitive solves it, use or extend that primitive. Keep specialized reusable components and existing defaults unless a separately approved change requires migration.

## 2. Generalize within the originating project

Prepare a bounded candidate with portable inputs and outputs, existing tokens and components, synthetic examples, applicable states and accessible interactions. Verify rights to contribute the code or rule. Keep unapproved originating-service identities, screenshots, adoption records and data outside the public library. Explicitly approved public technical references and historical attribution may remain. Keep private origin evidence locally or in its owning project; reusable contracts must remain independent. Do not change unrelated exports or consumer pins. Use the existing source, licensing and publication rules.

## 3. Verify and review

Run the same local library test, typecheck, build and frozen design lint commands as the existing CI. For component changes use the existing UI acceptance criteria and actual library showcase; execute applicable interaction, narrow/wide, theme and regression checks. Use the existing receipt for UI work with mode visual and scope feature; for rules-only changes run relevant doc/tests/build checks without inventing visual evidence. Test actual API behavior, not just types; preserve compatible defaults.

Before sending any public commit, branch, PR, comment or attachment, inspect the final publication candidate. The existing CLI adds three explicit phases:

~~~sh
# From the local library checkout; choose the actual last public base, available locally.
node scripts/ui-pipeline.mjs contribute --phase preflight --project . --base main --policy /private/path/policy.json --json
# Build executes generic source and built phases; repeat the private built check locally.
bun run build
node scripts/ui-pipeline.mjs contribute --phase built --project . --policy /private/path/policy.json --json
~~~

The private policy is a maintainer-supplied JSON file **outside** the library checkout:
~~~json
{"schemaVersion":1,"identifiers":["example-internal-identifier","https://example.invalid/internal-service"]}
~~~
Literal matches are case-insensitive after Unicode NFKC normalization, including filenames and commit messages. Supply precise identifiers to avoid ambiguous matches. Never store or transmit the actual list in public source, issue/PR text, CI variables accessible to untrusted PR code, logs or attachments. Missing private policy or unavailable local Git base blocks owner preflight. Use the actual intended outgoing range, including intermediate commits. Local tool checks staged/index, outgoing snapshots and tracked plus nonignored candidates. Re-run after final commit; never push a known failed candidate. Already-public history requires a separate decision, not silent rewriting. Generic CI checks source and compiled output without the dictionary. It cannot prove the absence of unknown service identities.

| Check | Scope |
| --- | --- |
| PUB-01 | Inventory, safe paths, explicit binary coverage |
| PUB-02 | Private literal policy, if supplied |
| PUB-03 | Literal import escape, absolute import and local dependency references; tracked environment files |
| PUB-04 | Compiled dist inventory and configured checks |
| PUB-05 | Manual semantic, rights, image/metadata and discussion review |

A binary asset requires manual review; the tool does not inspect pixels or certify semantic privacy. Review names, descriptions, commit messages, raw extraction reports, PR/issue text, attachments and any generated files. Generic CI pass covers only its declared checks. If no trusted execution environment or private policy is available, report BLOCKED for private preflight and keep the candidate local. Never fabricate PASS, auto-push, publish a raw scan report or deploy.

## 4. Submit

Use the contribution template: reusable problem, selected approach, public API/compatibility, canonical references, actual test/build results, visual evidence if applicable, rights and PUB-05 observation, private preflight status without identifiers. A maintainer accepts the change and publishes an immutable verified release separately; consumers choose adoption individually.

## Local discovery tool

`bun scripts/extract-from-repo.ts /explicit/source/directory` is optional local pattern discovery. Its raw output contains paths and must remain local. It never copies code or creates PRs.

## Skill quality checks

The current skill uses progressive disclosure and explicit triggers, including negative cases. See [Agent Skills specification](https://agentskills.io/specification) and [outcome-based skill evals](https://developers.openai.com/blog/eval-skills). No upstream skill text is copied. Live-model eval runs require a separate available agent runner; CLI integration tests establish only executable behavior.
