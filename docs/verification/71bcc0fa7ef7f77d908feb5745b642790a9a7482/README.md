# 0.4.1 acceptance receipt — 2026-11-25

Candidate: **`71bcc0fa7ef7f77d908feb5745b642790a9a7482`** ([source](https://github.com/VanDalkvist/vanya-ui/commit/71bcc0fa7ef7f77d908feb5745b642790a9a7482)). Baseline: `0cee760c6aebaf5d3db57628128384d27137266a`.

Author self-check, not independent review. Work stayed on main without subagents or PRs. No new GitHub Actions, infrastructure configuration, npm publication or consumer application updates.

## Executed gates

| Gate | Result |
|---|---|
| `bun install --frozen-lockfile` | PASS |
| `bun run test` | **122 Vitest + 23 Node PASS**, zero failures |
| `bunx tsc --noEmit -p tsconfig.build.json` | PASS |
| `bun run release:check` | PASS, version **0.4.1** |
| Production build / prerender / publication references | PASS, **17 local references** |
| Full production Playwright | **59/59 PASS**, zero skipped, unexpected or flaky results; final run **167.724 s**, two workers |
| Pinned axe 4.14.1 | No violations in scoped controls and open menu/drawer, both themes; incompletes explicitly triaged below |
| Actual native Chromium zoom | PASS: `chrome.tabs.getZoom() = 2`, width **1440 → 720 CSS px**, DPR **1 → 2**; keyboard search/filter/Escape in both themes |
| Forced colors / reduced motion | PASS in Chromium media emulation; visible menu focus and actual SVG system text color |
| Dynamic tabs | Actual React component: selected-item disable/remove, fallback selection, linked panel and keyboard reachability PASS |
| Manual interactive keyboard pass | Filter and menu focus/ArrowDown/End/Escape PASS, independently driven through the browser tool |
| Visual review | 390/1024/1440 × light/dark; native-zoom top views and forced-colors output inspected |
| Manual screen reader | **NOT_VERIFIED** |
| Non-Chromium engines | **NOT_RUN**, not part of this Chromium acceptance |
| Candidate Cloudflare build / annotated tag | **PASS**: Workers Builds completed successfully at **2026-11-25T02:01:02Z** on this exact SHA; annotated `v0.4.1` pushed and remote target verified |

The full browser run started at **2026-11-25T01:56:19.428Z**, before committing the same source tree as the candidate; `git diff --exit-code HEAD` subsequently confirmed no tracked source difference. The exact candidate's source distribution was then fetched independently by both consumers below. Raw browser JSON/HTML, traces and consumer fixture directories remain local; this receipt excludes private paths and raw runtime logs.

Toolchain: Node **26.13.1**, npm **11.20.0**, Bun **1.4.4**, Playwright **1.65.1**, Chromium **159.0.8154.6** / build **1255**. QA `package-lock.json` SHA-256: **`ce8ed8a2acc3599c81377b2825c96ce74ce375d67ec675a5a14717bda39687d6`**.

## Exact-SHA independent consumers — #18

Executed after candidate push:

```sh
npm run test:consumer -- 71bcc0fa7ef7f77d908feb5745b642790a9a7482
```

| Clean consumer | React | Pinned install / direct lock SHA | TS / ESM resolution | Client + CSS build | Bundled SSR + actual render |
|---|---|---|---|---|---|
| npm 11.20.0 | 18.3.1 | PASS | PASS | PASS | PASS |
| Bun 1.4.4 | 19.0.0 | PASS | PASS | PASS | PASS |

Both receipts identify the exact candidate and package **0.4.1**. This proves the documented source-distribution contract with a TSX-capable bundler, not native Node execution of raw TSX. The bundler emits nonfatal lucide-react `use client` module-directive warnings; ordinary client/SSR output and actual rendering pass. No Next.js/RSC compatibility claim is made.

## Browser/a11y evaluation — #17

The complete production suite includes geometry and negative controls, navigation/history/reload, tabs/menu (including hidden ancestors), slider hit testing, drawer focus return, search/filter/buttons, CraftCard pointer/keyboard behavior, typography/Cyrillic glyphs and divider composition. The screenshots are reviewed evidence, not automatically approved golden baselines.

Axe has **15 contrast incomplete nodes per theme**: 12 SVG text nodes are separately measured using browser-resolved sRGB against actual `--ground` (minimum ratio **7.608:1 light / 9.285:1 dark**), while three `aria-hidden` decorative artwork glyphs are not text labels. Three additional artwork-link label-content incompletes are manually not applicable: the artwork has no meaningful visible text label and each link is named by its corresponding title. Open menu/drawer incompletes are empty. No rules are suppressed. The deliberately unnamed-slider negative control is detected and restores green afterward.

Axe and visual checks discovered five bounded defects: FilterSelect label mismatch and premature hidden-portal focus; selected dark-menu contrast; unsupported generic-span labelling; forced-colors SVG label colors. All were fixed and rerun. See [Arch Loop findings and all four semantic probes](../../arch-improvement/browser-release-acceptance.md#cycle-33--local-production-acceptance-2026-11-25).

The generic portable React-consumer check was **FAIL** for this authoring repository because the library does not depend on itself. Explicit `--mode visual` inspect/check/verify then ran the real build and full browser script successfully; it does not skip browser execution. The final complete browser rerun after the forced-colors correction used:

```sh
npm --prefix browser-qa run test -- --workers=2
```

Manual screen-reader status is deliberately **NOT_VERIFIED**, as permitted by #17's separate-status requirement; this is not accessibility certification or a physical Windows high-contrast session. The separately cancelled extended mobile/touch audit is not reinstated.

## Visual evidence

- [1440 light](1440-light.png) · [1440 dark](1440-dark.png)
- [1024 light](1024-light.png) · [1024 dark](1024-dark.png)
- [390 light](390-light.png) · [390 dark](390-dark.png)
- [Native 200% light](native-200-light.png) · [Native 200% dark](native-200-dark.png)
- [Forced colors light](forced-colors-light.png) · [Forced colors dark](forced-colors-dark.png)

The native zoom screenshots were captured at scroll position zero after an instant reset and paint-frame events. Blank scrolled Chromium captures were rejected, not recorded as visual PASS; the actual zoom/focus assertions were retained. No CSS-zoom approximation was substituted for native zoom.

## Release decision — #19

Freeze previously untagged **0.4.1** with the dated changelog and existing 0.4.0 breaking/migration notes. These bounded fixes do not introduce another breaking API. The annotated release tag targets the candidate above, never this later evidence-only commit. Existing apps remain pinned as they were; their upgrades require separate tasks.

Verified through GitHub's check-runs API: **Workers Builds: vanya-ui**, status **completed**, conclusion **success**, head SHA **`71bcc0fa7ef7f77d908feb5745b642790a9a7482`**, completion **2026-11-25T02:01:02Z** ([candidate checks](https://github.com/VanDalkvist/vanya-ui/commit/71bcc0fa7ef7f77d908feb5745b642790a9a7482/checks)). This is the existing application's own Cloudflare build, not a newly created GitHub Actions workflow.

```text
git cat-file -t v0.4.1
# tag
git rev-parse 'v0.4.1^{}'
# 71bcc0fa7ef7f77d908feb5745b642790a9a7482
git ls-remote origin 'refs/tags/v0.4.1*'
# 957cbbfb1ed0d9bbd58b17400d4c5f05ead88edc  refs/tags/v0.4.1
# 71bcc0fa7ef7f77d908feb5745b642790a9a7482  refs/tags/v0.4.1^{}
```

No tag was moved or overwritten. No GitHub Release or registry publication was needed for this source-distribution release. The report commit is intentionally later than the accepted source SHA so that it can name the exact tested commit and published annotated tag without a self-referential placeholder.
