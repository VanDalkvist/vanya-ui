# Architecture Improvement Memory — Vanya UI

## 2026-11-23 — Never confuse test shape with a browser oracle
- Context: PR #25 (#13–16), AP-056/AP-057/AP-076.
- Symptom: a Playwright test could pass with only an input value change while the SineWave never moved, or miss a right-side overlay by probing only the middle of the slider.
- Cause: assertions checked intermediate representations or just one hit point rather than the delivered user outcome.
- Use next time: for each new browser acceptance test, name the broken user journey, observe a downstream visible result, and make one intentionally broken negative-control scenario where feasible. Keep screenshots as review artifacts, not automated approvals.
- Evidence: `browser-qa/tests/ui-contract.spec.ts` at PR #25, [test-integrity review](../research/pr25-test-integrity-review-2026-11-23.md).

## 2026-11-23 — Test the built entrypoint, not only the dev server
- Context: new browser QA runner.
- Symptom: Playwright originally ran `vite dev`, bypassing the Vite production build and prerender.
- Cause: the walking skeleton stopped at a development-only surface, so it could not prove production contract wiring.
- Use next time: browser gate must build first and test compiled `dist/` through real HTTP; S9 stays NOT_VERIFIED until that runner is executed and reviewed. No accidental Cloudflare production deploy from a PR.
- Evidence: `browser-qa/playwright.config.ts`, `package.json#scripts.preview`, [cycle 7 plan](../superpowers/plans/2026-11-23-arch-improvement-cycle-7-pr25.md).

## 2026-11-23 — Accurate source facts before criticizing an assertion
- Context: review of the pressed-state browser test.
- Symptom: an early criticism described a button as text variant when its actual source rendered outline variant.
- Cause: inference from test naming without tracing its exact live showcase instantiation.
- Use next time: inspect the rendering callsite, CSS variant-specific behavior and test locator together before declaring a wrong oracle. Correct mistakes explicitly and preserve what was genuinely wrong.
- Evidence: `src/showcase/ComponentCatalog.tsx` and `src/tokens.css`, [review](../research/pr25-test-integrity-review-2026-11-23.md).

## 2026-11-25 — Verify the consumer's installed design harness
- Context: #36, AP-012/AP-068/AP-075/AP-076.
- A checkout-only linter and a product-authored success script leave the real agent execution path unproven.
- Use next time: resolve policy and frozen toolchain from the installed immutable dependency; require canonical binding and execute before build/browser; exercise a deliberate invalid source change and observe actual nonzero exit. Prove separate distribution installs before release. Legacy baselines require explicit capture and policy fingerprint; never auto-refresh during feature work.
- Evidence: cycle 8 plan, design-harness.e2e.test.mjs, successful builds a78b3432-f6e0-4267-adf9-8833bafde97a and b5878c88-fd36-4044-92c9-9761f17a5365.

## 2026-11-27 — Golden baseline guard and truthful responsive examples
- Context: Composition checkpoint re-review.
- Symptom: visual mode baseline accepts updateSnapshots=all against any supplied directory; compact workspace example forces keep-columns while its prose promises mobile stacking, confirmed in actual 390px production capture.
- Use next time: enforce immutable baseline capture with explicit source/environment identity and refusal to overwrite; inspect actual example props against documented behavior at narrow widths before generalizing a component. An observed production baseline defect is a repair target, never evidence of candidate regression.
- Evidence: [checkpoint review R1/R2](../research/composition-checkpoint-review-2026-11-27.md).

## 2026-11-27 — Shared resources need lifetime ownership and comparison needs real destinations
- Context: Composition checkpoint RV2–RV4.
- Symptom: separate modal mounts captured global body overflow independently; out-of-order cleanup could unlock too early or restore hidden forever. Visual matrix missed lower specimens and opened overlays, link checks could pass a broken local destination.
- Use next time: document-level resources have one owner with idempotent releases and captured opener relationships. Actual local destination tests check HTTP, real fragments and returned reference content; matrix includes changed open states and closes them before moving to another hash. Guard tests establish manifest integrity only; full rendered acceptance stays separate.
- Evidence: [review RV2–RV4](../research/composition-stage-review-2026-11-27.md), visual-baseline Node RED/GREEN; native browser attempt timed out, actual compiled gate remains open.

