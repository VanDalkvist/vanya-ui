# Vanya Arc / UI — integration of the independent brand

The **sole authoritative** brand source is [vanya-arc-brand](https://github.com/VanDalkvist/vanya-arc-brand).

- [Brandbook](https://github.com/VanDalkvist/vanya-arc-brand/blob/main/docs/brand-guidelines.md), [mark source](https://github.com/VanDalkvist/vanya-arc-brand/blob/main/src/mark.ts), [assets](https://github.com/VanDalkvist/vanya-arc-brand/tree/main/assets), [brand license](https://github.com/VanDalkvist/vanya-arc-brand/blob/main/LICENSING.md).
- Brand architecture: **Vanya Arc** is the parent, **Vanya Arc / UI** is the design-system product, with accented UI only.
- `@vanya/ui` depends on `@vanya/brand`, re-exports `VanyaArcMark`/`VanyaArcLockup`/`VANYA_ARC_MARK_PATH` for compatibility, and imports `@vanya/brand/tokens.css` inside `@vanya/ui/tokens.css`.
- `scripts/sync.ts` copies the favicon from the installed brand package at build time, avoiding an independent editable SVG in the UI repo.
- The live [identity chapter](https://ui.vanya-arc.dev/#identity) is an illustration of the canonical kit, not a competing style guide.
- Mono/light/dark, minimum sizes, colors and SVG details are specified **only** by the brand repository.

```tsx
import { VanyaArcMark, VanyaArcLockup } from "@vanya/ui";
<VanyaArcLockup product="UI" />
<VanyaArcMark label="Vanya Arc" />
```

Existing MIT rights in previously published UI versions are unaffected by the new repository structure.
