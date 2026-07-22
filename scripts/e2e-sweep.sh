#!/usr/bin/env bash
# One-call full E2E sweep (Android, Maestro).
#
# Single phase on the seeded bundle (EXPO_PUBLIC_DEV_SEED=1): every
# `sweep`-tagged flow runs in config.yaml's flowsOrder. The last flow
# (erase-all-data) wipes the account and asserts the signed-out sign-in
# screen — which is also the fresh-install OAuth wall, the furthest point
# automation can reach in onboarding (no dev bypass for Apple/Google).
#
# Usage: npm run test:e2e            (or scripts/e2e-sweep.sh [device-id])
# Requires: a booted Android emulator with the Tatum dev client installed.
set -uo pipefail

DEVICE="${1:-${MAESTRO_DEVICE:-}}"
# 8081 is hardcoded here AND in the flows' dev-client deep links
# (subflows/launch-seeded.yaml, 19-settings.yaml) — change them together.
PORT=8081
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOG_DIR="$ROOT/.maestro/logs"
mkdir -p "$LOG_DIR"
METRO_PID=""

log() { printf '\n\033[1m[e2e] %s\033[0m\n' "$*"; }

cleanup() {
  if [[ -n "$METRO_PID" ]] && kill -0 "$METRO_PID" 2>/dev/null; then
    kill "$METRO_PID" 2>/dev/null
    wait "$METRO_PID" 2>/dev/null
  fi
  # killing the npx wrapper can orphan the actual Metro child — sweep it too,
  # or a stale bundle server keeps answering the port probe on the next run.
  pkill -f "expo start --dev-client.*--port $PORT" 2>/dev/null || true
}
trap cleanup EXIT

# ── Preflight ──
if ! command -v maestro >/dev/null; then
  echo "maestro CLI not found — install from https://docs.maestro.dev" >&2
  exit 1
fi

if [[ -z "$DEVICE" ]]; then
  DEVICE="$(adb devices | awk 'NR>1 && $2=="device" {print $1; exit}')"
fi
if [[ -z "$DEVICE" ]]; then
  echo "No Android device/emulator online (adb devices)." >&2
  exit 1
fi
log "Device: $DEVICE"

if ! adb -s "$DEVICE" shell pm list packages | grep -q com.tatumapp.tatum; then
  echo "Tatum dev client not installed on $DEVICE — run: npx expo run:android" >&2
  exit 1
fi

adb -s "$DEVICE" reverse "tcp:$PORT" "tcp:$PORT"
# A sleeping emulator display makes every Maestro assertion fail against an
# empty hierarchy — wake it and keep it awake for the whole sweep.
adb -s "$DEVICE" shell settings put system screen_off_timeout 1800000
adb -s "$DEVICE" shell svc power stayon true
adb -s "$DEVICE" shell input keyevent KEYCODE_WAKEUP

# ── Metro (seeded bundle) ──
# --clear is load-bearing: EXPO_PUBLIC_* values are baked into the bundle at
# transform time and cached, so a stale cache can serve a bundle built with
# different env values.
log "Starting Metro (seeded bundle) on port ${PORT}..."
EXPO_PUBLIC_DEV_SEED=1 npx expo start --dev-client --clear --port "$PORT" \
  >"$LOG_DIR/metro-seeded.log" 2>&1 &
METRO_PID=$!
METRO_UP=0
for _ in $(seq 1 60); do
  if curl -sf "http://localhost:$PORT/status" >/dev/null 2>&1; then
    METRO_UP=1
    log "Metro is up."
    break
  fi
  sleep 1
done
if [[ "$METRO_UP" != "1" ]]; then
  echo "Metro failed to start — see $LOG_DIR/metro-seeded.log" >&2
  exit 1
fi

# ── Sweep ──
SWEEP_RC=0
log "Running the full sweep..."
maestro --device "$DEVICE" test "$ROOT/.maestro" \
  --include-tags=sweep || SWEEP_RC=$?

cleanup
trap - EXIT

log "──────── E2E sweep summary ────────"
[[ $SWEEP_RC -eq 0 ]] && log "Sweep: PASS" || log "Sweep: FAIL (exit $SWEEP_RC)"
log "Screenshots/logs: ~/.maestro/tests (per-run) and $LOG_DIR"

exit "$SWEEP_RC"
