#!/usr/bin/env bash
# Workers Builds runs as an unprivileged user. Prepare only ephemeral QA libs.
# Package list comes from pinned Playwright's native apt simulation; no sudo,
# system install, external bootstrap script or change to the browser binary.
set -euo pipefail
cd "$(dirname "$0")"
npm ci
cd ..
npm run typecheck:tests
npm run typecheck:browser
cd browser-qa
npm exec -- playwright install chromium --no-shell
scratch=$(mktemp -d)
trap 'rm -rf "$scratch"' EXIT
mkdir -p "$scratch/debs" "$scratch/libs" "$scratch/lists/partial" "$scratch/cache/archives/partial"
# Keep apt indexes and cache inside this build's own writable directory.
# Retain the image's configured signed Ubuntu repositories and verification.
export APT_CONFIG="$scratch/apt.conf"
cat > "$APT_CONFIG" <<EOF
Dir::State::lists "$scratch/lists";
Dir::Cache "$scratch/cache";
APT::Get::List-Cleanup "false";
#clear APT::Update::Post-Invoke;
#clear APT::Update::Post-Invoke-Success;
EOF
apt-get update
set +e
report=$(npm exec -- playwright install-deps chromium --dry-run 2>&1)
status=$?
set -e
printf '%s\n' "$report"
if [ "$status" -ne 0 ]; then
  # Playwright 1.65.1 prints the exact apt simulation closure, one name per line.
  packages=$(printf '%s\n' "$report" | awk '/^Missing system dependencies \([0-9]+\):$/{found=1;next} found && /^  [a-z0-9][a-z0-9.+:-]*$/{print $1}')
  test -n "$packages" || { echo "Unable to resolve missing system packages" >&2; exit 1; }
  (cd "$scratch/debs" && apt-get download $packages)
  for deb in "$scratch"/debs/*.deb; do dpkg-deb -x "$deb" "$scratch/libs"; done
fi
export LD_LIBRARY_PATH="$scratch/libs/usr/lib/x86_64-linux-gnu:$scratch/libs/lib/x86_64-linux-gnu${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}"
# Fail once before the 147-test suite if the actual pinned browser cannot launch.
node --input-type=module -e '
import {chromium} from "@playwright/test";
const browser=await chromium.launch({channel:"chromium",headless:true});
try {
  const page=await browser.newPage();
  await page.goto("about:blank");
  console.log("CHROMIUM_READY",browser.version());
} finally { await browser.close(); }
'
cd ..
VANYA_UI_CLOUD_QA=1 npm run test:browser
