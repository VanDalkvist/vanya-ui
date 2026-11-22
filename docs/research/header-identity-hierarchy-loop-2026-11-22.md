# Header hierarchy and author avatar — research loop 02 (2026-11-22)

## Product signal and NMT

User report: the GitHub and theme glyphs in the showcase header look darker than the navigation links to the left. Also asked whether adding an author's portrait alongside “Ваня Афанасов” would help or move attention away from the product.

**Job:** while navigating the design-system docs, people should instantly distinguish (1) product identity, (2) sections to explore and (3) secondary utilities and the author link. The right-side controls must be discoverable and accessible, **not visually louder** than the sections; author attribution should be clear, not misread as a signed-in account or profile switcher.

## Ground truth: source code inspected, not a visual browser claim

- `ShowcaseHeader.tsx`: `VanyaArcLockup` on the left, `NavLinks` with 8 in-page destinations, and three right-side utilities: author `ActionLink`, GitHub icon link, `ThemeToggle`.
- `NavLinks.tsx` and `ActionLink.tsx`: default text uses `text-ink-soft/80` (80% alpha of the semantic muted ink).
- `src/tokens.css`: `.ui-feedback-icon` used plain `var(--ink-soft)` (100% ink). Both GitHub and theme used this class; this **objectively causes a 100%-vs-80% mismatch** before considering glyph density.
- `src/showcase/showcase.css`: GitHub glyph stays 14px in a 32px target, 44px on coarse pointer, theme glyph 14px in 32px; no need to enlarge/reposition or introduce a new color.
- `VanDalkvist/vanya-arc/src/components/timeline/NowQuickLinks.tsx` already uses `/images/avatar/vanya-telegram.jpg` as a link to **the Telegram channel**, not as an account/profile-switching control. Transferring this image to the design system’s author link would introduce a new and inconsistent meaning.
- `VanDalkvist/vanya-arc-brand/src/tokens.css`: light/dark `--ink-soft` differ through semantic theme variables; this should be preserved, not replaced with hard-coded greys.

## External research (reference only; no copied designs)

1. [Apple HIG — Color](https://developer.apple.com/design/human-interface-guidelines/color) and [Branding](https://developer.apple.com/design/human-interface-guidelines/branding): accent should serve a *meaningful priority* rather than make all toolbar controls compete. Apple does **not** require every glyph and text label to be identical in weight.
2. [Apple — SF Symbols](https://developer.apple.com/design/human-interface-guidelines/sf-symbols): outline glyphs can suit toolbars, whereas filled variants read more prominent; preserve outline family and alignment.
3. [Carbon — UI shell header specifications](https://www.carbondesignsystem.com/building-blocks/core/components/ui-shell-header/specifications): header actions distinguish primary/secondary icon color roles and hover-state backgrounds.
4. [Atlassian — Design tokens](https://atlassian.design/components/tokens/): semantic `color.icon.*` tiers correspond to `color.text.*` tiers (including subtlest); use role-specific tokens instead of independently styling each utility.
5. [Atlassian — Avatar](https://atlassian.design/components/avatar): avatars communicate a person or entity, especially people lists and account surfaces. An avatar isn't inherently mandatory for author attribution.
6. [NN/g — Utility Navigation](https://www.nngroup.com/articles/utility-navigation/): top-right header affordances are usually secondary utilities distinct from primary content navigation.
7. [NN/g — Visual Hierarchy](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/): scale, contrast and grouping determine what attracts attention; evaluate whole-header hierarchy, not an icon in isolation.

These are grounded patterns and **our own design inference**, not universal standards saying “never use an avatar”.

## Option storm and critical cycle

| Alternative | Helps | Harms | Decision |
| --- | --- | --- | --- |
| A. Add portrait plus author name to the header | Makes the person immediately recognizable, humanizes an otherwise technical UI | Adds a prominent high-frequency texture/color, second identity anchor alongside `Vanya Arc / UI`, suggests profile/account utility; tightens 1150px/mobile layout | **Reject for this product header.** Better on an explicit About/credits or personal-site landing page |
| B. Portrait only, no text | Compact on small screens | Opaque destination, indistinguishable from sign-in account avatar; contradicts meaningful author-link label | Reject |
| C. Keep the author text link, dim the icon group to match its text tier | Fixes exact reported contrast mismatch, preserves visual structure and one clear product identity | Must verify touch/focus/expanded states remain distinguishable | **Choose** |
| D. Darken all text links to match existing icons | Uniform technically, improves text contrast | Elevates 8 primary nav links plus the author; likely increases header noise and doesn't honor concern about right-side priority | Reject without a measured contrast failure |
| E. Individually reduce icon sizes / stroke widths | Could optically soften glyphs | Existing 14px is already small; smaller symbols risk recognition and diverge from source-site GitHub glyph | Reject |

## Chosen change — token, not a screenshot-specific opacity

`ui-feedback-icon` accepts an **optional local ink token**: `--ui-feedback-icon-ink`, defaulting to `var(--ink-soft)` for all existing consumers (backwards-compatible).

The showcase utility group sets this custom property to `color-mix(in oklab, var(--ink-soft) 80%, transparent)`, matching the built-in `text-ink-soft/80` of `NavLinks` and `ActionLink`. This is the *same tier*, not a new arbitrary grey. Theme open/selected still uses accent, and pointer hover still increases to `var(--ink)`; focus and pressed are unchanged. The body remains readable in light/dark mode, while the default icon glyph no longer wins attention through extra darkness.

No new avatar added. The personal-site anchor keeps `rel="author"`, a text label and outbound arrow; it's not a user/account control. This does **not** prohibit `AvatarLink` in member directories or an optional “About the author” presentation elsewhere.

## Acceptance evidence

- Source/DOM tests: both icon utilities use `ui-feedback-icon`; single shared ink override is scoped to `.showcase-nav`; author remains a real link with visible name, not an image-only trigger; GitHub remains 14px/32px and theme 14px/32px; tab/focus/expanded state preserved.
- Full package checks + Cloudflare build/deploy on exact SHA.
- **Not yet demonstrated**: browser screenshots and color sampling in both themes at 1440, 1150, 700, 390 px and 200% zoom; compare perceived darkness, actual text contrast against translucent blur, visual focus and cursor hover. Do not claim visual parity from unit tests alone.

**Stop criterion:** no decorative additions until the lower-priority utilities cease to dominate section labels. If perception still differs after role-color parity, test glyph stroke *optically* in a screenshot rather than blindly lowering contrast further.
