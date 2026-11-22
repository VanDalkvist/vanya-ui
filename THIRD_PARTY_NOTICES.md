# Third-party licenses and credits

**Scope:** Public Vanya Arc / UI repository (`@vanya/ui`) and its showcase at https://ui.vanya-arc.dev.

The original reusable **software** (not the entire mixed package) is licensed under [MIT](https://github.com/VanDalkvist/vanya-ui/blob/main/LICENSE), Copyright © 2026 Vanya Afanasov. This does **not** change ownership or license obligations for third-party libraries, icons, fonts, or editorial sources.

When the site is built, Vite emits **[licenses.txt](https://ui.vanya-arc.dev/licenses.txt)** for bundled dependency code. **Important:** an automated license detector may display only the MIT text for the mixed-license `@vanya/brand` package, which does *not* license its official artwork. The build therefore appends the exact [separate artwork terms](https://ui.vanya-arc.dev/reference/brand-artwork-license.txt) from the pinned package to `licenses.txt`. This is a version-specific inventory of bundled code **plus** an explicit brand notice, not a license for every asset on the website. License obligations apply to consumers' own bundles too.

## Runtime packages

| Work | License | Upstream |
| --- | --- | --- |
| React and React DOM | MIT | https://github.com/facebook/react/blob/main/LICENSE |
| clsx | MIT (Luke Edwards) | https://github.com/lukeed/clsx/blob/master/license |
| tailwind-merge | MIT (Dany Castillo) | https://github.com/dcastil/tailwind-merge/blob/main/LICENSE.md |
| Lucide / lucide-react icon collection | ISC (Lucide Icons and contributors) **and MIT** for Feather-derived icons | https://lucide.dev/license |

See the complete ISC + Feather MIT notice below. The icon packages' own files must retain copyright and permission notices on redistribution.

## Vanya Arc brand as a separate dependency

`@vanya/ui` depends on the public GitHub package [`@vanya/brand`](https://github.com/VanDalkvist/vanya-arc-brand). The brand package declares mixed licensing via `SEE LICENSE IN LICENSING.md`: its original React/CSS code is MIT, while official artwork/mark has a [separate brand-artwork license](https://ui.vanya-arc.dev/reference/brand-artwork-license.txt) and [canonical rights map](https://github.com/VanDalkvist/vanya-arc-brand/blob/main/LICENSING.md). The public favicon and mark geometry come from this dependency; UI does not relicense the artwork.

## Fonts

The website loads fonts **from Google Fonts** via stylesheet URLs; font binaries are **not checked into or distributed in this repository**. If an application self-hosts/copies font files, it must retain the supplied OFL notices.

| Family | License | Original font-license reference |
| --- | --- | --- |
| Manrope | SIL Open Font License 1.1 | https://github.com/google/fonts/tree/main/ofl/manrope |
| Fraunces | SIL Open Font License 1.1 | https://github.com/google/fonts/tree/main/ofl/fraunces |
| JetBrains Mono | SIL Open Font License 1.1 | https://github.com/JetBrains/JetBrainsMono/blob/master/OFL.txt |

Commercial applications and rendered logos may use these families subject to their license terms. Do not package Apple San Francisco fonts under these licenses.

## Editorial books and research sources (reference only)

The online edition [`Пиши, сокращай — 2025`](https://bureau.ru/books/pishi/), by **Максим Ильяхов and Людмила Сарычева**, is cited as a primary book source; we did **not** find a CC BY grant for the book and do not redistribute its chapters. The book's printed title contains `2025`, while the online bibliographic information lists the publisher as **Бюро Горбунова, 2023**. Original product-specific checklists are explicitly presented as Vanya UI interpretations, not quoted as authors' wording. See [quotation and source policy](docs/patterns/sources-and-attribution.md).

Apple HIG, GOV.UK, W3C, Carbon, NN/g, Mozilla, Kubernetes and other websites linked in research are **reference-only unless explicitly licensed**. We do not relicense their text, logos, images or diagrams under our own MIT/CC BY scopes.

## Editor skills (external reference; not vendored)

- Original source: https://github.com/N1arko/redaktura-skills
- Authors: **Людмила Сарычева** (https://gladlax.ru) and **Никита Архипов** (https://niar42.com).
- License: **CC BY 4.0**, https://creativecommons.org/licenses/by/4.0/.
- Our project-specific `.agents/redpolitika.md`, editorial guide and copy audit **apply general techniques and write our own project-specific commentary** for Vanya UI. They do not reproduce the upstream `SKILL.md` source files or imply endorsement by the authors.
- If upstream licensed text is incorporated or adapted later, retain creator credit, license link, source link, and an indication of changes. Do **not** silently treat upstream CC BY content as original MIT-authored code.

## Build-only tooling

Vite, Vitest and Tailwind CSS are MIT. TypeScript is Apache-2.0. Build-only tools do not automatically become shipped runtime code. Their package licenses still apply when redistributing them, and actual client bundle dependencies are inventoried in the generated `licenses.txt`.

Upstream examples:
- https://github.com/vitejs/vite/blob/main/LICENSE
- https://github.com/vitest-dev/vitest/blob/main/LICENSE
- https://github.com/tailwindlabs/tailwindcss/blob/main/LICENSE
- https://github.com/microsoft/TypeScript/blob/main/LICENSE.txt

## Lucide and Feather: complete upstream license notice

The following is the verbatim upstream [Lucide LICENSE](https://github.com/lucide-icons/lucide/blob/main/LICENSE) including its attribution to Feather. It is reproduced here **as required by the upstream permissions**. The content following the divider is third-party licensed material, not the author's MIT-licensed work.

---

ISC License

Copyright (c) 2026 Lucide Icons and Contributors

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

---

The following Lucide icons are derived from the Feather project:

airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out

The MIT License (MIT) (for the icons listed above)

Copyright (c) 2013-present Cole Bemis

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


---

## Scope and brand caution

A repo-level MIT notice is **not a substitute** for the upstream license texts. Current official artwork is held by [vanya-arc-brand](https://github.com/VanDalkvist/vanya-arc-brand); the UI site copies its favicon from that pinned dependency on build. Previously issued MIT rights on historical copies remain applicable. Rights to imply sponsorship, use another party's trademark, or claim affiliation do not automatically follow from permissive source-code licensing.

For the current audit, see [license audit](https://github.com/VanDalkvist/vanya-ui/blob/main/docs/legal/license-audit-2026-11-22.md).