## 2026-11-27 — Skill routing and generated knowledge
- Skill is an executable workflow and explicit conditional read gate. Normative rule owners live in canonical documents; require actual reads before implementation, including pre-edit baseline for existing surfaces. A genuinely new surface has no prior baseline; protect shared surroundings. Verify links and anchors deterministically, agent adherence through separate trace-based outcome evals.
- One explicit publication map drives Markdown routes, generation, freshness and corpus. Generate actual canonical bodies instead of maintaining normative prose in sync.ts. Keep authored llms.txt compact and generated copies untracked. Keep public boundary allowlist explicit. User confirms development-first removal of obsolete contracts; current internal callsites migrate together. Evidence: R13 audit and Node 7/7 with missing-source negative control. Full build/live model gate remains open.


## 2026-11-28 — Close changed-contract inventory and preflight before owner execution
- Context: Composition S9. Seven successive owner runs surfaced blocked downstream stages after each repair; early source-only work and delayed native verification were expensive. Grouped recurring failures into 13 causes (four publication/source-read test faults, one wrong focus matcher, two macOS path issues, one CSS token finding, one omitted consumer SHA, one npm 12 policy mismatch, one obsolete consumer prop, one imported JS typing issue, one invalid role-query option). Initial 6 failing tests, two rounds of 3 failures at shared lint boundaries, then one lint finding, consumer invocation, 2 consumer failures and 4 compiler diagnostics. Counts group duplicate symptoms, not independent product regressions.
- Cause: incomplete impact inventory across test/tooling/fixture contracts; full native gate deferred until end; production-only typecheck missed test APIs; consumer code embedded as JS strings escaped compiler; missing actual host preflight; sequential fail-fast full reruns hid downstream errors and repeated already-green stages. Two macOS path issues required environment evidence; exact npm 12 behavior was discoverable in pinned upstream docs. Prior green runtime evidence is scoped to its SHA.
- Use next time: inventory all changed contracts before coding; test typed consumer fixtures in the existing test tree, run compiler first in canonical test script; check actual CLI argument contract and version/platform/security defaults before the first install. For a failed stage use the cheapest real native reproduction and downstream independent preflight, then full final acceptance once. Do not present source checks or synthetic repro as whole-runtime verification. Browser QA needs its own type preflight after pinned dependencies are installed; current root typecheck does not cover browser specs.
- Evidence: S9 owner logs and ledger; https://vitest.dev/guide/learn/writing-tests.html, https://playwright.dev/docs/test-typescript, https://testing-library.com/docs/queries/byrole/, https://docs.npmjs.com/cli/v12/commands/npm-install/. Consumer App fixture extraction byte-identical to previously generated inputs; actual root compile and final remote matrix at changed SHA pending.


## 2026-11-28 — Exact versioned release gate and live read-back
- Context: Composition 3.0.0. After technical repairs and an explicit owner exception for incomplete visual/independent acceptance, release metadata committed atomically, production trigger executed the complete functional and installed-package gate once on the exact versioned SHA. 140 native browser tests passed, 8 opt-in visual scenarios remained separate. No production deploy until build command success.
- Use next time: combine all mandatory checks on the actual versioned source before deployment, restore any temporary trigger invocation settings, verify terminal status, active traffic and anonymous public version marker. Preserve exceptions as explicit scoped decisions and never turn missing evidence into PASS. Check annotated-tag write capability separately; a site deployment and immutable verified SHA can be recorded while tag remains pending. For cloud visual evidence select a durable scoped artifact mechanism before the run when full-resolution review is mandatory; do not treat logs as reliable bulk transport.
- Evidence: Composition ledger S9.6–S12, release SHA 8fc08b24a40e978bf2d4e0900069f1488baf0ca0, [final review](../research/composition-final-review-2026-11-28.md).


