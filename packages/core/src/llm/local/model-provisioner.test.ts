import { describe, expect, it } from "vitest";
import {
  listLocalModelCatalog,
  resolveLocalModelCatalog,
} from "./model-provisioner.js";

describe("local model provisioner catalog", () => {
  it("uses the pinned official Gemma artifact metadata", () => {
    const [entry] = listLocalModelCatalog();
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
