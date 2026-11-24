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
