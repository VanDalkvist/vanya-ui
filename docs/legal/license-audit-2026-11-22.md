# Licensing review — Vanya Arc / UI

Date: 22 November 2026. Repository: public `VanDalkvist/vanya-ui`, `main`. This is a source-and-upstream license review, **not** a legal opinion or a claim of full software-composition-analysis of every transitive package.

## Findings

| Scope | Evidence | Assessment / work |
| --- | --- | --- |
| Original Vanya UI | `LICENSE` standard MIT text, `Copyright (c) 2026 Vanya Afanasov`, `package.json` `license: MIT`, recognized by GitHub | **Consistent.** MIT remains unchanged, commercial use allowed with preservation of copyright/license notice |
| Runtime dependencies | `package.json` React/React DOM, clsx, tailwind-merge, lucide-react | MIT for React/clsx/tailwind-merge; Lucide needs ISC **and** Feather MIT notices for derived icons |
| Build-only tooling | Vite, Vitest, Tailwind, TypeScript | Permissive tooling, TypeScript Apache-2.0; don't confuse build deps with bundled runtime |
| Fonts | `index.html` Google Fonts imports Manrope/Fraunces/JetBrains Mono; binaries not in repo | SIL OFL 1.1 for all three; if files are redistributed later, ship required font license text |
| Editing skills | Only links, source attribution and project-derived policies | Original skills by Людмила Сарычева, Никита Архипов are CC BY 4.0, external and not vendored; preserve credit, source, license and modification notice when adapting licensed expression |
| Generated client JS | Existing Vite config had no published bundle-license inventory | **Corrected:** `build.license` produces `/licenses.txt` on each build. Also publish source `LICENSE.txt` and `reference/third-party.md` |

## Implementation

- `THIRD_PARTY_NOTICES.md`: clear list of dependency/font/skill sources, full Lucide ISC + Feather MIT license supplied by upstream.
- `vite.config.ts`: automated Vite bundled-license output `licenses.txt`.
- `scripts/sync.ts`: copies root MIT `LICENSE` to public `LICENSE.txt`, and third-party notices to `reference/third-party.md`.
- `README.md`, `DESIGN.md`, `llms.txt` and public footer link to licensing material.
- Added tests to make notices and build output configuration visible during future CI.

## Open rights decision: the brand

The existing root MIT license covers the repository's software and associated documentation; the SVG mark `public/vanya-arc-mark.svg` and `src/components/VanyaArcMark.tsx` are already distributed without an explicit brand-artwork carve-out. **Do not retroactively assert they are excluded** by an explanatory README entry. The project owner should decide whether future versions should:

1. Keep the mark available as part of MIT-distributed UI code, but disallow misleading statements of brand endorsement; or
2. Create a separately specified brand-asset license/policy with clear distribution boundaries and transition plan.

Software copyright licenses and **trademark registration / use** are separate questions. Any future change requires a decision from the owner and may not revoke already granted rights to existing copies. This commit does **not** change the MIT LICENSE or add new copyright restrictions.

## Limits and remaining checks

- No complete transitive dependency legal audit was performed; the generated build report records what Vite bundles but should be reviewed on upgrades.
- No dependency font binaries were packaged in the repo. If packaging changes, review OFL redistribution requirements.
- Provenance of elements originally transferred from another project and possible co-author/contributor rights is not established by a dependency license scan. Confirm their authorship separately before representing all code as exclusively owned.
- This document contains no private data, internal endpoints, auth details, or connected-app records.

## Primary sources

- https://github.com/VanDalkvist/vanya-ui/blob/main/LICENSE
- https://lucide.dev/license
- https://github.com/facebook/react/blob/main/LICENSE
- https://github.com/lukeed/clsx
- https://github.com/dcastil/tailwind-merge/blob/main/LICENSE.md
- https://github.com/google/fonts/tree/main/ofl/manrope
- https://github.com/google/fonts/tree/main/ofl/fraunces
- https://github.com/JetBrains/JetBrainsMono
- https://github.com/N1arko/redaktura-skills
- https://creativecommons.org/licenses/by/4.0/
- https://vite.dev/config/build-options.html#build-license
