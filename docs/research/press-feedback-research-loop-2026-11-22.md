# Press Feedback Research Loop 01 — 2026-11-22

## 0. Product failure / NMT

Observed complaint: «Я нажимаю кнопку и вообще не вижу реакции». The prior hover cycle deliberately made borders stable and hover quieter. But by turning down hover without providing *distinct press and result states*, the interface now had a missing causal link between input and visible output.

**Job-to-be-done:** When I press an action, I need to know immediately it registered, whether the system is doing work, and what actually changed — without rereading a dashboard, guessing whether to click again or watching a decorative animation.

**Anti-job:** Do not celebrate an action before it succeeds; do not fake a 300ms animation as a substitute for a real status; do not use focus/hover as the only press confirmation.

## 1. Source research (primary references, reference-only)

| Source | Grounded finding | Implication (our independent inference) |
| --- | --- | --- |
| [Apple HIG — Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons) | Always include press state for custom buttons; activity indicator for actions that don't finish immediately | Base press + optional controlled pending |
| [Apple — Understanding UI responsiveness](https://developer.apple.com/documentation/xcode/understanding-user-interface-responsiveness) | The finger's touch should cause a visible pressed response to preserve a causal sense of speed | Press should start on down, not only after promise resolution |
| [Apple HIG — Feedback](https://developer.apple.com/design/human-interface-guidelines/feedback) | Status feedback can communicate action, outcome; overly long animations can monopolize attention | Quiet and meaningful feedback over celebratory motion |
| [Atlassian Pressable](https://atlassian.design/components/primitives/pressable/usage) and [design tokens](https://atlassian.design/components/tokens/) | Distinct `:hover` and `:active` states and semantic motion tokens (`motion.button.pressed`) | Give press its own color/duration; no haphazard local timing |
| [Carbon — Inline loading](https://www.carbondesignsystem.com/building-blocks/core/components/inline-loading/guidelines) | Loading is shown at the action while operation is in progress and may prevent duplicate interaction | Don't leave a long-running click silent |
| [Radix — Styling](https://www.radix-ui.com/primitives/docs/guides/styling) and [Toggle](https://www.radix-ui.com/primitives/docs/components/toggle) | Stateful components expose `data-state`/pressed/selection for styling; toggle state is durable | Separate stateful selection from momentary CSS press |
| [NN/g — Button states](https://www.nngroup.com/articles/button-states-communicate-interaction/) | Click feedback prevents uncertainty; pressed should be distinct, subtle, fast | Avoid `:active` matching hover |
| [NN/g — Visibility of system status](https://www.nngroup.com/articles/visibility-system-status/) | Users can wonder if a page is loading when clicking causes no visible change | The **outcome** must be visible even when down/up is too fast |
| [WAI-ARIA — Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/) | Enter/Space activate buttons; `aria-pressed` belongs to toggle buttons | Native buttons for controls; explicit keyboard handling for custom roles |

References are source links, **not copied UI assets or a claim of endorsement**. Design values, code and analysis are original.

## 2. Existing code inventory (from current repository, not a browser claim)

| Surface | Before audit | Failure | Decision |
| --- | --- | --- | --- |
| `ActionButton text/mono/accent` | Generic `:active` turned ink dark, often same as hover | Press indistinguishable | Immediate opacity change on press |
| `ActionButton pill/outline` | Pressed fill existed, but no persisted action lifecycle | A fast click looks silent after release | Preserve press fill + opt-in pending/result |
| `ActionLink` / `NavLinks` | Navigation had hover and selected focus, weak or absent distinct pressed | Links may appear inert until navigation | Distinct transient opacity on press; native href and destination |
| `ThemeToggle` | Open/selected change exists; icon uses feedback role | Reliable persistent open, small press response | Keep state; accent selected, pressed neutral |
| `SegmentedControl` | Selected persists; press fill already exists | Selected confused with momentary actuation if treated as same | Keep aria-selected/aria-pressed and instant feedback separately |
| `FilterSelect` | Trigger has hover and expanded, no distinct click-down fill; options mouse-only DOM but keyboard listbox logic exists | Click and menu feel delayed | Pressed background; retain expanded/selected and keyboard control |
| `SearchField` clear | Hover only | Clear click no immediate feedback | :active fill + disappearance is result |
| `MediaCard`, `LinkChip`, breadcrumb links | Hover only or partial pressed roles | Thin links show almost no down response | Press opacity/filter, real destinations |
| `InspectDrawer`, `ReceiptDigestModal` close | Hover-only close icons, weak focus on receipt | Click may look inert before dismissal | Shared icon role with pressed/focus |
| `DisclosurePill` | Native details, feedback row | Open/closed is durable | Preserve native semantics and pressed role |
| `CraftCard` | `isInteractive` could show cursor/hover *without* an onClick | False affordance; no real action | Only mark actionable when onClick exists; keyboard activation |
| `DeskSlotCard` | Whole div reacts to pointer; nested title/park buttons | Inconsistent keyboard affordance and nested actions | Native full-card button overlay plus independent park button |
| `Minimap` | Pointer `onClick`, no keyboard role | Inaccessible seeking, no explicit active state | Slider semantics + keyboard mapping + pressed window |
| `EventPoint`, `TimelineEvent`, `TimelinePreviewCard` | Rich hover/lift; no distinct down interaction | Press still looks like hover | Momentary press compression and restored lift; no synthetic result |
| `OfferCard` | ActionButton + `isActive` controlled by consumer | No local success promised | Let consumer update `isActive`; action gets pressed feedback |
| `RangeSlider`, native `SelectField` | Browser-native response | No proven absence of feedback | Preserve native states; don't replace with custom animated controls |

**Scope limit:** Static source inspection finds high-confidence missing states, not an exhaustive visual QA of every rendered consumer. Product-specific handlers may still fail to show results even if the Vanya UI primitive now acknowledges press.

## 3. Brainstorm and critical rejection

1. **Grow every button 1.02x / click ripple everywhere.** Immediate but mechanical, distracts dense workflows, uses motion to compensate for missing semantics. Reject as global policy.
2. **Only add `:active` everywhere.** Cheap, but press ends as soon as user releases; a 70ms click gives no lasting result. Keep *only as the instant layer*, not complete solution.
3. **Automatically show “Готово” after any onClick.** False information for rejected writes and async failures; undermines trust. Reject.
4. **Uniform press + caller-controlled pending/success/error + native semantics.** Distinct states, less visual noise, truthful async work, works on keyboard/touch. **Selected.**
5. **Make a global toast for every button click.** Duplicates navigation/selection feedback, shifts attention, collides with user's stable-layout principle. Reject; context should show results in-place.

## 4. Implementation design

- Shared CSS state tokens in `src/tokens.css` distinguish neutral hover, pressed fill/opacity, focus outline and persistent selected. Press transition instant, no geometry changes, no extra shadows.
- `ActionButton` optionally accepts `actionState="idle|pending|success|error"` and `statusLabel`. The **consumer** controls it; pending uses `aria-busy`/`aria-disabled`, keeps focus, suppresses duplicate onClick. Success/error icons are truthful only when supplied by caller. No timers.
- `CraftCard` removes false cursor where not clickable, and supports Enter/Space when it is clickable. `DeskSlotCard` exposes actual native button for card and separate park action, not mouse-only root div. `Minimap` exposes keyboard seek. Close, search, links and narrative controls get immediate state.
- [Live component demo](https://ui.vanya-arc.dev/#action-feedback) demonstrates idle → pending → explicit success/error; buttons controlling the outcome are clearly labeled *test controls*, not fake network calls. [Normative contract](../patterns/action-feedback.md).

## 5. Acceptance and what evidence is still missing

Automated unit/DOM/source checks should cover a button's click count, pending duplicate suppression, results, disabled, tab/keyboard, native card actions, slider seek and presence of pressed roles. Cloudflare Worker build should be checked against exact SHA. Browser acceptance still needs **real** down/up, fast click, long click, mouse/touch, 390px/1440px, light/dark, 200% zoom, keyboard focus and reduced motion. Passing source tests **is not** proof that every animation feels right.

## 6. Open risks / next product-level decisions

- A generic UI package **cannot** infer whether a consumer's API call truly completed; consuming projects must supply state changes, errors and retry. This is a task for each product's flow audit, not a global toast library.
- `CraftCard` uses a keyboard-accessible role-button div to preserve HTML API; if cards contain nested links/controls, switch that usage to independent native actions. Consider a future explicit CardAction primitive only if several products need it.
- `Minimap` value semantics use the center of the visible from/to window; consumer must update the controlled range on seek.
- Core changes remain in `main` as an **unreleased** source version; dependent apps are pinned to their existing SHA and should not auto-update.
