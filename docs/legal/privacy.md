# Privacy Policy & Local Data Guarantees

**Effective Date**: July 2026

At Miki, we believe developer privacy is fundamental. This Privacy Policy outlines our data guarantees for the Miki Agent Framework and CLI.

---

## 1. Local SQLite Storage First

Miki agent memory drivers operate locally in SQLite database files (`./data/miki_memory.db`). Your prompt histories, tool execution steps, and vectors remain on your container filesystem unless you explicitly connect cloud cluster synchronization.

---

## 2. Telemetry Opt-Out

Anonymized system performance metrics (latency, active skill counts) can be completely disabled by setting the environment variable:

```env
DISABLE_MIKI_TELEMETRY=1
```

When disabled, zero diagnostic payloads are transmitted to Miki telemetry servers.

---

## 3. Zero Model Retraining Guarantee

Miki does not use user prompts, LLM reasoning logs, or tool output data to train global foundational models. All model interactions occur through direct API connections to your chosen provider (e.g. Google Gemini API, local Ollama).

---

## 4. Contact & Inquiries

For privacy inquiries, security audits, or data compliance requests, email `privacy@miki-agent.dev`.
