# Quiet Loop — actions and visible affordances

Date: 2026-11-26. Status: research and design recommendation; implementation and visual acceptance pending.

## Question

Can a calm working interface rely on text actions, direct manipulation and contextual controls without persistent button outlines or fills? Which actions require stronger visual cues?

## Public source evidence (reference-only)

| Author / source | Supported observation |
| --- | --- |
| Charlie Aufmann and Maxime Heckel, Linear, [A calmer interface for a product in motion](https://linear.app/now/behind-the-latest-design-refresh), 2026-03-12 | Reduces unnecessary borders, icon treatments and secondary visual weight. Consistent header placement and task-oriented hierarchy are explicit goals. |
| Linear, [Parent and sub-issues](https://linear.app/docs/parent-and-sub-issues), [Assign and delegate issues](https://linear.app/docs/assigning-issues), [Filters](https://linear.app/docs/filters) | Inline Add sub-issues command, direct property selection, contextual action menus and keyboard shortcuts are documented. Main commands and explicit creation flows still exist. |
| Apple, [Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons), [BorderlessButtonStyle](https://developer.apple.com/documentation/swiftui/borderlessbuttonstyle) | Distinguishes style/content/role, supports borderless appearance, requires recognizable actions and press feedback, recommends one or two prominent actions per view. |
| Adobe, [Spectrum action button](https://spectrum.adobe.com/web/swc/components/action-button) | Quiet action buttons support text labels and surface feedback on interaction. |
| Google, [Material TextButton](https://api.flutter.dev/flutter/material/TextButton-class.html) and [Material 1 buttons](https://m1.material.io/components/buttons.html) | Text buttons without permanent containers have a long-standing place in Material. |
| IBM, [Carbon Button](https://www.carbondesignsystem.com/building-blocks/core/components/button/guidelines) and shadcn/ui, [Button](https://ui.shadcn.com/docs/components/base/button) | Ghost appearance is an established lower-emphasis action treatment. |
| Kate Moran, Nielsen Norman Group, [Flat UI Elements Attract Less Attention and Cause Uncertainty](https://www.nngroup.com/articles/flat-ui-less-attention-cause-uncertainty/), 2017-09-03 | 71 participants, nine pairs of web pages; weaker signifiers increased target-finding time by 22% and gaze fixations by 25% on average. Three pairs had similar gaze patterns; whitespace, expected positions and salient targets were recurring factors. This was a target-finding experiment, not an estimate of task-wide productivity or a study of Vanya UI. |
| W3C, [Understanding WCAG 2.2 SC 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast) | Visible boundaries are required for identification only where other visual indicators are insufficient; required visual indicators and states need adequate contrast. |

All external references are for independent commentary. No copied screenshots, components, branding or source code. Official Linear screenshots linked from docs could not be fetched directly in the research environment; no pixel-level audit or live application observation is claimed.

## Proposed Quiet action model

One visual language; placement, semantics and consequence govern the amount of emphasis. Do not add a quiet variant or alternate appearance mode.

1. Eliminate redundant commands first: if a property is safely and reversibly editable in place, expose its value as the control. For immediate preference changes, a clear persistent toggle can replace explicit save. Preserve explicit commit for important, multi-field or irreversible changes; automatic saving must disclose actual persistence and recovery.
2. Routine text commands: transparent resting surface, existing semantic ink, clear verb, predictable action region and existing hover/pressed/focus feedback. No mandatory enclosing shape. Keep native button semantics and target geometry.
3. Contextual commands: place adjacent to the affected content (e.g. Add item, Rename, Reset filters). Less frequent actions may live in an accessible menu with keyboard access; essential actions stay discoverable without hover.
4. Property controls: value and chevron/state cue, native select or existing appropriate control; distinct semantics for binary state and momentary action.
5. Primary commitment: one locally salient action, accent text when context makes it discoverable. A filled action may be used for a high-consequence or otherwise hard-to-find commitment where evidence supports stronger signifiers. This is a semantic emphasis decision within Quiet.
6. Destructive: explicit action label, warning semantics, appropriate confirmation or undo; do not rely on color alone.

## Source implications for implementation

Existing ActionButton already renders a native button and owns pending/success/error presentation via actionState; text is its current default. Audit text/mono/accent/pill/outline for semantic necessity, actual usage and public compatibility. Do not conflate persistent toggled state with operation completion. Reuse ui-feedback-* tokens and existing roles. Preserve keyboard focus and stable hit targets. Navigation remains a native link.

## Acceptance in Quiet Loop

- Build one synthetic workspace showing real routine actions, direct property editing, a persistent toggle and contextual addition. Verify actual resulting values and visible outcomes.
- Show a form or confirmation with an explicit commitment and secondary command. Compare accent-text and filled emphasis only where needed; record rationale for any surface.
- Test first-use discoverability without hover, keyboard focus, touch, long labels, disabled, pending and error recovery; both themes. WCAG compliance is a baseline, and visual usability requires separate observation.
- Record observed results, including any difficulty locating actions; do not conclude borderless works universally from the references alone.
- Existing implementation plan: [Quiet Loop](../superpowers/plans/2026-11-26-quiet-loop.md). No code edits or release in this research step.
