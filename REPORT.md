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
