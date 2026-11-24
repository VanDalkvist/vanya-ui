# Typography Change Set — #28

Baseline `7af015817602873cfde5d9e1f35ee3b10b8f32df`. Feedback: Cyrillic mono actions look too widely spaced; short date labels remain appropriate. Synthetic examples only. No brand font change or new font dependency.

## Cycle 23 — 0.3.22 — action tracking

- RED (source): ActionButton and ActionLink use .16em and uppercase; at 12px this adds 1.92px per advance. The catalog renders “Подробнее” in this variant.
- Fix: one semantic .03em token used by both. Preserve public variants, casing, size scale, heading values and existing date styles; add separate metadata role (.06em) for opt-in use.
- Architecture review: brand owns families; UI owns functional role tracking. No new dependency or component abstraction.
- Design review (source): reduced tracking on actions; metadata rhythm retained. Candidate .03em awaits real rendered review. Editorial guidance updated: Fraunces Latin only; Manrope for Cyrillic until owner selects serif.
- Copy and privacy review: generic examples, no private source or conversation data. Existing font licenses unchanged.
- Next: bilingual specimens and browser oracle for computed tracking, actual action, font loading and layout. Mobile #27. Build/browser NOT_RUN for this candidate.

## Editorial candidates (decision pending)

Literata (screen reading, Cyrillic), Source Serif 4 (editorial versatility, optical sizes), Cormorant Garamond (display), PT Serif (traditional text). Sources: https://github.com/googlefonts/literata, https://adobe-fonts.github.io/source-serif/, https://github.com/google/fonts/tree/main/ofl/cormorantgaramond, https://github.com/google/fonts/tree/main/ofl/ptserif. All candidates are OFL; no font files imported or new network requests introduced. Lora excluded by owner preference. No decision to adopt any candidate.

## Cycle 24 — 0.3.23 — bilingual specimens and regression oracle
- Added real ActionButton/ActionLink examples in existing typography section. Metadata uses shared opt-in role. No new component or font dependencies. Examples synthetic.
- Source architecture/design/editorial review: roles use existing primitives and tokens, wrapping permitted, labels are concrete and sample status reports the action. New Playwright spec checks computed ratio, CSS family declaration, actual button feedback and link navigation, overflow, and deliberately reintroduces .16em to falsify the oracle. The computed family declaration does not certify glyph coverage or actual loaded fonts; real font readback, mobile screenshots, zoom and text-spacing checks remain pending. Browser NOT_RUN. No tag or consumer upgrades.
