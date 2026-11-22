# Licensing — Vanya Arc / UI

This is a **mixed-license repository and source package**. `package.json` says `"license": "SEE LICENSE IN LICENSING.md"`, following [npm's documented license syntax](https://docs.npmjs.com/cli/configuring-npm/package-json/#license). It does not assert that every file here is MIT.

| Paths or material | License / permissions | Boundaries |
| --- | --- | --- |
| Original reusable software: `src/**`, `scripts/**`, `tests/**`, `src/tokens.css`, components and helper code | **MIT**, [root LICENSE](LICENSE) | Copyright notice and full MIT permission notice must be retained on redistribution |
| Original authored guides and project documents not separately marked | **MIT** for their original expression | Does not include copyrighted words or images owned by external authors |
| `docs/research/typography-audit-2026-11-22.md`, `copy-audit-2026-11-22.md`, `hero-shortcuts-and-copy-2026-11-21.md`, `ilyakhov-copy-audit-2026-11-22.md`, `sources-and-licenses-audit-2026-11-22.md` | **CC BY 4.0**, limited to Vanya UI's independently owned original portions | Each is annotated in `REUSE.toml` and file header; third-party quotations are excluded |
| `@vanya/brand`, pinned GitHub dependency | Own mixed license; [brand rights map](https://github.com/VanDalkvist/vanya-arc-brand/blob/main/LICENSING.md) | Its React/CSS software is MIT; approved mark geometry and SVG files have separate limited-use terms |
| Lucide/Feather, React, clsx, tailwind-merge, font projects, redaktura-skills | **Upstream license for each**, see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) | No sublicensing under Vanya UI MIT; follow each license when distributing a copy |
| External books, standards, research, images, quotations and third-party trade names | **Reference-only unless verified otherwise** | Links are not permission to copy or adapt. Apply applicable quotation exception or get permission |
| `public/avatar.svg` and other own simple demo graphics | Original project asset where rights are held | No independent proof of authorship of all historical contributions; provenance should be checked |

**Previously distributed versions:** earlier MIT grants, including copies of logo artwork that was embedded in MIT files, are not revoked. Brand rules govern current material only within rights actually held; copyright in a simple or AI-assisted symbol and trademark registration remain unverified.

## Attribution and quotation

The [source and quotation policy](docs/patterns/sources-and-attribution.md) distinguishes an ordinary research reference, a protected direct quote, licensed CC BY adaptation, reused MIT source, and protected brand/visual media. For CC BY material reproduce the original creator's attribution, title, source URL, link to license and indication of changes, where required. For source-only references cite the creator, work and direct URL without copying protected expression.

Example for a Vanya UI-authored CC BY research document: “Typography audit — Vanya Arc / UI”, Vanya Afanasov, [original](https://github.com/VanDalkvist/vanya-ui/blob/main/docs/research/typography-audit-2026-11-22.md), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), adapted with modifications identified.

Source references from Apple HIG, W3C, the book by Ilyakhov and Sarycheva, or external articles are **not** reissued under CC BY just because they appear as citations. Never imply those organizations endorse Vanya UI.

## Machine-readable scope and deployment

`REUSE.toml` identifies the five selected CC BY documents; project-authored code and ordinary guides remain MIT by stated scope. **Do not assert full REUSE compliance** until all applicable files pass a complete lint. The package dependency has its own metadata and terms.

The live site publishes `/LICENSE.txt` (the original project's MIT grant), `/reference/licensing.md` (this full mixed-license map), `/reference/sources.md` (citation rules), `/reference/third-party.md`, `/reference/brand-artwork-license.txt` (the **exact custom artwork terms shipped with the pinned** `@vanya/brand` package) and `/licenses.txt` (generated bundled dependency notices **plus an explicit supplement for separately licensed artwork**). A copy of `LICENSE.txt` alone does **not** describe the entire website's rights.

## Primary legal sources

- [MIT — OSI](https://opensource.org/license/mit)
- [CC BY 4.0 — legalcode](https://creativecommons.org/licenses/by/4.0/legalcode)
- [CC guidance on attribution, quotations and third-party materials](https://creativecommons.org/reusing-cc-licensed-content/)
- [REUSE Specification 3.3](https://reuse.software/spec-3.3/)
- [EU quotation exception — Directive 2001/29/EC Article 5(3)(d)](https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX:32001L0029)
- [npm license-field guidance](https://docs.npmjs.com/cli/configuring-npm/package-json/#license)

This is a documented rights map, not a jurisdiction-specific legal opinion, proof of original ownership or trademark clearance.
