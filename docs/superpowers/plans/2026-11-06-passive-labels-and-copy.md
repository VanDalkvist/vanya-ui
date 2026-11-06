# Passive labels and plain showcase copy

**Scope:** User asks to verify tag hover patterns against primary web sources, fix misleading affordances, then edit pompous showcase text. Preserve approved visuals, layout, palette, component row organization and brand.

**Primary evidence:** Carbon Tag usage explicitly excludes read-only tags from hover/focus/click states and distinguishes selectable/operational tags; GOV.UK status tags are non-interactive; WAI-ARIA button pattern requires action semantics and keyboard activation. URLs: https://carbondesignsystem.com/components/tag/usage/ ; https://design-system.service.gov.uk/components/tag/ ; https://www.w3.org/WAI/ARIA/apg/patterns/button/ . Raw fetched evidence: BB thread thr_iqfqpdagcr / tag-hover-primary-sources.md. Informational tooltips are not the same as a clickable hover affordance.

## Work
- [x] Observe focused regression failures for read-only status semantics and native keyboard-operable actionable tags; keep existing tests.
- [x] Tag: static span without hover; when onClick exists, native button with interactive feedback. Disabled interactive state must not pretend to be enabled.
- [x] MeshStatusBadge: static label without onClick; native button when actionable. Show read-only statuses in the catalogue rather than artificial detail-opening callbacks.
- [x] Remove adjacent false affordances found in the same pass: image zoom on static preview, chart click cursor/opacity without action, card-wide hover when only a nested park button acts. Preserve genuine control/link feedback and informative chart titles.
- [x] Apply redaktura + ux-copy to Scene, catalogue, example cards and overlay prose: replace atmosphere/marketing with purpose, action and concrete data. Keep public component names and the approved first-screen composition. The user subsequently rejected the abstract heading but explicitly requires keeping and refining the intro block. No test assertions on prose wording.
- [x] User follow-ups: keep the intro block (do not remove it), give it a literal heading and lighter hierarchy; widen the radar and separate totals; move setup instructions into an always-visible block after all components.
- [x] CategoryBadge follow-up: add sm/md and one common inline size grid (sm 24px / md 32px). Share height, type, icon and spacing tokens across badges, tags, status, buttons, keyboard hints, links, avatars and existing segmented sizes. Preserve xs as a deprecated compact alias; show both canonical sizes together in each relevant catalogue row. Public numeric chart dimensions are unrelated to inline control density.
- [x] Header follow-up: real vanya-arc.dev external link between section navigation and theme, flanked by the existing and exported dividers; keep sticky header compact.
- [x] Check unit suite, types, sync/build and actual computed styles before/after hover, disabled controls, genuine clickable behavior and keyboard. Check light/dark and narrow-screen copy wrapping.
- [x] Record author self-review AP-046/AP-054/AP-068/AP-069 evidence in ledger; commit/push scoped changes. No independent reviewer claim or subagent retry.

**Plan review:** Branch clean at e2dff4e. No new library or service. Existing HTML props stay accepted; native button rendering is conditional on an actual action, not appearance. Editorial scope was explicitly authorized by the user's follow-up; the later hierarchy refinement preserves the intro and composition.

**Outcome:** Author verification complete: 18 unit tests, tsc, sync idempotence and build pass; 34 Chrome checks pass, including actual hover, keyboard, both themes, all eight size families, wider radar, separate setup and compact mobile navigation. No independent review or fresh user aesthetic acceptance is claimed.
