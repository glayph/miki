#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DATA_HOME="${XDG_DATA_HOME:-$HOME/.local/share}/miki"
MODEL_DIR="${MIKI_LOCAL_MODEL_DIR:-${DATA_HOME}/models}"
MODEL_PATH="${MODEL_DIR}/qwen2.5-coder-3b-instruct-q5_k_m.gguf"
PART_PATH="${MODEL_PATH}.$$.part"
MODEL_URL="https://huggingface.co/Qwen/Qwen2.5-Coder-3B-Instruct-GGUF/resolve/f74adce6aa16316c625447af059dbebe4983757c/qwen2.5-coder-3b-instruct-q5_k_m.gguf?download=true"
EXPECTED_SHA256="eb863f2a1a9b67e33bbf2dad98ea09c03b71c8052aeb4835171cf6f7a7a12db4"
EXPECTED_BYTES="2438740416"

mkdir -p "$MODEL_DIR"
chmod 700 "$DATA_HOME" "$MODEL_DIR" 2>/dev/null || true

verify_model() {
  [[ -s "$MODEL_PATH" ]] || return 1
  [[ "$(stat -c '%s' "$MODEL_PATH" 2>/dev/null || wc -c <"$MODEL_PATH")" == "$EXPECTED_BYTES" ]] || return 1
  [[ "$(sha256sum "$MODEL_PATH" | awk '{print $1}')" == "$EXPECTED_SHA256" ]] || return 1
}

if ! verify_model; then
  rm -f "$MODEL_PATH" "$PART_PATH"
  echo "Downloading and verifying Qwen2.5-Coder-3B Q5_K_M locally; this is a large model file."
  curl --fail --location --retry 5 --retry-delay 3 --continue-at - \
    --progress-bar "$MODEL_URL" -o "$PART_PATH"
  mv "$PART_PATH" "$MODEL_PATH"
  verify_model || { echo "Qwen checksum/size verification failed." >&2; rm -f "$MODEL_PATH"; exit 1; }
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
set_env MIKI_MODEL "llama.cpp/qwen2.5-coder-3b-instruct-q5_K_M"
set_env DEFAULT_MODEL "llama.cpp/qwen2.5-coder-3b-instruct-q5_K_M"
set_env MIKI_PROVIDER "llama.cpp"
set_env MIKI_LOCAL_MAX_TOKENS "256"
set_env DEFAULT_MAX_TOKENS "256"

if systemctl --user is-enabled miki.service >/dev/null 2>&1; then
  systemctl --user restart miki.service
fi
printf 'Local Qwen Coder configured at %s\n' "$MODEL_PATH"
printf 'Dashboard: http://127.0.0.1:18800\n'
