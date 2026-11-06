# Passive labels and plain showcase copy

**Scope:** User asks to verify tag hover patterns against primary web sources, fix misleading affordances, then edit pompous showcase text. Preserve approved visuals, layout, palette, component row organization and brand.

**Primary evidence:** Carbon Tag usage explicitly excludes read-only tags from hover/focus/click states and distinguishes selectable/operational tags; GOV.UK status tags are non-interactive; WAI-ARIA button pattern requires action semantics and keyboard activation. URLs: https://carbondesignsystem.com/components/tag/usage/ ; https://design-system.service.gov.uk/components/tag/ ; https://www.w3.org/WAI/ARIA/apg/patterns/button/ . Raw fetched evidence: BB thread thr_iqfqpdagcr / tag-hover-primary-sources.md. Informational tooltips are not the same as a clickable hover affordance.

## Work
- [ ] Observe focused regression failures for read-only status semantics and native keyboard-operable actionable tags; keep existing tests.
- [ ] Tag: static span without hover; when onClick exists, native button with interactive feedback. Disabled interactive state must not pretend to be enabled.
- [ ] MeshStatusBadge: static label without onClick; native button when actionable. Show read-only statuses in the catalogue rather than artificial detail-opening callbacks.
- [ ] Remove adjacent false affordances found in the same pass: image zoom on static preview, chart click cursor/opacity without action, card-wide hover when only a nested park button acts. Preserve genuine control/link feedback and informative chart titles.
- [ ] Apply redaktura + ux-copy to Scene, catalogue, example cards and overlay prose: replace atmosphere/marketing with purpose, action and concrete data. Keep public component names and the approved first-screen heading/layout. No test assertions on prose wording.
- [ ] Check unit suite, types, sync/build and actual computed styles before/after hover, disabled controls, genuine clickable behavior and keyboard. Check light/dark and narrow-screen copy wrapping.
- [ ] Record author self-review AP-046/AP-054/AP-068/AP-069 evidence in ledger; commit/push scoped changes. No independent reviewer claim or subagent retry.

**Plan review:** Branch clean at e2dff4e. No new library or service. Existing HTML props stay accepted; native button rendering is conditional on an actual action, not appearance. Editorial scope was explicitly authorized by the user's follow-up; no design change is needed.
