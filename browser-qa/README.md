# Vanya UI browser verification — #16

This is an **optional, manually invoked, portable browser gate** separate from Cloudflare builds and GitHub Actions. Its Playwright version is pinned in `package.json`. The commands work on macOS/Linux/Windows with Node.js 22+, Bun and a locally installed Chromium browser.

From repository root:

```sh
npm --prefix browser-qa install
npm --prefix browser-qa exec -- playwright install chromium
npm run test:browser
```

Playwright starts and stops a local Vite dev server at `127.0.0.1:4173`. No production deployment, no GitHub workflow, no external credentials. The browser toolchain lives in this subpackage so the existing `bun.lock` and production Worker dependency graph stay untouched. The exact Playwright package version is `1.65.1`. Commit the generated subpackage lockfile after the first verified install if it needs to become an immutable toolchain snapshot.

**What it asserts:** the hero distance slider actually receives pointer input (center hit-test using `document.elementFromPoint`) at 390 / 1024 / 1440 px in both themes; no floating help overlaps it; active nav reflects hash, scroll and Back/Forward; APG keyboard menu and tabs; drawer open/close; two independent scroll regions; visible pressed/result state; reduced motion and a CSS-zoom approximation. Screenshots and failures are written under `browser-qa/artifacts/` with an HTML report and traces, all ignored by Git.

**What is NOT proved by a passing script:** accessibility certification, a screen-reader session, actual browser 200% zoom (we simulate 200% CSS zoom as a smoke check), Safari/WebKit, and human review of the saved screenshots. Before writing `UI_VERIFIED`, review screenshots manually in at least three viewports/two themes, test native 200% zoom and a keyboard-only path, and save the approved evidence under `docs/verification/<SHA>/` in a review commit. Never silently generate or approve golden baselines. A browser suite not run in the actual environment is `NOT_RUN`, **not** PASS.

To refresh artifacts safely, delete `browser-qa/artifacts/` locally; no deployment is touched.
