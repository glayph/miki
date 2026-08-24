# Agent Miki Report

## Baseline findings

| Status | Finding | Cause/context | Fix or next action |
|---|---|---|---|
| Resolved | `glayph/Miki` contained only a Hello World static landing page. | The canonical repository was not connected to the mature Agent Miki implementation. | Imported the reviewed Linux/Windows Agent Miki implementation from `glayph/Agent`. |
| Resolved | Linux-first 24/7 installation guidance was missing from the canonical repository. | The existing implementation documented readiness but not a complete Linux service install path. | Added `deploy/miki.service`, `deploy/install-linux.sh`, and `docs/linux-24-7.md`. |
| Resolved | Low-cost provider intent was not explicit in the example configuration. | Existing config was local-first but did not document the requested Gemma/OpenCode routing boundary. | Added opt-in low-cost routing documentation and secret-safe provider examples. |
| Open | Shared project archive was not discoverable in the project directory. | The listed archive path was not exposed in the current sandbox mount. | Use the GitHub repositories as the source of truth and document this limitation. |
| Open | Credentials were supplied in project instructions. | Chat/project instructions are not a secure secret store. | Do not copy them into source, logs, or artifacts; rotate before persistent deployment and inject replacements through environment secrets. |

## Execution log

Validation results are appended below. Each important failure must include its cause, context, fix, and regression coverage.

## Validation findings

| Status | Problem | Cause/context | Fix/regression coverage |
|---|---|---|---|
| Resolved | Initial CLI screenshot was blank. | The first smoke command killed only the launcher parent while child gateway/memory processes remained, and the follow-up launch collided with occupied ports. | Cleared orphaned processes and ports, restarted cleanly, then verified the setup screen and authenticated workspace in a browser. |
| Resolved | Dashboard visual state was not captured in the first automated screenshot. | The initial smoke path did not complete the first-run password setup and authentication flow. | Completed setup/sign-in with the supplied test password; authenticated workspace rendered with navigation, Ready status, goal composer, and Pursue Goal action. |
| Verified | Linux runtime and repository validation. | Clean Linux checkout from `glayph/Miki`; build, readiness, benchmark, and full verification workflow completed successfully according to the validation log. | Status codes are recorded in `/home/ubuntu/miki-validation.log`; remote `main` points to commit `7fc1b21523d9469edba29ded43731a1af67d7b2b`. |

## Remaining limitations

The shared project archive was not available in the current project mount. The live Gemini/OpenCode provider paths, local model health, and external side-effect integrations remain configuration-dependent and were not exercised with the credentials supplied in project instructions. Those credentials were intentionally not copied into source, logs, or deliverables and should be rotated before persistent use.
