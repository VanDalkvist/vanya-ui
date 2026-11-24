# Post-change hardening

## Cycle 14 — 0.3.13 — publication hygiene
- Baseline 0.3.12, 115 Vitest / 22 Node checks and production build passed. Reviewed 49 changed files and patches of 42 commits; no matching credential patterns or sensitive personal records found in that scope. Internal verification metadata identified in historical documents and public discussions.
- Removed internal metadata from current journal copies; updated both PR discussions and descriptions to omit dashboard links; added safe evidence rules. Public SHA and test evidence retained. Source review: no UI/API changes. Historical Git objects, comment edit history and caches may retain previous content; no history rewrite or claim of complete removal. Full public artifact scan remains pending. Next: focus behavior.

## Cycle 15 — 0.3.14 — theme focus
- Source RED: old selector can include buttons in display:none ancestors and then focus an unreachable element. Native Tab candidate exercised in an isolated local Chromium DOM fixture: Tab skips hidden ancestor to next button, Shift+Tab returns to previous, menu closes. This is mechanism evidence, not the actual React component run. Remove manual document traversal; preserve Escape, arrow selection and focus return. Unit test checks non-cancelled default and trigger re-anchor; real browser test adds hidden ancestor and exact targets. Design review: no visual change, native focus order preserved. Full component browser/build pending; remote browser rate limited.
