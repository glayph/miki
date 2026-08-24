import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export interface LocalModelCatalogEntry {
  id: string;
  model_name: string;
  provider: "llama.cpp";
  filename: string;
  url: string;
  sha256: string;
  bytes: number;
  description: string;
}

export interface LocalModelInstallResult {
  catalog: LocalModelCatalogEntry;
  path: string;
  downloaded: boolean;
  verified: boolean;
  bytes: number;
}

const GEMMA_4_E2B_Q4_0: LocalModelCatalogEntry = {
  id: "gemma-4-E2B-it-Q4_0",
  model_name: "llama.cpp/gemma-4-E2B-it-Q4_0",
  provider: "llama.cpp",
  filename: "gemma-4-E2B-it-Q4_0.gguf",
  url: "https://huggingface.co/ggml-org/gemma-4-E2B-it-GGUF/resolve/main/gemma-4-E2B-it-Q4_0.gguf?download=true",
  sha256: "eff5313720ed419c369e56a37e6b617f9e4078821d070b16adeb5d723021e6bd",
  bytes: 2_843_934_688,
  description: "Official Gemma 4 E2B instruction model in GGUF Q4_0 format.",
};

const CATALOG: readonly LocalModelCatalogEntry[] = [GEMMA_4_E2B_Q4_0];

function stringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function defaultModelDirectory(dataDir?: string): string {
  const configured = stringValue(process.env.MIKI_LOCAL_MODEL_DIR);
  if (configured) return path.resolve(configured);
  if (dataDir) return path.join(path.resolve(dataDir), "models");
  return path.join(
    process.env.XDG_DATA_HOME || path.join(os.homedir(), ".local", "share"),
    "miki",
    "models",
  );
}

function catalogKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/^(?:llama\.cpp|llama-cpp|llamacpp|local-llama)\//, "");
}

export function listLocalModelCatalog(): LocalModelCatalogEntry[] {
  return CATALOG.map((entry) => ({ ...entry }));
}

export function resolveLocalModelCatalog(
  requested?: unknown,
): LocalModelCatalogEntry {
  const key = catalogKey(stringValue(requested));
  const entry = CATALOG.find(
    (candidate) =>
      catalogKey(candidate.id) === key ||
      catalogKey(candidate.model_name) === key ||
      catalogKey(candidate.filename.replace(/\.gguf$/i, "")) === key,
  );
  if (!entry) {
    throw new Error(
      `Unsupported local model '${stringValue(requested) || "(empty)"}'. Available official models: ${CATALOG.map((item) => item.id).join(", ")}`,
    );
  }
  return entry;
}

async function sha256File(
  filePath: string,
): Promise<{ sha256: string; bytes: number }> {
  const hash = createHash("sha256");
  let bytes = 0;
  const handle = await fs.promises.open(filePath, "r");
  try {
    for await (const chunk of handle.readableWebStream()) {
      const buffer = Buffer.from(chunk as ArrayBuffer);
      hash.update(buffer);
      bytes += buffer.byteLength;
    }
  } finally {
    await handle.close();
  }
  return { sha256: hash.digest("hex"), bytes };
}

async function verifyFile(
  filePath: string,
  entry: LocalModelCatalogEntry,
): Promise<{ sha256: string; bytes: number }> {
  const result = await sha256File(filePath);
  if (result.bytes !== entry.bytes || result.sha256 !== entry.sha256) {
    throw new Error(
      `Checksum/size verification failed for ${entry.filename}: expected ${entry.bytes} bytes/${entry.sha256}, received ${result.bytes} bytes/${result.sha256}.`,
    );
  }
  return result;
}

async function downloadFile(url: string, destination: string): Promise<void> {
  const response = await fetch(url, {
    headers: { "user-agent": "Agent-Miki-local-model-installer/1.0" },
    redirect: "follow",
  });
  if (!response.ok || !response.body) {
    throw new Error(
      `Local model download failed with HTTP ${response.status}.`,
    );
  }
  const temporary = `${destination}.${process.pid}.part`;
  await fs.promises.rm(temporary, { force: true });
  const handle = await fs.promises.open(temporary, "wx", 0o600);
  try {
    const reader = response.body.getReader();
    try {
      while (true) {
        const next = await reader.read();
        if (next.done) break;
        if (next.value) await handle.write(Buffer.from(next.value));
      }
    } finally {
      reader.releaseLock();
    }
  } finally {
    await handle.close();
  }
  await fs.promises.rename(temporary, destination);
}

function persistEnvValues(
  configDir: string | undefined,
  values: Record<string, string>,
): void {
  if (!configDir) return;
  const envPath = path.join(path.resolve(configDir), ".env");
  const current = fs.existsSync(envPath)
    ? fs.readFileSync(envPath, "utf8").split(/\r?\n/)
    : [];
  for (const [key, value] of Object.entries(values)) {
    const safeValue = value.replace(/[\r\n]/g, "");
    const index = current.findIndex((line) => line.startsWith(`${key}=`));
    if (index >= 0) current[index] = `${key}=${safeValue}`;
    else current.push(`${key}=${safeValue}`);
  }
  fs.mkdirSync(path.dirname(envPath), { recursive: true });
  fs.writeFileSync(envPath, `${current.filter(Boolean).join("\n")}\n`, {
    encoding: "utf8",
    mode: 0o600,
  });
  try {
    fs.chmodSync(envPath, 0o600);
  } catch {
    // Best effort on filesystems without POSIX permissions.
  }
}

export async function installLocalModel(
  requested: unknown,
  options: { dataDir?: string; configDir?: string } = {},
): Promise<LocalModelInstallResult> {
  const catalog = resolveLocalModelCatalog(requested);
  const modelDirectory = defaultModelDirectory(options.dataDir);
  await fs.promises.mkdir(modelDirectory, { recursive: true, mode: 0o700 });
  try {
    await fs.promises.chmod(modelDirectory, 0o700);
  } catch {
    // Best effort on filesystems without POSIX permissions.
  }
  const modelPath = path.join(modelDirectory, catalog.filename);
  let downloaded = false;
  if (fs.existsSync(modelPath)) {
    try {
      await verifyFile(modelPath, catalog);
    } catch {
      await fs.promises.rm(modelPath, { force: true });
    }
  }
  if (!fs.existsSync(modelPath)) {
    downloaded = true;
    await downloadFile(catalog.url, modelPath);
  }
  const verified = await verifyFile(modelPath, catalog);
  try {
    await fs.promises.chmod(modelPath, 0o600);
  } catch {
    // Best effort on filesystems without POSIX permissions.
  }
  persistEnvValues(options.configDir, {
    MIKI_LOCAL_MODEL_PATH: modelPath,
    MIKI_GEMMA_MODEL_PATH: modelPath,
    MIKI_MODEL: catalog.model_name,
    DEFAULT_MODEL: catalog.model_name,
    MIKI_PROVIDER: "llama.cpp",
  });
  return {
    catalog,
    path: modelPath,
    downloaded,
    verified: true,
    bytes: verified.bytes,
  };
}
