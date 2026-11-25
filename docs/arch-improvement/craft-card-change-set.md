# CraftCard — #21

Baseline `c9ee6a107fe0c292d6f70a3ebbabb4b3b31ff9b5` (0.3.29). Source RED: ignored isInteractive and bubbled nested click can activate parent. Consumer code search across accessible owner repositories returned four relevant files in one consumer; direct current file read found passive informational/skeleton cards, optional action passed with explicit boolean, and explicit action with custom keyboard handling and independent controls. This is an observed sample, not exhaustive repository coverage (code search omitted even known library files). Consumer files and private identifiers are not republished; no consumer changes.

## Cycle 31 — 0.4.0

- Explicit false disables library card activation; omitted/true requires a function. No pointer/role/tabIndex added to a passive card. Custom caller props remain caller responsibility. Existing consumer handlers preventing default retain control of keyboard activation.
- Nested independent interactive targets do not bubble into the card action. For composite content prefer passive wrapper with explicit native controls; this guard alone does not fix ARIA descendant semantics in legacy consumer markup.
- Review: localized component change, no new abstraction/dependency, existing feedback tokens unchanged. Showcase includes passive native action, actionable surface and opt-out, visible counters with real results. Copy explains actual behavior. Tests cover flag, pointer/keyboard, focus, repeats, nested target and prevention; portable browser scenario added. Minor bump per pre-1.0 breaking behavior and migration docs. Build/browser NOT_RUN at commit.

See #17 for final browser gate, #18 for consumer installation, #19 for release. No automatic consumer updates or release tag.
