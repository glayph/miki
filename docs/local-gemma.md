# Local Qwen Coding Runtime

Agent Miki now defaults to the local llama.cpp coding model `llama.cpp/qwen2.5-coder-3b-instruct-q5_K_M`. It is served through the local OpenAI-compatible endpoint `http://127.0.0.1:39200/v1`; no Gemini, OpenCode, or other cloud API key is required for this path. The previously verified Gemma 4 E2B model remains an explicit fallback only.

## Model source

The selected GGUF is `Qwen/Qwen2.5-Coder-3B-Instruct-GGUF`, file `qwen2.5-coder-3b-instruct-q5_k_m.gguf`. The official Qwen model card describes the 3.09B-parameter instruction-tuned model as code-specific, with improvements in code generation, code reasoning, code fixing, and code-agent use [1]. Miki uses the pinned revision `f74adce6aa16316c625447af059dbebe4983757c`, expected size 2,438,740,416 bytes, and SHA-256 `eb863f2a1a9b67e33bbf2dad98ea09c03b71c8052aeb4835171cf6f7a7a12db4` [1]. The Q5_K_M file is below the requested 4 GB model-file limit.

## Linux and Windows setup

The portable local LFS build path does not require GitHub Actions:

```bash
npm run build:lfs:local
# Or, for a checkout with LFS objects already present:
npm run build:lfs -- --full
```

Miki can install the allow-listed model from its own control path. Send an ordinary message such as `Download and install the Qwen local coding model`; Miki routes the unambiguous request to `model_runtime.install`, downloads only the official catalog entry, verifies exact size and SHA-256, persists the model path, and activates it. Installation remains recorded and approval-aware through Agent Control. The catalog contains Qwen Coder Q5_K_M as default and Gemma 4 E2B Q4_0 as fallback.

The existing installer filenames are retained for backward compatibility and now install the Qwen coding model:

```bash
./deploy/setup-local-gemma.sh
```

```powershell
.\deploy\setup-local-gemma.ps1
```

Both installers use the pinned artifact, enable startup recovery, and create `config/.env` without writing cloud credentials. The effective runtime values are:

```dotenv
MIKI_MODEL=llama.cpp/qwen2.5-coder-3b-instruct-q5_K_M
DEFAULT_MODEL=llama.cpp/qwen2.5-coder-3b-instruct-q5_K_M
MIKI_PROVIDER=llama.cpp
MIKI_LOCAL_MODEL_PATH=/absolute/path/to/qwen2.5-coder-3b-instruct-q5_k_m.gguf
MIKI_LLAMA_BASE_URL=http://127.0.0.1:39200/v1
MIKI_LLAMA_PORT=39200
MIKI_LOCAL_CONTEXT_SIZE=4096
MIKI_LOCAL_MAX_TOKENS=256
DEFAULT_MAX_TOKENS=256
```

For CPU-only machines, Miki uses bounded context/output settings and disables remote-only reasoning fields. A smaller context may be necessary on hosts with approximately 4 GB RAM. A GPU, more threads, or a larger-memory host is recommended for heavy tool workflows.

## GitHub Actions LFS path

The `Linux validation` workflow checks out the repository with Git LFS enabled and invokes the same `npm run build:lfs -- --full --no-archive` command used for local validation. The same workflow includes a `windows-platform-check` job that checks out LFS, parses the PowerShell installer with the native PowerShell parser, and builds the TypeScript workspaces in dependency order. Run [#32749870466](https://github.com/glayph/miki/actions/runs/32749870466) passed both platform jobs. Model GGUF files remain outside Git and are downloaded only into user-owned runtime data.

## Verification expectations

Before running a website-building goal, the direct Qwen llama.cpp endpoint must return an exact smoke-test marker and Miki’s dashboard should show `llama.cpp/qwen2.5-coder-3b-instruct-q5_K_M` as active. If Qwen fails to install or load, Miki should report the cause and use the bounded Gemma fallback rather than claiming success. On CPU-only hardware, long system/tool prompts can still be slow.

## References

[1]: https://huggingface.co/Qwen/Qwen2.5-Coder-3B-Instruct-GGUF "Hugging Face — Qwen2.5-Coder-3B-Instruct GGUF model card and file catalog"
[2]: https://qwenlm.github.io/blog/qwen2.5-coder-family/ "Qwen Team — Qwen2.5-Coder series"
[3]: https://huggingface.co/ggml-org/gemma-4-E2B-it-GGUF/blob/858dcdf955fb1b5a43ed2301aea00362fc443a5c/gemma-4-E2B-it-Q4_0.gguf "Hugging Face — pinned Gemma fallback metadata"
