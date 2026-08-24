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

| Status   | Problem                                                                    | Cause/context                                                                                                                                                 | Fix/regression coverage                                                                                                                                         |
| -------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Resolved | Initial CLI screenshot was blank.                                          | The first smoke command killed only the launcher parent while child gateway/memory processes remained, and the follow-up launch collided with occupied ports. | Cleared orphaned processes and ports, restarted cleanly, then verified the setup screen and authenticated workspace in a browser.                               |
| Resolved | Dashboard visual state was not captured in the first automated screenshot. | The initial smoke path did not complete the first-run password setup and authentication flow.                                                                 | Completed setup/sign-in with the supplied test password; authenticated workspace rendered with navigation, Ready status, goal composer, and Pursue Goal action. |
| Verified | Linux runtime and repository validation.                                   | Clean Linux checkout from `glayph/Miki`; build, readiness, benchmark, and full verification workflow completed successfully according to the validation log.  | Status codes are recorded in `/home/ubuntu/miki-validation.log`; the final source commit is recorded in the repository log and the authenticated level journal is at `data/reports/level-runs.jsonl`.                     |

## Remaining limitations

The shared project archive was not available in the current project mount. The live Gemini/OpenCode provider paths, local model health, and external side-effect integrations remain configuration-dependent and were not exercised with the credentials supplied in project instructions. Those credentials were intentionally not copied into source, logs, or deliverables and should be rotated before persistent use.

## Miki-owned level execution evidence

| Level/path                   | Result                             | Evidence or limitation                                                                                                                                                            |
| ---------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Normal chat as implicit goal | Detection and delegation passed.   | A normal chat message asking Miki to read `REPORT.md` was accepted by the standard composer and routed through the real agent runtime without using the Goal selector.            |
| Normal chat completion       | Blocked by provider configuration. | Miki returned a truthful `gemini credential was missing or rejected` response instead of fabricating completion. Configure a valid provider or a healthy local model, then retry. |
| Explicit level router        | Passed in unit tests.              | The router exposes and classifies Normal, Adaptive, Low, Medium, High, Extra, Max, and Turbo, and delegates through `AgentOrchestrator.runAgentLoop`.                             |
| Level-aware UI               | Passed visually.                   | Pursue Goal exposes all eight levels and now executes through `/api/agent/level-run` before optional legacy goal-history persistence.                                             |

This distinction is intentional: Miki successfully recognized and attempted the ordinary-message goal, while the environment correctly stopped execution at the missing-model-credential boundary. No user-supplied credentials were copied into source, logs, or release artifacts.

The authenticated eight-level probe is documented in `docs/level-probe-results.md`. Normal, Adaptive, Low, Medium, High, Extra, Max, and Turbo each returned HTTP 200 from `/api/agent/level-run` with the requested level preserved and the same truthful missing-Gemini-credential boundary. The safe probe goals prohibited file changes, external services, and side effects, so this evidence proves Miki-owned routing and reporting rather than falsely claiming completed work.

The Max-level and Turbo-level live attempts were submitted through the authenticated Miki API. Max requested read-only LFS inspection; Turbo requested controlled failure injection and recovery in a temporary non-destructive workspace. Both requests reached Miki, preserved their explicit levels, and stopped safely at the missing Gemini credential boundary before side effects. The repository’s Linux Actions workflow independently verified the LFS checkout/build/test path successfully.
