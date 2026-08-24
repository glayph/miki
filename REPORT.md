# Agent Miki Report

## Baseline findings

| Status   | Finding                                                                           | Cause/context                                                                                       | Fix or next action                                                                                                                         |
| -------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Resolved | `glayph/Miki` contained only a Hello World static landing page.                   | The canonical repository was not connected to the mature Agent Miki implementation.                 | Imported the reviewed Linux/Windows Agent Miki implementation from `glayph/Agent`.                                                         |
| Resolved | Linux-first 24/7 installation guidance was missing from the canonical repository. | The existing implementation documented readiness but not a complete Linux service install path.     | Added `deploy/miki.service`, `deploy/install-linux.sh`, and `docs/linux-24-7.md`.                                                          |
| Resolved | Low-cost provider intent was not explicit in the example configuration.           | Existing config was local-first but did not document the requested Gemma/OpenCode routing boundary. | Added opt-in low-cost routing documentation and secret-safe provider examples.                                                             |
| Open     | Shared project archive was not discoverable in the project directory.             | The listed archive path was not exposed in the current sandbox mount.                               | Use the GitHub repositories as the source of truth and document this limitation.                                                           |
| Open     | Credentials were supplied in project instructions.                                | Chat/project instructions are not a secure secret store.                                            | Do not copy them into source, logs, or artifacts; rotate before persistent deployment and inject replacements through environment secrets. |

## Execution log

Validation results are appended below. Each important failure must include its cause, context, fix, and regression coverage.

## Validation findings

| Status   | Problem                                                                           | Cause/context                                                                                                                                                 | Fix/regression coverage                                                                                                                                                                               |
| -------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Resolved | Initial CLI screenshot was blank.                                                 | The first smoke command killed only the launcher parent while child gateway/memory processes remained, and the follow-up launch collided with occupied ports. | Cleared orphaned processes and ports, restarted cleanly, then verified the setup screen and authenticated workspace in a browser.                                                                     |
| Resolved | Dashboard visual state was not captured in the first automated screenshot.        | The initial smoke path did not complete the first-run password setup and authentication flow.                                                                 | Completed setup/sign-in with the supplied test password; authenticated workspace rendered with navigation, Ready status, goal composer, and Pursue Goal action.                                       |
| Verified | Linux runtime and repository validation.                                          | Clean Linux checkout from `glayph/Miki`; build, readiness, benchmark, and full verification workflow completed successfully according to the validation log.  | Status codes are recorded in `/home/ubuntu/miki-validation.log`; the final source commit is recorded in the repository log and the authenticated level journal is at `data/reports/level-runs.jsonl`. |
| Verified | Local Gemma was initially slow and could enter an unbounded reasoning/tool cycle. | The CPU-only host required roughly two minutes to evaluate Miki’s long system prompt, while remote-style reasoning fields caused longer local cycles.         | Local llama.cpp requests now cap output via `MIKI_LOCAL_MAX_TOKENS`, strip remote reasoning fields, and Miki’s managed server starts with bounded no-reasoning flags.                                 |
| Verified | Miki-owned local model recovery.                                                  | A clean restart with `auto_start=true` launched the bundled `llama-server` from the configured GGUF path on port 39200.                                       | The managed process was observed with `--reasoning off --reasoning-format none --reasoning-budget 0 --n-predict 256`; health returned `{"status":"ok"}`.                                              |

## Remaining limitations

The shared project archive was not available in the current project mount. Live Gemini/OpenCode provider paths and external side-effect integrations remain configuration-dependent and were not exercised with the credentials supplied in project instructions. Those credentials were intentionally not copied into source, logs, or deliverables and should be rotated before persistent use. The local Gemma path is now verified; on CPU-only hardware, first-response latency is high because Miki’s system/tool prompt is approximately 2,900 tokens. A GPU, more threads, or a smaller local model is recommended for heavy autonomous work.

## Miki-owned level execution evidence

