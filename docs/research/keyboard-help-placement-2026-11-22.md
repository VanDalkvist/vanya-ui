# Keyboard help placement — Vanya UI (22 November 2026)

**Question.** The showcase had a `?` keycap in the top navigation, which competed with useful destination links. It also lacked a concise GitHub source icon. Existing shortcut support already works: `?`, `G → section`, accessible `InspectDrawer`, opt-out, input/IME and browser-modifier guards.

## Source-grounded references

- [Linear, Keyboard shortcuts help](https://linear.app/changelog/2021-03-25-keyboard-shortcuts-help) — `?` opens searchable shortcut help; Help & Feedback in the sidebar offers a pointer path. Strong precedent for a secondary utility, not a primary navigation tab.
- [Figma, Use Figma products with a keyboard](https://help.figma.com/hc/en-us/articles/360040328653-Use-Figma-products-with-a-keyboard) — bottom-right Help & resources → Keyboard shortcuts; actions menu is another route. A corner utility is more discoverable than an unexplained keycap.
- [Notion, Using slash commands](https://www.notion.com/en-gb/help/guides/using-slash-commands) — bottom-right question-mark menu → Keyboard shortcuts.
- [GitHub, Keyboard shortcuts](https://docs.github.com/en/get-started/accessibility/keyboard-shortcuts) — context-sensitive `?` help, command palette, and an option to disable character-only shortcuts.
- [WCAG 2.2 Understanding SC 2.1.4](https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html) — a non-modifier printable-character shortcut must be disableable, remappable or active only on focus; this is an accessibility requirement.

## Decision for the showcase

1. A single real GitHub `<a>` with a restrained Lucide symbol is shown in the header utility area alongside the theme toggle. Preserve the full footer source link. Use `aria-label`, native new-tab behavior and visible keyboard focus.
2. **Keyboard help belongs in the bottom-right corner** as a quiet button with keyboard icon, desktop text “Клавиши” and `?` hint, mobile 44px icon-only with the same accessible label. This follows Figma/Notion and is easy to reach with the right hand.
3. No automatic pop-up, toast or second panel. The button opens the existing `InspectDrawer`; `?` remains a shortcut if character shortcuts are enabled, and the button remains even when they are disabled.
4. Footer bottom padding and safe-area offsets keep the button away from the browser edge; inspect actual overlays and zoom before calling the visual result verified.

## Limits and applicability

This is a **showcase placement**, not a mandatory `HelpFloatingButton` design-system component. On apps with a sidebar, put Help in the utility section; in an editor with busy bottom-right controls, choose a help menu elsewhere. Never cover primary commands or make the keyboard the only access path. Run a real visual review on desktop, mobile, 200% zoom and dark/light before claiming visual QA.

## Updated decision — 2026-11-22: remove floating entry

A user screenshot showed that the bottom-right keyboard help dock was an oversized bordered rectangle **covering the first-screen “Расстояние между событиями” slider**. A persistent low-frequency utility must not cover the scene's primary control.

**Decision:** remove floating button, its CSS and the special footer padding. Do not replace it with a topbar `?` icon. Keep `?` and the existing `InspectDrawer`. The existing «Принципы → Клавиши» section gets an in-context “Настроить горячие клавиши” button, so mouse/touch/keyboard users can reopen settings even after opting out of shortcuts. No floating or automatic popups.

This supersedes the original placement decision above, retained for research history. Acceptance: no `.showcase-shortcut-dock` DOM/CSS; slider remains accessible; `?` works when enabled; contextual control works even when shortcuts are disabled. Source tests do not establish pixel-level visual QA.
