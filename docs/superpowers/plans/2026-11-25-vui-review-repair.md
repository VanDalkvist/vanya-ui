# VUI review repair — bounded slice

Owner approved findings in PR #38 review 6059464700. Base c934e8c9bb8715466f9b9c6988a8437043c9df0d. Context: existing UI package, portable CLI, canonical skill, consumer verification and contributor guide. Read existing memory and AP-019/020/021/022/074/075/076 in prior S4 review; preserve no-Git/no-new-dependency design. No product deployment, identity art or consumer pin changes.

## S5/S6 selected fixes
- [ ] P1: validate options per command and reject duplicate flags before inspecting/writing. Reject `adopt --dry-run`, `baseline --dry-run`, unknown/unsupported options; test real unchanged manifest/config/agent files. Preserve documented options, global help/version and direct entrypoint.
- [ ] P2: extract existing project discovery and verification use cases from CLI into cohesive modules; keep public re-exports, explicit runner wiring, one command interface. CLI <=250 lines, no new runtime dependencies. Verify real existing consumer and contributor journeys.
- [ ] P2: require explicit UI-12 applicability for new scope with source observation; independent/unbranded products can record scope and sources; existing feature N/A remains supported. Test rejected N/A and accepted applicable observations.
- [ ] P2: expand existing library pilot lint inventory to shared component files as well as showcase. Keep canonical token definitions separate. Reuse existing lint tools/negative controls; exercise the default component path with actual bad fixture and source scope. Existing recorded showcase baseline unchanged; any newly surfaced legacy debt must be inspected, not auto-captured or waived. No general token redesign.
- [ ] P2: clear help paths and two workflows, validate actual installed CLI; skill explicit branch and pinned local bin, fallback for source folder, no arbitrary tool discovery. Maintain documented JSON/exit semantics and genuine visual evidence boundary.
- [ ] Verify exact SHA via current CI, assess actual findings; independent S9 and live agent evals require available isolated agent runner. Do not claim those passed from unit tests.

## S7 plan review
Smallest viable repairs: use one option schema for help/validation; existing inspection and verification code moved without behavioral rewrite except explicit input validation. Reuse the real lint rules, not a regex imitation. Preserve token owner scope and baseline integrity. Test invalid mutations and result evidence, not merely output shape. Previous parser source probe reproduces RED logically; actual test execution RED not yet observed. Independent product review, visual QA and live skill evals remain blocked by runner availability. No extra CI workflow, framework, authentication, publication scanner or full redesign.

## Implementation status
Code and regression cases prepared for CI; no observed full RED/GREEN run in this environment. Existing baseline untouched; expanded lint results must be reviewed before acceptance. Independent S9 and agent evals remain NOT_VERIFIED/NOT_RUN.

Compatibility review: supported --mode flags for adopt/baseline/lint and explicit --json for plan/review remain accepted; --help is side-effect-free at any argument position. Existing documented invocation with options before --help is covered.

## Follow-up from real consumer smoke
- [ ] Ignore regular-file links outside the existing authored-source formats; preserve refusal of source and directory links. Real Ferma symptom: linked registry JSON blocked all diagnostics. Regression: inspect/check/verify --dry-run continue with linked JSON; authored JSX and directory links remain rejected. Review scope: no new traversal, source allowlist, dependency or consumer change. Exact-head CI required.

## Component lint remediation (owner approved)
- [ ] Use existing token utilities for exact 11/12px font and 2/4/6px radius equivalents; normalize nearby sizes 10→11, 12.5→13, 13.5→14. Use 13px existing control font via named theme alias. Kbd uses canonical 2px (DESIGN.md); timeline thumbnail 3→4px. Verify rendered typography/line-height and narrow surfaces in browser before release.
- [ ] Keep wide narrative labels/eyebrows at existing .16em/.24em via named theme tracking tokens (existing visual intent); minimap .1em uses tracking-widest. Keep ThemeToggle existing exact elevation values in named theme shadow tokens. Keep transition property list via named CSS utility; no broadened animations.
- [ ] Replace undefined OfferCard selected border with existing accent/30 (matches active badge). Preserve API and interactions. No new baseline entries, relaxed rules, consumer edits or unrelated restyling.
- [ ] Actual negative fixtures remain blocking. Existing CI must show zero new shadcn/Stylelint findings; test/build/consumer matrix remain intact. Exact-head browser review and independent S9 remain required. Review: bounded token normalization, no new subsystem; source values audited against tokens and DESIGN.md, CI confirms real lint output.
