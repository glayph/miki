# authenticated-blog-app Workflow

Target: app
Created: 2026-08-24T18:28:00.289Z

## Brief
Build a complete production-style authenticated create-post website with Node.js backend API, React/TypeScript frontend, SQLite database, secure authentication, protected sessions, dashboard, create/edit/delete posts, tests, and source archive.

## Architecture
Modular vertical-slice architecture with domain, adapter, interface, and verification layers.

- ui: User flows, state, responsive layout, and accessibility.
- api: Backend endpoints, auth boundary, validation, and integration contracts.
- domain: Core business rules independent from UI and transport.
- persistence: Data models, migrations, caching, and recovery behavior.
- tests: Unit, integration, visual, and smoke verification gates.

## File Tree
- [must] authenticated-blog-app/README.md - Project overview, setup, and delivery checklist.
- [must] authenticated-blog-app/docs/architecture.md - Architecture decisions, boundaries, and data flow.
- [must] authenticated-blog-app/src/index.ts - Main application or library entry point.
- [must] authenticated-blog-app/src/domain/index.ts - Core domain rules separated from adapters.
- [should] authenticated-blog-app/src/adapters/index.ts - External service and platform adapter boundary.
- [must] authenticated-blog-app/tests/smoke.test.ts - End-to-end or integration smoke gate.
- [must] authenticated-blog-app/scripts/verify.mjs - Portable scaffold verification used by post-generation gates.
- [must] authenticated-blog-app/package.json - Scripts for build, test, lint, and smoke.

## Milestones
### Blueprint
Requirements, architecture, and risk plan are explicit before writing broad code.
- Extract concrete requirements from the brief and any sketches/assets.
- Define module boundaries, data flow, and runtime constraints.
- Choose the smallest vertical slice that proves the architecture.
- Gate: blueprint review - Requirements and acceptance gates are written down.

### Vertical Slice
A minimal running artifact proves the highest-risk path.
- Create the workspace and core files.
- Implement the startup path and one end-to-end user/system workflow.
- Keep placeholders isolated behind interfaces so later expansion does not require rewrites.
- Gate: unit tests (node scripts/verify.mjs test) - Core behavior and adapters pass focused tests.
- Gate: build (node scripts/verify.mjs build) - Production artifact builds without type or bundling errors.

### Feature Expansion
Expected capabilities are added behind the established boundaries.
- Implement modules in dependency order.
- Add regression tests next to each module contract.
- Run smoke checks after each meaningful integration step.
- Gate: unit tests (node scripts/verify.mjs test) - Core behavior and adapters pass focused tests.
- Gate: build (node scripts/verify.mjs build) - Production artifact builds without type or bundling errors.
- Gate: smoke (node scripts/verify.mjs smoke) - Primary user workflow works in runtime.

### Hardening
The artifact is maintainable, testable, and ready for review.
- Remove dead paths, insecure defaults, and placeholder behavior.
- Document setup, limitations, and verification evidence.
- Run the full gate list from a clean state.
- Gate: unit tests (node scripts/verify.mjs test) - Core behavior and adapters pass focused tests.
- Gate: build (node scripts/verify.mjs build) - Production artifact builds without type or bundling errors.
- Gate: smoke (node scripts/verify.mjs smoke) - Primary user workflow works in runtime.

## Review Loop
- Plan the smallest next change.
- Edit only the files needed for that change.
- Run the narrowest meaningful gate.
- Broaden tests/build/smoke before declaring the milestone done.
- Record evidence and remaining risk.
