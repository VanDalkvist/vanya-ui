# Distribution and release Change Set — #18–19

## Cycle 11 — 0.3.10 — source distribution

- Baseline 0.3.9 / `5a9ee9e724cc7fd4a2117882476548cdf93f39f7`; Workers Builds 0.3.6–0.3.9 all successful. Exact geometry browser readback on 0.3.6 previously passed; later browser acceptance remains pending. Mobile audit tracked separately in #27.
- S0–S5: package metadata advertised dist/index.js and dist/index.d.ts, although export paths and the README already specify TSX source. Build produces the website. Chosen model: preserve current source distribution, avoid separate build pipeline and compatibility churn; main/module/types use the actual source entry; types condition first. No component API, peer range, dependency, or CSS changes.
- S6–S8: README and versioning specify supported source-transforming consumer requirements and SSR boundary; remove stale hardcoded version from README. Regression verifies actual package fields/targets and ESM conditions, with no new runner. Source review PASS; design review: no rendered changes in this slice, documentation makes installation and limits clear. No actual consumer smoke yet; production build and consumer verification pending. No release tag, no consumer edits.
- Next: two isolated consumer installations pinned to exact SHA, one React 18 and one React 19 with TS resolution/build/CSS/SSR evidence; record actual outcomes and migration notes before tagging.

## Cycle 12 — 0.3.11 — repeatable consumer smoke and migration
- Exact 0.3.10 / ef40f50e9f62a4780c35181391c0309fe50fee5e Workers Build eac549f8-13cd-4160-947d-f70a29487e6a succeeded: 115 Vitest, 20 Node, new entrypoint metadata regression, version, TypeScript, publication, build/deploy.
- S4–S8: add one opt-in smoke command generating two isolated actual consumer projects: npm/React 18 and Bun/React 19, both pinned source SHA, bundler TypeScript, Tailwind CSS production build, SSR rendering. Keep lockfiles and JSON receipts in temp dir. Offline fixture tests do not imply installed consumers work. No CI/provider changes, no real app edits, no new root dependencies.
- Source/ design review: specimen uses a real button and filter, no visual product changes; document explicit migration from implicit pseudo-tabs and source bundler/SSR boundaries. Actual npm registry/GitHub/codeload DNS unavailable in local sandbox, Bun absent, npm cache empty; independent execution remains BLOCKED. 0.3.11 build and consumer runtime not yet verified; no tag.

## Cycle 13 — 0.3.12 — smoke oracle and receipts review
- S4–S5: source review identified potential false failure checking inline --color-accent rather than --accent emitted by the pinned @vanya/brand tokens. Confirmed brand source and actual UI action selector. Documentation promised logs but child stdio was inherited.
- S6–S8: assert stable real token, shared selector and generated utility; pure oracle test exercises missing-token/selector/utility RED conditions. Save command stdout/stderr in each isolated directory, record manager/Node versions. No user interface, consumer, dependency or production runner changes. Design review N/A for tooling; fixture composition unchanged. Actual fixture install/build/SSR remains BLOCKED by unavailable network/Bun; exact source build pending. No tag.
