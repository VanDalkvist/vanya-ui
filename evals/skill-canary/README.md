# E1 — skill routing and UI recommendation canary

Optional experiment, separate from Composition S9. One native Promptfoo row using Sol low, no grader, no repeat or scheduler retry. The task is a read-only recommendation against actual source, so it does not establish compiled behavior or read-before-edit. The target is the public source revision `88e0c25b08bf2ab33c5bf6033813495e0313736b`. Agent skill discovery uses a symlink to the actual canonical skill; no copied instructions. The configuration and assertion oracle stay outside the agent working directory. The provider's read-only sandbox is not a proof of complete filesystem read isolation. Use the dedicated eval Codex home and only public synthetic inputs; do not add private sources.

## Run on the owner Mac

The existing Ferma tool installation and varc Eval plugin are reused. No installation, API key or alternate publication hook. Stop on any failure; check the prior native result before considering a retry.

```bash
(
  set -euo pipefail
  cd "$HOME/Projects/vanya-ui"
  git pull --ff-only
  TOOLS="$HOME/Projects/ferma/q34-sol-low.local/tools"
  PF="$TOOLS/node_modules/.bin/promptfoo"
  CODEX="$TOOLS/node_modules/.bin/codex"
  export CODEX_HOME="$HOME/.local/share/vanya-eval/codex-home"
  env -i PATH="$PATH" HOME="$HOME" CODEX_HOME="$CODEX_HOME" "$CODEX" login status
  varc eval check-config
  REV=88e0c25b08bf2ab33c5bf6033813495e0313736b
  umask 077
  RUN="$(mktemp -d "${TMPDIR:-/tmp}/vanya-ui-e1.XXXXXX")"
  mkdir -p "$RUN/workspace" "$RUN/db"
  git archive "$REV" | tar -xf - -C "$RUN/workspace"
  git -C "$RUN/workspace" init -q
  mkdir -p "$RUN/workspace/.agents/skills"
  ln -s ../../skills/vanya-ui "$RUN/workspace/.agents/skills/vanya-ui"
  test -f "$RUN/workspace/.agents/skills/vanya-ui/SKILL.md"
  cp evals/skill-canary/{promptfooconfig.yaml,task.txt} "$RUN/"
  EVAL_ROOT="$(varc plugins list | node -e 'const a=JSON.parse(require("node:fs").readFileSync(0,"utf8")); const p=a.find(x=>x.name==="eval"&&x.enabled===true); if(!p||!require("node:path").isAbsolute(p.root))process.exit(1); console.log(p.root)')"
  test -f "$EVAL_ROOT/promptfoo-hook.cjs"
  ln -s "$EVAL_ROOT/promptfoo-hook.cjs" "$RUN/promptfoo-hook.cjs"
  printf 'Evidence directory: %s\nSource SHA: %s\n' "$RUN" "$REV"
  cd "$RUN"
  # Native zero-model preflight: same prompt file, exact returned text, no hook.
  cat > echo.yaml <<'YAML'
description: E1 literal prompt preflight
sharing: false
prompts:
  - file://task.txt
providers:
  - echo
tests:
  - assert:
      - type: javascript
        value: |-
          output === context.prompt && output.includes('/projects/demo') && output.includes('/guides/overview')
YAML
  env -i PATH="$PATH" HOME="$HOME" \
    TMPDIR="${TMPDIR:-/tmp}" PROMPTFOO_CONFIG_DIR="$RUN/echo-db" \
    PROMPTFOO_SELF_HOSTED=1 PROMPTFOO_DISABLE_TELEMETRY=1 PROMPTFOO_DISABLE_UPDATE=1 \
    "$PF" eval -c echo.yaml --no-cache --max-concurrency 1 --no-share -o "$RUN/echo.json"
  node -e 'const r=require(process.argv[1]).results;const s=r.stats;const expected=require("node:fs").readFileSync(process.argv[2],"utf8").trim();if(s.successes!==1||s.failures!==0||s.errors!==0||r.results.length!==1||r.results[0].response.output!==expected)process.exit(1)' "$RUN/echo.json" "$RUN/task.txt"
  env -i PATH="$PATH" HOME="$HOME" CODEX_HOME="$CODEX_HOME" \
    TMPDIR="${TMPDIR:-/tmp}" \
    EVAL_CONFIG_PATH="${EVAL_CONFIG_PATH:-$HOME/.config/vanya-arc/eval.json}" \
    PROMPTFOO_CONFIG_DIR="$RUN/db" PROMPTFOO_SELF_HOSTED=1 \
    PROMPTFOO_DISABLE_TEMPLATE_ENV_VARS=false \
    PROMPTFOO_DISABLE_TELEMETRY=1 PROMPTFOO_DISABLE_UPDATE=1 \
    "$PF" eval -c promptfooconfig.yaml --no-cache --max-concurrency 1 --no-share -o "$RUN/result.json"
)
```

If login status fails, authenticate via native Codex login in that same dedicated home and repeat the preflight before any model call. One row may involve multiple internal model requests. No guaranteed quota amount; inspect native tokenUsage and provider errors. Review the actual command trace and native result; skill-used is a heuristic and canonical_reads is an independent conservative check of command text plus returned file content. A failed or missing trace is not a skill PASS. No automatic rerun.

The existing Eval hook publishes native output to the approved private archive; look for EVAL_PUBLISHED and record URL, native eval ID, counts, token usage. Preserve the local directory and avoid sending credentials/raw private logs in chat. Full browser validation, editing, and ChatGPT plugin activation are out of scope. Native config execution and positive/negative assertion controls are pending; this is an authored first candidate, not a verified result.

## Incident — Promptfoo 0.126.0 literal routes

First owner-host run stopped in readPrompts before dispatch: `There are no prompts in ...`. Pinned [maybeFilePath](https://github.com/promptfoo/promptfoo/blob/0.126.0/src/prompts/utils.ts) classifies a single-line string containing `/` as a file candidate; [processPrompt](https://github.com/promptfoo/promptfoo/blob/0.126.0/src/prompts/index.ts) then returns no prompts for the nonexistent non-glob path. Native [text-file processor](https://github.com/promptfoo/promptfoo/blob/0.126.0/src/prompts/processors/text.ts) reads the literal text and trims it. Use `file://task.txt`, preserving the exact original task. A separate native echo row in a fresh local DB checks literal prompt output and must succeed before the live row; it has no publication extension. No model request was reached in the failed attempt. Keep its evidence directory. Source inspection and Git readback only; actual corrected native run remains pending.

### Incident 2 — single-line JavaScript assertion

Owner run `eval-AhL-2026-11-27T19:52:54`: native echo executed one row, 0 pass / 1 fail / 0 errors; live model not reached. Pinned [JavaScript assertion implementation](https://github.com/promptfoo/promptfoo/blob/0.126.0/src/assertions/javascript.ts) trims trailing newlines and prepends `return` to a single-line expression; the authored single-line `return ...` compiles as `return return ...`, a syntax error. This is a confirmed source defect in our config; exact grading reason from the owner export was not inspected. Remove the redundant `return`, keep identical assertion semantics and separate exact-byte equality on the native exported response. Multi-line live assertions remain statement bodies. Native owner rerun pending; no model retry occurred.
