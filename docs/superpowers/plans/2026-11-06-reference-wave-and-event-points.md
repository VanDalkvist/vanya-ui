# Reference wave and composable event points

## Brief and boundary
Sizes are completed at 83c18cb. User now asks to reproduce vanya-arc.dev's actual rising wave, dotted ghost branches from events and differently sized points; then clarifies standalone interactive points and a point+card composition. Also fix the thick Divider example. Preserve the approved intro, palette, typography and header; source application is read-only.

## Source of truth
life-wave-narrative f11918ec32e0a6a40bc4be6132dbbe87d43b6a46:
- temporal.ts: SLOPE=-0.03, 16 octave periods 44/2^k, amplitude/fade rules, branchPoint/buildBranchDots.
- WaveTrajectory.tsx: 7px main sampling, two echoes, FNV-seeded branches sampled at 16px, radius 1.5px and fade 0.22 / 0.12 / 0; main/future stroke 1.35 / 1px.
- TimelinePoint.tsx: BASE_R=3/4.5/6.5/9, focus/cluster/highlight radius modifiers; ink/accent/future/halo states.
- FractalTimeline.tsx: default zoom 8.602; branches originate in events, not parallel translated curves.
Public page inspected in Chrome; screenshot arc-wave-reference-look.json in BB thread thr_iqfqpdagcr. Do not copy personal event records, dates, titles or assets.

## Chosen design
- Keep SineWave's SVG public surface, add normalized event anchors and responsive viewport geometry. It owns only static wave geometry and branch rendering, not time, camera, pan, clustering, navigation or persistence.
- EventPoint is the reusable point primitive. Data weight 1–4 controls the actual visible radius; sm/md controls its canonical hit area. Without an action it is passive; with an action it is a native keyboard button with hover/focus feedback.
- TimelineEvent composes the same EventPoint and real TimelinePreviewCard into one interactive event. One native button owns activation and shared hover/focus; the children remain passive. No nested or duplicate buttons.
- SineWave may place points or the compound event using native HTML in SVG foreignObject, preserving real button semantics and one pixel coordinate system. Branches and all static marks stay below the preview layer. Expose a passive SVG by default and an accessible group when real event controls/content are supplied.
- Use one pure package-owned geometry module and one shared point glyph; no import/runtime dependency on the source app. Source-generated numeric fixtures verify fidelity without coupling tests to a sibling checkout.
- Fix the Divider call site: horizontal line explicitly selects horizontal; show the vertical variant separately.

## Alternatives considered
A hand-drawn approximation was already rejected. Importing the full source timeline would couple a UI primitive to personal data/router/camera state. Separate point/card buttons duplicate a single event action and make hover/focus drift; one composite control avoids this.

## Review follow-ups (same slice)
- Preserve intro, but put the actual wave in its own area below it; remove the obsolete click hint and name the slider for event spacing.
- Source-matched resting/hover card shadows, accent point/date/title, 4px card lift and a hover bridge. Keep CSS state ownership in one layer rather than override it with utility colors/widths.
- Fit the demo curve and echoes within its canvas without scaling point radii. Use one HTML overlay/stacking context, with every card above every point.
- All visible scene points are real native actions with corresponding details, including points without preview cards.
- External-link icon and underline in header. Hide OfferCard from catalogue for now, keeping its public export compatible. EnergyRadar must use the actual shared SegmentedControl, including sm size and disabled semantics.
- After visual completion: audit repository and Git history for private data/secrets; only make the repository public if the audit is clear. User explicitly authorized this conditional visibility change.

## Slices and verification
- [ ] Save source-derived numeric geometry/radius fixtures; observe focused red tests for branch anchoring, actual input-dependent wave shape, native standalone action, one compound action and shared focus semantics.
- [ ] Implement source-derived math, EventPoint, TimelineEvent and responsive SineWave; preserve existing SVG props and package conventions.
- [ ] Wire real components to scene and separate catalogue rows, including all weights/states and a working detail action. Keep intro and existing size refinements intact.
- [ ] Run focused/full tests, types, generation and production build with bounded commands. Chrome-check resized geometry, ghost starts, variable point radii, actual point/card hover and keyboard, mobile, both themes and 1px divider.
- [ ] Inspect compiled page/screenshots against the reference; update ledger with scoped author verification and limits. Commit/push immediately, no merge or independent-review claim.
