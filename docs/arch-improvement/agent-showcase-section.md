# Agent showcase section — #31

Baseline c9509720c080d042bd7cb5d908c50015c8caf755. Owner requests an independent section within the existing page, exposed in the existing menu.

Scope: append #agents after #setup; keep existing section ordering, hero, navigation geometry, theme and all existing URLs. Use existing ActionButton/ActionLink, shared type roles and a scoped responsive two-column layout. One row separator owner; no new routes, switcher, dependency, external skill installation or changes to consuming products.

Actual sources: local canonical skill, portable CLI, component index, tokens, LLM index/full reference, versioning and installation. Copy action awaits Clipboard API; failure offers manual selection. Release status links to canonical versioning to avoid duplicate hard-coded version. Agent evals explicitly unconfirmed. No new claim of external skill composition.

Arch review: existing Showcase mounts AgentSection in its only main; ShowcaseHeader uses native fragment and existing active-section logic; SSR prerender asserts presence. No duplicate business logic, network dependency or domain migration. UI verification uses actual controls and published URLs. Existing navigation exact list updated, active navigation browser coverage extended, agent section axe coverage added, copy success/rejection tests added, width/theme browser matrix and clipboard flow added. No browser result inferred from static source.

Baseline 0.4.3 Cloudflare FAIL: 33/34 Node tests passed, bootstrap expected obsolete `plan --task` instead of current `plan --project . --task`. Corrected assertion to match project-bound plan and verify receipt. No production skill behavior changed.

Version 0.4.4; exact-head tests/build and browser observations pending at commit. Previous verified component tag remains unchanged. No automated workflow added.

## Deployment repair — 0.4.5

Cloudflare exact 0.4.4 commit b69273807a8a43bf3a226f5c57efc9d10629ac9f failed the TypeScript gate (four TS2322 diagnostics). All 34 Node tests passed; the old bootstrap assertion is resolved. AgentSection incorrectly used lg, but ComponentSize in src/sizes.ts permits sm/md only. Replaced all four values with md, preserving local layout and copy hit-target CSS. No global tokens, component contracts or unrelated sections changed. New exact-head deployment and live readback pending.
