# Composition patterns: workspaces, filters, and compact headers

A reusable UI assembly guide for applications that users revisit and operate, rather than promotional landing pages. These are composition principles on top of existing Vanya UI tokens and primitives, **not** a new visual theme.

## 1. Put the job before the introduction

Use a compact **workspace header**: 1 short title and, optionally, a small contextual count. The first actionable result or form control should begin near the top of the page.

Avoid oversized, repeated titles, hero paragraphs, and duplicate section headings in frequently used tools. A landing-page hero does not become a good dashboard header simply because it uses the right typeface.

## 2. Separate navigation from filtering

- `NavLinks` names **primary destinations**, not every available capability. Aim for few stable destinations.
- `SegmentedControl semantics="filters"` changes the **subset** within the current context, e.g., All / Mine / Shared. As a filter, it exposes a labeled `group` of pressed buttons to assistive technology.
- `SegmentedControl semantics="tabs"` (default for backwards compatibility) represents actual tab navigation and exposes a `tablist`.
- `Tag` is useful for small, immediately visible participant or category selections; convey pressed state and result count.
- Prefer one common search input that searches the whole underlying collection, not a silently narrower derived subset.

If a user must change sections just to complete an ordinary `find → select → compare` loop, the composition likely needs to change.

## 3. Sticky elements must earn their pixels

- Desktop: one compact persistent main header; optionally a **single contextual filter row** directly below, only if it truly helps in long lists.
- Mobile: avoid stacking sticky global chrome and sticky filters when they compete with the content. Let the task filter strip scroll away if necessary.
- Use a single document scroll; avoid nested vertical scroll areas by default.
- Avoid hiding the first actionable item under sticky surfaces when using focus navigation or anchored links.
- Use semantic DOM reading order matching visual order.

References: [NN/g Sticky Headers](https://www.nngroup.com/articles/sticky-headers/), [NN/g Scrolling and Attention](https://www.nngroup.com/articles/scrolling-and-attention/).

## 4. Keep actions next to the thing they affect

- Use `ActionButton` for quick, frequent decisions beside the item.
- Use `InspectDrawer` for rich details and optional advanced editing; don't force the drawer open for the primary one-click action.
- Use `CraftCard` for meaningful task surfaces/settings, not to wrap every line of text.
- Keep owner/administrator tools secondary unless administration itself is the current task.
- An empty result should suggest the nearest useful action, not blindly navigate to another page.
- Provide alternate candidate content if the primary filter yields no hits, when safe and meaningful.

References: [NN/g Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/), [NN/g User Intent Affects Filter Design](https://www.nngroup.com/articles/applying-filters/).

## 5. Maintain one source of visual truth

Use Vanya UI's own `tokens.css` and real exported React components. Local app CSS should define *layout and domain composition*, not duplicate the components and colors from the design system.

`--ground`, `--surface`, `--ink`, `--ink-soft`, `--ink-faint`, `--accent`, and `--border` are semantic tokens; avoid hardcoding theme palettes.

## Acceptance checklist

- Can a first-time user identify the primary task without reading a long description?
- Does the first screen contain an actionable item or primary input on common laptop/mobile viewports?
- Can the user complete the most frequent loop without page round-trips?
- Are all filters labeled, visually selected, keyboard accessible and announced correctly (group vs. tabs)?
- Does search work across the expected collection with clear scope?
- Is there a useful path out of empty and no-match states?
- Are touch targets comfortable, focus visible and reduced-motion respected?
- Is there one document scroll and no stuck content beneath the header?

These are guidance and design QA checks, not a universal pixel-perfect template.
