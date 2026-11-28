# Vanya UI browser verification — #16

This is an **optional, manually invoked, portable browser gate** without a production deployment or GitHub Actions workflow. It can run in an existing Cloudflare validation build. Its Playwright version is pinned in `package.json`. The commands work on macOS/Linux/Windows with Node.js 22+, Bun and a locally installed Chromium browser.

From repository root:

```sh
npm --prefix browser-qa ci
npm run typecheck:browser
npm --prefix browser-qa exec -- playwright install chromium --no-shell
npm run test:browser
```

Playwright first runs the full production `bun run build` (including sync and prerender), then starts/stops `vite preview` for the **compiled `dist/`** at `127.0.0.1:4173`. A dev-server-only green cannot prove production entrypoint wiring. No production deployment, no GitHub workflow, no external credentials. The browser toolchain lives in this subpackage so the existing `bun.lock` and production Worker dependency graph stay untouched. The exact Playwright package version is `1.65.1`; `package-lock.json` pins its transitive dependencies and `axe-core@4.14.1`. Use `npm --prefix browser-qa ci`; record Node/npm versions, browser version and lockfile hash. The `chromium` channel uses the full Chromium new-headless implementation, so the extra headless-shell download is unnecessary. Keep raw traces and local logs outside public Git.

### Existing Cloudflare Workers Builds (validation only)

Use `bash browser-qa/cloudflare-browser.sh` as the browser portion of a manually initiated validation build on the exact candidate SHA. The build must end with `echo VALIDATION_ONLY_DO_NOT_DEPLOY`; leave the production trigger intact. The script uses the pinned Playwright package and browser, native APT dependency simulation, signed Ubuntu package indexes and user-owned temporary extraction. It verifies a real Chromium launch before testing. No root access or changes to the build image are needed. Both TypeScript checks run before browser execution. The cloud line reporter preserves failure details in build logs. Local HTML/JSON reports and traces are ephemeral unless explicitly exported. Visual baseline capture/compare remains a separate opt-in gate requiring the same browser, OS and fonts.

**What it asserts:** the hero distance slider changes its value **and actual SineWave event geometry**; left/centre/right hit-tests use `document.elementFromPoint`, including a negative-control overlay that must be detected at 390 / 1024 / 1440 px in both themes; no floating help overlaps it; active nav reflects hash, manual scroll, nested sections and Back/Forward; APG keyboard menu and tabs including Tab/Shift+Tab; drawer content/Escape/focus return; two independent scroll regions in both directions; observable click counter and explicit pending/error/success states; reduced motion and a CSS-zoom approximation. Screenshots and failures are written under `browser-qa/artifacts/` with an HTML report and traces, all ignored by Git.

**Geometry regression:** `tests/stable-geometry.spec.ts` checks all six example states at 1440/1024/390/320 CSS px in both themes. It compares document-relative bounding rectangles of controls, plot, help and list (height is variable on narrow screens), requires actual series stroke, marker coordinates, and list changes, tests disclosure and keyboard activation, and uses a hidden stroke and deliberate margin shift as negative controls. Screenshots remain review artifacts. Run the focused suite with `npm --prefix browser-qa run test -- stable-geometry.spec.ts`.

