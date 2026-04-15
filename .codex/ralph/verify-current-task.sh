#!/usr/bin/env bash
set -euo pipefail
test -f package.json
node -e "const p=require('./package.json'); const s=p.scripts||{}; if(!s.dev||!s.build||!s.start||!s['test:e2e']) process.exit(1)"
test -f src/main.tsx
