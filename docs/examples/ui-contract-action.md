# GitHub Actions consumer workflow, copied into .github/workflows/vanya-ui-contract.yml

Pin <VANYA_UI_ACTION_SHA> to a real commit of VanDalkvist/vanya-ui.

```yaml
name: Vanya UI contract
on:
  pull_request:
  push:
    branches: [main]
permissions:
  contents: read
jobs:
  ui-contract:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: VanDalkvist/vanya-ui/.github/actions/ui-contract@<VANYA_UI_ACTION_SHA>
        with:
          mode: auto
          base-sha: ${{ github.event.pull_request.base.sha || github.event.before }}
```

For UI-bearing React repositories, execute the project browser-test script in a separate job; run it on both pull requests and main. Protect the main branch with the contract + browser statuses when permitted.

Static visual-only projects may use mode: visual. Mode: off is only for confirmed projects without UI; leave mode: auto so ordinary backend-only commits skip without special configuration.
