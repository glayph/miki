import { afterEach, describe, expect, it } from "vitest";

import {
  DEFAULT_GEMINI_MODEL,
  DEFAULT_GEMINI_PROVIDER,
  DEFAULT_LOCAL_CODING_MODEL,
  DEFAULT_LOCAL_GEMMA_MODEL,
  DEFAULT_LOCAL_GEMMA_PROVIDER,
  settings,
} from "./index.js";

describe("centralized local coding model default", () => {
  const originalModel = process.env.MIKI_MODEL;
  const originalProvider = process.env.MIKI_PROVIDER;
  const originalSettingsModel = settings.defaultModel;
  const originalSettingsProvider = settings.provider;

  afterEach(() => {
    if (originalModel === undefined) delete process.env.MIKI_MODEL;
    else process.env.MIKI_MODEL = originalModel;
    if (originalProvider === undefined) delete process.env.MIKI_PROVIDER;
    else process.env.MIKI_PROVIDER = originalProvider;
    settings.setModel(originalSettingsModel);
    settings.provider = originalSettingsProvider;
  });

  it("exposes Qwen Coder Q5_K_M as the canonical default", () => {
    expect(DEFAULT_LOCAL_CODING_MODEL).toBe(
      "llama.cpp/qwen2.5-coder-3b-instruct-q5_K_M",
    );
    expect(DEFAULT_LOCAL_GEMMA_MODEL).toBe("llama.cpp/gemma-4-E2B-it-Q4_0");
    expect(DEFAULT_LOCAL_GEMMA_PROVIDER).toBe("llama.cpp");
    expect(DEFAULT_GEMINI_MODEL).toBe("gemini/gemini-3.5-flash-lite");
    expect(DEFAULT_GEMINI_PROVIDER).toBe("gemini");
    expect(settings.getSupportedModels()[0]).toBe(DEFAULT_LOCAL_CODING_MODEL);
    expect(settings.getSupportedModels()).toContain(DEFAULT_LOCAL_GEMMA_MODEL);
  });

  it("keeps an explicit model selection as an override", () => {
    settings.setModel("openai/gpt-4o");
    settings.provider = "openai";

    expect(settings.defaultModel).toBe("openai/gpt-4o");
    expect(settings.model).toBe("openai/gpt-4o");
    expect(settings.provider).toBe("openai");
  });
});