**Accessibility gate (#17):** `tests/accessibility.spec.ts` loads pinned `axe-core@4.14.1` from the local QA-only dependency. It checks named component specimens (including CraftCard) and open menu/drawer in light/dark for WCAG A/AA tags, fails on violations and attaches all incomplete results for review. A deliberately unnamed range input must be detected. No suppressed rules or automatic baseline approvals. Run `npm --prefix browser-qa run test -- accessibility.spec.ts`. The first remote probe (closed controls: tabs, geometry, header) returned zero violations but three incomplete contrast nodes per theme; the wider scope is intentionally unverified until run. The suite also checks forced-colors keyboard focus and measures SVG text contrast after converting browser colors to sRGB. Decorative artwork and incomplete axe results still require explicit evaluation; a manual screen-reader session remains separate.

**Native zoom:** `tests/native-zoom.spec.ts` loads a local-only fixture extension into a temporary isolated Chromium profile, calls the supported `chrome.tabs.setZoom(2)`, and verifies the actual zoom, halved CSS viewport and doubled DPR. It checks both themes, search/filter keyboard focus, Escape return and horizontal overflow. The old CSS-zoom approximation remains separately labelled; it is not the native-zoom oracle. No extension is installed into the user's browser profile.

**Dynamic tabs:** `tests/dynamic-tabs.spec.ts` bundles the real exported component into a test-only React fixture, then changes its props to disable or remove the selected tab. It verifies fallback selection, the connected panel and keyboard focus in a real browser. The fixture does not add a public application route or alter the production build.

**What is NOT proved by a passing script:** accessibility certification, a manual screen-reader session, Safari/WebKit, and human review of the saved screenshots. Before writing `UI_VERIFIED`, review screenshots manually in at least three viewports/two themes, test native 200% zoom and a keyboard-only path, and save the approved evidence under `docs/verification/<SHA>/` in a review commit. Never silently generate or approve golden baselines. A browser suite not run in the actual environment is `NOT_RUN`, **not** PASS.

To refresh artifacts safely, delete only disposable run report directories (test-results, report, results.json, traces) after checking their paths. Keep sealed golden directories intact, including any golden nested under browser-qa/artifacts.

**Cold-load hero geometry:** `tests/hero-initial-frame.spec.ts` holds the compiled client script while the real prerendered page loads. It checks reserved layout, invisible provisional wave, a negative control that reveals mismatched fallback geometry, stable first visible SVG coordinates, actual slider behavior and the no-script fallback. Run `npm --prefix browser-qa run test -- hero-initial-frame.spec.ts`. This is a browser test; unit/build success is not evidence that the first visible frame passed.

## Consumer harness workspace specimen (#36)
Use existing pinned browser setup, then `node scripts/consumer-smoke.mjs FULL_SHA --harness --browser`. The npm/React18 fixture becomes a real WorkspaceSplit/SurfaceHeader/SegmentedControl/ActionButton consumer, built with Vite. A local HTTP server serves dist; Chromium checks wide/narrow, light/dark, real state and keyboard outcome, body typography, available width and deliberately constrained-width negative control. Captures and actual measurements stay in the temp consumer. Review screenshots separately; this is not a blind-agent result. No automatic browser installation in production CI.


## Composition regression and visual comparison

See [Regression Gate](../docs/patterns/regression-gate.md) for exact baseline/compare commands and acceptance. `composition-regression.spec.ts` probes every visible textual ActionLink in both themes and real filter results, plus guide/catalog alignment. `composition-visual.spec.ts` is opt-in and requires exact version/SHA metadata, explicit baseline directory and snapshot policy; it covers 20 stable anchors and two actually opened modal states at four widths in both themes (176 images). Local destination and real keyboard-popup assertions run in the existing regression and new-tab suites. The baseline and candidate reports are isolated by VANYA_UI_EVIDENCE_DIR. Keep raw images local, review intentional diffs explicitly. The visual baseline is not automatically regenerated or marked accepted.


**Composition golden integrity:** `npm --prefix browser-qa run test:baseline` runs the dependency-free filesystem tests. Visual mode uses the existing Playwright runner and the explicit capture/compare commands in [Regression Gate](../docs/patterns/regression-gate.md). Keep the sealed golden directory outside the disposable run report directory; never delete approved golden data while cleaning reports. No visual acceptance follows from the Node tests alone.


### Paired cloud visual execution

The existing validation-only Cloudflare build may invoke the same browser adapter with verified baseline identity:

~~~sh
VANYA_UI_BASELINE_SHA=<verified-40-char-production-sha> \
VANYA_UI_BASELINE_VERSION=<served-package-version> \
VANYA_UI_QA_URL=https://ui.vanya-arc.dev \
bash browser-qa/cloudflare-browser.sh --visual-pair
~~~

It captures the full immutable 176-image baseline and compares the exact checked-out compiled candidate in the same build environment. The native Playwright comparison and explicit snapshot policy remain authoritative. A nonzero comparison exit stays nonzero even when every changed scene has been captured successfully. Per-scene receipts and contact sheets (baseline left/candidate right; matches show the reference on both sides) are exported to authenticated build logs for coarse layout review. Full-size PNGs, native diffs, traces and HTML report are transient in Workers Builds; reduced JPEG sheets are not a substitute for full-resolution review or approved baseline retention. Log size limits may truncate image transport.

For supplemental review after a completed full comparison, use an explicit comma-separated context selection and matching native Playwright grep (e.g. `VANYA_UI_VISUAL_REVIEW_CONTEXTS=dark-1024,dark-390,dark-320` plus `--grep 'dark (1024|390|320)$'`). The baseline still captures all 176 frames in a fresh directory, selected comparison receipts must be complete, and the default full gate is unchanged. Record the supplemental scope and evidence separately. Do not use a subset to claim full acceptance.
