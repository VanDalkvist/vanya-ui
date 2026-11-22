# GitHub Actions consumer workflow, copied into .github/workflows/vanya-ui-contract.yml

Pin <VANYA_UI_ACTION_SHA> to a real commit of VanDalkvist/vanya-ui.

```yaml
name: Vanya UI contract
on:
  workflow_dispatch:
    inputs:
      mode:
        description: Contract mode
        type: choice
        options: [react, visual, auto]
        default: react
      base_sha:
        description: Optional comparison commit SHA
        type: string
        required: false
permissions:
  contents: read
jobs:
  ui-contract:
    runs-on: ubuntu-24.04
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: VanDalkvist/vanya-ui/.github/actions/ui-contract@<VANYA_UI_ACTION_SHA>
        with:
          mode: ${{ inputs.mode }}
          base-sha: ${{ inputs.base_sha }}
```


For React UI, run the real browser-test script locally during feature implementation. A separate browser job can be added to this **manually dispatched** workflow. Do not enable `push`, `pull_request`, `schedule`, or required-status gating; GitHub Actions must remain manual-only.

For static visual-only projects choose `visual`. For API/data-only changes the agent may skip UI validation. Manual invocation is deliberate, not an automatic PR gate.
