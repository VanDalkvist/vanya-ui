# Vanya UI browser verification — #16

This is an **optional, manually invoked, portable browser gate** separate from Cloudflare builds and GitHub Actions. Its Playwright version is pinned in `package.json`. The commands work on macOS/Linux/Windows with Node.js 22+, Bun and a locally installed Chromium browser.

From repository root:

```sh
npm --prefix browser-qa install
npm --prefix browser-qa exec -- playwright install chromium
npm run test:browser
```

Playwright first runs the full production `bun run build` (including sync and prerender), then starts/stops `vite preview` for the **compiled `dist/`** at `127.0.0.1:4173`. A dev-server-only green cannot prove production entrypoint wiring. No production deployment, no GitHub workflow, no external credentials. The browser toolchain lives in this subpackage so the existing `bun.lock` and production Worker dependency graph stay untouched. The exact Playwright package version is `1.65.1`. Commit the generated subpackage lockfile after the first verified install if it needs to become an immutable toolchain snapshot.

**What it asserts:** the hero distance slider changes its value **and actual SineWave event geometry**; left/centre/right hit-tests use `document.elementFromPoint`, including a negative-control overlay that must be detected at 390 / 1024 / 1440 px in both themes; no floating help overlaps it; active nav reflects hash, manual scroll, nested sections and Back/Forward; APG keyboard menu and tabs including Tab/Shift+Tab; drawer content/Escape/focus return; two independent scroll regions in both directions; observable click counter and explicit pending/error/success states; reduced motion and a CSS-zoom approximation. Screenshots and failures are written under `browser-qa/artifacts/` with an HTML report and traces, all ignored by Git.

**Geometry regression:** `tests/stable-geometry.spec.ts` checks all six example states at 1440/1024/390/320 CSS px in both themes. It compares document-relative bounding rectangles of controls, plot, help and list (height is variable on narrow screens), requires actual series and list changes, tests disclosure and keyboard activation, and uses a deliberate margin shift as a negative control. Screenshots remain review artifacts. Run the focused suite with `npm --prefix browser-qa run test -- stable-geometry.spec.ts`.

**Accessibility gate (#17):** `tests/accessibility.spec.ts` loads pinned `axe-core@4.14.1` from the local QA-only dependency. It checks named component specimens and open menu/drawer in light/dark for WCAG A/AA tags, fails on violations and attaches all incomplete results for review. A deliberately unnamed range input must be detected. No suppressed rules or automatic baseline approvals. Run `npm --prefix browser-qa run test -- accessibility.spec.ts`. The first remote probe (closed controls: tabs, geometry, header) returned zero violations but three incomplete contrast nodes per theme; the wider scope is intentionally unverified until run. Manual screen reader, native zoom and contrast evaluation remain separate requirements.

**What is NOT proved by a passing script:** accessibility certification, a screen-reader session, actual browser 200% zoom (we simulate 200% CSS zoom as a smoke check), Safari/WebKit, and human review of the saved screenshots. Before writing `UI_VERIFIED`, review screenshots manually in at least three viewports/two themes, test native 200% zoom and a keyboard-only path, and save the approved evidence under `docs/verification/<SHA>/` in a review commit. Never silently generate or approve golden baselines. A browser suite not run in the actual environment is `NOT_RUN`, **not** PASS.

To refresh artifacts safely, delete `browser-qa/artifacts/` locally; no deployment is touched.
