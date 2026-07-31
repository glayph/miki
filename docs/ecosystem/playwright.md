# Playwright Chromium Tool Technical Specification

The **Playwright Chromium Tool** gives Miki agents native headless browser automation capabilities for web scraping, form submission, SPA rendering, and anti-detection web workflows.

---

## 1. Capabilities & Primitive Actions

The Playwright driver exposes low-level browser actions to the ReAct engine:

* `navigate(url: string)`: Loads target URL and waits for network idle.
* `extractDOM(selector?: string)`: Distills raw HTML into token-optimized clean DOM trees.
* `click(selector: string)`: Simulates human-like pointer interactions.
* `type(selector: string, text: string)`: Keypress-by-keypress input injection.
* `screenshot()`: Captures viewport PNG image for visual multimodal reflection.

---

## 2. Configuration Options

```typescript
import { PlaywrightSkill } from 'miki/tools/playwright';

const browserTool = new PlaywrightSkill({
  headless: true,
  stealthMode: true,
  viewport: { width: 1280, height: 800 },
  timeoutMs: 30000,
  blockMedia: true // Blocks image/font downloads to save bandwidth
});

agent.registerSkill(browserTool);
```

---

## 3. DOM Distillation Engine

To conserve context window usage, Miki uses an optical DOM compressor that converts standard HTML pages into clean, semantic Markdown representations:

```
[Button: "Submit Application"] (id="#submit-btn")
[Input: "Email Address"] (id="#user-email")
[Link: "Privacy Policy"] (href="/privacy")
```
