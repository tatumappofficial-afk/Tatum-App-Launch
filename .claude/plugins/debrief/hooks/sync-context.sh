#!/usr/bin/env bash
set -euo pipefail

PLUGIN_ROOT="${CLAUDE_PLUGIN_ROOT:-.}"
CONTEXT_DIR="${PLUGIN_ROOT}/references/context"
SOURCE_DIR="${HOME}/.claude"

if [ ! -d "$SOURCE_DIR" ]; then
  exit 0
fi

mkdir -p "$CONTEXT_DIR"

if command -v rsync &>/dev/null; then
  rsync -a --delete \
    --exclude='*.sock' \
    --exclude='*.lock' \
    --exclude='tmp/' \
    --exclude='cache/' \
    --exclude='logs/' \
    "$SOURCE_DIR/" "$CONTEXT_DIR/"
else
  rm -rf "$CONTEXT_DIR"
  cp -a "$SOURCE_DIR" "$CONTEXT_DIR"
fi
