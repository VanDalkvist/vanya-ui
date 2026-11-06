# Hearth & Wave

## Visual authority

The light theme of Vanya's Arc Wave / Синусоида is the reference. The transferable character is open space, quiet peripheral controls, clear type hierarchy and details revealed on request — not a mandatory wave graphic or a checklist of decorative prohibitions.

## Source of truth

- `src/tokens.css`: executable colors, typography families, spacing and overlay elevation for both themes.
- `src/components`: actual reusable primitives, exported through `src/index.ts`.
- `src/showcase`: working composition and live examples; both `/` and `/showcase.html` mount the same React entrypoint.
- `llms.txt`, `public/llms.txt`: generated CSS declarations and public component names (`bun run sync`), not a separate palette or a claim to infer all component signatures.

## Typography and hierarchy

Manrope is the normal interface and display face, including EventCard, TimelinePreviewCard and InspectDrawer headings. Use size, weight, measure and spacing to separate content from controls. Fraunces remains available for intentionally editorial content, such as ReceiptDigestModal narrative prose. JetBrains Mono is for code, measurements and short metadata, not every heading.

## Composition recipes

- Open field: content first, navigation near the edge, no permanent secondary panel.
- Preview: short title and context, with a real button when interactive.
- Detail: a right-hand sheet retaining the page as a subdued backdrop. A directional shadow communicates separation; the edge may also have a hairline.
- Reference: readable grouped examples with descriptions, not a second set of HTML lookalikes.
- Dense working views can use rows and compact spacing; spaciousness does not require hiding primary actions or making text faint.

`--spacing-scene` controls outer clearance; `--spacing-focus` separates focus areas. Use existing warm paper, ink and accent colors rather than introducing a new skin. Borders remain stable on hover; use surface change and subtle elevation where helpful.

## Interaction

Controls must work in the demonstrated composition. Detail sheets use the native modal dialog for focus containment, Escape dismissal and focus return. The page theme control owns persistent theme selection; other demo state is local. Reduced-motion preferences disable nonessential movement. Small visual controls still need adequate hit areas and visible keyboard focus.

## Modes

The opening scene is Experience: the composition is the example. The component reference is Read. Tools consuming the package are Operate: keep task interactions quick, with no decorative page-load sequence. A reference site's longer spatial transitions are not a default for all tools.

## Verification limits

A passing build, detector or unit test does not establish aesthetic acceptance. Inspect the assembled light/dark and narrow-screen views. User approval of the visual result remains separate from technical checks.
