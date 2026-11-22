# Author identity, source links and icon actions — 2026-11-22

## Problem and provenance

Vanya UI is a design-system product at `ui.vanya-arc.dev`, while `vanya-arc.dev` is the **author's personal site**, not a section of the design-system navigation. The showcase had a muted, underlined raw hostname in the primary navigation and hid it below 1150px. The repository link used a filled one-off SVG, different from the legacy Lucide outline `Github` icon already used in the author's `VanDalkvist/vanya-arc` source (`src/components/timeline/NowQuickLinks.tsx`, pinned `lucide-react ^0.575.0`). Current Vanya UI lucide-react no longer exports that legacy glyph.

## Source review

- [NN/g — Better Link Labels](https://www.nngroup.com/articles/better-link-labels/): meaningful, self-contained link labels communicate destinations better than vague generic labels. **Application:** personal name identifies the author; hostname alone does not communicate purpose.
- [NN/g — Beyond Blue Links](https://www.nngroup.com/articles/clickable-elements/): clickable affordances should be recognizable and consistent. **Application:** utility text uses the same `ActionLink` type scale/hover/focus, not a standalone underlined style.
- [Atlassian Design — Anchor usage](https://atlassian.design/components/primitives/anchor/usage): links inside obvious navigation can omit an underline; navigation should use real anchors. **Application:** author/source links are true `<a href>`, never button actions.
- [Atlassian — Link icon button](https://atlassian.design/components/button/link-icon-button/usage): icon-only navigation should use recognizable glyphs and real link behavior. **Application:** GitHub is recognizable as a standalone source link, with descriptive accessible name.
- [HTML Living Standard — rel=author](https://html.spec.whatwg.org/dev/links.html): `author` identifies information about an author. **Application:** the personal site gets `rel="author"` in the real anchor; new-tab security tokens are appended by `ActionLink`.
- [GOV.UK — Links](https://design-system.service.gov.uk/styles/links/): indicate when navigating to another site/new tab and give meaningful text; hidden text can clarify a new tab. **Application:** a semantic accessible label and a subtle arrow indicate the author's personal domain.
- [Lucide / Feather license](https://lucide.dev/license): source of the legacy 24x24 Github outline (current-color, 2px stroke). **Application:** vendor the one original icon geometry as independent `GitHubIcon`, preserving existing ISC/Feather MIT attribution in `THIRD_PARTY_NOTICES.md`, not adding another icon dependency.

These sources are **references and independently reasoned design decisions**, not copied third-party design layouts.

## Decision

The actual header has three distinct layers:

1. **Vanya Arc / UI** logo → current site root (brand/product identity).
2. **Composition, identity, typography, writing, etc.** → primary in-site sections with native fragment links.
3. **Author: Vanya Afanasov ↗**, **GitHub glyph**, **theme toggle** → compact utilities on the far right.

The personal link's visible label is `Ваня Афанасов` above 1150px and `Автор` at smaller widths, without being hidden. Its accessible name contains both the role and the full name, the destination and new-tab behavior. Use `ActionLink variant="text"`, an inline arrow, `rel=author`, not a new `AuthorLink` component. Do not implement a fake back button, duplicate product logo, separate visible hostname or ornamental card.

The GitHub repository gets its own **exported SVG icon component** because this particular glyph stopped shipping in newer Lucide versions while a pinned consumer still uses the older outline. The component is only a graphic; link semantics, destination and accessible names belong to the caller. Unlike `GitHubIcon`, product-specific routes and author identities are **not** baked into the library.

## Acceptance

Check that the header shows the author link at 1440, 1150, 1024, 390 and 320px (including 200% zoom), alongside GitHub and theme. At narrow widths the nav may scroll horizontally, but utility links must never disappear. Verify keyboard focus and non-jumping shared header, light/dark, icon silhouette vs the source site, native Cmd/Ctrl-click, new-tab security and an accurate `rel=author` link. Static/unit tests cannot replace real screenshot/browser evidence.
