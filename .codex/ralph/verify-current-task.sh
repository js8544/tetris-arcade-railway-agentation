#!/usr/bin/env bash
set -euo pipefail
npm run build
test -f playwright.config.ts
test -f test-results/tetris-home.png
