# Low-Cost Model Routing

Agent Miki uses a **local-first** policy. If an operator supplies a compatible llama.cpp model, inference remains on the Linux machine and does not require a remote API call. When a remote fallback is needed, configure only the provider that the operator is authorized to use.

The requested `gemini/gemma-4-e2b` value is represented as an opt-in example, not a guaranteed live model. Miki must check the provider's live model catalog before selecting it. If that model is unavailable, the runtime must retain the local model or use another explicitly configured low-cost model rather than silently inventing a model ID.

OpenCode is supported through the OpenAI-compatible `opencode` provider. Its endpoint and credential are environment-configured and remain absent from source control. Provider errors are bounded by timeout, retry, and fallback policy; secrets are never written to run logs.

## Recommended order

| Priority | Route | When it is used |
|---|---|---|
| 1 | Local llama.cpp | Default when a compatible local model is installed and healthy. |
| 2 | Verified low-cost remote model | Only when the live provider catalog confirms availability and a credential is configured. |
| 3 | OpenCode or another configured compatible provider | For operator-selected workloads and explicit credentials. |
| 4 | Stronger fallback | Only when the task policy permits escalation and the operator has enabled it. |

The dashboard should display provider readiness and the selected route without exposing credential values.
