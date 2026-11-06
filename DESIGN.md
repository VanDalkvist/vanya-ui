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

- Open field: content first, navigation near the edge, no permanent secondary panel. The approved scene keeps its existing layout and now uses the exported static SineWave as a quiet background.
- Preview: short title and context, with a real button when interactive.
- Detail: a right-hand sheet retaining the page as a subdued backdrop. A directional shadow communicates separation; the edge may also have a hairline.
- Reference: one named row per public component, with that component's states and variants together; never a second set of HTML lookalikes.
- Harness identity: CategoryBadge and both radar examples use Farm's Sparkles / HeartHandshake / Briefcase / Cpu and its exact light/dark harness palette. The package owns a small shared definition, with no runtime dependency on the Farm application.
- Dense working views can use rows and compact spacing; spaciousness does not require hiding primary actions or making text faint.

`--spacing-scene` controls outer clearance; `--spacing-focus` separates focus areas. Use existing warm paper, ink and accent colors rather than introducing a new skin. Borders remain stable on hover; use surface change and subtle elevation where helpful.

## Inline size grid

`ComponentSize` is `sm | md`. CategoryBadge, Tag, MeshStatusBadge, ActionButton, Kbd, LinkChip, AvatarLink and SegmentedControl share the `.ui-size` foundation in `src/tokens.css`. Its `--size-{sm,md}-*` tokens control outer height, font, line height, inline padding, gap and icon size; avatars use the outer height as their width. Segmented controls fit their buttons inside the same outer height rather than adding a second size scale. Text-only actions keep their unboxed horizontal spacing.

Canonical heights are 24px and 32px. SegmentedControl still accepts `xs` as a legacy alias for canonical `sm`; callers wanting its larger appearance should use `md`. Size names, not old incidental padding values, are the stable convention. Explicit consumer classes/styles may override the foundation.

## Interaction

Controls must work in the demonstrated composition. Detail sheets use the native modal dialog for focus containment, Escape dismissal and focus return. The page theme controls share persistent theme selection, synchronized between the sticky header and their own catalogue row; other demo state is local. Reduced-motion preferences disable nonessential movement. Small visual controls still need adequate hit areas and visible keyboard focus.

## Modes

The opening scene is Experience: the composition is the example. The component reference is Read. Tools consuming the package are Operate: keep task interactions quick, with no decorative page-load sequence. A reference site's longer spatial transitions are not a default for all tools.

## Verification limits

A passing build, detector or unit test does not establish aesthetic acceptance. Inspect the assembled light/dark and narrow-screen views. User approval of the visual result remains separate from technical checks.
