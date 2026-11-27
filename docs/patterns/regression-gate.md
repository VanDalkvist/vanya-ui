# Regression Gate — baseline and candidate
Purpose: detect loss of previously working UI while refactoring. Applies to Composition and subsequent substantive visual or interaction changes. Existing browser-qa is the single browser runner. Existing machine gates, AP-054/056/057/068/069/076, and independent review stay in force.

## Before changing a surface
For a genuinely new surface with no prior implementation, record that baseline comparison is inapplicable to that surface; identify any existing shared surroundings and protect those journeys. Existing surfaces require actual baseline evidence or an explicit verification blocker.
- Identify exact last successful source SHA, served version, affected and neighboring protected journeys. Capture a baseline from the compiled baseline or verified production. Record viewport, theme, browser, OS/font environment, actual outcome and known defects. Do not retroactively describe an unavailable baseline as captured.
- Run relevant existing browser tests; protect real user outcomes, not only classes or receipts. A known baseline failure is triaged and documented before candidate work.
- Name intentional differences before comparing. Keep immutable baseline images and separate candidate artifacts. Local/QA artifacts must not contain private consumer material or secrets. Public synthetic captures may be promoted after inspection per publication policy.

## Run
From the current library tree, install the existing pinned browser dependencies and Chromium as in browser-qa/README.md. Use one unchanged runner/browser environment for both surfaces. VANYA_UI_QA_URL points to a verified served baseline/candidate; without it the runner builds and serves the current tree. A version marker verifies the expected package version; SHA is supplied by the verified deployment/checkout record, not inferred from the version. Use an absolute baseline directory outside the transient evidence directory. Example shell commands (fill in actual values, do not use placeholder SHA):

~~~sh
npm --prefix browser-qa ci
npm --prefix browser-qa exec -- playwright install chromium --no-shell
export VANYA_UI_VISUAL_BASELINE_DIR="$PWD/browser-qa/artifacts/composition-baseline-images"
export VANYA_UI_QA_URL=https://ui.vanya-arc.dev
export VANYA_UI_EXPECT_VERSION=2.0.0
export VANYA_UI_EVIDENCE_SHA=6ae7c4ed06bb4905ba350ecd69009ff6f3c366dd
export VANYA_UI_EVIDENCE_DIR="$PWD/browser-qa/artifacts/baseline-run"
# Only for the verified baseline, in an empty directory:
VANYA_UI_VISUAL_MODE=baseline npm --prefix browser-qa run test -- composition-visual.spec.ts --update-snapshots=all
# Review captures, retain them unchanged. Set the expected golden identity separately.
export VANYA_UI_BASELINE_SHA="$VANYA_UI_EVIDENCE_SHA"
export VANYA_UI_BASELINE_VERSION="$VANYA_UI_EXPECT_VERSION"
# For the compiled local candidate, first confirm the exact clean checkout, then:
unset VANYA_UI_QA_URL
export VANYA_UI_EVIDENCE_SHA="$(git rev-parse HEAD)"
export VANYA_UI_EXPECT_VERSION="$(node -p 'require("./package.json").version')"
export VANYA_UI_EVIDENCE_DIR="$PWD/browser-qa/artifacts/candidate-run"
VANYA_UI_VISUAL_MODE=compare npm --prefix browser-qa run test -- composition-visual.spec.ts --update-snapshots=none
# Full functional regression, including new Composition tests and existing interaction, native zoom and accessibility tests:
unset VANYA_UI_VISUAL_MODE VANYA_UI_VISUAL_BASELINE_DIR
npm run test:browser
~~~

Use baseline links/interaction checks before implementation; candidate-only geometry assertions may expose a known baseline defect. For the current Composition loop the baseline is 2.0.0; if that version no longer serves the public URL, use a compiled checkout of its exact SHA instead. For future loops replace all baseline metadata. The runner reserves the empty golden directory exclusively, records completed theme/viewport contexts, and seals manifest.json only after all 176 snapshots exist with SHA-256 hashes. Compare requires the explicit baseline identity and verifies the file hashes and recorded browser/OS/font evidence; it cannot repair missing images. Partial captures and existing golden directories are rejected for recapture; use a new sibling directory. Keep reports outside the golden directory. The source SHA is operator-supplied provenance from a verified deployment receipt or exact clean checkout, not an attestation by the remote server. The actual served version is checked by Playwright. The manifest establishes capture completeness, not design approval. Verify the filesystem guard with `npm --prefix browser-qa run test:baseline`. Never use a different environment to manufacture an easier comparison. Snapshot comparison is strict (0 differing pixels after version mask); intended changes will fail the visual comparison until reviewed. Review all soft diff results in HTML report, label each intended vs unintended; do not auto-accept. A new approved reference is a distinct reviewed checkpoint; do not overwrite the original before arch/product acceptance. Browser engine differences and font rendering are investigated rather than hidden with blanket tolerance.

## Protected journeys
| Area | Behavioral evidence |
|---|---|
| Navigation | Native anchor, all nine destinations, headings, sticky offset, history, real new-tab popup and original preserved |
| Links | Every visible ActionLink has target-derived marker and safe rel, actual hover changes feedback, no size drift, visible keyboard focus, neighbor separation; every visible local link resolves to a successful resource and actual HTML fragment where applicable; text references reject HTML fallback; real keyboard popup reaches expected reference content |
| Selection | Real collection changes, selected state vs hover, active option visible, disabled skip, focus restored |
| Form/actions | dirty/invalid/save/cancel, error/success/pending actual outcomes, status grouping, stable field geometry |
| Dialog/scroll | Open and close actual content, Escape, focus trap for modal, focus return, intended scroll ownership |
| Layout | shared axes, no overflow, 1440/1024/390/320, light/dark, native 200% zoom, real wave/slider geometry |

Composition visual matrix captures eight chapters, twelve targeted specimens and two actual opened dialog states (176 screenshots total across four widths and two themes); mask only the version label. Both dialogs are dismissed using the actual close button after capture. Use the identical runner on the baseline and candidate; a sealed earlier 96-image directory cannot satisfy the new manifest and must remain intact. Baseline screenshot review is separate from actual interaction tests. Use the existing targeted suites and a deliberate negative control when changing a regression oracle. Do not ship the negative control. Record its actual failure and restore the exact candidate.

## Acceptance
Before every bounded checkpoint: run unit/Node/type/build/lint, applicable actual browser journeys, visual comparison and independent architecture/product review. Review changed and unchanged adjacent areas, keyboard accessibility and any incomplete axe findings. All unexpected visual/functional regressions are fix-now. No silent baseline updates or lint suppression. No automatic GitHub workflows. Full suite before final release. Verify exact deployed SHA, version and active runtime after publication. Missing browser or baseline is BLOCKED/NOT_VERIFIED; do not call it PASS. Owner exceptions must be explicit and recorded; preserve current verified production while a broad destructive cleanup lacks regression proof.
