# Typography Change Set — #28

Baseline `7af015817602873cfde5d9e1f35ee3b10b8f32df`. Feedback: Cyrillic mono actions look too widely spaced; short date labels remain appropriate. Synthetic examples only. No brand font change or new font dependency.

## Cycle 23 — 0.3.22 — action tracking

- RED (source): ActionButton and ActionLink use .16em and uppercase; at 12px this adds 1.92px per advance. The catalog renders “Подробнее” in this variant.
- Fix: one semantic .03em token used by both. Preserve public variants, casing, size scale, heading values and existing date styles; add separate metadata role (.06em) for opt-in use.
- Architecture review: brand owns families; UI owns functional role tracking. No new dependency or component abstraction.
- Design review (source): reduced tracking on actions; metadata rhythm retained. Candidate .03em awaits real rendered review. Editorial guidance updated: Fraunces Latin only; Manrope for Cyrillic until owner selects serif.
- Copy and privacy review: generic examples, no private source or conversation data. Existing font licenses unchanged.
- Next: bilingual specimens and browser oracle for computed tracking, actual action, font loading and layout. Mobile #27. Build/browser NOT_RUN for this candidate.

## Editorial candidates (historical shortlist)

Literata (screen reading, Cyrillic), Source Serif 4 (editorial versatility, optical sizes), Cormorant Garamond (display), PT Serif (traditional text). Sources: https://github.com/googlefonts/literata, https://adobe-fonts.github.io/source-serif/, https://github.com/google/fonts/tree/main/ofl/cormorantgaramond, https://github.com/google/fonts/tree/main/ofl/ptserif. All candidates are OFL; no font files imported or new network requests introduced. Lora excluded by owner preference. At cycle 25 the owner selected Spectral.

## Cycle 24 — 0.3.23 — bilingual specimens and regression oracle
- Added real ActionButton/ActionLink examples in existing typography section. Metadata uses shared opt-in role. No new component or font dependencies. Examples synthetic.
- Source architecture/design/editorial review: roles use existing primitives and tokens, wrapping permitted, labels are concrete and sample status reports the action. New Playwright spec checks computed ratio, CSS family declaration, actual button feedback and link navigation, overflow, and deliberately reintroduces .16em to falsify the oracle. The computed family declaration does not certify glyph coverage or actual loaded fonts; real font readback, mobile screenshots, zoom and text-spacing checks remain pending. Browser NOT_RUN. No tag or consumer upgrades.

## Cycle 25 — 0.3.24 — Spectral and typography showcase
- Owner selected Spectral. Brand owns family token; @vanya/brand 0.1.1 pinned to `c3aa7ce7672bb06932dda333ba8bc98e8290f5ae`. Prior brand delta workflow-only. Preserve mark, palette, Manrope and JetBrains Mono. UI owns opt-in editorial classes on existing scale; existing font-serif usages inherit new family.
- Sources: https://type.today/ru/spectral, https://productiontype.com/font/spectral, https://github.com/productiontype/Spectral (OFL 1.1). No font binaries copied; existing Google Fonts mechanism, regular 400/500/600 and italic 400. Manifest and lock reference updated; frozen install requires build evidence.
- Navigation and section named Типографика, unchanged fragment. Real RU/EN editorial specimens, headings and italic. New CDP glyph test verifies actual custom font on both scripts. Browser NOT_RUN.

## Cycle 26 — 0.3.25 — normative and LLM-friendly update
- UX-copy v0.2.2 (https://github.com/N1arko/redaktura-skills/blob/main/ux-copy/SKILL.md): scenario — designer chooses role and copies usage. Name section/navigation consistently, clarify roles, fix misleading size labels, give examples and a real next action. Synthetic examples. No upstream text copied.
- Catalog review: A03/A04 canonical brand family and UI roles; A11 change to opted-in serif consumers; B05/I01/I03/I05 current guides, llms discovery and generated-doc inputs; D06/D12/D13 responsive typography composition, screenshots pending; E01–E07 editorial scope; F01/F02 synthetic examples and secret-pattern review; G01–G06 license scope and attribution; H02 pin direct dependency, H06 deployment readback pending; J01–J09 actual painted glyph oracle and navigation assertions. Source review only; full build, browser, consumer smoke and public readback remain NOT_RUN at commit. Historical research and receipts remain historical. No tag or mass consumer upgrades.

## Cycle 27 — 0.3.26 — regression and evidence integrity
- Actual RED from 0.3.23 Workers build: 118 passing / 1 failed Vitest; old typography test required exactly seven .type-specimen nodes. Preserve seven base scale roles by explicit per-role/token assertions and separately test bilingual heading/body/italic and action feedback. No weakened user outcome or deleted test. Demo reports selection rather than claiming an actual project opened.
- LLM gate now requires typography reference presence, canonical equality, sitemap and discovery links; stale-font-guide negative fixture exercises the same gate. CDP test deliberately forces fallback and restores Spectral. Source review of new checks completed; actual full build/browser remains pending. Privacy review of this diff: synthetic examples, no internal IDs or secrets. No release tag.

## Cycle 28 — 0.3.27 — navigation regression
- Actual build RED on 0.3.26: navigation-guidelines.test.tsx searched for the previous typography label. Updated the independent expected label, scoped the oracle to actual header navigation, retained all eight fragment targets and checked the matching typography heading. No production UI, package entrypoint, or dependencies changed. Source review completed; final build and browser receipts pending.
