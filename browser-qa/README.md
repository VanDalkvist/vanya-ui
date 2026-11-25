# Vanya UI browser verification — #16

This is an **optional, manually invoked, portable browser gate** separate from Cloudflare builds and GitHub Actions. Its Playwright version is pinned in `package.json`. The commands work on macOS/Linux/Windows with Node.js 22+, Bun and a locally installed Chromium browser.

From repository root:

```sh
npm --prefix browser-qa ci
npm --prefix browser-qa exec -- playwright install chromium --no-shell
npm run test:browser
```

Playwright first runs the full production `bun run build` (including sync and prerender), then starts/stops `vite preview` for the **compiled `dist/`** at `127.0.0.1:4173`. A dev-server-only green cannot prove production entrypoint wiring. No production deployment, no GitHub workflow, no external credentials. The browser toolchain lives in this subpackage so the existing `bun.lock` and production Worker dependency graph stay untouched. The exact Playwright package version is `1.65.1`; `package-lock.json` pins its transitive dependencies and `axe-core@4.14.1`. Use `npm --prefix browser-qa ci`; record Node/npm versions, browser version and lockfile hash. The `chromium` channel uses the full Chromium new-headless implementation, so the extra headless-shell download is unnecessary. Keep raw traces and local logs outside public Git.

**What it asserts:** the hero distance slider changes its value **and actual SineWave event geometry**; left/centre/right hit-tests use `document.elementFromPoint`, including a negative-control overlay that must be detected at 390 / 1024 / 1440 px in both themes; no floating help overlaps it; active nav reflects hash, manual scroll, nested sections and Back/Forward; APG keyboard menu and tabs including Tab/Shift+Tab; drawer content/Escape/focus return; two independent scroll regions in both directions; observable click counter and explicit pending/error/success states; reduced motion and a CSS-zoom approximation. Screenshots and failures are written under `browser-qa/artifacts/` with an HTML report and traces, all ignored by Git.

**Geometry regression:** `tests/stable-geometry.spec.ts` checks all six example states at 1440/1024/390/320 CSS px in both themes. It compares document-relative bounding rectangles of controls, plot, help and list (height is variable on narrow screens), requires actual series stroke, marker coordinates, and list changes, tests disclosure and keyboard activation, and uses a hidden stroke and deliberate margin shift as negative controls. Screenshots remain review artifacts. Run the focused suite with `npm --prefix browser-qa run test -- stable-geometry.spec.ts`.

**Accessibility gate (#17):** `tests/accessibility.spec.ts` loads pinned `axe-core@4.14.1` from the local QA-only dependency. It checks named component specimens (including CraftCard) and open menu/drawer in light/dark for WCAG A/AA tags, fails on violations and attaches all incomplete results for review. A deliberately unnamed range input must be detected. No suppressed rules or automatic baseline approvals. Run `npm --prefix browser-qa run test -- accessibility.spec.ts`. The first remote probe (closed controls: tabs, geometry, header) returned zero violations but three incomplete contrast nodes per theme; the wider scope is intentionally unverified until run. The suite also checks forced-colors keyboard focus and measures SVG text contrast after converting browser colors to sRGB. Decorative artwork and incomplete axe results still require explicit evaluation; a manual screen-reader session remains separate.

**Native zoom:** `tests/native-zoom.spec.ts` loads a local-only fixture extension into a temporary isolated Chromium profile, calls the supported `chrome.tabs.setZoom(2)`, and verifies the actual zoom, halved CSS viewport and doubled DPR. It checks both themes, search/filter keyboard focus, Escape return and horizontal overflow. The old CSS-zoom approximation remains separately labelled; it is not the native-zoom oracle. No extension is installed into the user's browser profile.

**Dynamic tabs:** `tests/dynamic-tabs.spec.ts` bundles the real exported component into a test-only React fixture, then changes its props to disable or remove the selected tab. It verifies fallback selection, the connected panel and keyboard focus in a real browser. The fixture does not add a public application route or alter the production build.

**What is NOT proved by a passing script:** accessibility certification, a manual screen-reader session, Safari/WebKit, and human review of the saved screenshots. Before writing `UI_VERIFIED`, review screenshots manually in at least three viewports/two themes, test native 200% zoom and a keyboard-only path, and save the approved evidence under `docs/verification/<SHA>/` in a review commit. Never silently generate or approve golden baselines. A browser suite not run in the actual environment is `NOT_RUN`, **not** PASS.

To refresh artifacts safely, delete `browser-qa/artifacts/` locally; no deployment is touched.

**Cold-load hero geometry:** `tests/hero-initial-frame.spec.ts` holds the compiled client script while the real prerendered page loads. It checks reserved layout, invisible provisional wave, a negative control that reveals mismatched fallback geometry, stable first visible SVG coordinates, actual slider behavior and the no-script fallback. Run `npm --prefix browser-qa run test -- hero-initial-frame.spec.ts`. This is a browser test; unit/build success is not evidence that the first visible frame passed.

## Consumer harness workspace specimen (#36)
Use existing pinned browser setup, then `node scripts/consumer-smoke.mjs FULL_SHA --harness --browser`. The npm/React18 fixture becomes a real WorkspaceSplit/SurfaceHeader/SegmentedControl/ActionButton consumer, built with Vite. A local HTTP server serves dist; Chromium checks wide/narrow, light/dark, real state and keyboard outcome, body typography, available width and deliberately constrained-width negative control. Captures and actual measurements stay in the temp consumer. Review screenshots separately; this is not a blind-agent result. No automatic browser installation in production CI.