| Level/path                   | Result                           | Evidence or limitation                                                                                                                                                 |
| ---------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Normal chat as implicit goal | Detection and delegation passed. | A normal chat message asking Miki to read `REPORT.md` was accepted by the standard composer and routed through the real agent runtime without using the Goal selector. |
| Normal chat completion       | Local Gemma passed.              | With `llama.cpp/gemma-4-E2B-it-Q4_0` active, Miki returned the exact `LOCAL_MIKI_GEMMA_OK` response through the authenticated dashboard.                               |
| Explicit level router        | Passed in unit tests.            | The router exposes and classifies Normal, Adaptive, Low, Medium, High, Extra, Max, and Turbo, and delegates through `AgentOrchestrator.runAgentLoop`.                  |
| Level-aware UI               | Passed visually.                 | Pursue Goal exposes all eight levels and now executes through `/api/agent/level-run` before optional legacy goal-history persistence.                                  |

This distinction is intentional: Miki successfully recognized ordinary-message goals and now completes short chat through local Gemma. Tool-heavy or high-level execution still depends on local hardware speed and the model’s bounded output budget. No user-supplied credentials were copied into source, logs, or release artifacts.

The authenticated eight-level probe is documented in `docs/level-probe-results.md`. Normal, Adaptive, Low, Medium, High, Extra, Max, and Turbo each returned HTTP 200 from `/api/agent/level-run` with the requested level preserved and the same truthful missing-Gemini-credential boundary. The safe probe goals prohibited file changes, external services, and side effects, so this evidence proves Miki-owned routing and reporting rather than falsely claiming completed work.

The Max-level and Turbo-level live attempts were submitted through the authenticated Miki API. Max requested read-only LFS inspection; Turbo requested controlled failure injection and recovery in a temporary non-destructive workspace. Both requests reached Miki, preserved their explicit levels, and stopped safely at the prior missing-Gemini-credential boundary before side effects. The repository’s Linux Actions workflow independently verified the LFS checkout/build/test path successfully. Local Gemma is now active and short chat completion has passed; full tool-heavy Max/Turbo replays should be run on the target Linux host after the model is installed there.

## Local Gemma completion evidence

The authenticated dashboard displayed `llama.cpp/gemma-4-E2B-it-Q4_0` and returned `LOCAL_MIKI_GEMMA_OK` for a normal chat message. After stopping the manual server and restarting Miki, `auto_start=true` launched the managed llama.cpp process from the GGUF path with bounded no-reasoning flags; the subsequent dashboard message returned `LOCAL_GEMMA_AUTOSTART_OK`. Setup instructions and the portable environment contract are in `docs/local-gemma.md`; the ignored machine-local environment is in `config/.env`.

## LFS and self-managed model lifecycle extension

