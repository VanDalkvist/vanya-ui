# Licensing — Vanya Arc / UI

**Effective date for this version: 22 November 2026.** This repository is a **mixed-license** project. The root [LICENSE](LICENSE) and `package.json` `license: MIT` cover the project's original, reusable **software**, except the specifically identified brand artwork and third-party material below.

| Source or asset | License / rights | What it means |
| --- | --- | --- |
| `src/components/**`, `src/showcase/**`, `src/hooks/**`, `src/tokens.css`, `scripts/**`, tests and other original source code, **excluding** `src/brand/VanyaArcArtwork.ts` | **MIT** | Free use, modification and commercial redistribution subject to MIT notice |
| Original documentation and guides unless separately identified | **MIT** | The existing license for authored documentation remains in force |
| `docs/research/typography-audit-2026-11-22.md`, `docs/research/copy-audit-2026-11-22.md`, `docs/research/hero-shortcuts-and-copy-2026-11-21.md` | **CC BY 4.0** for independently owned original contributions in **this and later versions** | Reuse and adapt with attribution, license URL, source and modification indication |
| `src/brand/VanyaArcArtwork.ts`, `public/vanya-arc-mark.svg` (the distinctive official mark and embedded artwork) | **LicenseRef-VanyaArc-Brand**; reserved rights and limited permitted uses | Identity references allowed under [BRAND.md](BRAND.md); no blanket grant for rebranding unrelated products |
| `src/components/VanyaArcMark.tsx` and `VanyaArcLockup.tsx` program logic | **MIT for code only** | Code is reusable; this does not by itself grant rights to adopt the official logo as another product's brand |
| `THIRD_PARTY_NOTICES.md`, third-party icons, fonts and external skills | Upstream licenses and rights **only** | Their authors and original notices govern; never relicense them as ours |
| Public demo assets and other images | Evaluate individually | No automatic assignment of CC BY or reserved-rights status merely because they appear in a folder |

**Important historical boundary:** previous public versions of `vanya-ui` distributed the same artwork inside MIT-licensed files. Nothing in this new licensing statement revokes existing permissions for those copies. Future artwork changes can be separately licensed to the extent the rightsholder owns their rights; trademark rules and copyright rights are independent.

## CC BY attribution

For a covered original research document, a valid attribution example:

> “Typography audit — Vanya Arc / UI”, Vanya Afanasov, [original](https://github.com/VanDalkvist/vanya-ui/blob/main/docs/research/typography-audit-2026-11-22.md), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), adapted with changes to wording and examples.

The CC license grants **only rights the grantor owns**. Quoted text, external diagrams, third-party photographs, original skills and other external material retain separate conditions. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Machine-readable scope

The three CC BY files and the two artwork files have exact path-level REUSE/SPDX annotations in [REUSE.toml](REUSE.toml) and, for the artwork, in source file headers. The [LICENSES](LICENSES/) directory contains the relevant complete texts; `LicenseRef-VanyaArc-Brand` is **custom reserved-rights terms**, not a standard open-source license. This is a **targeted implementation**; do not call the entire repository REUSE-compliant until all files, authorship and generated files pass full validation.

## What consumers can do

When copying the code into another product, retain MIT notices for software and applicable third-party notices. Replace or remove official Vanya Arc branding when producing a separate product. Original research can be quoted or adapted with CC BY attribution. The `VanyaArcMark` component is useful for displaying the **official** identity; its export does not license third-party use as a replacement company logo.

## Primary legal sources

- [OSI MIT license](https://opensource.org/license/mit)
- [Creative Commons CC BY 4.0](https://creativecommons.org/licenses/by/4.0/legalcode)
- [CC FAQ for software, logos and trademarks](https://creativecommons.org/faq/)
- [REUSE Specification 3.3](https://reuse.software/spec-3.3/)
- [GitHub open-source applications and logo distinction](https://docs.github.com/en/site-policy/github-terms/github-open-source-applications-terms-and-conditions)
- [WIPO trademark rights](https://www.wipo.int/en/web/trademarks/protection)

This is a documented licensing policy and source audit, **not legal advice**, trademark clearance, proof of artwork originality or registration.
