# Semantic test review — post-change hardening

Scope: the browser contracts and related unit/consumer checks modified since 0.3.0. This is a source review; newly added browser scenarios are NOT_RUN until the real suite executes.

| User outcome | Previous oracle | Failure that could escape | Review result |
| --- | --- | --- | --- |
| Hero slider moves visible timeline | CSS custom property and input value | Changed property ignored by CSS | Measure rendered event position for keyboard and pointer. |
| Filter changes actual data | Filter group present | Callback disconnected from chart | Assert 10 → 20 → 40 actions in radar, old total absent, both control groups synchronized. |
| Tabs show linked content | Focus and selected attribute, visible panel | Invalid controlled value on dynamic items | Integrated controlled-owner recovery with one visible linked panel and selected tab after disable/remove; retain ignored-callback test. |
| Chart state changes | one-state points unequal to baseline; partial circle count | Empty/frozen/wrong data could pass | Explicit independently calculated coordinates for zero/one/partial/many; same oracle detects deliberately wrong visible series. |
| Loading/error | Plot message and missing polyline | Stale visible list or missing busy state | Verify no list entries, busy region, and loading removed when data returns. |
| Native navigation | aria-current and visible horizontal strip | Selected link correct while target hidden by sticky header | Assert actual target is below header and within viewport. |
| Axe | Some rules passed across a combined scope; isolated negative rule list | A missing scope can be skipped or mutation hits a different ruleset | Check each requested scope exists; missing-name RED/GREEN uses same WCAG tags and specific input target. |
| Pointer obstruction | elementFromPoint across slider, injected cover | Existing negative control measures actual obstruction | Retain. |
| Press/pending | computed fill + visible count/status | Mocked request lifecycle says nothing about real network or duplicate backend execution | Keep scope limited to component/demo. |
| CSS hierarchy | unit CSS strings/classes | CSS overridden at runtime | Structural contract only; rendered visual QA required. |
| Consumer | independent source lock and installed name, types, CSS, SSR | exact Bun format, real builds and browser behavior unknown | Explicit NOT_RUN until networked fixture execution; synthetic lock checks only. |

Remaining gaps: native 200% zoom, physical touch/VoiceOver/TalkBack, actual browser focus scopes, real installed consumer matrix, full mobile audit (#27), visual hierarchy/contrast, complete release verification. Keep structural, runtime, visual and release claims separate. No test deletion or weakened assertions to obtain a green build.
