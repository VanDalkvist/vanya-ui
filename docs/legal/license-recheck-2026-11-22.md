# License recheck — Vanya Arc / UI

**Rechecked:** 22 November 2026. Sources: public `VanDalkvist/vanya-ui` and the exact installed `@vanya/brand` commit `6c6a3d2d1b25e212817c354b2ee76163c4a64fab`, live deployment `ui.vanya-arc.dev`, upstream original license texts. This is a review of declared grants, explicitly referenced third-party materials and bundled dependency notices, **not legal advice or a guarantee against claims**.

## Current rights matrix

| Area | Verified evidence | Assessment |
| --- | --- | --- |
| Original reusable code | Root `LICENSE`; `LICENSING.md`; `src/index.ts`; `package.json` | **MIT**, including component and pipeline implementations, with MIT notice obligations on redistribution |
| Research | `REUSE.toml` and SPDX headers on **five** `docs/research/*.md` files; `LICENSES/CC-BY-4.0.txt` | **CC BY 4.0** only for independently owned expression; external citations are not relicensed; author/license/source/change notices needed on adaptations |
| UI package metadata | `license: SEE LICENSE IN LICENSING.md` | Accurate expression of mixed scope under npm's package metadata conventions |
| Canonical brand renderers | Pinned `@vanya/brand` `src/VanyaArcMark.tsx`, `src/VanyaArcLockup.tsx`, `LICENSING.md` | **MIT code** but it imports/exports separately licensed mark geometry |
| Mark artwork | Pinned `src/mark.ts`, `assets/*.svg`, `LICENSES/LicenseRef-VanyaArc-Brand.txt` | **Limited-use custom terms**; not MIT. Earlier grants on historically MIT-distributed copies cannot be withdrawn |
| Bundled JS | Live `/licenses.txt` previously contained `@vanya/brand` root MIT notice **without the separately licensed mark notice** | **Concrete presentation defect:** new post-build check appends the pinned exact artwork terms and warns that dependency-code notices are not a whole-site license |
| Lucide/Feather | Upstream Lucide license and full `THIRD_PARTY_NOTICES.md`; live `licenses.txt` contains Lucide ISC and Feather MIT/Cole Bemis notices | Both attribution/notice obligations are represented; build guard will reject absence |
| React, React DOM, clsx, tailwind-merge | Source dependency list and live generated notices | MIT; notices retained for distributed client bundle |
| Manrope, Fraunces, JetBrains Mono | Site loads Google Fonts; no font binary committed to this repository; upstream font sources in curated notices | OFL 1.1 references provided. If self-hosting or redistributing actual font files later, verify/ship relevant notices |
| Editor skills | Original `N1arko/redaktura-skills/LICENSE`: CC BY 4.0, named authors; `.agents/redpolitika.md` and editorial guide contain links and product-specific guidance | Upstream skills are **linked, not vendored**. Do not imply that a book citation is licensed to copy |
| Third-party guidelines and books | Source-policy links to Apple HIG, W3C, book by Ильяхов/Сарычева, Carbon and others | **Reference-only** without an independently verified license/permission. No blanket copying grant established |

## What was fixed in this recheck

1. Publish `/reference/brand-artwork-license.txt` verbatim from the *installed, pinned* `@vanya/brand` package, without duplicating the terms manually.
2. Keep Vite's normal `/licenses.txt` inventory, prepend a clear **mixed-license warning**, append the precise artwork license and a link to the pinned source. Script fails if the generated Lucide/Feather notice, pinned brand license or public artwork copy is absent or stale.
3. Link the custom artwork notice from `LICENSING.md`, `THIRD_PARTY_NOTICES.md`, `llms.txt`, the website Markdown and sitemap. Clarify that generated dependency notices are **not** the legal scope of every asset.
4. Add reproducible tests for exact terms, idempotence, missing Feather/MIT notices and floating dependencies. Preserve old audit documents as historical snapshots, correcting their outdated counts and package/license descriptions via visible prefaces.

## Unresolved verification limits

- **Artwork originality and ownership:** the mark's geometry and any AI-assisted provenance have not been independently established. Separate copyright/originality and trademark clearance by market remains necessary; no registration is claimed. The custom notice applies only to rights actually held.
- **Historical contributors:** external code or design fragments moved from other projects could have co-author rights that license scans cannot prove. Verify provenance when copying or relicensing those specific contributions.
- **Dependency completeness:** Vite's inventory covers the client bundles; it is **not** a full audit of every transitive package, build tool or optional consumer dependency. Re-run review after substantial dependency changes.
- **Research and upstream expression:** links and our own commentary are visible, but this review is **not** a line-by-line similarity or plagiarism analysis of all text, screenshots or historical commits.
- **REUSE:** `REUSE.toml` marks special scopes but **full-repository REUSE compliance is not asserted**; a full lint pass and coverage of all applicable files would be a separate task.
- **Jurisdiction:** specific quotation exceptions, trademark rights and scope of copyright in a simple mark depend on applicable law. Attribution does not confer permission to reproduce protected material.

## Sources and traceability

- [Vanya UI licensing map](../../LICENSING.md), [third-party notices](../../THIRD_PARTY_NOTICES.md), [REUSE annotations](../../REUSE.toml)
- [Pinned brand rights map](https://github.com/VanDalkvist/vanya-arc-brand/blob/6c6a3d2d1b25e212817c354b2ee76163c4a64fab/LICENSING.md) and [exact artwork terms](https://github.com/VanDalkvist/vanya-arc-brand/blob/6c6a3d2d1b25e212817c354b2ee76163c4a64fab/LICENSES/LicenseRef-VanyaArc-Brand.txt)
- [Lucide / Feather license](https://lucide.dev/license), [redaktura-skills LICENSE](https://github.com/N1arko/redaktura-skills/blob/main/LICENSE), [Creative Commons CC BY 4.0 legal code](https://creativecommons.org/licenses/by/4.0/legalcode)
- [npm mixed-license field](https://docs.npmjs.com/cli/configuring-npm/package-json/#license), [Vite bundling license output](https://vite.dev/config/build-options.html)
- [Live site rights map](https://ui.vanya-arc.dev/reference/licensing.md), [site dependency/artwork notices](https://ui.vanya-arc.dev/licenses.txt), [brand artwork notice](https://ui.vanya-arc.dev/reference/brand-artwork-license.txt)

**Acceptance:** after the next build, confirm exact `@vanya/brand` artwork terms appear on the public site, the generated dependency inventory includes the custom supplement, all tests pass, and the correct commit is deployed. Do not report this as done merely because a PR merged.
