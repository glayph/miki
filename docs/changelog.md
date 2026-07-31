# Miki Release Changelog & Version History

All notable changes to the Miki Agentic Framework will be documented in this file.

---

## [v1.4.2] - 2026-07-28

### Added
* **Dynamic Markdown Documentation Engine**: Integrated `react-markdown` with Vite glob imports (`/docs/**/*.md`).
* **Source Editing & Raw Markdown Toggles**: Added live "View Raw Markdown" and "Edit Source" inspector capabilities on all documentation pages.
* **Hermes Socket Bridge v1.2**: Added support for compressed WebSocket frames and mTLS connection pooling.

### Fixed
* Fixed potential memory leak in long-running SQLite WAL memory compaction loops.
* Improved error stack formatting during tool execution failures.

---

## [v1.4.0] - 2026-06-15

### Added
* **OpenClaw Adapter**: Native JSON schema parameter translator for OpenClaw skill manifests.
* **Playwright Stealth Tool**: Anti-detection fingerprinting for web automation agents.

---

## [v1.3.0] - 2026-05-01

### Added
* **Layered SQLite Memory**: 3-tier memory engine with working memory, episodic history, and FTS5 search.
* **API Key Studio**: Role-based access keys with granular permission scopes.
