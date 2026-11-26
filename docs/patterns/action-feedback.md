# Action feedback: press → processing → result

**Canonical status:** normative implementation contract for all new and changed interactive components in `@vanya/ui`. This is a supplement to [hover/focus/selected](interaction-states.md), not an alternative palette or an automatic toast system. Live demo: [Press / pending / result](https://ui.vanya-arc.dev/#action-feedback). Research, evidence and criticism: [Press Feedback Loop](../research/press-feedback-research-loop-2026-11-22.md).

## Separate three different kinds of feedback

| Moment | User's question | UI obligation | Who owns the truth? |
| --- | --- | --- | --- |
| **Press** (pointer down, keyboard activation) | «Нажал?» | Immediate distinct `:active` feedback, not identical to hover, no layout shift | Library / browser |
| **Pending** (async process) | «Выполняется?» | Visible progress indication; guard duplicate activation; keep focus when possible | Consuming app supplies pending |
| **Result** (success/error) | «Что получилось?» | Show actual changed data, navigation or an explicit outcome/error; do not fabricate success | Consuming app reports outcome |

Source hierarchy: [Apple Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons) explicitly says custom buttons need a press state and a progress indicator when actions do not immediately finish. [Apple responsiveness](https://developer.apple.com/documentation/xcode/understanding-user-interface-responsiveness) connects visible feedback at finger-down with perceived speed. [Atlassian Pressable](https://atlassian.design/components/primitives/pressable/usage) uses separate hovered and pressed states and semantic motion tokens. [Carbon inline loading](https://www.carbondesignsystem.com/building-blocks/core/components/inline-loading/guidelines) documents the loading/result part of long-running actions. [NN/g visibility of system status](https://www.nngroup.com/articles/visibility-system-status/) shows that a click with no visible result creates uncertainty.

### 1. Immediate press

- For `ActionButton`, `ActionLink`, `NavLinks`, `ThemeToggle`, `SegmentedControl`, `FilterSelect`, modal close actions, search clear, icon utilities, timeline/card actions: use the **`--ui-feedback-pressed-fill`** token or a distinct *brief* ink/opacity response when the component has no filled surface. Preserve the neutral hover and accent selected/focus roles.
- Press must work for pointer and touch; do not place it only under `@media(hover:hover)`. `:active` is immediate (`transition-duration:0ms`) and must never change geometry. Keep pointer-up release quiet. Hover-only glow is *not* press feedback.
- Link navigation still uses native `<a href>`. A native click may navigate too quickly for the press to be noticed; the destination is the durable outcome. Never delay navigation with an arbitrary timer just to show a press animation.
- A toggle's `aria-pressed` describes **persistent on/off**; it is *not* an announcement that the pointer is physically down. A menu trigger uses `aria-expanded`. A loading action uses `aria-busy`, *not* `aria-pressed`.
- `prefers-reduced-motion` disables decorative motion. A change in fill, border-independent pressed surface or visible state still works.

### 2. ActionButton controlled async states

```tsx
const [state,setState] = useState<ActionButtonState>("idle");

async function save() {
  if(state==="pending") return;
  setState("pending");
  try {
    await writeChanges(); // real consumer operation
    setState("success");
  } catch (error) {
    setState("error");
  }
}
<ActionButton variant="outline" actionState={state} onClick={save}>
  Сохранить
</ActionButton>
```

`actionState` is optional: `idle | pending | success | error`; `statusLabel` can override the accessible Russian status announcement. The library renders pending spinner, success/check or error indicator; `pending` uses `aria-busy` and `aria-disabled` while **retaining focus** and preventing a repeated onClick. No timers, automatic success or fake network callbacks. If a button remains focused during a pending state, its focused outline persists. Native `disabled` is still available for permanently disabled controls.

Do not display a success check before a response. If a route changes instantly, the new page is sufficient result feedback; if a filter changes a list, update the result count; if a modal opens, the dialog is the result. For async failure, include *specific readable error/context and retry* in the consuming app. The library cannot know the server outcome.

### 3. Genuine input and keyboard semantics

- `CraftCard` is passive without a real `onClick` or when `isInteractive={false}`. With `onClick` and omitted/true `isInteractive`, it exposes a card action and Enter/Space activation. A supplied onKeyDown may cancel the library activation with preventDefault. Nested interactive controls own their clicks; the card action ignores bubbled clicks from them. For content with independent links, buttons or inputs, prefer a passive card with explicit native actions: nested controls inside a role=button can impair accessibility. Caller-supplied role, tabIndex, classes and custom handlers remain the caller's responsibility. [Migration](../versioning.md).
- `DeskSlotCard` uses **one actual overlay native button** to open the card and an *independent* park button; do not make the wrapper `onClick` mouse-only or put a button inside a button.
- `Minimap` exposes a focusable seek `role=slider` with `aria-valuenow`; Home/End/arrow/Page keys must seek just like pointer clicks. The consumer owns the updated position (controlled from/to).
- The same interaction-feedback contract applies to dismissed overlays, search clear, menu items and expressive timeline actions; large motion is not required to acknowledge a press.
- Follow [WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/) and [Radix state exposure](https://www.radix-ui.com/primitives/docs/guides/styling) when exposing persistent selection/open/closed states.

### 4. Verification, not a screenshot illusion

For **each changed action**, test (a) pointer-down/release computed styles, (b) Tab + Space/Enter, (c) correct click count, (d) held pending plus repeated click, (e) actual success/error, (f) mobile touch, (g) focus return/retention, (h) reduced motion and both themes. The automated suite tests DOM, states and source CSS; **real browser screenshots/interactions are a separate requirement**.

For external product consumers pinned to immutable SHA, opt into the updated component version only after local build and interaction review. This policy does **not** initiate dependency updates or GitHub Actions.

For actions with asynchronous feedback, pass `actionState="idle"` from the first render and keep passing the current state. The trailing indicator slot is reserved throughout that lifecycle. Prominent commands balance both sides so the text is centered. Ordinary commands without an explicit `actionState` have no slot. Pending and aria-disabled actions retain focus and do not acquire hover/pressed feedback. Selection stays independent of execution.