| Capability                 | Result      | Evidence and limitation                                                                                                                                                                                                                       |
| -------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Local Linux LFS build      | Verified    | Installed the Git LFS client in the Linux environment, confirmed the real LFS-managed `llama-server` object, ran `git lfs fsck`, and completed `npm run build:lfs -- --full --no-archive`.                                                    |
| GitHub Actions LFS build   | Verified    | Run [#32701351380](https://github.com/glayph/miki/actions/runs/32701351380) checked out the real LFS object with `lfs: true` and passed the same portable local runner, tests, readiness, verification, credential scan, and artifact upload. |
| LFS pointer safety         | Resolved    | `build-llama.mjs` now rejects a Git LFS pointer as an executable and falls back to a source build when LFS content is unavailable.                                                                                                            |
| Miki-owned LLM acquisition | Verified    | The `llama.cpp` adapter now exposes a checksum-verified allow-listed installer for official Gemma 4 E2B Q4_0, persists the model path, and can activate the installed model through the existing control path.                                |
| Startup model recovery     | Implemented | `MIKI_AUTO_INSTALL_LOCAL_MODEL=1` enables a guarded startup bootstrap; the Linux and Windows installers enable it after configuring the official model.                                                                                       |
| Arbitrary download safety  | Verified    | The catalog resolver rejects arbitrary URLs and unsupported model identifiers; the adapter smoke test confirmed existing-file verification without another download.                                                                          |
| Three-hour continuation    | Active      | One recurring schedule named `Agent Miki autonomous continuation` is enabled with a 10,800-second interval, `runAsNewTask=false`, and current-context continuation instructions.                                                              |

The first local LFS probe failed only because the clean Linux environment did not yet have the `git-lfs` executable. Installing that system dependency enabled a real LFS checkout/fsck/build path. The final implementation is pushed in commit `821b833` (`docs: record LFS and model lifecycle validation`). Model GGUF files remain outside Git; only the required native runtime is LFS-managed, and the self-installer downloads the approved model into user-owned data with checksum verification.

## Continuation-session revalidation

| Check                      | Result                      | Evidence                                                                                                                                                                                                                                                                                                                     |
| -------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Workspace reconciliation   | Resolved                    | The resumed workspace initially pointed at `4d8849c`; `git fetch` and fast-forward restored canonical `821b833`.                                                                                                                                                                                                             |
| Resumed Git LFS dependency | Resolved                    | `git-lfs` was absent in the resumed Linux environment; it was installed, `git lfs pull` fetched the 15 MB native object, and `git lfs fsck` passed.                                                                                                                                                                          |
| Local Gemma recheck        | Passed after catalog repair | The first resumed self-install used stale moving-main metadata and correctly rejected the live file. The catalog is now pinned to official revision `858dcdf955fb1b5a43ed2301aea00362fc443a5c`; the current artifact is 2,841,481,184 bytes with SHA-256 `8e30dff3ac4c8434c49a7036fa15564bdbb6044e42bf04550bf1a096ad7e6a52`. |
| 24/7 readiness             | Passed                      | `npm run runtime:24-7:check` confirmed the gateway entry and runtime roots.                                                                                                                                                                                                                                                  |
| Local LFS full validation  | Passed                      | `npm run build:lfs -- --full --no-archive` completed native build, all 53 frontend tests, repository verification, and LFS checks.                                                                                                                                                                                           |
| Schedule continuity        | Passed                      | The recurring schedule remains active at 10,800 seconds with `runAsNewTask=false`.                                                                                                                                                                                                                                           |

The resumed canonical checkout exposed an important maintenance issue: Hugging Face’s moving `resolve/main` artifact had changed while Miki still stored the previous size and checksum. The self-installer correctly refused the mismatched file rather than using an unverified model. Official file metadata was checked, and the core catalog, Linux installer, Windows installer, and documentation now use the pinned revision and matching checksum. Future model updates require an intentional metadata change and fresh verification.

## Pinned Gemma artifact repair

The moving Hugging Face `resolve/main` URL changed its underlying Q4_0 file after the first local validation. Miki’s checksum gate correctly rejected the new file because the recorded metadata was stale; this was a truthful safety failure, not a model runtime failure. Official Hugging Face file metadata was checked at pinned revision `858dcdf955fb1b5a43ed2301aea00362fc443a5c`, and the catalog, Linux installer, Windows installer, and guide were updated together to 2,841,481,184 bytes and SHA-256 `8e30dff3ac4c8434c49a7036fa15564bdbb6044e42bf04550bf1a096ad7e6a52`. The repaired provisioner accepted the existing verified file without downloading it again, and a fresh llama.cpp server returned the exact `PINNED_GEMMA_OK` response.

## Windows CI continuation repair

The first Windows platform job correctly checked out Git LFS and parsed `deploy/setup-local-gemma.ps1`, but core compilation failed because the monorepo’s `@miki/config` workspace had not been built first. The Linux path already builds workspace dependencies in order. The Windows job was repaired to build workspace dependencies in order; the follow-up run passed.

The first Windows workflow repair built `@miki/config` but core then exposed the next missing workspace dependency, `@miki/installer`. The Windows job was expanded to build config, installer, skills, memory, and core in the same dependency order as the Linux build. Run [#32749870466](https://github.com/glayph/miki/actions/runs/32749870466) passed both `linux-build-test` and `windows-platform-check`, including real LFS checkout, PowerShell parsing, Linux full validation, and Windows workspace compilation.
This keeps Windows validation deterministic without downloading the large local model.

## Qwen Extra-level execution attempt — stalled before tool execution

During the Extra-level delegated website run, the local `Qwen2.5-Coder-3B-Instruct Q5_K_M` runtime accepted the request after the context and timeout repairs, but the request remained in llama.cpp processing with `n_prompt_tokens` rising to approximately 4,568 and `n_decoded` still at 0 for several minutes. Miki’s dashboard remained on a spinning Start state, no active agent-run record or website project files appeared, and the core log contained no tool execution event. This is a real execution failure, not evidence of website completion.

**What failed:** the Extra-level goal did not reach an actionable tool call or create any delegated website files. **Why:** on this CPU-only host, the long orchestration prompt is too slow or stalls during prompt evaluation even after increasing the local context to 8,192 and request timeout to 900,000 ms. **Change that can enable the capability:** stop the stuck request safely and retry the same Miki goal through the user-authorized low-cost Gemini fallback, while keeping Qwen as the preferred local default for ordinary work. **Improvement:** the parent agent will change only Miki’s provider/runtime configuration and continue observing Miki; it will not author the target website. The fallback attempt and its final evidence must be recorded here separately.

## Gemini fallback execution attempt — scaffolded but incomplete

After the Qwen request stalled, Miki was restarted with the user-authorized Gemini fallback and `gemini/gemini-3.5-flash-lite` was selected in the dashboard. Gemini was responsive and Miki created an `authenticated-blog-app` directory with a README, architecture note, package metadata, server/database files, and a smoke-test scaffold. However, the run then stopped with the dashboard message **"Agent exceeded max consecutive tool-call turns without a text response."** The resulting project is not yet evidence of a complete website: the source inventory lacks the requested React frontend, full CRUD/auth test suite, completed verification, screenshots, and curated source ZIP.

**What failed:** Gemini’s tool-heavy continuation reached Miki’s consecutive tool-call safety cap before a final response or complete implementation. **Why:** the model repeatedly emitted low-confidence `project_workflow_create`, `file_write`, and `shell_execute` actions; Miki sought clarification/retries and accumulated tool turns without a milestone-aware handoff. **Change that can enable the capability:** improve Miki’s orchestration to checkpoint long delegated builds, surface a resumable continuation when the consecutive-call cap is reached, and prefer bounded implementation milestones over unbounded tool loops. **Improvement:** the parent agent will repair only Miki’s orchestration/prompt/runtime behavior, then instruct Miki to continue from its own scaffold; the parent will not author or complete website files.


## Goal-Free Adaptive Workflow (2026-08-24)

### Requirement change
The user required that Goal setup be completely automatic and that no Goal option or manual Goal menu remain in the dashboard. Ordinary chat must be the only user-facing task entry point. Miki must infer effort, execution level, expected duration, milestone count, checkpoint cadence, and same-context continuation internally.

### Changes implemented in Miki
- Removed the `PursueGoalPanel` import and render path from `packages/ui/frontend/src/pages/chat-page.tsx`.
- Removed the `/goal` chat shortcut and its local UI state from the chat page.
- Removed the unused dashboard Goal panel and Goal API UI modules, and removed the English `pursueGoal` translation namespace.
- Added `buildAdaptiveExecutionPlan()` to the internal level router. The planner infers a level from the ordinary request, then adjusts estimated minutes, maximum run minutes, milestone count, and checkpoint cadence from scope signals such as dependencies, authentication, databases, tests, screenshots, documentation, and multi-step language.
- Ordinary action messages are wrapped automatically by `prepareOrdinaryChatMessage()` with an execution contract that explicitly forbids asking the user to create or choose a Goal, level, duration, milestone, or checkpoint.
- The inferred maximum run time is passed into the actual `AgentOrchestrator.runAgentLoop()` deadline through the internal `adaptiveRunTimeoutMs` option. The value is bounded between five minutes and six hours, and never bypasses the existing safety deadline mechanism.

### Verification evidence
- `npm run build --workspace=@miki/core` passed after the adaptive deadline integration.
- `npm --prefix packages/ui/frontend run build` passed after removing the Goal UI.
- `npx vitest run packages/core/src/level-router.test.ts` passed: 13 tests.
- The authenticated dashboard was reloaded and visually checked. The visible surface contains ordinary chat, model status, navigation, and the composer; no `Pursue Goal` button, Goal dialog, Goal menu, or `/goal` affordance is exposed.
- An ordinary chat message, without manual Goal setup, caused one safe `File Read` activity and returned `ADAPTIVE_CHAT_OK: level=adaptive, same_context_continuation=enabled`.

### Failures and repairs during this change
1. The first adaptive prompt revision changed a legacy phrase and broke two focused router assertions. The cause was a compatibility-sensitive text assertion, not a routing defect. The enabling change was restoring the explicit `Execute the user's goal yourself` marker while retaining the new adaptive metadata. All 13 focused tests then passed.
2. After a restart, the dashboard briefly showed `No Model Configured` because the ignored launcher state still pointed to an unavailable OpenCode model while the runtime `.env` selected Gemini. The cause was persisted launcher-state drift. The enabling change was reconciling the ignored active-model state and selecting the configured Gemini model through Miki's own launcher endpoint. A fresh model API query then reported Gemini available and default, and the dashboard returned to Ready.
3. The start script continues to report an `EADDRINUSE` collision on the legacy control port 18700 when an older Miki launcher shell remains alive, although the gateway/core services can still start on their configured ports. This is a runtime process-lifecycle cleanup limitation that should be repaired in the launcher shutdown/restart path; it is not a website implementation result.

### Remaining limitations
- The delegated authenticated posts website is still incomplete. Miki has created a partial scaffold and frontend/backend files, but no verified complete CRUD website, end-to-end browser evidence, curated source ZIP, or final website screenshots have been produced yet. The parent agent has not authored the website code, in accordance with the delegation boundary.
- Gemini/OpenCode fallback runs have shown provider rate limiting, low-confidence tool calls, malformed model-generated tool JSON, and incomplete milestone execution. Miki's parser, execution contract, checkpoint loop, and adaptive budget were improved, but provider reliability and long tool-heavy coding completion remain unresolved.
- The Goal backend/router compatibility APIs remain internal for runtime compatibility, but they are no longer exposed as dashboard controls or chat shortcuts.


## Adaptive runtime and malformed tool JSON repair (2026-08-24)

Miki now calculates an internal adaptive execution plan from ordinary chat requests. The plan selects an execution level, estimates work duration, derives a bounded maximum run time, chooses a milestone count, sets a checkpoint cadence, and enables same-context continuation. The selected maximum duration is passed into the real agent-loop deadline through an internal option bounded to five minutes through six hours; no Goal control is required or exposed.

The dashboard no longer renders the manual Pursue Goal panel, Goal shortcut, Goal translations, or Goal UI API modules. The remaining Goal router and persistence code is internal compatibility infrastructure only. A fresh authenticated browser check showed the standard chat composer and no Goal setup control. An ordinary user message completed a safe File Read and returned `ADAPTIVE_CHAT_OK: level=adaptive, same_context_continuation=enabled`.

The main agent parser now normalizes literal control characters inside model-generated JSON tool arguments and extracts a bounded JSON object when a provider wraps it with harmless surrounding text. Unrecoverable or truncated payloads still fail safely rather than being executed. Focused regression coverage passed together with the existing agent tests: 44 tests across the agent and level-router files. Core TypeScript compilation also passed.

The CLI now forwards SIGTERM and SIGINT to its gateway child before exiting, reducing orphaned gateway processes and stale-port collisions during restarts. A legacy control-port collision was observed before this change because an older launcher shell left a child alive; the new forwarding repair is syntactically validated, but a full restart-cycle test should still be performed on the target operating systems.

The delegated `authenticated-blog-app` remains incomplete. Miki has created a partial scaffold, landing page, and some frontend/backend files, but it has not yet produced verified complete authentication, posts CRUD, end-to-end browser evidence, screenshots, or a curated website ZIP. Gemini fallback has repeatedly stopped after small milestones or reported provider/tool warnings. This remains the primary unresolved capability limitation; the parent agent has not written the website implementation.
