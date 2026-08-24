import { describe, expect, it } from "vitest";
import {
  listLocalModelCatalog,
  resolveLocalModelCatalog,
} from "./model-provisioner.js";

describe("local model provisioner catalog", () => {
  it("uses the pinned official Qwen Coder Q5_K_M metadata first", () => {
    const [entry] = listLocalModelCatalog();
    expect(entry).toMatchObject({
      id: "qwen2.5-coder-3b-instruct-q5_K_M",
      model_name: "llama.cpp/qwen2.5-coder-3b-instruct-q5_K_M",
      filename: "qwen2.5-coder-3b-instruct-q5_k_m.gguf",
      bytes: 2_438_740_416,
      sha256:
        "eb863f2a1a9b67e33bbf2dad98ea09c03b71c8052aeb4835171cf6f7a7a12db4",
    });
    expect(entry.url).toContain(
      "/resolve/f74adce6aa16316c625447af059dbebe4983757c/",
    );
  });

  it("keeps the verified Gemma model as an explicit fallback", () => {
    const entry = resolveLocalModelCatalog("gemma-4-E2B-it-Q4_0");
    expect(entry).toMatchObject({
      id: "gemma-4-E2B-it-Q4_0",
      bytes: 2_841_481_184,
      sha256:
        "8e30dff3ac4c8434c49a7036fa15564bdbb6044e42bf04550bf1a096ad7e6a52",
    });
    expect(entry.url).toContain(
      "/resolve/858dcdf955fb1b5a43ed2301aea00362fc443a5c/",
    );
  });

  it("rejects URLs and unsupported model identifiers", () => {
    expect(
      resolveLocalModelCatalog("https://example.invalid/model.gguf"),
    ).toThrow("Unsupported local model");
    expect(() => resolveLocalModelCatalog("unknown-local-model")).toThrow(
      "Unsupported local model",
    );
  });
});
