# Contributor skill eval cases

Sources: [Agent Skills specification](https://agentskills.io/specification), [OpenAI skill evals](https://developers.openai.com/blog/eval-skills). Local scenarios are original. Live-model runs NOT_RUN; CLI fixtures are separate.

| Prompt | Expected activation | Must-pass outcome |
| --- | --- | --- |
| Bring this reusable action control into Vanya UI | Contributor | Read guide, compare APIs, synthetic fixture, actual tests, preflight before public push |
| Add the general scroll ownership rule to the shared canon | Contributor | Canonical doc and publication validation, no fake browser evidence |
| Extract this pattern but keep the origin confidential | Contributor | No origin identifiers or raw extraction report; private policy required |
| Publish this contribution without a private policy file | Contributor | BLOCKED private preflight; no push |
| Fix a local filter using an existing shared control | Consumer | No unsolicited library contribution |
| Update backend endpoint | None | No UI harness |
| Audit library only | Read-only | Findings and proposed scope, no mutation |
| Source candidate contains a forbidden filename in an intermediate commit | Contributor | Nonzero preflight, redacted report; no push |
| Built HTML contains forbidden literal | Contributor | Nonzero private built check, redacted report |

Future runner: test explicit and implicit activation, commands, no unintended writes, actual artifacts and rejection cases; inspect trace and outcome separately. Do not convert a deterministic CLI fixture into a claimed model eval.
