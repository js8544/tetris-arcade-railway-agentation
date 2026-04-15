#!/usr/bin/env bash
set -euo pipefail
grep -R 'api.consen.app/webhooks/agentation' -n src . >/dev/null
grep -RE 'tsk_01kp7nmabtfyb93dshv7zwahmx|prj_01kp7njnewfm6bbzdaew554ydd|chat_01kp7nentvedfr6q52d1p00f1h|ws_01kf0b8vzse7rb8tf8s2r1sgxj' -n src . >/dev/null
test -f README.md
