# Contributor skill eval cases

Sources: [Agent Skills specification](https://agentskills.io/specification), [OpenAI skill evals](https://developers.openai.com/blog/eval-skills). Local scenarios are original. Live-model runs NOT_RUN; CLI fixture execution is separate.

| Prompt | Expected activation | Must-pass outcome |
| --- | --- | --- |
| Bring this reusable action control into Vanya UI | Contributor | Compare exports, choose reuse or focused extension, synthetic use, actual verification |
| Add a general scroll ownership rule | Contributor | Check canonical guidance, update one source, meaningful examples and documentation validation |
| Extract this pattern from a project | Contributor | Preserve applicable behavior, portable API, existing publication and rights rules |
| Add a component already covered by existing exports | Contributor | Prefer reuse or a justified focused extension |
| Prepare a library change via API-only tools | Contributor | Produce bounded candidate and actual evidence or NOT_RUN; no Git dependency |
| Fix local filter using shared control | Consumer | No unsolicited library edits |
| Update backend endpoint | None | No UI harness |
| Audit library only | Read-only | Findings and proposed scope |
| A library verification script fails | Contributor | Actual nonzero exit, subsequent scripts not run, report failed check |

Future live-model evals: explicit/implicit activation, actual source/artifact and verification results, negative cases; no claim of a completed model eval from CLI tests.
