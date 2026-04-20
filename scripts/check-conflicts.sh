#!/usr/bin/env bash
set -euo pipefail

if rg -n "^<<<<<<<|^=======|^>>>>>>>" . --glob '!node_modules/**' --glob '!.git/**'; then
  echo "Conflict markers found. Resolve them before committing."
  exit 1
fi

echo "No conflict markers found."
