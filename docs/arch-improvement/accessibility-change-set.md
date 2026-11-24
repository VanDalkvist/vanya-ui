# Accessibility Change Set — #13–17

Source main `a29e224fd47c8e73c83f892d773333d4de150201`. Direct main, separate versioned slices, no new PRs, no release tags until verified.

## Cycle 8 — 0.3.7 — active navigation (#15)
- 0.3.6 build [internal receipt omitted] successful: 113 Vitest, 19 Node, TypeScript, release/publication/build/deploy. Browser Run verified exact assets main-YECCh5lS.css / main-fYSyzJ3o.js: 48 geometry transitions at four widths/two themes, 0px delta, all contained, no overflow, correct data and negative controls. Full portable runner and native zoom/screen reader still unexecuted.
- Real browser on 0.3.6: tab keyboard selection/panel/Shift+Tab and theme menu ArrowDown/End/Home/Escape/Enter/Space/Tab/Shift+Tab passed 1440/390/320. Navigation RED: 390/320 header 82.39px, fragment scroll margin 160px, current section remains previous; at 1024 and document end setup top ~170px but probe ~129px. At 1440 with taller viewport bottom can also clamp before probe. Active link in mobile horizontal strip can be clipped: separate next slice.
- S4–S8: use computed scrollMarginTop in the viewport probe (2px rounding tolerance), retain actual header threshold, choose last visible section only at actual scroll limit. Existing native URL/history preserved; no new public component props. Two unit regressions, four Playwright width cases. Source design review: current indication follows reading position and browser anchor alignment, no visual changes yet. Exact 0.3.7 build and browser GREEN pending.

## Cycle 9 — 0.3.8 — visible active navigation (#15)
- RED on exact 0.3.6: 320px nav strip 113.2px, Workspace link ~140px, unable to fit; current links clipped at 390/320. First layout candidate collided with brand at 320; rejected.
- Revised CSS candidate tested in Chromium on 0.3.6 at 390 and 320 fine-pointer widths: full strip 342/296px, no brand/utility overlap or document overflow, full 137.5px Workspace link fits when scrolled; screenshots inspected. Header height ~99.4px. Narrow coarse-pointer fallback keeps utilities in normal flow; not yet browser-tested.
- S4–S8: scope changes to showcase, no public NavLinks API changes. Reveal active link via horizontal scrollLeft only when clipped; retain native anchors and vertical scroll. Add containment expectations to existing four-width regression. Source review PASS, exact production browser/build pending; no claim of final UI_VERIFIED.

## Cycle 10 — 0.3.9 — automated accessibility smoke (#17)
- Browser Run executed actual axe-core 4.14.1 on #segments, #composition-stable-geometry and .showcase-header in light/dark: 25 passed rules, zero violations, three incomplete color-contrast nodes in each theme. The broader follow-up request was rate-limited (429); no claim of a full baseline.
- Add axe-core exact pin only to browser-qa devDependencies; use bundled source in existing Playwright runner and WCAG A/AA rules. Preserve incomplete checks in JSON evidence and fail on any violation; negative control removes the RangeSlider accessible name. No production dependencies, no automatic CI, no exclusions to force green.
- Source design review: inspect actual states (closed specimens/open menu/open dialog), focus return, accessibility names. No product copy or visual changes. Full local suite, lockfile generation, forced-colors/manual contrast, native zoom and screen reader remain pending. Source review only; exact build and runtime gate not yet executed.
