# Agent Miki Level Probe Results

The probe used the authenticated `/api/agent/level-run` endpoint and submitted one safe, no-side-effect verification request for each level. Every request reached Miki’s real execution loop and returned HTTP 200 with the requested level preserved.

| Level    | HTTP | Miki result                                   | Boundary                              |
| -------- | ---: | --------------------------------------------- | ------------------------------------- |
| Normal   |  200 | Routed and returned a truthful provider error | Gemini credential missing or rejected |
| Adaptive |  200 | Routed and returned a truthful provider error | Gemini credential missing or rejected |
| Low      |  200 | Routed and returned a truthful provider error | Gemini credential missing or rejected |
| Medium   |  200 | Routed and returned a truthful provider error | Gemini credential missing or rejected |
| High     |  200 | Routed and returned a truthful provider error | Gemini credential missing or rejected |
| Extra    |  200 | Routed and returned a truthful provider error | Gemini credential missing or rejected |
| Max      |  200 | Routed and returned a truthful provider error | Gemini credential missing or rejected |
| Turbo    |  200 | Routed and returned a truthful provider error | Gemini credential missing or rejected |

The shared response was: `The gemini credential was missing or rejected. Add a valid API key in Models/Credentials, then retry.` This is a capability-boundary result, not a fabricated success. The complete raw browser-console result is retained at `/home/ubuntu/console_outputs/exec_result_2026-08-24_05-34-10_310.txt` in the current sandbox, and the runtime journal is written to the configured reports directory.

The probe goals explicitly prohibited file modification, external services, and side effects. To obtain completion beyond routing, configure a healthy local model or a valid authorized provider credential, then rerun the same probe.

## Max-level LFS attempt through Miki

A real authenticated Max-level request asked Miki to inspect LFS configuration and run a read-only Linux `git-lfs` validation. Miki accepted the request and returned HTTP 200 with the Max level preserved, but the agent loop stopped at the same truthful Gemini credential boundary before tools could run. Separately, the canonical Linux Actions workflow successfully completed checkout with `lfs: true`, LFS verification, build, tests, readiness, full verification, secret scan, and artifact upload. Therefore the repository/CI LFS path is verified, while Miki’s live LFS tool execution remains provider-credential dependent.

## Turbo-level failure-recovery attempt through Miki

A real authenticated Turbo-level request asked Miki to inject a controlled failure only in a temporary non-destructive workspace, diagnose it, recover if safe, and write a Report without repository or external side effects. Miki accepted the Turbo request and returned HTTP 200 with the Turbo level preserved, but the loop safely stopped before any tool execution because the Gemini credential was missing or rejected. This is recorded as an unresolved capability limitation rather than a false recovery claim.
