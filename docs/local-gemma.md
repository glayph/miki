# Local Gemma Runtime

Agent Miki now defaults to the local llama.cpp model `llama.cpp/gemma-4-E2B-it-Q4_0`. The model is served through the local OpenAI-compatible endpoint `http://127.0.0.1:39200/v1`; no Gemini, OpenCode, or other cloud API key is required for this path.

## Model source

The selected GGUF is `ggml-org/gemma-4-E2B-it-GGUF`, file `gemma-4-E2B-it-Q4_0.gguf`. Google’s official llama.cpp integration documents running Gemma 4 E2B directly with llama.cpp and exposing an OpenAI-compatible `/v1` endpoint [1]. The model card identifies the repository as a Gemma 4 E2B instruction-tuned GGUF and lists the Q4_0 quantization [2].

## Linux setup

The supported self-install path is now available directly from the repository:

```bash
# Builds the bundled llama.cpp runtime, verifies Git LFS, runs tests/verification,
# and writes a source archive under the system temporary directory.
npm run build:lfs:local
```

For an already checked-out repository where the LFS objects are present, use `npm run build:lfs -- --full`. Add `--pull` when the checkout contains LFS pointers that must be fetched from the configured Git remote. The command is portable Node.js and does not require GitHub Actions.

Miki can also install the allow-listed local model from its own control path. Send an ordinary message such as `Download and install the local Gemma model`; Miki routes the unambiguous request to `model_runtime.install`, downloads only the official catalog entry, verifies its exact byte count and SHA-256 checksum, persists it under the runtime data directory, and activates it. Installation remains recorded and approval-aware through Agent Control. The supported catalog currently contains Gemma 4 E2B-it Q4_0.

The equivalent explicit local setup script is useful for a first installation or a service host:

```bash
./deploy/setup-local-gemma.sh
```

On Windows PowerShell, use the companion installer:

```powershell
.\deploy\setup-local-gemma.ps1
```

Both installers download the same allow-listed artifact from a pinned Hugging Face revision, verify its expected 2,841,481,184-byte size and SHA-256 `8e30dff3ac4c8434c49a7036fa15564bdbb6044e42bf04550bf1a096ad7e6a52`, persist the local model path, enable startup recovery, and create `config/.env` without writing cloud credentials. Build or use Miki’s bundled headless `llama-server`, download the model into a local model directory, and create `config/.env` from `config/.env.example`:

```bash
mkdir -p data/models
curl -L --fail --retry 5 \
  'https://huggingface.co/ggml-org/gemma-4-E2B-it-GGUF/resolve/858dcdf955fb1b5a43ed2301aea00362fc443a5c/gemma-4-E2B-it-Q4_0.gguf?download=true' \
  -o data/models/gemma-4-E2B-it-Q4_0.gguf

cp config/.env.example config/.env
# Set MIKI_LOCAL_MODEL_PATH to the absolute path of the downloaded GGUF.
```

The runtime values used by the tested Linux installation are:

```dotenv
MIKI_MODEL=llama.cpp/gemma-4-E2B-it-Q4_0
DEFAULT_MODEL=llama.cpp/gemma-4-E2B-it-Q4_0
MIKI_PROVIDER=llama.cpp
MIKI_LOCAL_MODEL_PATH=/absolute/path/to/gemma-4-E2B-it-Q4_0.gguf
MIKI_LLAMA_BASE_URL=http://127.0.0.1:39200/v1
MIKI_LLAMA_PORT=39200
MIKI_LOCAL_CONTEXT_SIZE=4096
MIKI_LOCAL_MAX_TOKENS=256
DEFAULT_MAX_TOKENS=256
```

For a CPU-only machine, Miki sends a bounded local response budget and strips remote-only reasoning fields. This prevents Gemma’s reasoning template from consuming an unbounded agent cycle. The tested sandbox required approximately two minutes for the first long-context chat prompt and then returned a real response; a faster CPU or GPU is recommended for tool-heavy tasks.

The local server should be started with bounded, non-remote reasoning settings:

```bash
./packages/core/src/llm/local/native/linux-x64/llama-server \
  --model data/models/gemma-4-E2B-it-Q4_0.gguf \
  --host 127.0.0.1 --port 39200 \
  --ctx-size 4096 --threads 2 --threads-batch 2 --parallel 1 \
  --reasoning off --reasoning-format none --reasoning-budget 0 \
  --n-predict 128 --no-ui --no-webui
```

## GitHub Actions LFS path

The `Linux validation` workflow checks out the repository with Git LFS enabled and invokes the same `npm run build:lfs -- --full --no-archive` command used for local validation. Therefore, the build path is not Actions-specific: GitHub Actions provides a clean hosted Linux runner, while a normal Linux checkout can run the identical command independently. The workflow also scans tracked text for credential patterns and uploads a source artifact created with `git archive`; model GGUF files remain outside Git and are downloaded only into user-owned runtime data.

## Verification evidence

The authenticated Miki dashboard visibly showed `llama.cpp/gemma-4-E2B-it-Q4_0` as the active model. A normal message, `Reply exactly LOCAL_MIKI_GEMMA_OK`, produced the exact response `LOCAL_MIKI_GEMMA_OK` through Miki’s dashboard. The direct llama.cpp smoke test also returned `LOCAL_GEMMA_OK`. This proves local provider selection and a real local completion; it does not claim that a CPU-only 5B model is fast enough for every high-level tool workflow.

## References

[1]: https://ai.google.dev/gemma/docs/integrations/llamacpp "Google AI for Developers — Run Gemma with Llama.cpp"
[2]: https://huggingface.co/ggml-org/gemma-4-E2B-it-GGUF/blob/858dcdf955fb1b5a43ed2301aea00362fc443a5c/gemma-4-E2B-it-Q4_0.gguf "Hugging Face — pinned Gemma 4 E2B Q4_0 GGUF metadata"