## 2026-11-28 — постоянная команда production gate
- После успешной ручной сборки 3.0.0 временно расширенная команда была возвращена к прежнему unit/type/build/lint, из-за чего следующий release мог пропустить native browser и installed-package smoke. Release Integrity установил точную ранее исполненную команду в постоянный trigger; desired state и rollback принадлежат cloudflare-deploy.
- В дальнейшем сравнивать actual build command успешного release и persistent trigger. Проверять изменённые поля и неизменность активного deployment отдельно; конфигурационный PASS не заменяет fresh execution. Visual acceptance и независимые reviewers остаются отдельным gate.
- Evidence: [Release Integrity](../superpowers/plans/2026-11-28-release-integrity.md), ledger, private cloudflare-deploy@b9d7836. Тег и новые визуальные артефакты пока blocked.


## 2026-11-28 — Раздельные визуальные evidence paths
- Browser Rendering screenshot успешно доставил полный PNG 1440x900 из production в интерфейс ревью без логового транспорта (VART-01). Этот путь полезен для точечной live-проверки; immutable comparison baseline принадлежит pinned Playwright runtime, экспорт его файлов должен сохранять исходные байты и manifest.
- Перед массовой визуальной проверкой сначала подтвердить project-scoped transport одним actual build artifact, независимым GET и SHA-256. VARC assets уже имеет подходящий контракт; UI target и build-side auth пока отсутствуют. Не использовать чужой bucket и не выдавать разовое изображение за durable evidence.
- Evidence: [Release Integrity VART-01/02](../superpowers/plans/2026-11-28-release-integrity.md), ledger.


## 2026-11-28 — Долговременные QA-артефакты
- Dedicated private R2 vanya-ui-qa verified. Native Browser Rendering PNG and a real pinned Playwright screenshot both survived independent GET with equal SHA-256. Bounded log relay of one synthetic frame worked; mass log export remains unreliable.
- Cloudflare Builds user command uses /bin/sh, which in actual provider rejected pipefail; keep invocation short and use POSIX-compatible set -eu with separate checked commands, or a reviewed Bash script. Long inline PATCH rejected HTTP 400; exact limit remains unconfirmed.
- Direct upload requires scoped S3 bucket-item credentials; account-token permission currently unavailable. Keep credentials and provider IDs private; preserve manifest and artifact integrity before baseline approval.
- Evidence: [Release Integrity](../superpowers/plans/2026-11-28-release-integrity.md), ledger, private cloudflare-deploy.

## 2026-11-28 — Single visual pack
- Owner explicitly rejected maintaining dual profiles. Use one canonical risk-selected scene/context mapping across native capture, manifest and reporting; 56 scenes across six contexts verified in actual Cloudflare Playwright baseline run (6/6, 44.8s). Historical 176-image manifests immutable and incompatible with current schema. No profile flag or fallback. Distinguish capture/seal from comparison/approval; existing native functional tests protect additional behavior. [Test Cleanup](../superpowers/plans/2026-11-28-test-cleanup.md).


## 2026-11-28 — Main-first and native overflow oracle
- Owner explicitly requires Vanya UI work directly on main and real production checkpoints. Read AGENTS; avoid feature/research branches and PRs absent explicit request. Fast-forward only, preserve concurrent commits, validate exact released SHA and active version. Release 3.0.1 03073cb25770df426bbcaa539c89a059ef68de1e succeeded after a real Minimap row-local overflow RED. The root page width alone missed this defect; retain row-level oracle, injected negative control and component endpoint tests at 320/390/1024/1440. Preserve actual failures and fix the owning primitive. Cloudflare build log response may truncate at an arbitrary test; follow returned cursor until final page before interpreting suite outcome. Confirm actual deployment separately. Evidence: Test Cleanup final ledger and plan.
