#!/usr/bin/env bash
# Copies the seeded checkout page into the run's empty workspace.
# Called from each case's fixture.sh; SEEDED.md (the answer key) is deliberately not copied.
set -euo pipefail
here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cp "$here/checkout.html" ./checkout.html
if [ "${1:-}" = "account" ]; then cp "$here/account.html" ./account.html; fi
