# Local Gemma Runtime

Agent Miki now defaults to the local llama.cpp model `llama.cpp/gemma-4-E2B-it-Q4_0`. The model is served through the local OpenAI-compatible endpoint `http://127.0.0.1:39200/v1`; no Gemini, OpenCode, or other cloud API key is required for this path.

## Model source

The selected GGUF is `ggml-org/gemma-4-E2B-it-GGUF`, file `gemma-4-E2B-it-Q4_0.gguf`. Google’s official llama.cpp integration documents running Gemma 4 E2B directly with llama.cpp and exposing an OpenAI-compatible `/v1` endpoint [1]. The model card identifies the repository as a Gemma 4 E2B instruction-tuned GGUF and lists the Q4_0 quantization [2].

## Linux setup

Build or use Miki’s bundled headless `llama-server`, download the model into a local model directory, and create `config/.env` from `config/.env.example`:

```bash
mkdir -p data/models
curl -L --fail --retry 5 \
  'https://huggingface.co/ggml-org/gemma-4-E2B-it-GGUF/resolve/main/gemma-4-E2B-it-Q4_0.gguf?download=true' \
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

## Verification evidence

The authenticated Miki dashboard visibly showed `llama.cpp/gemma-4-E2B-it-Q4_0` as the active model. A normal message, `Reply exactly LOCAL_MIKI_GEMMA_OK`, produced the exact response `LOCAL_MIKI_GEMMA_OK` through Miki’s dashboard. The direct llama.cpp smoke test also returned `LOCAL_GEMMA_OK`. This proves local provider selection and a real local completion; it does not claim that a CPU-only 5B model is fast enough for every high-level tool workflow.

## References

[1]: https://ai.google.dev/gemma/docs/integrations/llamacpp "Google AI for Developers — Run Gemma with Llama.cpp"

[2]: https://huggingface.co/ggml-org/gemma-4-E2B-it-GGUF "Hugging Face — ggml-org/gemma-4-E2B-it-GGUF"
