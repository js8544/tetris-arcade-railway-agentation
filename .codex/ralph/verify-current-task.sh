#!/usr/bin/env bash
set -euo pipefail
test -f src/App.tsx
grep -RE '开始|暂停|继续|重开' -n src/App.tsx src >/dev/null
grep -RE 'score|level|lines|next' -ni src >/dev/null
