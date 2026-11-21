# Vanya Arc — brand identity and product lockups

**Approved direction, 21 November 2026.** The mark follows the user's selected original reference screenshot, rather than a newly imagined sine curve. The repository and published site are public, so use only synthetic examples.

## Brand architecture

**Vanya Arc** is the parent brand. Its sign, name, wordmark construction and semantic colors are shared by its products.

**Vanya Arc / UI** is the design-system product. **UI is accented**, while the slash is a secondary separator. The parent name is always “Vanya Arc”, not “Vanya-Arc”, and neither its V nor A is colored separately: the initial-letter connection is already represented by the sign. The public package name stays `@vanya/ui`, the repository stays `vanya-ui`, and the website stays `ui.vanya-arc.dev`.

Future products may keep this parent lockup and replace the product suffix without redrawing the mark.

## Exact mark — a continuous V → A gesture

The owner's original screenshot shows a short **dark** crest and small valley on the left, then a much higher **warm** crest on the right, with one unbroken stroke fading naturally from ink to terracotta. This asymmetry is the identity; do **not** replace it with a standard sinusoid, a single arc, intersecting initials, a symmetrical monogram, or two disconnected shapes.

Authoritative protected brand artwork: `src/brand/VanyaArcArtwork.ts`, constant `VANYA_ARC_MARK_PATH`, reused by the MIT-licensed renderer `src/components/VanyaArcMark.tsx`. The mark is included for use as an official project identifier; see [BRAND.md](../../BRAND.md).

SVG viewBox: `75 115 540 235`; stroke width 29; rounded ends and joins. The color transition occurs *after the first valley*, around 38–60% of the width; it is not a sharp 50/50 split.

## Wordmark / typography

- Use **Manrope** for the custom logo lettering, with weight 600, tight optical tracking around `-0.048em`, and consistent capitalization `Vanya Arc`.
- Preserve ordinary Manrope for UI controls and document text: bespoke **wordmark treatment** is not a mandate to change the whole product typography or bundle font files.
- Product suffix `/ UI`: slash uses `--ink-soft`, UI uses `--accent` and Manrope weight 700; product is clearly visible on the design-system site.
- Do not separately accent the V and A letters, as that creates competing signals with the already two-color mark.
- Apple typography guidelines inform the separation of expressive identity from functional UI; do not package, copy or use proprietary Apple SF Pro for this brand.

## Colors and themes

Only semantic colors already in `src/tokens.css`:

| Role | Token | Meaning |
| --- | --- | --- |
| Background | `--ground` | Warm paper (light) or charcoal (dark) |
| First crest and parent wordmark | `--ink` | Deep ink in light mode, light linen in dark |
| Second crest and product UI | `--accent` | Current Vanya UI terracotta; brighter in dark |
| Slash and small explanations | `--ink-soft` | Secondary readable ink |

No blue, teal, purple, burgundy, new gradient colors, drop shadows or decorative dots. `monochrome` uses the single ink color for all parts.

## How to use

```tsx
import { VanyaArcMark, VanyaArcLockup } from "@vanya/ui";

<VanyaArcLockup />                         // Parent: Vanya Arc
<VanyaArcLockup product="UI" />            // Product: Vanya Arc / UI
<VanyaArcLockup product="UI" size="sm" />  // Compact navigation
<VanyaArcLockup product="UI" monochrome />// Print or one-color usage
<VanyaArcMark label="Vanya Arc" />         // Accessible stand-alone mark
```

The standalone mark is decorative by default within a lockup. The full lockup exposes one accessible label, avoiding duplicate SVG announcements. Keep the SVG aspect ratio, stroke weight, and a clear perimeter around the mark. If the full mark cannot fit or read at a small size, use the standalone mark instead. Check minimum sizes visually rather than shrinking text below legibility.

## Shortcut-key typography within the identity

Hotkeys are **interaction notation**, not another logo. Use the same `--font-mono` (JetBrains Mono) as code labels, while their explanatory text remains in Manrope. The flat `Kbd` and `ShortcutKeys` primitives inherit the brand's paper, ink and terracotta tokens. Use neutral keycaps, no brand-like gradients or embossed shadows. A small `?` control may open a discoverable help sheet without competing with the Vanya Arc / UI lockup.

The full keyboard contract (bindings, accessibility, opt-out, key conflicts and sequence styles) is [docs/patterns/keyboard-shortcuts.md](../patterns/keyboard-shortcuts.md).

## Separate typography and editorial copy

Logo-only optical letter spacing is not applied to body text. Use shared [typography roles](../patterns/typography.md). UI labels follow the [editorial policy](../patterns/writing-and-editorial.md) with author attribution to the original Sarycheva/Arkhipov skills.

## Licensing and use

The source code of the React logo renderer is MIT, but the mark and wordmark are brand identifiers and have separately stated rules in [BRAND.md](../../BRAND.md). Using a public component does not grant the right to represent an unrelated application as an official Vanya Arc product. For accurate references, reviews and copies of the unmodified official project, consult BRAND.md. Past MIT releases remain governed by their original terms. Do not label the symbol a registered trademark unless registration has been confirmed.

## Website and quality checks

- Main header uses the real `VanyaArcLockup product="UI"`, linked via native `href`.
- The [identity chapter](https://ui.vanya-arc.dev/#identity) is a section of the *same* longread, not a standalone page.
- Verify desktop/mobile, dark/light/mono, keyboard focus, browser Back/Forward, and direct anchor access.
- Static icon `/vanya-arc-mark.svg` uses the identical approved path and a fixed light-color fallback. The React component is the source of truth for theme-aware appearances.
- Avoid exposing private project records, credentials, connected app details, or private infrastructure in this public repo.

References: [Apple Typography HIG](https://developer.apple.com/design/human-interface-guidelines/typography) (general inspiration), [design authority](../../DESIGN.md), [navigation](../patterns/browser-navigation.md), [publication safety](../patterns/publication-safety.md).
