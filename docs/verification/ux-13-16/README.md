# UX-13–16 verification — evidence, not promises

Branch: `fix/ux-13-16-interaction-browser-gate-20261123`.

## Current status at initial PR authoring

- Source changes and unit tests: **written**, not yet independently executed in the local working container.
- Browser gate: **implemented**, optional `npm run test:browser`, but not executed in this environment (GitHub repository is accessible through the connected GitHub service rather than a local network clone).
- Visual screenshots, human comparison, actual 200% browser zoom, screen reader: **NOT_VERIFIED**.
- No tag, release, production deploy or consumer update.

Do not replace NOT_RUN with PASS until an actual command returns success; do not close #16 until screenshots are reviewed.

## Run on any machine after checkout

```sh
bun install --frozen-lockfile
bun run test
bunx tsc --noEmit -p tsconfig.build.json
bun run build
npm --prefix browser-qa install
npm --prefix browser-qa exec -- playwright install chromium
npm run test:browser
```

Playwright is installed only for the optional browser subproject. The suite writes actual PNGs and traces to `browser-qa/artifacts/`. Open `browser-qa/artifacts/report/index.html` and review each scenario; do not commit random machine-dependent screenshots as baselines.

## Manual sign-off

- [ ] APG Tab / Theme menu with real Tab, Shift+Tab, arrow navigation, Escape, focus return, mouse/touch.
- [ ] Header active label after native scroll, click, reload and history.
- [ ] Light/dark × widths 390/1024/1440; at native browser zoom 200%, ensure slider/tabs/header remain reachable and no content is covered.
- [ ] Independent scroll left vs reader, drawer return focus.
- [ ] Save reviewed screenshots and any failures under `docs/verification/<commit-sha>/`, then record who reviewed and environment.
- [ ] Mark UI_VERIFIED only after the above; otherwise report NOT_VERIFIED.

The gate is **manual-only**; there are no GitHub Actions `push`, `pull_request` or `schedule` triggers.
