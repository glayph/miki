#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const argv = new Set(process.argv.slice(2));
const full = argv.has("--full");
const pull = argv.has("--pull") || process.env.MIKI_LFS_PULL === "1";
const noArchive = argv.has("--no-archive");
const outputArgIndex = process.argv.indexOf("--output");
const requestedOutput =
  outputArgIndex >= 0 ? process.argv[outputArgIndex + 1] : undefined;

function log(message) {
  console.log(`[local-lfs] ${message}`);
}

function fail(message) {
  console.error(`[local-lfs] ERROR: ${message}`);
  process.exit(1);
}

function run(command, args, options = {}) {
  log(`Running: ${command} ${args.join(" ")}`);
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    stdio: options.capture ? ["ignore", "pipe", "pipe"] : "inherit",
    shell: false,
    ...options,
  });
  if (result.error) fail(`${command} could not start: ${result.error.message}`);
  if (result.status !== 0) {
    if (options.allowFailure) return result;
    const detail = options.capture
      ? String(result.stderr || result.stdout || "").trim()
      : "";
    fail(
      `${command} exited with status ${result.status ?? "unknown"}${detail ? `: ${detail}` : ""}`,
    );
  }
  return result;
}

function sha256(file) {
  return crypto
    .createHash("sha256")
    .update(fs.readFileSync(file))
    .digest("hex");
}

function gitOutput(args) {
  const result = run("git", args, { capture: true });
  return String(result.stdout || "").trim();
}

function hasGitLfs() {
  const result = spawnSync("git", ["lfs", "version"], {
    cwd: root,
    encoding: "utf8",
    stdio: "ignore",
    shell: false,
  });
  return result.status === 0;
}

function createArchive() {
  if (noArchive) return undefined;
  const output = path.resolve(
    requestedOutput ||
      process.env.MIKI_LFS_OUTPUT ||
      path.join(
        os.tmpdir(),
        `miki-lfs-${process.pid}`,
        "miki-linux-source.tar.gz",
      ),
  );
  fs.mkdirSync(path.dirname(output), { recursive: true });
  run("git", ["archive", "--format=tar.gz", "--output", output, "HEAD"]);
  const manifest = {
    artifact: output,
    bytes: fs.statSync(output).size,
    sha256: sha256(output),
    commit: gitOutput(["rev-parse", "HEAD"]),
    lfs_files: gitOutput(["lfs", "ls-files"]).split("\n").filter(Boolean)
      .length,
    created_at: new Date().toISOString(),
  };
  log(`Created ${output}`);
  log(JSON.stringify(manifest));
  return manifest;
}

function main() {
  if (!hasGitLfs()) {
    fail("Git LFS is required. Install git-lfs, then rerun this command.");
  }
  run("git", ["lfs", "install", "--local"]);
  if (pull) run("git", ["lfs", "pull"]);
  run("git", ["lfs", "fsck"]);
  const files = gitOutput(["lfs", "ls-files"]);
  log(
    `LFS files available: ${files ? files.split("\n").filter(Boolean).length : 0}`,
  );

  if (!argv.has("--no-build")) run("npm", ["run", "build:all"]);
  if (full) {
    run("npm", ["test"]);
    run("npm", ["run", "runtime:24-7:check"]);
    run("npm", ["run", "verify"]);
  }
  createArchive();
  log("Local LFS build and validation passed.");
}

main();
