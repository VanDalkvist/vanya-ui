# Distribution and release Change Set — #18–19

## Cycle 11 — 0.3.10 — source distribution

- Baseline 0.3.9 / `5a9ee9e724cc7fd4a2117882476548cdf93f39f7`; Workers Builds 0.3.6–0.3.9 all successful. Exact geometry browser readback on 0.3.6 previously passed; later browser acceptance remains pending. Mobile audit tracked separately in #27.
- S0–S5: package metadata advertised dist/index.js and dist/index.d.ts, although export paths and the README already specify TSX source. Build produces the website. Chosen model: preserve current source distribution, avoid separate build pipeline and compatibility churn; main/module/types use the actual source entry; types condition first. No component API, peer range, dependency, or CSS changes.
- S6–S8: README and versioning specify supported source-transforming consumer requirements and SSR boundary; remove stale hardcoded version from README. Regression verifies actual package fields/targets and ESM conditions, with no new runner. Source review PASS; design review: no rendered changes in this slice, documentation makes installation and limits clear. No actual consumer smoke yet; production build and consumer verification pending. No release tag, no consumer edits.
- Next: two isolated consumer installations pinned to exact SHA, one React 18 and one React 19 with TS resolution/build/CSS/SSR evidence; record actual outcomes and migration notes before tagging.
