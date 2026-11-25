# External design agent skills — parked (#34)
Owner decision 2026-11-25: preserve research, stop investing until a real product task warrants it. No skill installation, hooks, vendoring, orchestrator or dependency updates.

## Research retained
- [Anthropic frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design): distinctive product art direction; useful for new-product concept.
- [Impeccable](https://github.com/pbakaus/impeccable), [workflows](https://impeccable.style/docs/): shape, critique, audit, harden, polish, clarity, layout. Best first full external specialist; PRODUCT.md / DESIGN.md context, read-only critique after implementation. Keep Vanya UI identity and acceptance authoritative.
- [Vercel web-design-guidelines](https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines): accessibility, input, localization, list performance.
- [shadcn skill](https://github.com/shadcn-ui/ui/tree/main/skills/shadcn): component selection and actual APIs; useful reference for future catalog navigation.
- [UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill), [Taste Skill](https://github.com/Leonxlnx/taste-skill): exploration of patterns and distinctive landing-page concepts; avoid generating alternative global palettes/tokens.
- [Emil Kowalski skills](https://github.com/emilkowalski/skills): animation and microinteraction expertise.
- [Agentic Design Systems](https://github.com/thedesignproject/agent-skills/tree/main/skills/agentic-design-systems): component usage hints, variants and composition metadata.
- [Vercel Skills CLI](https://github.com/vercel-labs/skills): separately installed and managed upstream skills, project/global scope, lockfile; no universal nested invocation across harnesses. Impeccable native installer also supports --no-hooks. Verify exact upstream version and license before installing; no copies of upstream skill text.

## Hypothesis to resume
Vanya UI owns scope, canon, implementation and evidence. Optional external specialist: shape for new product; critique/audit for significant screen, harden for complex states. Pass product context and constraints; use read-only recommendations; record conflicts and final decisions; unavailable skill explicit. Trial one existing real product task with and without specialist, compare defects, time, acceptance and user review. No new framework without evidence. Standalone deterministic Impeccable detector (#33) is separate and does not activate agent skill.
