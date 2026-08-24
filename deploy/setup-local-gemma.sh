#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DATA_HOME="${XDG_DATA_HOME:-$HOME/.local/share}/miki"
MODEL_DIR="${DATA_HOME}/models"
MODEL_PATH="${MODEL_DIR}/gemma-4-E2B-it-Q4_0.gguf"
MODEL_URL="https://huggingface.co/ggml-org/gemma-4-E2B-it-GGUF/resolve/main/gemma-4-E2B-it-Q4_0.gguf?download=true"

mkdir -p "$MODEL_DIR"
chmod 700 "$DATA_HOME" "$MODEL_DIR"
if [[ ! -s "$MODEL_PATH" ]]; then
  echo "Downloading Gemma 4 E2B Q4_0 locally; this is a large model file."
  curl -L --fail --retry 5 --retry-delay 3 -C - --progress-bar "$MODEL_URL" -o "$MODEL_PATH"
fi

ENV_FILE="$ROOT/config/.env"
if [[ ! -f "$ENV_FILE" ]]; then
  cp "$ROOT/config/.env.example" "$ENV_FILE"
fi

# Replace only the documented placeholder; never write cloud credentials.
sed -i "s#^MIKI_LOCAL_MODEL_PATH=.*#MIKI_LOCAL_MODEL_PATH=${MODEL_PATH}#" "$ENV_FILE"
sed -i "s#^MIKI_MODEL=.*#MIKI_MODEL=llama.cpp/gemma-4-E2B-it-Q4_0#" "$ENV_FILE"
sed -i "s#^DEFAULT_MODEL=.*#DEFAULT_MODEL=llama.cpp/gemma-4-E2B-it-Q4_0#" "$ENV_FILE"
sed -i "s#^MIKI_PROVIDER=.*#MIKI_PROVIDER=llama.cpp#" "$ENV_FILE"
if ! grep -q '^MIKI_LOCAL_MAX_TOKENS=' "$ENV_FILE"; then echo 'MIKI_LOCAL_MAX_TOKENS=256' >> "$ENV_FILE"; fi
if ! grep -q '^DEFAULT_MAX_TOKENS=' "$ENV_FILE"; then echo 'DEFAULT_MAX_TOKENS=256' >> "$ENV_FILE"; fi

if systemctl --user is-enabled miki.service >/dev/null 2>&1; then
  systemctl --user restart miki.service
fi
printf 'Local Gemma configured at %s\n' "$MODEL_PATH"
printf 'Dashboard: http://127.0.0.1:18800\n'
