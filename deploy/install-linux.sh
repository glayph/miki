#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DATA_HOME="${XDG_DATA_HOME:-$HOME/.local/share}/miki"
mkdir -p "$DATA_HOME/runtime" "$DATA_HOME/workspace"
chmod 700 "$DATA_HOME" "$DATA_HOME/runtime" "$DATA_HOME/workspace"
cd "$ROOT"
npm install --no-audit --no-fund
npm run build
mkdir -p "$HOME/.config/systemd/user"
sed "s#%h/miki#$ROOT#g" deploy/miki.service > "$HOME/.config/systemd/user/miki.service"
systemctl --user daemon-reload
systemctl --user enable --now miki.service
printf 'Agent Miki is running. Check with: systemctl --user status miki.service\\n'
printf 'Dashboard: http://127.0.0.1:18800\\n'
