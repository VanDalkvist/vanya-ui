# Vanya Arc / UI — brand integration

The authoritative architecture, palette and lockup renderer live in [vanya-arc-brand](https://github.com/VanDalkvist/vanya-arc-brand). This integration uses the exact [brandbook](https://github.com/VanDalkvist/vanya-arc-brand/blob/70c7a6ff839355a45d11bd9d51a888aeaa4cac43/docs/brand-guidelines.md) and [product identity procedure](https://github.com/VanDalkvist/vanya-arc-brand/blob/70c7a6ff839355a45d11bd9d51a888aeaa4cac43/docs/product-identity.md) at the pinned revision.

**Vanya Arc is an umbrella brand.** The original asymmetric V→A is the approved mark for the parent and Vanya Arc / UI. Each other official service owns an individual wave interpretation whose geometry expresses its purpose, with a matching favicon. Shared stroke character, paper/ink/terracotta palette, Manrope and the `Vanya Arc / Product` wordmark establish the family.

- `@vanya/ui` depends on `@vanya/brand`, re-exports `VanyaArcMark`, `VanyaArcLockup`, `VanyaArcProductMarkProps` and the original path constants. It imports the brand palette via `@vanya/ui/tokens.css`.
- Parent and UI preserve the approved original mark. For every other service, supply the approved product's React mark using `productMark`. Without one, the renderer displays a temporary text-only lockup; product identity is PENDING. Do not ship the parent/UI icon as a service favicon.
- Product-specific SVGs, favicon, semantic rationale and approval live with the product. Preserve existing approved assets outside explicit identity tasks.
- `scripts/sync.ts` copies the UI favicon from the pinned brand package. The [live identity chapter](https://ui.vanya-arc.dev/#identity) shows the original and explains the family architecture. Individual marks are designed in separate product tasks.
- The mark, its [rights](https://github.com/VanDalkvist/vanya-arc-brand/blob/70c7a6ff839355a45d11bd9d51a888aeaa4cac43/LICENSING.md) and source geometry remain in the brand repo; existing MIT rights are unaffected.

```tsx
import { VanyaArcMark, VanyaArcLockup, type VanyaArcProductMarkProps } from "@vanya/ui";
import { ProductMark } from "./identity/ProductMark";
<VanyaArcLockup product="UI" />
<VanyaArcMark label="Vanya Arc" />
<VanyaArcLockup product="Product" productMark={ProductMark} />
```

For a new official service: inspect purpose and approved assets, propose 2–3 meaningful wave directions, get owner approval, save approved source + light/dark/mono SVG + favicon and rationale, then check 16/24/32 px and rendered lockups. In UI-12 record asset paths, meaning, approval and visual evidence; mark missing approval or visual checks honestly. Ordinary unbranded consumers follow their own identity scope. Older package pins require explicit migration before using the new slot.
