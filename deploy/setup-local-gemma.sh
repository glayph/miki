#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DATA_HOME="${XDG_DATA_HOME:-$HOME/.local/share}/miki"
MODEL_DIR="${MIKI_LOCAL_MODEL_DIR:-${DATA_HOME}/models}"
MODEL_PATH="${MODEL_DIR}/gemma-4-E2B-it-Q4_0.gguf"
PART_PATH="${MODEL_PATH}.$$.part"
MODEL_URL="https://huggingface.co/ggml-org/gemma-4-E2B-it-GGUF/resolve/858dcdf955fb1b5a43ed2301aea00362fc443a5c/gemma-4-E2B-it-Q4_0.gguf?download=true"
EXPECTED_SHA256="8e30dff3ac4c8434c49a7036fa15564bdbb6044e42bf04550bf1a096ad7e6a52"
EXPECTED_BYTES="2841481184"

mkdir -p "$MODEL_DIR"
chmod 700 "$DATA_HOME" "$MODEL_DIR" 2>/dev/null || true

verify_model() {
  [[ -s "$MODEL_PATH" ]] || return 1
  [[ "$(stat -c '%s' "$MODEL_PATH" 2>/dev/null || wc -c <"$MODEL_PATH")" == "$EXPECTED_BYTES" ]] || return 1
  [[ "$(sha256sum "$MODEL_PATH" | awk '{print $1}')" == "$EXPECTED_SHA256" ]] || return 1
}

if ! verify_model; then
  rm -f "$MODEL_PATH" "$PART_PATH"
  echo "Downloading and verifying Gemma 4 E2B Q4_0 locally; this is a large model file."
  curl --fail --location --retry 5 --retry-delay 3 --continue-at - \
    --progress-bar "$MODEL_URL" -o "$PART_PATH"
  mv "$PART_PATH" "$MODEL_PATH"
  verify_model || { echo "Gemma checksum/size verification failed." >&2; rm -f "$MODEL_PATH"; exit 1; }
fi
chmod 600 "$MODEL_PATH" 2>/dev/null || true

ENV_FILE="$ROOT/config/.env"
if [[ ! -f "$ENV_FILE" ]]; then
  cp "$ROOT/config/.env.example" "$ENV_FILE"
fi

set_env() {
  local key="$1" value="$2"
  value="${value//$'\n'/}"
  if grep -q "^${key}=" "$ENV_FILE"; then
    sed -i "s#^${key}=.*#${key}=${value}#" "$ENV_FILE"
  else
    printf '%s=%s\n' "$key" "$value" >> "$ENV_FILE"
  fi
}

set_env MIKI_LOCAL_MODEL_PATH "$MODEL_PATH"
set_env MIKI_AUTO_INSTALL_LOCAL_MODEL "1"
set_env MIKI_MODEL "llama.cpp/gemma-4-E2B-it-Q4_0"
set_env DEFAULT_MODEL "llama.cpp/gemma-4-E2B-it-Q4_0"
set_env MIKI_PROVIDER "llama.cpp"
set_env MIKI_LOCAL_MAX_TOKENS "256"
set_env DEFAULT_MAX_TOKENS "256"

if systemctl --user is-enabled miki.service >/dev/null 2>&1; then
  systemctl --user restart miki.service
fi
printf 'Local Gemma configured at %s\n' "$MODEL_PATH"
printf 'Dashboard: http://127.0.0.1:18800\n'
