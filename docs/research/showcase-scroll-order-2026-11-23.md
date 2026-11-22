# Showcase navigation: section ordering fix (2026-11-23)

## Bug and root cause

When scrolling the page down, the header briefly highlighted **Компоненты → Рабочие поверхности → Компоненты**. The page had `#workspace` nested inside `#catalog`, and still rendered EnergyRadar, SpiderRadar, HearthPulse, VoiceWaveIndicator, InspectDrawer and ReceiptDigestModal **after** that nested workspace example. The viewport-active hook correctly selected the child while it crossed the probe, then returned to the still-visible parent. This was a content hierarchy bug, not a scroll-timing bug.

## Decision

- Give the longread three consecutive, independent top-level sections: `#catalog`, `#workspace`, `#setup`.
- Put **all** general component specimens in the catalog before workspace; put **all nine** workspace/composition specimens inside the new standalone workspace section.
- Preserve `/#workspace`, `/#energy` and other deep links. The former composition specimen is now `#workspace-overview`; the top-level `#workspace` has its own H2 and intro. No new sticky headers or scrolling containers.
- Keep the React state and existing dialogs in the same component. Do not add debounce, artificial delays or incorrect scroll-synchronization workarounds.

## Test oracles

1. DOM structure enforces sibling order and ownership of all general and workspace component IDs.
2. Viewport measurements progress monotonically catalog → workspace → setup; no backwards selection.
3. Existing browser journey scrolls to the last workspace specimen and then to setup, checking actual `aria-current="location"` after each step.
4. The original test demanding return from a nested workspace to catalog was removed because it asserted the very undesired hierarchy.

**Verification boundary:** React/DOM tests and build do not demonstrate real-browser smooth scrolling. A Playwright browser run must be reported separately if unavailable.
