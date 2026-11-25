# Browser and release acceptance — #17 / #18 / #19

## Cycle 32 — 0.4.1

Baseline 0.4.0 `4bcb4b824e74c09a0273ef05c451ec2dde38e023`. Owner approved the desktop editorial/divider design and mobile appearance; that approval is scoped to visual review. Exact-head real-browser acceptance remains pending.

Source finding: horizontal zero-value SVG polyline can have a zero-height geometry box despite a visible stroke. In an isolated local Chromium fixture with the exact zero-series points, getBBox().height=0, getTotalLength()=276; computed stroke oracle true; display:none false; restored true. This was an isolated fixture, not the production React application. Replaced the fragile series visibility assertion with visible SVG, computed stroke, positive path length, exact points and visible marker coordinates; added hide/restore negative control. Added #21 specimen to existing axe scope. No production UI change in this cycle.

## Evidence and remaining execution
- 0.3.29 exact SHA `c9ee6a107fe0c292d6f70a3ebbabb4b3b31ff9b5`: Cloudflare build successful, 119 Vitest and 23 Node tests, 17 public references. Historical evidence only.
- 0.4.0/0.4.1: new exact-head build and browser receipts required. Browser suite, real glyph checks, divider checks, keyboard/contrast and screen reader remain NOT_VERIFIED until executed. Do not infer them from visual acceptance or unit tests. Owner cancelled separate full mobile audit #27.
- Local environment check: Node 22.16.0 and npm 10.9.2 available; Bun missing and DNS lookups for GitHub, codeload, npm registry failed. Local Chromium can exercise isolated fixtures. Full dependency install and actual app browser run BLOCKED in this environment. Earlier remote browser rendering hit rate limit; no retry before provider cooldown. Existing manual consumer smoke remains the supported release route.
- Release tag requires exact SHA with verified build, types, browser and consumer matrix; existing connector does not expose tag creation. No tag created; no new workflow or automated consumer update.

## Manual commands on a networked machine

```sh
bun install --frozen-lockfile
bun run test
bunx tsc --noEmit -p tsconfig.build.json
bun run build
npm --prefix browser-qa install
npm --prefix browser-qa exec -- playwright install chromium
npm run test:browser
npm run test:consumer -- "$(git rev-parse HEAD)"
```

Review browser lockfile and receipts, use exact SHA, and follow [release process](../versioning.md) before creating an immutable tag. Keep private raw logs local.
